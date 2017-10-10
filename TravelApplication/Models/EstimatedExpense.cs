using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelApplication.Models
{
    public class EstimatedExpense
    {
        public int EstimatedExpenseId { get; set; }
        public int TravelRequestId { get; set; }
        public decimal AdvanceLodging { get; set; }
        public decimal AdvanceAirFare { get; set; }
        public decimal AdvanceRegistration { get; set; }
        public decimal AdvanceMeals { get; set; }
        public decimal AdvanceCarRental { get; set; }
        public decimal AdvanceMiscellaneous { get; set; }
        public decimal AdvanceTotal { get; set; }
        public decimal TotalEstimatedLodge { get; set; }
        public decimal TotalEstimatedAirFare { get; set; }
        public decimal TotalEstimatedRegistration { get; set; }
        public decimal TotalEstimatedMeals { get; set; }
        public decimal TotalEstimatedCarRental { get; set; }
        public decimal TotalEstimatedMiscellaneous { get; set; }
        public decimal TotalEstimatedTotal { get; set; }
        public string HotelNameAndAddress { get; set; }
        public string Schedule { get; set; }
        public string PayableToAndAddress { get; set; }
        public string Note { get; set; }
        public string AgencyNameAndReservation { get; set; }
        public string Shuttle { get; set; }
        public decimal CashAdvance { get; set; }
        public DateTime DateNeededBy { get; set; }

    }
}