﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelApplication.Models;

namespace TravelApplication.DAL.Repositories
{
    public interface IApprovalRepository
    {
        Task<List<HeirarchichalPosition>> GetHeirarchichalPositions(int badgeNumber);
        bool SubmitTravelRequest(SubmitTravelRequestData submitTravelRequestData);
        void sendEmail(string departmentHeadBadgeNumber, string body, string subject);
        bool SubmitTravelRequestNew(SubmitTravelRequest submitTravelRequest);
        SubmitTravelRequest GetApproverDetails(string travelRequestId);
        bool SubmitReimburse(SubmitReimburseData submitReimburseData);
    }
}
