using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TravelApplication.DAL.Repositories;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public class FISService : IFISService
    {
        IFISRepository fisRepository = new FISRepository();
        public async Task<List<CostCenter>> GetAllCostCenters()
        {
            List<CostCenter> result = await fisRepository.GetAllCostCenters().ConfigureAwait(false);
            return result;
        }
    }
}