import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFormComponent } from '../base.form.component';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Food } from './food';
import { Country } from '../countries/country';
import { FoodService } from './food.service';
import { ApiResult } from '../base.service';

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.component.html',
  styleUrls: ['./food-edit.component.css']
})
export class FoodEditComponent
  extends BaseFormComponent implements OnInit, OnDestroy {

  // the view title
  title: string;

  // the form model
  form: FormGroup;

  // the food object to edit or create
  food: Food;

  // the food object id, as fetched from the active route:
  // It's NULL when we're adding a new food,
  // and not NULL when we're editing an existing one.
  id?: number;

  // the countries observable for the select (using async pipe)
  foods: Observable<ApiResult<Food>>;

  // Activity Log (for debugging purposes)
  activityLog: string = '';

  // Notifier subject (to avoid memory leaks)
  private destroySubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private foodService: FoodService) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required)
    }, null, this.isDupeFood());

    // react to form changes
    this.form.valueChanges
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        if (!this.form.dirty) {
          this.log("Form Model has been loaded.");
        }
        else {
          this.log("Form was updated by the user.");
        }
      });

    // react to changes in the form.name control
    this.form.get("name")!.valueChanges
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        if (!this.form.dirty) {
          this.log("Name has been loaded with initial values.");
        }
        else {
          this.log("Name was updated by the user.");
        }
      });

    this.loadData();
  }

  ngOnDestroy() {
    // emit a value with the takeUntil notifier
    this.destroySubject.next(true);
    // unsubscribe from the notifier itself
    this.destroySubject.unsubscribe();
  }

  log(str: string) {
    this.activityLog += "["
      + new Date().toLocaleString()
      + "] " + str + "<br />";
  }

  loadData()
  {

    // load countries
    this.loadFoods();

    // retrieve the ID from the 'id'
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      // EDIT MODE

      // fetch the food from the server
      this.foodService.get<Food>(this.id).subscribe(result => {
        this.food = result;
        this.title = "Edit - " + this.food.name;

        // update the form with the food value
        this.form.patchValue(this.food);
      }, error => console.error(error));
    }
    else {
      // ADD NEW MODE

      this.title = "Create a new Food";
    }
  }

  loadFoods() {
    // fetch all the countries from the server
    this.foods = this.foodService
      .getFood<ApiResult<Food>>(
        0,
        9999,
        "name",
        null,
        null,
        null,
      );
  }

  onSubmit(type) {

    var food = (this.id) ? this.food : <Food>{};

    food.name = this.form.get("name").value;

    if (this.id) {
      // EDIT mode

      if (type == "del") {
        
        console.log(type);

       // this.foodService
        //  .delete<Food>(food)
         // .subscribe(result => {

           // console.log("Food " + food.id + " has been deleted.");

            // go back to food view
          //  this.router.navigate(['/foods']);
         // }, error => console.error(error));

      }

      if (type == "create") {
        this.foodService
          .put<Food>(food)
          .subscribe(result => {

            console.log("Food " + food.id + " has been updated.");

            // go back to food view
            this.router.navigate(['/foods']);
          }, error => console.error(error));

      }
      
    }
    else {
      // ADD NEW mode

        this.foodService
          .post<Food>(food)
          .subscribe(result => {

            console.log("Food " + result.id + " has been created.");

            // go back to food view
            this.router.navigate(['/foods']);
          }, error => console.error(error));
    }
  }

  isDupeFood(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      var food = <Food>{};
      food.id = (this.id) ? this.id : 0;
      food.name = this.form.get("name").value;

      return this.foodService.isDupeFood(food)
        .pipe(map(result => {
          return (result ? { isDupeFood: true } : null);
        }));
    }
  }
}
