using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace YerraPro.Models
{
    public class SystemInfo
    {
        [Key]
        public int Id { get; set; }
        public string HostName { get; set; }
        public string OSName { get; set; }
        public string OSVersion { get; set; }
        //public string OSManufacturer { get; set; }
        public string RegisteredOwner { get; set; }
        public string ProductID { get; set; }
        public string Processor { get; set; }
        public string BIOSVersion { get; set; }
        public string TimeZone { get; set; }
        public string SystemType { get; set; }
        public string AgentId { get; set; }
        public Agent Agent { get; set; }
    }
}
