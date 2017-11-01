using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelApplication.Models
{
    public class ReimbursementInput
    {
        public ReimbursementTravelRequestDetails TravelRequest { get; set; }
        public ReimbursementDetails reimbursementDetails { get; set; }
        public FIS fis { get; set; }
    }
}