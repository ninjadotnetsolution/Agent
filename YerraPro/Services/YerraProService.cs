using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using YerraPro.Data;
using YerraPro.Models;
using YerraPro.ViewModels;

namespace YerraPro.Services
{
    public interface IYerraProService
    {
        ApplicationDbContext context { get; set; }
        UserVM Authenticate(string userName, string password);
        List<Admin> GetAll();
        List<Admin> GetByCompanyId(string compnayId);
        List<Admin> GetByRoleName(string roleName);

        UserVM GetById(string id);
        UserVM Register(Register user);
        UserVM Create(Admin user);
        void Update(ApplicationUser user, string password = null);
        UserVM Update(Admin admin);
        void Delete(string id);
    }

    public interface IYerraProSingleton
    {
        List<ProcessInfo> ShowActions { get; set; }
        List<ProcessInfo> GetActions(string id);
        List<ProcessInfo> GetGlobalActions();
        void AddAction(ProcessInfo process);

    }

    public class YerraProSingleton : IYerraProSingleton
    {
        public YerraProSingleton()
        {
            this._showActions = new List<ProcessInfo>();

        }
        private List<ProcessInfo> _showActions { get; set; }
        public List<ProcessInfo> ShowActions
        {
            get => _showActions;
            set => _showActions = value;
        }

        public List<ProcessInfo> GetGlobalActions()
        {
            return _showActions.Where(p => p.Target == 2).ToList();
        }
        public List<ProcessInfo> GetActions(string id)
        {

            var selectedActions = _showActions.Where(a => a.AgentId == id).ToList();
            selectedActions.ForEach(p =>
            {
                if(p.Target == 0)
                    _showActions.Remove(p);
            });
            return selectedActions;
        }

        public void AddAction(ProcessInfo action)
        {
            _showActions.Add(action);
        }
    }

    public class YerraProService : IYerraProService
    {
        private ApplicationDbContext _context { get; set; }
        public ApplicationDbContext context
        {
            get => _context;
            set => _context = value;
        }
      
        [Obsolete]
        public YerraProService(ApplicationDbContext context)
        {
            _context = context;

            if(_context.Roles.Count() == 0)
            {
                _context.Roles.Add(new IdentityRole() { Name = "SuperAdmin" });
                _context.Roles.Add(new IdentityRole() { Name = "CompanyAdmin" });
            }
            _context.SaveChanges();

            if(_context.Users.Count() == 0)
            {
                var selRole = _context.Roles.FirstOrDefault(r => r.Name == "SuperAdmin");
                if(selRole != null)
                {
                    string passwordHash;
                    byte[] passwordSalt;
                    CreatePasswordHash("elder", out passwordHash, out passwordSalt);

                    ApplicationUser newUser = new ApplicationUser();
                    newUser.PasswordHash = passwordHash;
                    newUser.PasswordSalt = passwordSalt;
                    newUser.Email = "superadmin@gmail.com";
                    newUser.UserName = "superadmin";
                    _context.Users.Add(newUser);
                    _context.SaveChanges();

                    _context.UserRoles.Add(new IdentityUserRole<string>()
                    {
                        UserId = newUser.Id,
                        RoleId = selRole.Id
                    });
                    _context.SaveChanges();
                }
                
            }
        }

        public UserVM Authenticate(string email, string password)
        {
            
            var user = _context.Users.FirstOrDefault(x => x.Email == email);

            // check if ApplicationUsername exists
            if (user == null)
                throw new Exception("EMAIL_NOT_EXISTS");

            // check if password is correct
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                throw new Exception("INVALID_PASSWORD");

            var roleIds = _context.UserRoles.Where(r => r.UserId == user.Id).Select(r => r.RoleId);

            var roleNames = _context.Roles.Where(r => roleIds.Any(rId => rId == r.Id)).Select(r => r.Name).ToList();

            return new UserVM(user, roleNames);
        }

        public List<Admin> GetAll()
        {
            return (from user in _context.Users.AsQueryable()
                         select new Admin(user)).ToList();
        }

        public List<Admin> GetByCompanyId(string companyId)
        {
            return (from user in _context.Users.AsQueryable()
                    where user.CompanyId == companyId
                    select new Admin(user)).ToList();
        }

        public List<Admin> GetByRoleName(string roleName)
        {
            var selRole = _context.Roles.FirstOrDefault(r => r.Name == roleName);
            if (selRole == null) return null;
            return _context.UserRoles
                .Where(ur => ur.RoleId == selRole.Id)
                .Join(_context.Users, ur => ur.UserId, u => u.Id, (ur, u) => u)
                .Select(u => new Admin(u))
                .ToList();

        }

