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
    public class CompaniesController : ControllerBase
    {
        public ICompanyService _service;

        public CompaniesController(ICompanyService service)
        {
            _service = service;
        }
        // GET: api/<CompaniesController>
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_service.GetAllCompanies());
        }

        // GET api/<CompaniesController>/5
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            return Ok(_service.GetCompanyById(id));
        }

        // POST api/<CompaniesController>
        [HttpPost]
        public IActionResult Post([FromBody] CompanyVM value)
        {
            return Ok(_service.CreateCompany(value));
        }

        // PUT api/<CompaniesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CompaniesController>/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _service.DeleteCompany(id);
        }
    }
}
