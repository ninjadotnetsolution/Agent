using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YerraPro.Models
{
    public class ProcessInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Target { get; set; }
        public bool Action { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Agent Agent { get; set; }
        public string? AgentId { get; set; }

        public ProcessInfo(string name)
        {
            this.Name = name;
        }

        public ProcessInfo()
        {

        }
    }
}
