using Microsoft.AspNetCore.Mvc;
using SMS.Models;

namespace SMS.Controllers
{
    public class ProductCategoryController : BaseController
    {
        private readonly SMSDbContext _context;

        public ProductCategoryController(SMSDbContext context)
        {
            _context = context;
        }

        // GET: List all categories
        public IActionResult Index()
        {
            var categories = _context.ProductCategories.ToList();
            return View(categories);
        }

        // GET: Create form
        public IActionResult Create()
        {
            return View();
        }

        // POST: Create category
        [HttpPost]
        public IActionResult Create(ProductCategory model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            model.IsActive = true;
            _context.ProductCategories.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // GET: Edit form
        public IActionResult Edit(int id)
        {
            var category = _context.ProductCategories.Find(id);
            if (category == null) return NotFound();

            return View(category);
        }

        // POST: Edit
        [HttpPost]
        public IActionResult Edit(ProductCategory model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            _context.ProductCategories.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // GET: Delete confirmation
        public IActionResult Delete(int id)
        {
            var category = _context.ProductCategories.Find(id);
            if (category == null) return NotFound();

            return View(category);
        }

        // POST: Delete
        [HttpPost, ActionName("Delete")]
        public IActionResult DeleteConfirmed(int id)
        {
            var category = _context.ProductCategories.Find(id);
            if (category == null) return NotFound();

            _context.ProductCategories.Remove(category);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

    }
}
