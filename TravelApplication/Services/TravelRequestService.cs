using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public class TravelRequestService : ITravelRequestService
    {
        ITravelRequestRepository travelRequestRepo = new TravelRequestRepository();

        public bool Approve(int badgeNumber, int travelRequestId, string comments)
        {
            var result = travelRequestRepo.Approve(badgeNumber, travelRequestId, comments);
            return result;
        }

        public bool Reject(int badgeNumber, int travelRequestId, string comments)
        {
            var result = travelRequestRepo.Reject(badgeNumber, travelRequestId, comments);
            return result;
        }

        public async Task<EmployeeDetails> GetEmployeeDetails(int badgeNumber)
        {
            EmployeeDetails result =  await travelRequestRepo.GetEmployeeDetails(badgeNumber).ConfigureAwait(false);
            return result;
        }

        public TravelRequest GetTravelRequestDetail(int travelRequestId)
        {
            TravelRequest result = travelRequestRepo.GetTravelRequestDetail(travelRequestId);
            return result;
        }

        public List<TravelRequestDetails> GetTravelrequestList(int badgeNumber, int selectedRoleId)
        {
            var result = travelRequestRepo.GetTravelRequestList(badgeNumber, selectedRoleId);
            return result;
        }

        public List<TravelRequestDetails> GetApprovedTravelrequestList(int badgeNumber, int selectedRoleId)
        {
            var result = travelRequestRepo.GetApprovedTravelRequestList(badgeNumber, selectedRoleId);
            return result;
        }

        public async Task<int> SaveTravelRequest(TravelRequest travelRequest)
        {
            try
            {
                int travelRequestId = await travelRequestRepo.SaveTravelRequest(travelRequest).ConfigureAwait(false);
                return travelRequestId;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            
        }

        public TravelRequestInputResponse SaveTravelRequestInput(TravelRequestInput travelRequest)
        {
            try
            {
                var result =   travelRequestRepo.SaveTravelRequestInput(travelRequest);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public TravelRequestInput GetTravelRequestDetailNew(string travelRequestId)
        {
            TravelRequestInput result = travelRequestRepo.GetTravelRequestDetailNew(travelRequestId);
            return result;
        }

        public TravelRequestReimbursementDetails GetTravelRequestInfoForReimbursement(string travelRequestId)
        {
            TravelRequestReimbursementDetails result = travelRequestRepo.GetTravelRequestInfoForReimbursement(travelRequestId);
            return result;
        }
    }
}