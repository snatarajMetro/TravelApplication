﻿using System.Collections.Generic;
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
        bool Approve(int badgeNumber, int travelRequestId, string comments);
    }
}