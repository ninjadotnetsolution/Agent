using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using YerraPro.Data;
using YerraPro.Models;
using YerraPro.Services;
using YerraPro.ViewModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace YerraPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentController : ControllerBase
    {
        private readonly IYerraProService _yerraProService;
        private IWebHostEnvironment _hostEnvironment;
        private readonly IYerraProSingleton _singleton;
        public AgentController(IYerraProService service, IYerraProSingleton singleton, IWebHostEnvironment environment)
        {
            _yerraProService = service;
            _singleton = singleton;
            _hostEnvironment = environment;
        }

        // GET: api/<AgentController>
        [HttpGet("byCompanyId/{id}")]
        public IActionResult GetByCompanyId(string Id)
        {
            return Ok(_yerraProService.context.Agents.Where(a => a.CompanyId == Id).Select(a => new AgentVM(a)).ToList());
        }

        [HttpGet("check")]
        public IActionResult Check()
        {
            return Ok();
        }

        // GET api/<AgentController>/5
        [HttpGet("{id}")]
        [Obsolete]
        public IActionResult Get(string id)
        {
            
            return Ok(_yerraProService.context.Agents
                .Include(a => a.ProcessInfos)
                .FirstOrDefault(a => a.Id == id));
        }

        [AllowAnonymous]
        [HttpGet("checkstate/{id}")]
        [Obsolete]
        public int CheckState(string id)
        {
            return _yerraProService.context.Agents
                .FirstOrDefault(a => a.Id == id).Status;
        }

        [AllowAnonymous]
        [HttpGet("turnoff/{id}")]
        [Obsolete]
        public void turnoff(string id)
        {
            var selAgent = _yerraProService.context.Agents
                .FirstOrDefault(a => a.Id == id);
            selAgent.Status = 4;
            var selProcesses = _yerraProService.context.ProcessesInfos.Where(p => p.AgentId == id);
            _yerraProService.context.ProcessesInfos.RemoveRange(selProcesses);
            _yerraProService.context.SaveChanges();
        }

        [HttpGet("allProcesses/{id}")]
        public List<ProcessInfo> GetAllProcesses(string id)
        {
            var result = _yerraProService.context.ProcessesInfos.Where(p => p.AgentId == id).ToList();
            return result;
        }

        // POST api/<AgentController>
        [AllowAnonymous]
        [HttpPost]
        [Obsolete]
        public Agent Post(Agent agent)
        {

            var selCompany = _yerraProService.context.Companies.FirstOrDefault(c => c.Id == agent.CompanyId);
            if (selCompany == null) return null;

            var selAgent = _yerraProService.context.Agents.FirstOrDefault(a => a.Id == agent.Id);
            if (selAgent != null)
            {
                selAgent.IpAddress = agent.IpAddress;
                selAgent.MachineID = agent.MachineID;
                _yerraProService.context.SaveChanges();

                return selAgent;
            }else
            {
                _yerraProService.context.Agents.Add(agent);
            }
            _yerraProService.context.SaveChanges();

            

            return agent;
        }
        
        [AllowAnonymous]
        [HttpPut]
        [Obsolete]
        public Agent Put(Agent agent)
        {
            var selectedAgent = _yerraProService.context.Agents.FirstOrDefault(a => a.Id == agent.Id);
            if (selectedAgent == null) return null;
            else if (selectedAgent.IpAddress != null && selectedAgent.IpAddress != agent.IpAddress) return null;
            selectedAgent.IpAddress = agent.IpAddress;
            selectedAgent.MachineID = agent.MachineID;
            selectedAgent.Status = agent.Status;
            _yerraProService.context.SaveChanges();
            return agent;
        }
        
        [AllowAnonymous]
        [HttpPost("processes/{id}")]
        [Obsolete]
        public List<ActionResult> setProcesses (string id, List<ProcessInfo> processes)
        {

            var selectedAgent = _yerraProService.context.Agents.Include(a => a.ProcessInfos).FirstOrDefault(a => a.Id == id);
            if (selectedAgent.Status != 1) return null;
            List<ActionResult> result = new List<ActionResult>();
            List<ProcessInfo> storedProcesses = _yerraProService.context.ProcessesInfos.Where(p => p.AgentId == id).ToList();
            if(processes.Count > 0)
            {
                if (selectedAgent == null) return new List<ActionResult>();
                if (selectedAgent.ProcessInfos == null) selectedAgent.ProcessInfos = new List<ProcessInfo>();

                processes.ForEach(p =>
                {
                    var selProcess = _yerraProService.context.ProcessesInfos.FirstOrDefault(p => p.AgentId == id);
                    if(selProcess == null)
                    {
                        var selGlobalProcess = _yerraProService.context.ProcessesInfos.FirstOrDefault(p => p.Target == 2 || p.Target == 3);
                        bool action = false;
                        if(selGlobalProcess != null)
                        {
                            action = selGlobalProcess.Action;
                        }
                        ProcessInfo temp = new ProcessInfo()
                        {
                            Name = p.Name,
                            Target = 0,
                            Action = action,
                            State = true
                        };

                        selectedAgent.ProcessInfos.Add(temp);
                        selectedAgent.UpdatedAt = DateTime.Now;
                    }else
                    {
                        var selGlobalProcess = _yerraProService.context.ProcessesInfos.FirstOrDefault(p => p.Target == 2 || p.Target == 3);
                        bool action = false;
                        if (selGlobalProcess != null)
                        {
                            action = selGlobalProcess.Action;
                        }
                        selProcess.Action = action;
                        selProcess.State = true;

                    }
                });

                foreach(ProcessInfo p in storedProcesses)
                {
                    if (!processes.Any(sp => (sp.Name == p.Name)))
                    {
                        p.State = false;
                    }
                }

                selectedAgent.UpdatedAt = DateTime.Now;
                _yerraProService.context.SaveChanges();
            }
            
            return _yerraProService.context.ProcessesInfos.Where(p => p.AgentId == id || p.Target == 2).Select(p => new ActionResult(p.Name, p.Action)).ToList();
        }

        // PUT api/<AgentController>/5
        [HttpPost]
        [Route("RegisterProcess")]
        [Obsolete]
        public bool RegisterProcess(List<ProcessInfo> processes)
        {
            var selectedAgent = _yerraProService.context.Agents.FirstOrDefault(a => a.Id == processes[0].Agent.Id);
            if (selectedAgent == null) return false;
            selectedAgent.ProcessInfos = new List<ProcessInfo>();
            processes.ForEach(p =>
            {
                selectedAgent.ProcessInfos.Add(new ProcessInfo(p.Name));

            });
            _yerraProService.context.SaveChanges();
            return true;
        }

        // DELETE api/<AgentController>/5
        [HttpDelete("{id}")]
        [Obsolete]
        public Agent Delete(string id)
        {
            var selectedAgent = _yerraProService.context.Agents.Include(p => p.ProcessInfos).FirstOrDefault(a => a.Id == id);
            _yerraProService.context.Agents.Remove(selectedAgent);
            _yerraProService.context.SaveChanges();
            return selectedAgent;
        }

        [HttpGet("download")]
        public FileResult Download()
        {
            string archive = Path.Combine(_hostEnvironment.ContentRootPath, @"temp\archive.zip");
            if (System.IO.File.Exists(archive))
            {
                System.IO.File.Delete(archive);
            }
            ZipFile.CreateFromDirectory("./Resources", archive);
            byte[] fileBytes = System.IO.File.ReadAllBytes(archive);

            return File(fileBytes, "application/zip", "archive.zip");
        }
    }

    public class ActionResult
    {
        public string ProcessName { get; set; }
        public bool Action { get; set; }

        public ActionResult(string name, bool action)
        {
            ProcessName = name;
            Action = action;
        }
    }

    public class AgentCompany
    {
        public string companyId { get; set; }
    }
}
