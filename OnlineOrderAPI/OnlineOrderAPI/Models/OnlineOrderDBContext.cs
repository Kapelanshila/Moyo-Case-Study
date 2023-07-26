using Microsoft.EntityFrameworkCore;

namespace OnlineOrderAPI.Models
{
    public class OnlineOrderDBContext : DbContext
    {
        public OnlineOrderDBContext()
        {
        }

        public OnlineOrderDBContext(DbContextOptions<OnlineOrderDBContext> options)
                 : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderLine> OrderLines { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRole>().HasData(new UserRole
            {
                UserRoleID = 1,
                Description = "Client"
            },
            new UserRole
            {
                UserRoleID = 2,
                Description = "Vendor"
            });


            modelBuilder.Entity<Product>().HasData(new Product
            {
                ProductID = 1,
                ProductName = "Apple iPhone 13 Pro",
                Price = 14000,
                Stock = 50
            },
           new Product
           {
               ProductID = 2,
               ProductName = "Samsung Galaxy S21 Ultra",
               Price = 11000,
               Stock = 60
           },
           new Product
           {
               ProductID = 3,
               ProductName = "Google Pixel 6 Pro",
               Price = 9000,
               Stock = 40
           },
           new Product
           {
               ProductID = 4,
               ProductName = "OnePlus 9 Pro",
               Price = 8500,
               Stock = 30
           },
           new Product
           {
               ProductID = 5,
               ProductName = "Xiaomi Mi 11",
               Price = 6750,
               Stock = 35
           },
           new Product
           {
               ProductID = 6,
               ProductName = "Apple MacBook Pro 16",
               Price = 21000,
               Stock = 25
           },
           new Product
           {
               ProductID = 7,
               ProductName = "Dell XPS 17",
               Price = 22000,
               Stock = 20
           },
           new Product
           {
               ProductID = 8,
               ProductName = "HP Spectre x360 15",
               Price = 17650,
               Stock = 15
           },
           new Product
           {
               ProductID = 9,
               ProductName = "Lenovo ThinkPad X1 Carbon Gen 9",
               Price = 9000,
               Stock = 18
           },
           new Product
           {
               ProductID = 10,
               ProductName = "Asus ROG Zephyrus G14",
               Price = 18950,
               Stock = 22
           });
        }

    }


}
