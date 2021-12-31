using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YerraPro.Models;

namespace YerraPro.ViewModels
{
    public class Admin
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string CompanyId { get; set; }
        public bool Status { get; set; }
        public Admin() { }
        public Admin(ApplicationUser _admin)
        {
            Id = _admin.Id;
            FirstName = _admin.FirstName;
            LastName = _admin.LastName;
            Email = _admin.Email;
            Address = _admin.Address;
            PhoneNumber = _admin.PhoneNumber;
            CompanyId = _admin.CompanyId;
            Status = _admin.Status;
        }
    }
}
