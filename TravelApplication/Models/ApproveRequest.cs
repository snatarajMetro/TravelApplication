using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelApplication.Models
{
    public class ApproveRequest
    {
        public int ApproverBadgeNumber { get; set; }
        public int TravelRequestId { get; set; }
        public string Comments { get; set; }
    }
}