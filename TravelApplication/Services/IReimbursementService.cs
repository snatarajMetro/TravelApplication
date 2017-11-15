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
        string SaveTravelRequestReimbursement(ReimbursementInput reimbursementRequest);
        List<ReimburseGridDetails> GetReimbursementRequests(int badgeNumber, int roleId);
        ReimbursementInput GetReimbursementDetails(string travelRequestId);
        bool Approve(int badgeNumber, int travelRequestId, string comments);
        bool Reject(int badgeNumber, int travelRequestId, string comments);
    }
}