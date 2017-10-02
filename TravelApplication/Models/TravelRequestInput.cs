using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelApplication.Models
{
    public class TravelRequestInput
    {
        public TravelRequest TravelRequestData { get; set; }
        public EstimatedExpense EstimatedExpenseData { get; set; }

        public List<FIS> FISData { get; set; }
      
    }


}