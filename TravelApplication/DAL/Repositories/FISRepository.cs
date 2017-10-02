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

        public async Task<List<CostCenter>> GetCostCenters()
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

        public async Task<List<Project>> GetProjectsByCostCenterName(string costCenterName)
        {
            List<Project> projects = new List<Project>();
            List<string> projectIds = null;

            var client = new HttpClient();
            try
            {
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                var endpointUrl = string.Format("http://apitest.metro.net/fis/ProjectsByCostCenterId/{0}",costCenterName);
                HttpResponseMessage response = await client.GetAsync(endpointUrl).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {

                    projectIds = await response.Content.ReadAsAsync<List<string>>();

                    foreach (var item in projectIds)
                    {
                        projects.Add(new Project() { Id = item, Name = item });
                    }
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