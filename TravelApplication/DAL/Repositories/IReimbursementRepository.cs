using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TravelApplication.Models;

namespace TravelApplication.DAL.Repositories
{
    public interface IReimbursementRepository
    {
        List<TravelRequestDetails> GetApprovedTravelRequestList(int submittedBadgeNumber, int selectedRoleId);
        ReimbursementAllTravelInformation GetTravelRequestInfoForReimbursement(string travelRequestId);
        ReimbursementTravelRequestDetails GetTravelReimbursementDetails(DbConnection dbConn, string travelRequestId);
        string GetVendorId(DbConnection dbConn, int badgeNumber);
        string SaveTravelRequestReimbursement(ReimbursementInput reimbursementRequest);
        List<ReimburseGridDetails> GetReimbursementRequestsList(int badgeNumber, int selectedRoleId);
    }
}