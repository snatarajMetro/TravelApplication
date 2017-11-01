using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public interface IReimbursementService
    {
        List<TravelRequestDetails> GetApprovedTravelrequestList(int badgeNumber, int selectedRoleId);
        ReimbursementAllTravelInformation GetTravelRequestInfoForReimbursement(string travelRequestId);
        System.Threading.Tasks.Task<int> SaveTravelRequestReimbursement(ReimbursementInput reimbursementRequest);

    }
}