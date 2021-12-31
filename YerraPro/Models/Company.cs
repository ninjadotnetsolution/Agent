using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YerraPro.Models
{
    public class Company
    {
        public string Id { get; set; }
        public string CompanyName { get; set; }
        public string CompanyShortName { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public DateTime LicenseIssueDate { get; set; }
        public DateTime LicenseExpireDate { get; set; }
        public int NumberOfLicenses { get; set; }
        public int Type { get; set; }
        public ICollection<ApplicationUser> Admins { get; set; }
        public ICollection<Agent> Agents { get; set; }
        public Company()
        {
            this.Admins = new List<ApplicationUser>();
            this.Agents = new List<Agent>();
        }
    }
}
