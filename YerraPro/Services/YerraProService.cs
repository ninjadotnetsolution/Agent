using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using YerraPro.Data;
using YerraPro.Models;

namespace YerraPro.Services
{
    public interface IYerraProService
    {
        ApplicationDbContext context { get; set; }
        ApplicationUser Authenticate(string userName, string password);
        IEnumerable<ApplicationUser> GetAll();
        ApplicationUser GetById(int id);
        ApplicationUser Create(Register user);
        void Update(ApplicationUser user, string password = null);
        void Delete(int id);
    }

    public interface IYerraProSingleton
    {
        List<ProcessInfo> ShowActions { get; set; }
        List<ProcessInfo> GetActions(string id);
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
        public List<ProcessInfo> GetActions(string id)
        {

            var selectedActions = _showActions.Where(a => a.AgentId == id).ToList();
            _showActions.ForEach(p =>
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
        }

        public ApplicationUser Authenticate(string email, string password)
        {
            
            var user = _context.Users.FirstOrDefault(x => x.Email == email);

            // check if ApplicationUsername exists
            if (user == null)
                throw new Exception("EMAIL_NOT_EXISTS");

            // check if password is correct
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                throw new Exception("INVALID_PASSWORD");

            // authentication successful
            
            return user;
        }

        public IEnumerable<ApplicationUser> GetAll()
        {
            return _context.Users;
        }

        public ApplicationUser GetById(int id)
        {
            return _context.Users.Find(id);
        }

        public ApplicationUser Create(Register user)
        {
            // validation
            
            if (_context.Users.Any(x => x.UserName == user.UserName))
                throw new Exception("USERNAME_EXISTS");

            if (_context.Users.Any(x => x.Email == user.Email))
                throw new Exception("EMAIL_EXISTS");

            
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

            return newUser;
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

        public void Delete(int id)
        {
            var user = _context.Users.Find(id);
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
