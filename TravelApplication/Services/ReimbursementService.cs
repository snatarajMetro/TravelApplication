using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TravelApplication.DAL.Repositories;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public class ReimbursementService : IReimbursementService
    {
        IReimbursementRepository reimbursementRepository = new ReimbursementRepository();
        public List<TravelRequestDetails> GetApprovedTravelrequestList(int badgeNumber, int selectedRoleId)
        {
            var result = reimbursementRepository.GetApprovedTravelRequestList(badgeNumber, selectedRoleId);
            return result;
        }

        public List<ReimburseGridDetails> GetReimbursementRequests(int badgeNumber, int roleId)
        {
            var result = reimbursementRepository.GetReimbursementRequestsList(badgeNumber, roleId);
            return result;
        }

        public ReimbursementAllTravelInformation GetTravelRequestInfoForReimbursement(string travelRequestId)
        {
            ReimbursementAllTravelInformation result = reimbursementRepository.GetTravelRequestInfoForReimbursement(travelRequestId);
            return result;
        }

        public string SaveTravelRequestReimbursement(ReimbursementInput reimbursementRequest)
        {
            try
            {
                string reimbursementId = reimbursementRepository.SaveTravelRequestReimbursement(reimbursementRequest);
                return reimbursementId;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
    }
}