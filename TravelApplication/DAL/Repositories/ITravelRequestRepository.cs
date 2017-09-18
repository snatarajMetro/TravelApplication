using System.Threading.Tasks;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public interface ITravelRequestRepository
    {
        Task<EmployeeDetails> GetEmployeeDetails(int BadgeNumber);
    }
}