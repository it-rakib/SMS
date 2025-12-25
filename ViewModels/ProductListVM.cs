namespace SMS.ViewModels
{
    public class ProductListVM
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = "N/A";
        public decimal? SalePrice { get; set; }
        public bool? IsActive { get; set; }
    }
}
