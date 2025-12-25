using SMS.Models;

namespace SMS.ViewModels
{
    public class SaleEditVM
    {
        public int SaleId { get; set; }
        public string? CustomerName { get; set; }
        public decimal? TotalAmount { get; set; }

        public List<SaleDetailVM> Details { get; set; } = new();
    }
    public class SaleDetailVM
    {
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? TotalPrice { get; set; }
    }
}
