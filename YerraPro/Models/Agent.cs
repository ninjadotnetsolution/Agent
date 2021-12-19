using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace YerraPro.Models
{
    public class Agent: BaseModel
    {
        [Key]
        public string Id { get; set; }
        public string SystemName { get; set; }
        public string WinVersion { get; set; }
        public string IpAddress { get; set; }
        public string MachineID { get; set; }
        public long CompanyId { get; set; }
        public string Domain { get; set; }
        public string UniqueId { get; set; }
        public int Status { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<ProcessInfo> ProcesseInfos { get; set; }
    }
}
