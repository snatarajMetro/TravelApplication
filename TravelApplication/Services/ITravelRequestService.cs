using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public interface ITravelRequestService
    {
        Task<EmployeeDetails> GetEmployeeDetails(int BadgeNumber);
        Task<int> SaveTravelRequest(TravelRequest travelRequest);
        TravelRequest GetTravelRequestDetail(int travelRequestId);
        List<TravelRequestDetails> GetTravelrequestList(int badgeNumber, int selectedRoleId);
        bool Approve(int badgeNumber, string travelRequestId, string comments);
        bool Reject(int badgeNumber, string travelRequestId, string comments);
        TravelRequestInputResponse  SaveTravelRequestInput(TravelRequestInput travelRequest);
        TravelRequestInput GetTravelRequestDetailNew(string travelRequestId);
        TravelRequestSubmitDetailResponse GetSubmitDetails(int travelRequestId);
    }
}
