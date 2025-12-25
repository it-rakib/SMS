using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SMS.Models;

namespace SMS.Controllers
{
    public class PurchaseController : Controller
    {
        private readonly SMSDbContext _context;

        public PurchaseController(SMSDbContext context)
        {
            _context = context;
        }

        // ================= INDEX =================
        public IActionResult Index()
        {
            var purchases = _context.Purchases
                .Select(p => new
                {
                    p.PurchaseId,
                    p.PurchaseDate,
                    p.SupplierName,
                    p.TotalAmount,
                    TotalItems = p.PurchaseDetails.Count
                }).ToList();

            return View(purchases);
        }

        // ================= CREATE =================
        public IActionResult Create()
        {
            ViewBag.Products = _context.Products
                .Where(p => p.IsActive == true)
                .Select(p => new SelectListItem
                {
                    Value = p.ProductId.ToString(),
                    Text = p.ProductName
                })
                .ToList();

            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Purchase purchase, List<PurchaseDetail> details)
        {
            if (details == null || details.Count == 0)
            {
                ModelState.AddModelError("", "Add at least one product");
            }

            if (!ModelState.IsValid)
            {
                ViewBag.Products = _context.Products.Where(x => x.IsActive == true).ToList();
                return View(purchase);
            }

            purchase.PurchaseDate = DateTime.Now;
            purchase.CreatedBy = 1; // TODO: logged-in user
            purchase.TotalAmount = details.Sum(x => x.TotalPrice ?? 0);

            _context.Purchases.Add(purchase);
            _context.SaveChanges();

            foreach (var d in details)
            {
                d.PurchaseId = purchase.PurchaseId;
                _context.PurchaseDetails.Add(d);

                // ✅ UPDATE STOCK
                var product = _context.Products.First(p => p.ProductId == d.ProductId);
                product.StockQuantity = (product.StockQuantity ?? 0) + (d.Quantity ?? 0);
            }

            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // ================= DETAILS =================
        public IActionResult Details(int id)
        {
            var purchase = _context.Purchases
                .Include(p => p.PurchaseDetails)
                .ThenInclude(d => d.Product)
                .FirstOrDefault(p => p.PurchaseId == id);

            if (purchase == null)
                return NotFound();

            return View(purchase);
        }


        public IActionResult Edit(int id)
        {
            var purchase = _context.Purchases
                .Include(s => s.PurchaseDetails) // <-- include the details
                .FirstOrDefault(s => s.PurchaseId == id);

            if (purchase == null) return NotFound();

            ViewBag.Products = _context.Products
                .Where(x => x.IsActive == true)
                .Select(x => new SelectListItem
                {
                    Value = x.ProductId.ToString(),
                    Text = x.ProductName
                }).ToList();

            return View(purchase);
        }        

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Purchase purchase, List<PurchaseDetail> details)
        {
            if (id != purchase.PurchaseId) return NotFound();

            if (ModelState.IsValid)
            {
                var existingSale = _context.Purchases.Include(s => s.PurchaseDetails).FirstOrDefault(s => s.PurchaseId == id);
                if (existingSale == null) return NotFound();

                existingSale.SupplierName = purchase.SupplierName;
                existingSale.TotalAmount = details.Sum(d => d.TotalPrice ?? 0);

                // Remove old details
                _context.PurchaseDetails.RemoveRange(existingSale.PurchaseDetails);
                _context.SaveChanges();

                // Add new details
                foreach (var d in details)
                {
                    d.PurchaseId = id;
                    _context.PurchaseDetails.Add(d);
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

            return View(purchase);
        }

        // ================= DELETE =================
        public IActionResult Delete(int id)
        {
            var purchase = _context.Purchases.Find(id);
            if (purchase == null)
                return NotFound();

            return View(purchase);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var purchase = _context.Purchases
                .Include(p => p.PurchaseDetails)
                .FirstOrDefault(p => p.PurchaseId == id);

            if (purchase == null)
                return NotFound();

            // 🔻 rollback stock
            foreach (var d in purchase.PurchaseDetails)
            {
                var product = _context.Products.Find(d.ProductId);
                if (product != null)
                    product.StockQuantity -= d.Quantity ?? 0;
            }

            _context.PurchaseDetails.RemoveRange(purchase.PurchaseDetails);
            _context.Purchases.Remove(purchase);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
    }
}
