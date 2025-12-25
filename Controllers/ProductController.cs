using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using SMS.Models;
using SMS.ViewModels;

namespace SMS.Controllers
{
    public class ProductController : BaseController
    {
        private readonly SMSDbContext _context;

        public ProductController(SMSDbContext context)
        {
            _context = context;
        }

        // GET: List all products
        public IActionResult Index()
        {
            var products = _context.Products
            .Select(p => new {
                p.ProductId,
                p.ProductName,
                CategoryName = p.Category != null ? p.Category.CategoryName : "N/A",
                SalePrice = p.SalePrice, // keep nullable
                IsActive = p.IsActive     // nullable bool
            }).ToList();


            return View(products);
        }

        // GET: Create form
        public IActionResult Create()
        {
            ViewBag.Categories = new SelectList(_context.ProductCategories.Where(c => c.IsActive == true), "CategoryId", "CategoryName");
            var product = new Product(); // <-- Create empty model instance
            return View(product);
        }

        // POST: Create
        [HttpPost]
        public IActionResult Create(Product model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Categories = new SelectList(_context.ProductCategories.Where(c => c.IsActive == true), "CategoryId", "CategoryName");
                return View(model);
            }

            model.IsActive = true;
            _context.Products.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // GET: Edit
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            ViewBag.Categories = new SelectList(_context.ProductCategories.Where(c => c.IsActive == true), "CategoryId", "CategoryName", product.CategoryId);
            return View(product);
        }

        // POST: Edit
        [HttpPost]
        public IActionResult Edit(Product model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Categories = new SelectList(_context.ProductCategories.Where(c => c.IsActive == true), "CategoryId", "CategoryName", model.CategoryId);
                return View(model);
            }

            _context.Products.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // GET: Delete confirmation
        public IActionResult Delete(int id)
        {
            var product = _context.Products
                .Where(p => p.ProductId == id)
                .Select(p => new ProductDeleteVM
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName ?? ""
                })
                .FirstOrDefault();

            if (product == null) return NotFound();

            return View(product);
        }

        // POST: Delete
        [HttpPost, ActionName("Delete")]
        public IActionResult DeleteConfirmed(int ProductId)
        {
            var product = _context.Products.Find(ProductId);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

    }
}
