using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetAngular.Data;
using NetAngular.Data.Models;

namespace NetAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FoodController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Food
        // GET: api/Food/?pageIndex=0&pageSize=10
        // GET: api/Food/?pageIndex=0&pageSize=10&sortColumn=name&sortOrder=asc
        // GET: api/Food/?pageIndex=0&pageSize=10&sortColumn=name&sortOrder=asc&filterColumn=name&filterQuery=york
        [HttpGet]
        public async Task<ActionResult<ApiResult<FoodDTO>>> GetFoods(
                int pageIndex = 0,
                int pageSize = 10,
                string sortColumn = null,
                string sortOrder = null,
                string filterColumn = null,
                string filterQuery = null)
        {
            return await ApiResult<FoodDTO>.CreateAsync(
                    _context.Food
                        .Select(c => new FoodDTO()
                        {
                            Id = c.Id,
                            Name = c.Name
                        }),
                    pageIndex,
                    pageSize,
                    sortColumn,
                    sortOrder,
                    filterColumn,
                    filterQuery);
        }

        // GET: api/Food/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Food>> GetFood(int id)
        {
            var Food = await _context.Food.FindAsync(id);

            if (Food == null)
            {
                return NotFound();
            }

            return Food;
        }



        // PUT: api/Food/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFood(int id, Food Food)
        {
            if (id != Food.Id)
            {
                return BadRequest();
            }

            //var sourceCity = _context.Cities.Where(i => i.Id == city.Id).FirstOrDefault();
            //if (sourceCity == null) return BadRequest();
            //sourceCity.Name = city.Name;
            //sourceCity.Lat = city.Lat;
            //sourceCity.Lon = city.Lon;

            _context.Entry(Food).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FoodExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Cities
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Food>> PostFood(Food Food)
        {
            _context.Food.Add(Food);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFood", new { id = Food.Id }, Food);
        }

        // DELETE: api/Cities/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Food>> DeleteFood(int id)
        {
            var Food = await _context.Food.FindAsync(id);
            if (Food == null)
            {
                return NotFound();
            }

            _context.Food.Remove(Food);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FoodExists(int id)
        {
            return _context.Food.Any(e => e.Id == id);
        }

        [HttpPost]
        [Route("IsDupeFood")]
        public bool IsDupeFood(Food Food)
        {
            return _context.Food.Any(
                e => e.Name == Food.Name
                && e.Id != Food.Id);
        }
    }
}
