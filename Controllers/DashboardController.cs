using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
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

        public IActionResult InventoryReport(int? month, int? productId)
        {
            int year = DateTime.Now.Year;

            var result = new List<dynamic>();

            using (SqlConnection con = new SqlConnection(
                _context.Database.GetConnectionString()))
            {
                using (SqlCommand cmd = new SqlCommand("SELECT\r\n    X.ProductId,\r\n    X.ProductName,\r\n    X.[Year],\r\n    DATENAME(MONTH, DATEFROMPARTS(X.[Year], X.[Month], 1)) AS MonthName,\r\n    SUM(X.PurchasedQty) AS PurchasedQty,\r\n    SUM(X.SoldQty) AS SoldQty,\r\n    SUM(X.PurchasedQty - X.SoldQty) AS ClosingStock\r\nFROM\r\n(\r\n    -- PURCHASE\r\n    SELECT\r\n        D.ProductId,\r\n        PD.ProductName,\r\n        YEAR(P.PurchaseDate) AS [Year],\r\n        MONTH(P.PurchaseDate) AS [Month],\r\n        SUM(D.Quantity) AS PurchasedQty,\r\n        0 AS SoldQty\r\n    FROM PurchaseDetails D\r\n    INNER JOIN Purchases P ON D.PurchaseId = P.PurchaseId\r\n    INNER JOIN Products PD ON D.ProductId = PD.ProductId\r\n    GROUP BY\r\n        D.ProductId,\r\n        PD.ProductName,\r\n        YEAR(P.PurchaseDate),\r\n        MONTH(P.PurchaseDate)\r\n\r\n    UNION ALL\r\n\r\n    -- SALE\r\n    SELECT\r\n        D.ProductId,\r\n        PD.ProductName,\r\n        YEAR(S.SaleDate) AS [Year],\r\n        MONTH(S.SaleDate) AS [Month],\r\n        0 AS PurchasedQty,\r\n        SUM(D.Quantity) AS SoldQty\r\n    FROM SaleDetails D\r\n    INNER JOIN Sales S ON D.SaleId = S.SaleId\r\n    INNER JOIN Products PD ON D.ProductId = PD.ProductId\r\n    GROUP BY\r\n        D.ProductId,\r\n        PD.ProductName,\r\n        YEAR(S.SaleDate),\r\n        MONTH(S.SaleDate)\r\n) X\r\nWHERE\r\n    X.[Year] = @Year\r\n    AND (@Month IS NULL OR X.[Month] = @Month)\r\n    AND (@ProductId IS NULL OR X.ProductId = @ProductId)\r\nGROUP BY\r\n    X.ProductId,\r\n    X.ProductName,\r\n    X.[Year],\r\n    X.[Month]\r\nORDER BY\r\n    X.ProductName,\r\n    X.[Month];\r\n", con))
                {
                    cmd.Parameters.AddWithValue("@Year", year);
                    cmd.Parameters.AddWithValue("@Month", (object?)month ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ProductId", (object?)productId ?? DBNull.Value);

                    con.Open();
                    var reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            ProductId = reader["ProductId"],
                            ProductName = reader["ProductName"],
                            Year = reader["Year"],
                            MonthName = reader["MonthName"],
                            PurchasedQty = reader["PurchasedQty"],
                            SoldQty = reader["SoldQty"],
                            ClosingStock = reader["ClosingStock"]
                        });
                    }
                }
            }

            ViewBag.Products = _context.Products.ToList();
            ViewBag.SelectedMonth = month;
            ViewBag.SelectedProductId = productId;

            return View(result);
        }
    }
}
