using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YerraPro.Models;

namespace YerraPro.ViewModels
{
    public class AgentVM
    {
        public string Id { get; set; }
        public string IpAddress { get; set; }
        public string MachineID { get; set; }
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public int Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public AgentVM() { }

        public AgentVM(Agent agent)
        {
            Id = agent.Id;
            IpAddress = agent.IpAddress;
            MachineID = agent.MachineID;
            CompanyId = agent.CompanyId;
            CompanyName = agent.CompanyName;
            Status = agent.Status;
            CreatedAt = agent.CreatedAt;
            UpdatedAt = agent.UpdatedAt;

        }
    }
}
