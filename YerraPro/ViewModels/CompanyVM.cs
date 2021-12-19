using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YerraPro.Models;

namespace YerraPro.ViewModels
{
    public class CompanyVM
    {
        public long Id { get; set; }
        public string CompanyName { get; set; }
        public string Domain { get; set; }
        public string Description { get; set; }
        public List<string> Admins { get; set; }

        public CompanyVM() { }
        public CompanyVM(Company company, List<string> admins)
        {
            this.Id = company.Id;
            this.Domain = company.Domain;
            this.CompanyName = company.CompanyName;
            this.Description = company.Description;
            this.Admins = admins;
        }
    }
}
