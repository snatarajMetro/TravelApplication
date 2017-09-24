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
        public async Task<EmployeeDetails> GetEmployeeDetails(int BadgeNumber)
        {
            EmployeeDetails result =  await travelRequestRepo.GetEmployeeDetails(BadgeNumber).ConfigureAwait(false);
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

      
    }
}