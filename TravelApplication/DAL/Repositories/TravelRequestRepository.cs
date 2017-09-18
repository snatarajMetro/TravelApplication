using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public class TravelRequestRepository : ITravelRequestRepository
    {
        public async Task<EmployeeDetails> GetEmployeeDetails(int badgeNumber)
        {
            EmployeeDetails employeeDetails = null;
            var client = new HttpClient();
            try
            {
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                var endpointUrl = string.Format("http://apitest.metro.net/fis/EmployeeInfo/{0}", badgeNumber);
                HttpResponseMessage response = await client.GetAsync(endpointUrl).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {

                    employeeDetails = await response.Content.ReadAsAsync<EmployeeDetails>();
                }   
            }
            catch (Exception ex)
            {
                // TODO : Log the exception
                throw new Exception("Unable to get the badge information from FIS service");
            }
            finally
            {
                client.Dispose();
            }
            return employeeDetails;

        }
    }
}