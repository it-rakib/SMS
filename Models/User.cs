using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SMS.Models
{
    [Index("Email", Name = "UQ__Users__A9D1053498609B63", IsUnique = true)]
    public partial class User
    {
        public User()
        {
            Purchases = new HashSet<Purchase>();
            Sales = new HashSet<Sale>();
        }

        [Key]
        public int UserId { get; set; }
        [StringLength(100)]
        public string? FullName { get; set; }
        [StringLength(100)]
        public string? Email { get; set; }
        [StringLength(255)]
        public string? PasswordHash { get; set; }
        [StringLength(50)]
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedAt { get; set; }

        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<Purchase> Purchases { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<Sale> Sales { get; set; }
    }
}
