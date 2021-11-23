using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
namespace YerraPro.Models
{
    public class Register
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
    
}
