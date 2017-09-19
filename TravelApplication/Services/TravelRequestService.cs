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
        public async Task<int> SaveTravelRequest(TravelRequest travelRequest)
        {
            try
            {
                ValidateTravelRequestInfo(travelRequest);
                int travelRequestId = await travelRequestRepo.SaveTravelRequest(travelRequest).ConfigureAwait(false);
                return travelRequestId;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            
        }

        public void ValidateTravelRequestInfo(TravelRequest request)
        {
            try
            {
                if (request.BadgeNumber <= 0)
                {
                    throw new Exception("Invalid Badge Number");
                }
                if (string.IsNullOrWhiteSpace(request.Name))
                {
                    throw new Exception("Invalid Name");
                }

                if (string.IsNullOrWhiteSpace(request.Division))
                {
                    throw new Exception("Invalid Division");
                }
                if (string.IsNullOrWhiteSpace(request.Section))
                {
                    throw new Exception("Invalid Section");
                }
                if (string.IsNullOrWhiteSpace(request.Organization))
                {
                    throw new Exception("Invalid Organization");
                }
                if (string.IsNullOrWhiteSpace(request.MeetingLocation))
                {
                    throw new Exception("Invalid Meeting Location");
                }

                if  (request.MeetingBeginDateTime == DateTime.MinValue)
                {
                    throw new Exception("Invalid Meeting Begin Date");
                }
                if (request.MeetingEndDateTime == DateTime.MinValue)
                {
                    throw new Exception("Invalid Meeting End Date");
                }
                if (request.DepartureDateTime == DateTime.MinValue)
                {
                    throw new Exception("Invalid Departure Date");
                }
                if (request.ReturnDateTime == DateTime.MinValue)
                {
                    throw new Exception("Invalid Return Date");
                }
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }
    }
}