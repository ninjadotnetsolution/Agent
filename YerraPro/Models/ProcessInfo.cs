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
        public string Label { get; set; }
        public string Url { get; set; }
        public int Target { get; set; }
        public bool Action { get; set; }
        public bool State { get; set; }
        public Agent Agent { get; set; }
        public string AgentId { get; set; }
        public Company Company { get; set; }
        public string CompanyId { get; set; }

        public ProcessInfo(string name)
        {
            this.Name = name;
        }

        public ProcessInfo()
        {

        }
    }
}
