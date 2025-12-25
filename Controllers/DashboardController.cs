using Microsoft.AspNetCore.Mvc;
using SMS.Models;
using SMS.ViewModels;

namespace SMS.Controllers
{
    public class DashboardController : BaseController
    {
        private readonly SMSDbContext _context;

        public DashboardController(SMSDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            ViewBag.UserName = HttpContext.Session.GetString("UserName");

            DateTime today = DateTime.Today;

            var model = new DashboardVM
            {
                TodayPurchase = _context.Purchases
                    .Where(p => p.PurchaseDate.HasValue &&
                                p.PurchaseDate.Value.Date == today)
                    .Sum(p => (decimal?)p.TotalAmount) ?? 0,

                TodaySale = _context.Sales
                    .Where(s => s.SaleDate.HasValue &&
                                s.SaleDate.Value.Date == today)
                    .Sum(s => (decimal?)s.TotalAmount) ?? 0,

                TotalProducts = _context.Products.Count(),

                TotalStock = _context.Products
                    .Sum(p => (int?)p.StockQuantity) ?? 0,

                OutOfStock = _context.Products
                    .Count(p => p.StockQuantity <= 0)
            };

            return View(model);
        }
    }
}
