namespace SMS.Models
{
    public class MonthlyInventoryReport
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }

        public int Year { get; set; }
        public int Month { get; set; }

        public int PurchasedQty { get; set; }
        public int SoldQty { get; set; }
        public int ClosingStock { get; set; }
    }
}
