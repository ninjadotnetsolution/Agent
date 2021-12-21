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
        [HttpGet]
        public List<Agent> Get()
        {
            return _yerraProService.context.Agents.ToList();
        }

        // GET api/<AgentController>/5
        [HttpGet("{id}")]
        [Obsolete]
        public Agent Get(string id)
        {
            
            return _yerraProService.context.Agents
                .Include(a => a.ProcesseInfos)
                .FirstOrDefault(a => a.Id == id);
        }

        [HttpGet("checkstate/{id}")]
        [Obsolete]
        public int CheckState(string id)
        {
            return _yerraProService.context.Agents
                .FirstOrDefault(a => a.Id == id).Status;
        }

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
        [HttpPost]
        [Obsolete]
        public Agent Post(Agent agent)
        {

            var selCompany = _yerraProService.context.Companies.FirstOrDefault(c => c.CompanyName == agent.CompanyName);
            if (selCompany == null) return null;

            var selAgent = _yerraProService.context.Agents.FirstOrDefault(a => a.Id == agent.Id);
            if (selAgent != null)
            {
                selAgent.IpAddress = agent.IpAddress;
                selAgent.MachineID = agent.MachineID;
                selAgent.WinVersion = agent.WinVersion;
                selAgent.CompanyName = agent.CompanyName;
                selAgent.SystemName = agent.SystemName;
                _yerraProService.context.SaveChanges();

                return selAgent;
            }else
            {
                agent.CompanyId = selCompany.Id;
                _yerraProService.context.Agents.Add(agent);
            }
            _yerraProService.context.SaveChanges();

            //IPAddress[] ipHostInfo = Dns.GetHostEntry(Dns.GetHostName()).AddressList;
            //string originString = guid.ToString() + "*" + ipHostInfo[1].ToString() + ":6430"+"*"+selCompany.Domain;
            //string encString = StringCipher.EncryptStringAES(originString, "E546C8DF278CD5931069B522E695D222");
            //string path = "./Resources/liecense.lie";
            //if (!System.IO.File.Exists(path))
            //{
            //    using (StreamWriter sw = System.IO.File.CreateText(path))
            //    {
            //        sw.WriteLine(encString);
            //    }
            //}
            //else System.IO.File.WriteAllText(path, encString);

            return agent;
        }
        
        [HttpPut]
        [Obsolete]
        public Agent Put(Agent agent)
        {
            var selectedAgent = _yerraProService.context.Agents.FirstOrDefault(a => a.Id == agent.Id);
            if (selectedAgent == null) return null;
            else if (selectedAgent.IpAddress != null && selectedAgent.IpAddress != agent.IpAddress) return null;
            selectedAgent.IpAddress = agent.IpAddress;
            selectedAgent.MachineID = agent.MachineID;
            selectedAgent.WinVersion = agent.WinVersion;
            selectedAgent.Status = agent.Status;
            selectedAgent.SystemName = agent.SystemName;
            _yerraProService.context.SaveChanges();
            return agent;
        }
        
        [HttpPost("processes/{id}")]
        [Obsolete]
        public List<ActionResult> setProcesses (string id, List<ProcessInfo> processes)
        {

            var selectedAgent = _yerraProService.context.Agents.Include(a => a.ProcesseInfos).FirstOrDefault(a => a.Id == id);
            if (selectedAgent.Status != 1) return null;
            List<ActionResult> result = new List<ActionResult>();
            List<ProcessInfo> storedProcesses = _yerraProService.context.ProcessesInfos.Where(p => p.AgentId == id || p.Target == 2).ToList();
            if(processes.Count > 0)
            {
                if (selectedAgent == null) return new List<ActionResult>();
                if (selectedAgent.ProcesseInfos == null) selectedAgent.ProcesseInfos = new List<ProcessInfo>();

                processes.ForEach(p =>
                {
                    if (storedProcesses.Count == 0 || !storedProcesses.Any(sp => (sp.Name == p.Name)))
                    {
                        ProcessInfo temp = new ProcessInfo()
                        {
                            Name = p.Name,
                            Target = 0,
                            Action = false,
                        };

                        selectedAgent.ProcesseInfos.Add(temp);
                        selectedAgent.UpdatedAt = DateTime.Now;
                    }
                });

                storedProcesses.ForEach(p =>
                {
                    if (!processes.Any(sp => (sp.Name == p.Name) && p.Target == 0))
                    {
                        _yerraProService.context.ProcessesInfos.Remove(p);
                    }
                });

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
            selectedAgent.ProcesseInfos = new List<ProcessInfo>();
            processes.ForEach(p =>
            {
                selectedAgent.ProcesseInfos.Add(new ProcessInfo(p.Name));

            });
            _yerraProService.context.SaveChanges();
            return true;
        }

        // DELETE api/<AgentController>/5
        [HttpDelete("{id}")]
        [Obsolete]
        public Agent Delete(string id)
        {
            var selectedAgent = _yerraProService.context.Agents.Include(p => p.ProcesseInfos).FirstOrDefault(a => a.Id == id);
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
