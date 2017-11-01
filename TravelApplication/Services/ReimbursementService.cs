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
        public ReimbursementAllTravelInformation GetTravelRequestInfoForReimbursement(string travelRequestId)
        {
            ReimbursementAllTravelInformation result = reimbursementRepository.GetTravelRequestInfoForReimbursement(travelRequestId);
            return result;
        }

        public async System.Threading.Tasks.Task<int> SaveTravelRequestReimbursement(ReimbursementInput reimbursementRequest)
        {
            try
            {
                int travelRequestId = await reimbursementRepository.SaveTravelRequestReimbursement(reimbursementRequest);
                return travelRequestId;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
    }
}