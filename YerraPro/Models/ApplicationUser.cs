using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YerraPro.Models
{
    public class ApplicationUser : IdentityUser
    {
        public byte[] PasswordSalt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public long CompanyId { get; set; }
        public Company Company { get; set; }
    }
}
