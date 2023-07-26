using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineOrderAPI.Models
{
    public interface IOnlineOrderRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();


        //Users-------------------------------------------------------------------------
        Task<User[]> GetAllUsersAsync();
        Task<User> GetUserAsync(User User);
        // 


        //UserRoles-------------------------------------------------------------------------
        Task<UserRole[]> GetAllUserRolesAsync();
        Task<UserRole> GetUserRoleAsync(int? userid);
        // 

        //Valid User -------------------------------------------------------------------------
        Task<User> GetValidUserAsync(LoginVM user);
        //

        //Products-------------------------------------------------------------------------
        Task<Product[]> GetAllProductsAsync();
        Task<Product> GetProductAsync(int productID);
        Task<Product[]> SearchProductsAsync(string search);
        // 

        //Orders-------------------------------------------------------------------------
        Task<Order[]> GetAllOrdersAsync();
        Task<Order> GetOrderAsync(int orderID);
        Task<Order[]> SearchOrdersAsync(string search);
        // 

        //OrderLines-------------------------------------------------------------------------
        Task<OrderLine[]> GetAllOrderLinesAsync(int UserID);
        Task<OrderLine[]> GetEveryOrderLinesAsync();
        Task<OrderLine> GetOrderLineAsync(int orderLineID);
        Task<OrderLine> GetSpecificPOrderLineAsync(int orderID, int productID);
        Task<OrderLine[]> SearchOrderLinesAsync(SearchOrderVM searchquery);
        // 


    }
}
