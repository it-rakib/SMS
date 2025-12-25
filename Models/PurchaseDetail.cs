using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SMS.Models
{
    public partial class PurchaseDetail
    {
        [Key]
        public int PurchaseDetailId { get; set; }
        public int? PurchaseId { get; set; }
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? UnitPrice { get; set; }
        [Column(TypeName = "decimal(29, 2)")]
        public decimal? TotalPrice { get; set; }

        [ForeignKey("ProductId")]
        [InverseProperty("PurchaseDetails")]
        public virtual Product? Product { get; set; }
        [ForeignKey("PurchaseId")]
        [InverseProperty("PurchaseDetails")]
        public virtual Purchase? Purchase { get; set; }
    }
}
