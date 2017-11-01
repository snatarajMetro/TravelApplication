using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelApplication.Models
{
    public class ReimbursementTravelRequestDetails
    {
        public string ReimbursementId { get; set; }
        public string TravelRequestId { get; set; }
        public int BadgeNumber { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime ReturnDateTime { get; set; }
        public string VendorNumber { get; set; }
        public string CostCenterId { get; set; }
        public string Name { get; set; }
        public string Extension { get; set; }
        public string Division { get; set; }
        public string Department { get; set; }
        public int SelectedRoleId { get; set; }
        public int SubmittedByBadgeNumber { get; set; }

    }
}