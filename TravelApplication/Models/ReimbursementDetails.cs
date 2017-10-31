using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelApplication.Models
{
    public class ReimbursementDetails
    {
        public int ReimbursementId { get; set; }
        public List<Reimbursement> Reimbursement { get; set; }
        public int TotalMiles { get; set; }
        public int TotalMileageToWork { get; set; }
        public int TotalBusinessMiles { get; set; }
        public decimal TotalBusinessMilesXRate { get; set; }
        public decimal TotalParkingGas { get; set; }
        public decimal TotalAirFare { get; set; }
        public decimal TotalTaxiRail { get; set; }
        public decimal TotalLodge { get; set; }
        public decimal TotalMeals { get; set; }
        public decimal TotalRegistration { get; set; }
        public decimal TotalInternet { get; set; }
        public decimal TotalOther { get; set; }
        public decimal TotalDailyTotal { get; set; }
        public decimal TotalPart1TravelExpenses { get; set; }
        public decimal TotalPart2TravelExpenses { get; set; }
        public decimal TotalExpSubmittedForApproval { get; set; }
        public decimal SubstractPaidByMTA { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal SubtractCashAdvance { get; set; }
        public decimal Total { get; set; }
    }

    public class Reimbursement
    {
        public DateTime Date { get; set; }
        public string CityStateAndBusinessPurpose { get; set; }
        public int Miles { get; set; }
        public int MileageToWork { get; set; }
        public int BusinessMiles { get; set; }
        public decimal BusinessMilesXRate { get; set; }
        public decimal ParkingGas { get; set; }
        public decimal AirFare { get; set; }
        public decimal TaxiRail { get; set; }
        public decimal Lodge { get; set; }
        public decimal Meals { get; set; }
        public decimal Registration { get; set; }
        public decimal Internet { get; set; }
        public decimal Other { get; set; }
        public decimal DailyTotal { get; set; }
    }
}