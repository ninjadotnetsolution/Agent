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
        public string PhoneNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> Roles { get; set; }

        public UserVM(ApplicationUser user, List<string> roles)
        {
            this.Id = user.Id;
            this.UserName = user.UserName;
            this.Email = user.Email;
            this.PhoneNumber = user.PhoneNumber;
            this.Roles = roles;
            this.CreatedAt = user.CreatedAt;
        }
    }
}
