using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using YerraPro.Data;
using YerraPro.Models;
using YerraPro.ViewModels;

namespace YerraPro.Services
{
    public interface ICompanyService
    {
        ApplicationDbContext _context { get; set; }

        List<Company> GetAllCompanies();
        CompanyVM CreateCompany(CompanyVM company);
        CompanyVM GetCompanyById(string id);
        void DeleteCompany(string id);
    }

    public class CompanyService : ICompanyService 
    {
        private ApplicationDbContext context { get; set; }
        public ApplicationDbContext _context
        {
            get => context;
            set => context = value;
        }

        [Obsolete]
        public CompanyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Company> GetAllCompanies()
        {
            return context.Companies.ToList();
        }

        public CompanyVM CreateCompany(CompanyVM company)
        {
            var newCompany = new Company()
            {
                Id = company.Id,
                CompanyName = company.CompanyName,
                CompanyShortName = company.CompanyShortName,
                Address = company.Address,
                NumberOfLicenses = company.NumberOfLicenses,
                Type = company.Type,
                LicenseIssueDate = company.LicenseIssueDate,
                LicenseExpireDate = company.LicenseExpireDate
            };
            context.Companies.Add(newCompany);
            context.SaveChanges();
            
            return new CompanyVM(newCompany);
        }

        public CompanyVM GetCompanyById(string Id)
        {
            var company = context.Companies.Include(c => c.Admins).Include(c => c.Agents).Where(c => c.Id == Id).FirstOrDefault();
            if (company == null) return null;

            return new CompanyVM(company, company.Admins.ToList(), company.Agents.ToList());
        }

        public void DeleteCompany(string Id)
        {
            var selCompany = context.Companies.FirstOrDefault(c => c.Id == Id);

            context.Companies.Remove(selCompany);
            context.SaveChanges();
        }

    }
}