        public UserVM GetById(string id)
        {
            var selUser = _context.Users.FirstOrDefault(u => u.Id == id);
            if (selUser == null) return null;
            var roleNames = _context.UserRoles.Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name).ToList();
            return new UserVM(selUser, roleNames);
        }

        public UserVM Register(Register user)
        {
            // validation
            
            if (_context.Users.Any(x => x.UserName == user.UserName))
                throw new Exception("USERNAME_EXISTS");

            if (_context.Users.Any(x => x.Email == user.Email))
                throw new Exception("EMAIL_EXISTS");

            var selRole = _context.Roles.FirstOrDefault(r => r.Name == "CompanyAdmin");
            if (selRole != null)
            {

                string passwordHash;
                byte[] passwordSalt;
                CreatePasswordHash(user.Password, out passwordHash, out passwordSalt);

                ApplicationUser newUser = new ApplicationUser();
                newUser.PasswordHash = passwordHash;
                newUser.PasswordSalt = passwordSalt;
                newUser.Email = user.Email;
                newUser.UserName = user.UserName;

                _context.Users.Add(newUser);
                _context.SaveChanges();

                _context.UserRoles.Add(new IdentityUserRole<string>()
                {
                    UserId = newUser.Id,
                    RoleId = selRole.Id
                });
                _context.SaveChanges();

                return new UserVM(newUser, new List<string>() { selRole.Name});
            }
            return null;
        }

        public UserVM Create(Admin user)
        {
            // validation
            if (_context.Users.Any(x => x.Email == user.Email))
                throw new Exception("EMAIL_EXISTS");

            IdentityRole selRole;
            if (user.CompanyId == null)
            {
                selRole = _context.Roles.FirstOrDefault(r => r.Name == "SuperAdmin");
            }
            else
            {
                selRole = _context.Roles.FirstOrDefault(r => r.Name == "CompanyAdmin");

            }
            if (selRole != null)
            {

                string passwordHash;
                byte[] passwordSalt;
                CreatePasswordHash(user.Password, out passwordHash, out passwordSalt);

                ApplicationUser newUser = new ApplicationUser();
                newUser.PasswordHash = passwordHash;
                newUser.CompanyId = user.CompanyId;
                newUser.PasswordSalt = passwordSalt;
                newUser.FirstName = user.FirstName;
                newUser.LastName = user.LastName;
                newUser.Email = user.Email;
                newUser.Address = user.Address;
                newUser.PhoneNumber = user.PhoneNumber;
                newUser.UserName = $"{user.FirstName} {user.LastName}";
                newUser.Status = false;
                _context.Users.Add(newUser);
                _context.SaveChanges();

                _context.UserRoles.Add(new IdentityUserRole<string>()
                {
                    UserId = newUser.Id,
                    RoleId = selRole.Id
                });
                _context.SaveChanges();

                return new UserVM(newUser, new List<string>() { selRole.Name });
            }
            return null;
        }

        public UserVM Update(Admin admin)
        {
            var selUser = _context.Users.FirstOrDefault(u => u.Id == admin.Id);
            if (selUser == null) return null;
            selUser.FirstName = admin.FirstName;
            selUser.LastName = admin.LastName;
            selUser.Email = admin.Email;
            selUser.Address = admin.Address;
            selUser.PhoneNumber = admin.PhoneNumber;
            selUser.Status = admin.Status;
            _context.Users.Update(selUser);
            _context.SaveChanges();
            List<string> roles = _context.UserRoles.Where(ur => ur.UserId == selUser.Id).Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name).ToList();
            return new UserVM(selUser, roles);
        }
        public void Update(ApplicationUser userParam, string password = null)
        {
            var user = _context.Users.Find(userParam.Id);

            if (user == null)
                throw new Exception("ApplicationUser not found");

            // update ApplicationUsername if it has changed
            if (!string.IsNullOrWhiteSpace(userParam.UserName) && userParam.UserName != user.UserName)
            {
                // throw error if the new ApplicationUsername is already taken
                if (_context.Users.Any(x => x.UserName == userParam.UserName))
                    throw new Exception("ApplicationUsername " + userParam.UserName + " is already taken");

                user.UserName = userParam.UserName;
            }

            
            // update password if provided
            if (!string.IsNullOrWhiteSpace(password))
            {
                string passwordHash;
                byte[] passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }

            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void Delete(string id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }

        // private helper methods

        private static void CreatePasswordHash(string password, out string passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                byte[] bytes = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }

                passwordHash = builder.ToString();
            }
        }

        private static bool VerifyPasswordHash(string password, string storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 128) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                byte[] computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < computedHash.Length; i++)
                {
                    builder.Append(computedHash[i].ToString("x2"));
                }

                if (builder.ToString() != storedHash) return false;
            }

            return true;
        }
    }
}
