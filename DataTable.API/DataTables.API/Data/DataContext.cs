using DataTables.Models;
using System.Data.Entity;


namespace DataTables.Data
{
    public class DataContext : DbContext
    {
        public DataContext() : base("name=EmployeeContext")
        {

        }

        public virtual DbSet<Employee> Employees { get; set; }
    }
}