using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelApplication.Models
{
    public class EmailApprovalDetails
    {
        public string Reason { get; set; }

        public string TravelRequestId { get; set; }

        public int BadgeNumber { get; set; }

    }
}