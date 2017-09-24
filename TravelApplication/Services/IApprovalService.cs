using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public interface IApprovalService
    {
        Task<List<HeirarchichalPosition>> GetHeirarchichalPositions(int badgeNumber);
        List<HeirarchichalPosition> GetTAAprovers();
        bool SubmitTravelRequest(SubmitTravelRequestData submitTravelRequestData);
    }
}
