using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using TravelApplication.Models;

namespace TravelApplication.DAL.Repositories
{
    public class FISRepository : IFISRepository
    {

        public async Task<List<CostCenter>> GetAllCostCenters()
        {
            List<CostCenter> costCenters = new List<CostCenter>();
            var client = new HttpClient();
            try
            {
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                var endpointUrl = string.Format("http://apitest.metro.net/fis/CostCenters");
                HttpResponseMessage response = await client.GetAsync(endpointUrl).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {

                    costCenters = await response.Content.ReadAsAsync<List<CostCenter>>();
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
            return costCenters;
        }

        public async Task<List<Project>> GetProjectsByCostCenterId(int costCenterId)
        {
            List<Project> projects = new List<Project>();
            var client = new HttpClient();
            try
            {
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                var endpointUrl = string.Format("http://apitest.metro.net/fis/ProjecstByCostCenterId/{0}",costCenterId);
                HttpResponseMessage response = await client.GetAsync(endpointUrl).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {

                    projects = await response.Content.ReadAsAsync<List<Project>>();
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
            return projects;
        }
    }
}