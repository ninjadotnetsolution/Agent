using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace YerraPro.Models
{
    public class Agent: BaseModel
    {
        [Key]
        public string Id { get; set; }
        public string IpAddress { get; set; }
        public string MachineID { get; set; }
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public int Status { get; set; }
        public SystemInfo SystemInfo { get; set; }
        public ICollection<ProcessInfo> ProcessInfos { get; set; }

        public Agent()
        {
            SystemInfo = new SystemInfo();
            ProcessInfos = new List<ProcessInfo>();
        }
    }
}
