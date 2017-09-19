using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelApplication.Models
{
    public class EstimatedExpense
    {
        public int EstimatedId { get; set; }
        public int TravelRequestId { get; set; }
        public int AdvanceLodging { get; set; }
        public int AdvanceAirFare { get; set; }
        public int AdvanceRegistration { get; set; }
        public int AdvanceMeals { get; set; }
        public int AdvanceCarRental { get; set; }
        public int AdvanceMiscellaneous { get; set; }
        public int AdvanceTotal { get; set; }
        public int TotalEstimatedLodge { get; set; }
        public int TotalEstimatedAirFare { get; set; }
        public int TotalEstimatedRegistration { get; set; }
        public int TotalEstimatedMeals { get; set; }
        public int TotalEstimatedCarRental { get; set; }
        public int TotalEstimatedMiscellaneous { get; set; }
        public int TotalEstimatedTotal { get; set; }
        public string HotelNameAndAddress { get; set; }
        public string Schedule { get; set; }
        public string PayableToAndAddress { get; set; }
        public string Note { get; set; }
        public string AgencyNameAndReservation { get; set; }
        public string Shuttle { get; set; }
        public int CashAdvance { get; set; }
        public DateTime DateNeededBy { get; set; }

    }
}