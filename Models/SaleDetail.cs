using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SMS.Models
{
    public partial class SaleDetail
    {
        [Key]
        public int SaleDetailId { get; set; }
        public int? SaleId { get; set; }
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? UnitPrice { get; set; }
        [Column(TypeName = "decimal(29, 2)")]
        public decimal? TotalPrice { get; set; }

        [ForeignKey("ProductId")]
        [InverseProperty("SaleDetails")]
        public virtual Product? Product { get; set; }
        [ForeignKey("SaleId")]
        [InverseProperty("SaleDetails")]
        public virtual Sale? Sale { get; set; }
    }
}
