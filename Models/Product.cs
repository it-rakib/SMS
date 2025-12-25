using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SMS.Models
{
    public partial class Product
    {
        public Product()
        {
            PurchaseDetails = new HashSet<PurchaseDetail>();
            SaleDetails = new HashSet<SaleDetail>();
        }

        [Key]
        public int ProductId { get; set; }
        [StringLength(150)]
        public string? ProductName { get; set; }
        public int? CategoryId { get; set; }
        public int? StockQuantity { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? PurchasePrice { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? SalePrice { get; set; }
        public bool? IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedAt { get; set; }

        [ForeignKey("CategoryId")]
        [InverseProperty("Products")]
        public virtual ProductCategory? Category { get; set; }
        [InverseProperty("Product")]
        public virtual ICollection<PurchaseDetail> PurchaseDetails { get; set; }
        [InverseProperty("Product")]
        public virtual ICollection<SaleDetail> SaleDetails { get; set; }
    }
}
