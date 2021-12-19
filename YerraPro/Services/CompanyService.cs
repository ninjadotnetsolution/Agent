using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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

        List<CompanyVM> GetAllCompanies();
        CompanyVM CreateCompany(CompanyVM company);
        CompanyVM GetCompanyById(long id);
        void DeleteCompany(long id);
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

        public List<CompanyVM> GetAllCompanies()
        {
            return context.Companies.Select(c => new CompanyVM(c, context.Users.Where(u => u.CompanyId == c.Id).Select(u => u.Email).ToList())).ToList();
        }

        public CompanyVM CreateCompany(CompanyVM company)
        {
            var admins = context.Users.Where(u => company.Admins.Any(aId => aId == u.Id)).Select(u => u.Email).ToList();
            var newCompany = new Company()
            {
                CompanyName = company.CompanyName,
                Domain = company.Domain,
                Description = company.Description,
            };
            context.Companies.Add(newCompany);
            context.SaveChanges();
            
            return new CompanyVM(newCompany, admins);
        }

        public CompanyVM GetCompanyById(long Id)
        {
            return context.Companies.Where(u => u.Id == Id).Select(c => new CompanyVM(c, context.Users.Where(u => u.CompanyId == c.Id).Select(u => u.Email).ToList())).FirstOrDefault();
        }

        public void DeleteCompany(long Id)
        {
            var selCompany = context.Companies.FirstOrDefault(c => c.Id == Id);

            context.Companies.Remove(selCompany);
        }

    }
}
