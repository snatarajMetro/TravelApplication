using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TravelApplication.DAL.Repositories;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public class ApprovalService : IApprovalService
    {
        IApprovalRepository approvalRepository = new ApprovalRepository();
        public async Task<List<HeirarchichalPosition>> GetHeirarchichalPositions(int badgeNumber)
        {
            List<HeirarchichalPosition> result = await approvalRepository.GetHeirarchichalPositions(badgeNumber).ConfigureAwait(false);
            return result;
        }
    }
}