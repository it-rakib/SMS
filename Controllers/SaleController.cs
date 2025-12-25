using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SMS.Models;
using System.Linq;

namespace SMS.Controllers
{
    public class SaleController : Controller
    {
        private readonly SMSDbContext _context;

        public SaleController(SMSDbContext context)
        {
            _context = context;
        }

        // GET: Sale
        public IActionResult Index()
        {
            var sales = _context.Sales
                .Select(s => new
                {
                    s.SaleId,
                    s.SaleDate,
                    s.CustomerName,
                    s.TotalAmount,
                    TotalItems = s.SaleDetails.Count
                }).ToList();

            return View(sales);
        }

        // GET: Sale/Create
        public IActionResult Create()
        {
            ViewBag.Products = _context.Products
                .Where(p => p.IsActive == true)
                .Select(p => new SelectListItem
                {
                    Value = p.ProductId.ToString(),
                    Text = p.ProductName
                }).ToList();

            return View();
        }

        // POST: Sale/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Sale sale, List<SaleDetail> details)
        {

            if (details == null || details.Count == 0)
            {
                ModelState.AddModelError("", "Add at least one product");
            }

            if (!ModelState.IsValid)
            {
                ViewBag.Products = _context.Products.Where(x => x.IsActive == true).ToList();
                return View(sale);
            }

            sale.SaleDate = DateTime.Now;
            sale.CreatedBy = 1; // TODO: logged-in user
            sale.TotalAmount = details.Sum(x => x.TotalPrice ?? 0);

            _context.Sales.Add(sale);
            _context.SaveChanges();

            foreach (var d in details)
            {
                d.SaleId = sale.SaleId;
                _context.SaleDetails.Add(d);

                // ✅ UPDATE STOCK
                var product = _context.Products.First(p => p.ProductId == d.ProductId);
                product.StockQuantity = (product.StockQuantity ?? 0) - (d.Quantity ?? 0);
            }

            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // GET: Sale/Details/5
        public IActionResult Details(int id)
        {
            var sale = _context.Sales
                .Include(p => p.SaleDetails)
                .ThenInclude(d => d.Product)
                .FirstOrDefault(p => p.SaleId == id);

            if (sale == null)
                return NotFound();

            return View(sale);
        }
        // GET: Sale/Edit/5
        public IActionResult Edit(int id)
        {
            var sale = _context.Sales
                .Include(s => s.SaleDetails) // <-- include the details
                .FirstOrDefault(s => s.SaleId == id);

            if (sale == null) return NotFound();

            ViewBag.Products = _context.Products
                .Where(x => x.IsActive == true)
                .Select(x => new SelectListItem
                {
                    Value = x.ProductId.ToString(),
                    Text = x.ProductName
                }).ToList();

            return View(sale);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Sale sale, List<SaleDetail> details)
        {
            if (id != sale.SaleId) return NotFound();

            if (ModelState.IsValid)
            {
                var existingSale = _context.Sales.Include(s => s.SaleDetails).FirstOrDefault(s => s.SaleId == id);
                if (existingSale == null) return NotFound();

                existingSale.CustomerName = sale.CustomerName;
                existingSale.TotalAmount = details.Sum(d => d.TotalPrice ?? 0);

                // Remove old details
                _context.SaleDetails.RemoveRange(existingSale.SaleDetails);
                _context.SaveChanges();

                // Add new details
                foreach (var d in details)
                {
                    d.SaleId = id;
                    _context.SaleDetails.Add(d);
                }
                _context.SaveChanges();

                return RedirectToAction(nameof(Index));
            }

            ViewBag.Products = _context.Products
                .Where(p => p.IsActive == true)
                .Select(p => new SelectListItem
                {
                    Value = p.ProductId.ToString(),
                    Text = p.ProductName
                }).ToList();

            return View(sale);
        }


        // GET: Sale/Delete/5
        public IActionResult Delete(int id)
        {
            var sale = _context.Sales
                .Include(s => s.SaleDetails)
                .FirstOrDefault(s => s.SaleId == id);

            if (sale == null) return NotFound();
            return View(sale);
        }

        // POST: Sale/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int SaleId)
        {
            var sale = _context.Sales
                .Include(s => s.SaleDetails)
                .FirstOrDefault(s => s.SaleId == SaleId);

            if (sale == null) return NotFound();

            foreach (var d in sale.SaleDetails)
            {
                var product = _context.Products.Find(d.ProductId);
                if (product != null)
                    product.StockQuantity += d.Quantity ?? 0;
            }

            _context.SaleDetails.RemoveRange(sale.SaleDetails);
            _context.Sales.Remove(sale);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

    }
}
