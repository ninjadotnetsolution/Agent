using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YerraPro.Models;

namespace YerraPro.ViewModels
{
    public class ProcessVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Label { get; set; }
        public string Url { get; set; }
        public int Target { get; set; }
        public bool Action { get; set; }
        public string AgentId { get; set; }

        public ProcessVM() { }
        public ProcessVM(ProcessInfo process)
        {
            Id = process.Id;
            Name = process.Name;
            Label = process.Label;
            Url = process.Url;
            Target = process.Target;
            Action = process.Action;
            AgentId = process.AgentId;
        }
    }
}
