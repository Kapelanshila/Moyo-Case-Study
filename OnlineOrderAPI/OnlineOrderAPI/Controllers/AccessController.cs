using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using OnlineOrderAPI.Models;

namespace OnlineOrderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AccessController : ControllerBase
    {

        private readonly IOnlineOrderRepository _db;
        public IConfiguration _configuration;
        private readonly OnlineOrderDBContext _context;


        public AccessController(IOnlineOrderRepository appDbContext, IConfiguration config, OnlineOrderDBContext context)
        {
            _db = appDbContext;
            _configuration = config;
            _context = context;
        }

        //Testing Adding Users
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register(User user)
        {
            try
            {
                User UserCreate = new User();

                User newUser = new User
                {
                    UserID = UserCreate.UserID,
                    UserName = user.UserName,
                    UserRoleID = user.UserRoleID,
                    Password_Hashed = BCrypt.Net.BCrypt.HashPassword(user.Password_Hashed)
                };
                _db.Add(newUser);

                if (await _db.SaveChangesAsync())
                {
                    return Ok(newUser);
                }
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
            return BadRequest();
        }
        //

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Post(LoginVM user)
        {
            var validuser = await _db.GetValidUserAsync(user);

            if (validuser != null && BCrypt.Net.BCrypt.Verify(user.Password_Hashed, validuser.Password_Hashed) == true)
            {
                //create claims details based on the user information
                var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                new Claim("UserName", user.UserName),
                new Claim("_uid", validuser.UserID.ToString())

                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], claims, expires: DateTime.UtcNow.AddDays(1), signingCredentials: signIn);

                return Ok(new JwtSecurityTokenHandler().WriteToken(token));
            }
            else
            {
                return BadRequest("Invalid credentials");
            }

        }


        }
    }


