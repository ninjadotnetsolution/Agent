using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YerraPro.Data;
using YerraPro.Models;
using YerraPro.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace YerraPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcessController : ControllerBase
    {
        public ApplicationDbContext _context;
        private readonly IYerraProService _yerraProService;
        public ProcessController(IYerraProService service, ApplicationDbContext context)
        {
            _context = context;
            _yerraProService = service;
        }
        // GET: api/<ProcessController>
        [HttpGet]
        public List<ProcessInfo> Get()
        {
            return _context.ProcessesInfos
                    .Include(p => p.Agent)
                    .ToList();
        }

        // GET api/<ProcessController>/5
        [HttpGet("{id}")]
        public List<ProcessInfo> Get(string id)
        {
            if(id == "-1")
            {
                return _context.ProcessesInfos
                    .Include(p => p.Agent)
                    .Where(p => p.Target == 2).ToList();
            }
            return _context.ProcessesInfos.Where(p => p.AgentId == id || p.Target == 2).Include(p => p.Agent).ToList();
                    
        }

        // POST api/<ProcessController>
        [HttpPost]
        [Obsolete]
        public List<ProcessInfo> Post(List<ProcessInfo> processInfos)
        {
            _context.ProcessesInfos.AddRange(processInfos);
            _context.SaveChanges();
            return processInfos;
        }
        
        // PUT api/<ProcessController>/5
        [HttpPut]
        [Obsolete]
        public ProcessInfo Put(ProcessInfo process)
        {
            var selectedProcess = _context.ProcessesInfos.SingleOrDefault(p => p.Id == process.Id);

            if (selectedProcess.Target == process.Target) _yerraProService.AddShowAction(process);
            _context.ProcessesInfos.Update(process);
            _context.SaveChanges();
            return process;
        }

        // DELETE api/<ProcessController>/5
        [HttpDelete("{id}")]
        [Obsolete]
        public void Delete(int id)
        {
            var selectedProcess = _context.ProcessesInfos.FirstOrDefault(p => p.Id == id);
            _context.ProcessesInfos.Remove(selectedProcess);
            _context.SaveChanges();
        }
    }
}
