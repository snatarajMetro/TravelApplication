using System.Collections.Generic;
using System.Threading.Tasks;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public interface ITravelRequestRepository
    {
        Task<EmployeeDetails> GetEmployeeDetails(int BadgeNumber);
        Task<int> SaveTravelRequest(TravelRequest request);
        TravelRequest GetTravelRequestDetail(int travelRequestId);
        List<TravelRequestDetails> GetTravelRequestList(int badgeNumber, int selectedRoleId);
        bool Approve(int badgeNumber, string travelRequestId, string comments);
        bool Reject(int badgeNumber, string travelRequestId, string comments);
        TravelRequestInputResponse SaveTravelRequestInput(TravelRequestInput travelRequest);
        TravelRequestInput GetTravelRequestDetailNew(string travelRequestId);
        Task<string> GetVendorNumber(int badgeNumber);
        TravelRequestSubmitDetailResponse GetSubmitDetails(int travelRequestId);
    }
}