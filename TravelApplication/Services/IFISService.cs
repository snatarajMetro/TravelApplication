using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public interface IFISService
    {
        Task<List<CostCenter>> GetAllCostCenters();
        Task<List<Project>> GetProjectsByCostCenterId(int costCenterId);
    }
}
