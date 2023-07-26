using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Dynamic;
using System.Data;

namespace OnlineOrderAPI.Models
{
    public class OnlineOrderRepository : IOnlineOrderRepository
    {
        private readonly OnlineOrderDBContext _appDbContext;
        public IConfiguration Configuration { get; }

        public OnlineOrderRepository(OnlineOrderDBContext appDbContext, IConfiguration configuration)
        {
            _appDbContext = appDbContext;
            Configuration = configuration;
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);
        }


        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        //User 
        public async Task<User[]> GetAllUsersAsync()
        {
            IQueryable<User> query = _appDbContext.Users;
            return await query.ToArrayAsync();
        }

        public async Task<User> GetUserAsync(User user)
        {
            IQueryable<User> query = _appDbContext.Users.Where(l => l.UserID == user.UserID);
            return await query.FirstOrDefaultAsync();
        }
        //


        //User Role
        public async Task<UserRole[]> GetAllUserRolesAsync()
        {
            IQueryable<UserRole> query = _appDbContext.UserRoles;
            return await query.ToArrayAsync();
        }

        public async Task<UserRole> GetUserRoleAsync(int? userid)
        {
            IQueryable<UserRole> query = _appDbContext.UserRoles.Where(x => x.UserRoleID == userid);
            return await query.FirstOrDefaultAsync();
        }
        //

        //Valid User
        public async Task<User> GetValidUserAsync(LoginVM user)
        {
            IQueryable<User> query = _appDbContext.Users.Where(l => l.UserName == user.UserName);
            return await query.FirstOrDefaultAsync();
        }
        //


        //Products
        public async Task<Product[]> GetAllProductsAsync()
        {
            IQueryable<Product> query = _appDbContext.Products;
            return await query.ToArrayAsync();
        }

        public async Task<Product> GetProductAsync(int productID)
        {
            IQueryable<Product> query = _appDbContext.Products.Where(l => l.ProductID == productID);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Product[]> SearchProductsAsync(string search)
        {
            IQueryable<Product> query = _appDbContext.Products
                          .Where(l => l.ProductName.ToUpper().Contains(search.ToUpper()));
            return await query.ToArrayAsync();
        }
        //

        //Orders
        public async Task<Order[]> GetAllOrdersAsync()
        {
            IQueryable<Order> query = _appDbContext.Orders;
            return await query.ToArrayAsync();
        }

        public async Task<Order> GetOrderAsync(int orderID)
        {
            IQueryable<Order> query = _appDbContext.Orders.Where(l => l.OrderID == orderID);
            return await query.FirstOrDefaultAsync();
        }


        public async Task<Order[]> SearchOrdersAsync(string search)
        {
            IQueryable<Order> query = _appDbContext.Orders
                          .Where(l => l.Description.ToUpper().Contains(search.ToUpper()));
            return await query.ToArrayAsync();
        }
        //

        //OrderLine
        public async Task<OrderLine[]> GetAllOrderLinesAsync(int UserID)
        {
            IQueryable<OrderLine> query = _appDbContext.OrderLines.Where(l => l.UserID == UserID);
            return await query.ToArrayAsync();
        }

        public async Task<OrderLine[]> GetEveryOrderLinesAsync()
        {
            IQueryable<OrderLine> query = _appDbContext.OrderLines;
            return await query.ToArrayAsync();
        }

        public async Task<OrderLine> GetOrderLineAsync(int orderLineID)
        {
            IQueryable<OrderLine> query = _appDbContext.OrderLines.Where(l => l.OrderLineID == orderLineID);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<OrderLine> GetSpecificOrderLineAsync(int orderID, int productID)
        {
            IQueryable<OrderLine> query = _appDbContext.OrderLines.Where(l => l.OrderID == orderID && l.ProductID == productID);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<OrderLine> GetSpecificPOrderLineAsync(int orderID, int productID)
        {
            IQueryable<OrderLine> query = _appDbContext.OrderLines.Where(l => l.OrderID == orderID && l.ProductID == productID);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<OrderLine[]> SearchOrderLinesAsync(SearchOrderVM searchquery)
        {
            IQueryable<Order> orders = _appDbContext.Orders;
            IQueryable<OrderLine> orderlines = _appDbContext.OrderLines;
            IQueryable<User> users = _appDbContext.Users;
            IQueryable<Product> products = _appDbContext.Products;


            IQueryable<OrderLine> query = (from ol in orderlines
                                           join o in orders on ol.OrderID equals o.OrderID
                                           join u in users on ol.UserID equals u.UserID
                                           join p in products on ol.ProductID equals p.ProductID

                                           where (p.ProductName.ToUpper().Contains(searchquery.search.ToUpper()) || o.Description.ToUpper().Contains(searchquery.search.ToUpper())) && searchquery.UserID == u.UserID
                                            select ol
                                           );

            return await query.ToArrayAsync();

        }
        //


    }
}

