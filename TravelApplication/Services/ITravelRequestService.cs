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
        bool Approve(int badgeNumber, int travelRequestId, string comments);
        bool Reject(int badgeNumber, int travelRequestId, string comments);
        bool SaveTravelRequestInput(TravelRequestInput travelRequest);
        TravelRequestInput GetTravelRequestDetailNew(int travelRequestId);
    }
}
