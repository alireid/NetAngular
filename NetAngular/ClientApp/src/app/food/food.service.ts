import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService, ApiResult } from '../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FoodService
    extends BaseService {
    constructor(
        http: HttpClient,
        @Inject('BASE_URL') baseUrl: string) {
        super(http, baseUrl);
    }

    getData<ApiResult>(
        pageIndex: number,
        pageSize: number,
        sortColumn: string,
        sortOrder: string,
        filterColumn: string,
        filterQuery: string
    ): Observable<ApiResult> {
        var url = this.baseUrl + 'api/Food';
        var params = new HttpParams()
            .set("pageIndex", pageIndex.toString())
            .set("pageSize", pageSize.toString())
            .set("sortColumn", sortColumn)
            .set("sortOrder", sortOrder);

        if (filterQuery) {
            params = params
                .set("filterColumn", filterColumn)
                .set("filterQuery", filterQuery);
        }

        return this.http.get<ApiResult>(url, { params });
    }

  get<Food>(id): Observable<Food> {
    var url = this.baseUrl + "api/Food/" + id;
    return this.http.get<Food>(url);
    }

  put<Food>(item): Observable<Food> {
    var url = this.baseUrl + "api/Food/" + item.id;
    return this.http.put<Food>(url, item);
    }

  post<Food>(item): Observable<Food> {
    var url = this.baseUrl + "api/Food";
    return this.http.post<Food>(url, item);
  }

  //delete<Food>(item): Observable<Food> {
    //var url = this.baseUrl + "api/Food/" + item.id;
    //return this.http.delete<Food>(url, item);
  //}

  getFood<ApiResult>(
        pageIndex: number,
        pageSize: number,
        sortColumn: string,
        sortOrder: string,
        filterColumn: string,
        filterQuery: string
    ): Observable<ApiResult> {
    var url = this.baseUrl + 'api/Foods';
        var params = new HttpParams()
            .set("pageIndex", pageIndex.toString())
            .set("pageSize", pageSize.toString())
            .set("sortColumn", sortColumn)
            .set("sortOrder", sortOrder);

        if (filterQuery) {
            params = params
                .set("filterColumn", filterColumn)
                .set("filterQuery", filterQuery);
        }

        return this.http.get<ApiResult>(url, { params });
    }

  isDupeFood(item): Observable<boolean> {
      var url = this.baseUrl + "api/Food/IsDupeFood";
        return this.http.post<boolean>(url, item);
    }
}
