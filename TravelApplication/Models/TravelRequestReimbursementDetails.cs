using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelApplication.Models
{
    public class TravelRequestReimbursementDetails
    {
        public TravelReimbursementDetails TravelReimbursementDetails { get; set; }
        public FIS Fis { get; set; }
        public decimal CashAdvance { get; set; }

    }
}