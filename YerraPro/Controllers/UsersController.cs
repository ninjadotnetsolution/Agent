using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YerraPro.Models;
using YerraPro.Services;
using YerraPro.ViewModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace YerraPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IYerraProService _yerraProService;
        public UsersController(IYerraProService service)
        {
            _yerraProService = service;
        }
        // GET: api/<UsersController>
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(_yerraProService.GetAll());
        }

        [HttpGet("bycompanyId/{id}")]
        public IActionResult GetByCompanyId(string id)
        {
            if(id == "-1")
            {
                return Ok(_yerraProService.GetByRoleName("SuperAdmin"));
            }
            return Ok(_yerraProService.GetByCompanyId(id));
        }

        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            return Ok(_yerraProService.GetById(id));
        }

        
        // POST api/<UsersController>
        [HttpPost]
        public IActionResult Post([FromBody] Admin admin)
        {
            return Ok(_yerraProService.Create(admin));
        }

        // PUT api/<UsersController>/5
        [HttpPut]
        public IActionResult Put([FromBody] Admin admin)
        {
            return Ok(_yerraProService.Update(admin));
        }

        // DELETE api/<AccountController>/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _yerraProService.Delete(id);
        }
    }
}
