namespace SMS.ViewModels
{
    public class DashboardVM
    {
        public decimal TodayPurchase { get; set; }
        public decimal TodaySale { get; set; }

        public int TotalProducts { get; set; }
        public int TotalStock { get; set; }
        public int OutOfStock { get; set; }
    }
}
