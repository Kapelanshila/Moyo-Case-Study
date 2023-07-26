using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OnlineOrderAPI.Models;


namespace OnlineOrderAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OMSController : ControllerBase
    {
        private readonly IOnlineOrderRepository _db;

        public OMSController(IOnlineOrderRepository appDbContext)
        {
            _db = appDbContext;
        }


        //Read Users
        [HttpGet]
        [Route("getUsers")]
        public async Task<IActionResult> getUsers()
        {
            try
            {
                var UserList = await _db.GetAllUsersAsync();
                return Ok(UserList);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }

        //Read User Roles
        [HttpGet]
        [Route("getUserRoles")]
        public async Task<IActionResult> getUserRoles()
        {
            try
            {
                var UserRolesList = await _db.GetAllUserRolesAsync();
                return Ok(UserRolesList);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }

        //Create Product
        [HttpPost]
        [Route("createProduct")]
        public async Task<IActionResult> CreateProduct(Product Product)
        {
            Product ProductCreate = new Product();
            try
            {
                Product newProduct = new Product
                {
                    ProductID = ProductCreate.ProductID,
                    ProductName = Product.ProductName,
                    Stock = Product.Stock,
                    Price = Product.Price
                };
                _db.Add(newProduct);
                await _db.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
            return Ok("Record saved in database");
        }

        //Read Products
        [HttpGet]
        [Route("getProducts")]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                var ProductList = await _db.GetAllProductsAsync();
                return Ok(ProductList);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }


        //Read OrderLines
        [HttpGet]
        [Route("getOrderLines")]
        public async Task<IActionResult> GetOrderLines()
        {
            try
            {
                var OrderLineList = await _db.GetEveryOrderLinesAsync();
                return Ok(OrderLineList);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }


        //Search Product
        [HttpGet]
        [Route("searchProducts")]
        public async Task<IActionResult> searchProduct(string search)
        {
            try
            {
                if (search == null || search == "")
                {
                    var searchProductList = await _db.GetAllProductsAsync();
                    return Ok(searchProductList);
                }
                else
                {
                    var searchProductList = await _db.SearchProductsAsync(search);
                    return Ok(searchProductList);
                }
            }
            catch (Exception)
            {
                return StatusCode(605);
            }
        }

        //Update Product
        [HttpPost]
        [Route("updateProduct")]
        public async Task<IActionResult> UpdateProduct(Product Product)
        {
            try
            {
                var exisitingProduct = await _db.GetProductAsync(Product.ProductID);
                exisitingProduct.ProductID = Product.ProductID;
                exisitingProduct.ProductName = Product.ProductName;
                exisitingProduct.Stock = Product.Stock;
                exisitingProduct.Price = Product.Price;

                if (await _db.SaveChangesAsync())
                {
                    return Ok(Product);
                }
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
            return StatusCode(469);
        }


        //Delete Product 
        [HttpPost]
        [Route("deleteProduct")]
        public async Task<IActionResult> DeleteProduct(Product Product)
        {
            try
            {
                var exisitingProduct = await _db.GetProductAsync(Product.ProductID);

                if (exisitingProduct != null)
                {
                    _db.Delete(exisitingProduct);

                    if (await _db.SaveChangesAsync())
                    {
                        return Ok();
                    }
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Cannot be deleted");
                }
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Cannot be deleted");
            }

            return BadRequest();
        }


        //Create Order
        [HttpPost]
        [Route("createOrderLine")]
        public async Task<IActionResult> CreateOrderLine(OrderVM order)
        {
            Order OrderCreate = new Order();
            OrderLine OrderLineCreate = new OrderLine();

            try
            {
                Order newOrder = new Order
                {
                    OrderID = OrderCreate.OrderID,
                    Description = order.Description,
                    Date = DateTime.Now
                };
                _db.Add(newOrder);
                await _db.SaveChangesAsync();

                foreach (var item in order.Products)
                {
                    OrderLine newOrderLine = new OrderLine
                    {
                        OrderLineID = OrderLineCreate.OrderLineID,
                        OrderID = newOrder.OrderID,
                        ProductID = item.ProductID,
                        UserID = order.UserID,
                        Quantity = item.Quantity
                    };
                    _db.Add(newOrderLine);
                    //Reduces Product Stock
                    var existingproduct = await _db.GetProductAsync(item.ProductID);
                    existingproduct.Stock = existingproduct.Stock - item.Quantity;
                    await _db.SaveChangesAsync();
                }


            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
            return Ok("Record saved in database");
        }

        //Read OrderLines
        [HttpGet]
        [Route("getClientOrderLines")]
        public async Task<IActionResult> GetClientOrderLines(int userID)
        {
            try
            {
                var OrderLineList = await _db.GetAllOrderLinesAsync(userID);
                return Ok(OrderLineList);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }


        //Read Order
        [HttpGet]
        [Route("getOrders")]
        public async Task<IActionResult> GetOrders()
        {
            try
            {
                var OrderList = await _db.GetAllOrdersAsync();
                return Ok(OrderList);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }

        //Search Orders
        [HttpPost]
        [Route("searchOrderLines")]
        public async Task<IActionResult> searchOrderLine(SearchOrderVM search)
        {
            try
            {
                if (search == null)
                {
                    var searchOrderList = await _db.GetAllOrderLinesAsync(search.UserID);
                    return Ok(searchOrderList);
                }
                else
                {
                    var searchOrderList = await _db.SearchOrderLinesAsync(search);
                    return Ok(searchOrderList);
                }
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error, please contact support");
            }
        }


        //Update Orderline
        [HttpPut]
        [Route("UpdateOrderLine")]
        public async Task<IActionResult> UpdateOrderline(OrderVM order)
        {
            try
            {
                //Update Order Details
                var existingOrder = await _db.GetOrderAsync(order.OrderID);
                existingOrder.Description = order.Description;
                existingOrder.Date = DateTime.Now;

                //Updating Stock Levels
                foreach (var item in order.Products)
                {
                    //Get Specific Ordline Porduct 
                    var exisitingOrderLine = await _db.GetSpecificPOrderLineAsync(order.OrderID, item.ProductID);

                    //Loop through products in order 
                    if (await _db.GetSpecificPOrderLineAsync(order.OrderID, item.ProductID) != null)
                    {
                        var existingProduct = await _db.GetProductAsync(item.ProductID);
                        existingProduct.Stock = existingProduct.Stock + (exisitingOrderLine.Quantity - item.Quantity);
                        exisitingOrderLine.Quantity = item.Quantity;
                    }
                    else
                    {
                        OrderLine newOrderLine = new OrderLine
                        {
                            OrderLineID = order.OrderLineID,
                            OrderID = order.OrderID,
                            ProductID = item.ProductID,
                            UserID = order.UserID,
                            Quantity = item.Quantity
                        };
                        _db.Add(newOrderLine);

                        //Reduces Stock
                        var existingProduct = await _db.GetProductAsync(item.ProductID);
                        existingProduct.Stock = existingProduct.Stock - item.Quantity;
                        await _db.SaveChangesAsync();
                    }

                }
                await _db.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
            return Ok("Record saved in database");
        }


        //Delete Product in Order Line 
        [HttpPost]
        [Route("deleteOrderProduct")]
        public async Task<IActionResult> deleteOrderProduct(ProductVM product)
        {
            try
            {
                var exisitingOrderLine = await _db.GetSpecificPOrderLineAsync(product.OrderID, product.ProductID);
                var exisitingProduct = await _db.GetProductAsync(product.ProductID);


                //Update Status
                if (exisitingOrderLine != null)
                {
                    var exisitingOrder = await _db.GetOrderAsync(exisitingOrderLine.OrderID);
                    exisitingOrder.Date = DateTime.Now;

                    //Add Stock
                    exisitingProduct.Stock = exisitingProduct.Stock + exisitingOrderLine.Quantity;


                    _db.Delete(exisitingOrderLine);

                    if (await _db.SaveChangesAsync())
                    {
                        return Ok();
                    }
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Cannot be deleted");
                }

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Cannot be deleted");
            }

            return BadRequest();
        }

    }
}
