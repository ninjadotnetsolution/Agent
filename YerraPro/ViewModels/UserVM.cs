using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YerraPro.Models;

namespace YerraPro.ViewModels
{
    public class UserVM
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string CompanyId { get; set; }
        public bool Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> Roles { get; set; }

        public UserVM(ApplicationUser user, List<string> roles)
        {
            this.Id = user.Id;
            this.UserName = user.UserName;
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;
            this.Email = user.Email;
            this.CompanyId = user.CompanyId;
            this.PhoneNumber = user.PhoneNumber;
            this.Status = user.Status;
            this.Roles = roles;
            this.CreatedAt = user.CreatedAt;
        }
    }
}
