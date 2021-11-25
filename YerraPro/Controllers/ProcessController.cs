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
        private readonly IYerraProService _yerraProService;
        private readonly IYerraProSingleton _singleton;
        public ProcessController(IYerraProService service, IYerraProSingleton singleton)
        {
            _yerraProService = service;
            _singleton = singleton;
        }
        // GET: api/<ProcessController>
        [HttpGet]
        public List<ProcessInfo> Get()
        {
            return _yerraProService.context.ProcessesInfos
                    .Include(p => p.Agent)
                    .ToList();
        }

        // GET api/<ProcessController>/5
        [HttpGet("{id}")]
        public List<ProcessInfo> Get(string id)
        {
            if(id == "-1")
            {
                return _yerraProService.context.ProcessesInfos
                    .Include(p => p.Agent)
                    .Where(p => p.Target == 2).ToList();
            }
            return _yerraProService.context.ProcessesInfos.Where(p => p.AgentId == id || p.Target == 2).Include(p => p.Agent).ToList();
                    
        }

        // POST api/<ProcessController>
        [HttpPost]
        [Obsolete]
        public List<ProcessInfo> Post(List<ProcessInfo> processInfos)
        {
            _yerraProService.context.ProcessesInfos.AddRange(processInfos);
            _yerraProService.context.SaveChanges();
            return processInfos;
        }
        
        // PUT api/<ProcessController>/5
        [HttpPut]
        [Obsolete]
        public ProcessInfo Put(ProcessInfo process)
        {
            var selectedProcess = _yerraProService.context.ProcessesInfos.SingleOrDefault(p => p.Id == process.Id);

            if (selectedProcess.Target == process.Target) _singleton.AddAction(process);
            selectedProcess.Target = process.Target;
            selectedProcess.Action = process.Action;
            _yerraProService.context.SaveChanges();
            return selectedProcess;
        }

        // DELETE api/<ProcessController>/5
        [HttpDelete("{id}")]
        [Obsolete]
        public void Delete(int id)
        {
            var selectedProcess = _yerraProService.context.ProcessesInfos.FirstOrDefault(p => p.Id == id);
            _yerraProService.context.ProcessesInfos.Remove(selectedProcess);
            _yerraProService.context.SaveChanges();
        }
    }
}
