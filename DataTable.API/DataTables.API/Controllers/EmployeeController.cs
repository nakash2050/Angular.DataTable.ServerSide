using DataTables.Data;
using DataTables.Models;
using DataTables.Models.Paging;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace DataTables.Controllers
{
    public class EmployeeController : ApiController
    {
        private readonly DataContext _context;

        public EmployeeController()
        {
            _context = new DataContext();
        }

        public async Task<IHttpActionResult> Get()
        {
            var employees = await _context.Employees.ToListAsync();
            return Ok(employees);
        }

        public async Task<IHttpActionResult> Get(int id)
        {
            var recordSkip = id == 1 ? 0 : (id - 1) * 10;
            var employee = await _context.Employees.OrderBy(emp => emp.EmployeeID).Skip(recordSkip).Take(10).ToListAsync();
            return Ok(employee);
        }

        public async Task<IHttpActionResult> Post([FromBody]PagingRequest paging)
        {
            var pagingResponse = new PagingResponse()
            {
                Draw = paging.Draw
            };

            if (!paging.SearchCriteria.IsPageLoad)
            {
                IQueryable<Employee> query = null;

                if (!string.IsNullOrEmpty(paging.SearchCriteria.Filter))
                {
                    query = _context.Employees.Where(emp => emp.Name.Contains(paging.SearchCriteria.Filter));
                }
                else
                {
                    query = _context.Employees;
                }

                var recordsTotal = await query.CountAsync();

                var colOrder = paging.Order[0];

                switch (colOrder.Column)
                {
                    case 0:
                        query = colOrder.Dir == "asc" ? query.OrderBy(emp => emp.EmployeeID) : query.OrderByDescending(emp => emp.EmployeeID);
                        break;
                    case 1:
                        query = colOrder.Dir == "asc" ? query.OrderBy(emp => emp.Name) : query.OrderByDescending(emp => emp.Name);
                        break;
                    case 2:
                        query = colOrder.Dir == "asc" ? query.OrderBy(emp => emp.Email) : query.OrderByDescending(emp => emp.Email);
                        break;
                    case 3:
                        query = colOrder.Dir == "asc" ? query.OrderBy(emp => emp.Company) : query.OrderByDescending(emp => emp.Company);
                        break;
                }

                pagingResponse.Employees = await query.Skip(paging.Start).Take(paging.Length).ToArrayAsync();
                pagingResponse.RecordsTotal = recordsTotal;
                pagingResponse.RecordsFiltered = recordsTotal;
            }

            return Ok(pagingResponse);
        }
    }
}
