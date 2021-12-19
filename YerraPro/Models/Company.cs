using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YerraPro.Models
{
    public class Company
    {
        public long Id { get; set; }
        public string CompanyName { get; set; }
        public string Domain { get; set; }
        public string Description { get; set; }
        public ICollection<ApplicationUser> Admins { get; set; }

        public Company()
        {
            this.Admins = new List<ApplicationUser>();
        }
    }
}
