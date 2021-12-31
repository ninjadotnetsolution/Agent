using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YerraPro.Models;

namespace YerraPro.ViewModels
{
    public class CompanyVM
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
        public ICollection<Admin> Admins { get; set; }
        public ICollection<Agent> Agents { get; set; }

        public CompanyVM() { }
        public CompanyVM(Company company, List<ApplicationUser> admins, List<Agent> agents)
        {
            this.Id = company.Id;
            this.CompanyName = company.CompanyName;
            this.CompanyShortName = company.CompanyShortName;
            this.Address = company.Address;
            this.Description = company.Description;
            this.LicenseIssueDate = company.LicenseIssueDate;
            this.LicenseExpireDate = company.LicenseExpireDate;
            this.NumberOfLicenses = company.NumberOfLicenses;
            this.Type = company.Type;
            this.Agents = agents;
            this.Admins = admins.Select(a => new Admin(a)).ToList();
        }

        public CompanyVM(Company company)
        {
            this.Id = company.Id;
            this.CompanyName = company.CompanyName;
            this.CompanyShortName = company.CompanyShortName;
            this.Address = company.Address;
            this.LicenseIssueDate = company.LicenseIssueDate;
            this.LicenseExpireDate = company.LicenseExpireDate;
            this.NumberOfLicenses = company.NumberOfLicenses;
            this.Type = company.Type;
        }
    }
}
