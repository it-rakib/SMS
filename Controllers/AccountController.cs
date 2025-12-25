using Microsoft.AspNetCore.Mvc;
using SMS.Models;
using SMS.ViewModels;

namespace SMS.Controllers
{
    public class AccountController : Controller
    {

        private readonly SMSDbContext _context;

        public AccountController(SMSDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(LoginVM model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = _context.Users.FirstOrDefault(x => x.Email == model.Email && x.IsActive == true);


            if (user == null)
            {
                ViewBag.Error = "Invalid email or password";
                return View(model);
            }

            // TEMP password check (hashing comes next)
            if (user.PasswordHash != model.Password)
            {
                ViewBag.Error = "Invalid email or password";
                return View(model);
            }

            // Session set
            HttpContext.Session.SetInt32("UserId", user.UserId);
            HttpContext.Session.SetString("UserName", user.FullName);
            HttpContext.Session.SetString("UserRole", user.Role);

            return RedirectToAction("Index", "Dashboard");
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }
        // Temporary method to generate a hashed password
        //[HttpGet]
        //public IActionResult GenerateHash(string password)
        //{
        //    if (string.IsNullOrEmpty(password))
        //        return Content("Please provide password in query string: ?password=123456");

        //    // Hash the password
        //    var hashed = BCrypt.Net.BCrypt.HashPassword(password);

        //    return Content($"Hashed password: {hashed}");
        //}

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(RegisterVM model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (model.Password != model.ConfirmPassword)
            {
                ViewBag.Error = "Passwords do not match";
                return View(model);
            }

            // Check if email already exists
            var exists = _context.Users.Any(u => u.Email == model.Email);
            if (exists)
            {
                ViewBag.Error = "Email already registered";
                return View(model);
            }

            // Hash the password
            //var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
            var hashedPassword = model.Password;

            // Create user
            var user = new Models.User
            {
                FullName = model.FullName,
                Email = model.Email,
                PasswordHash = hashedPassword,
                Role = string.IsNullOrEmpty(model.Role) ? "User" : model.Role,
                IsActive = true
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            ViewBag.Success = "User registered successfully!";
            return View();
        }

    }
}
