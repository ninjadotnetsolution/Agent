using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YerraPro.Models;
using YerraPro.Services;

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

        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            return Ok(_yerraProService.GetById(id));
        }


        
        // POST api/<UsersController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<AccountController>/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _yerraProService.Delete(id);
        }
    }
}
