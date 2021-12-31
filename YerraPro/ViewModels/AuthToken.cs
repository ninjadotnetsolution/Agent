using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YerraPro.ViewModels
{
    public class AuthToken
    {
        public string AccessToken { get; set; }
        public int ExpiresIn { get; set; }

    }
}
