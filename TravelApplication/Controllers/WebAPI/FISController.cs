using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace TravelApplication.Controllers.WebAPI
{
    public class FISController : ApiController
    {
        private Dictionary<int, List<Project>> Projects = new Dictionary<int, List<Project>>();

        public FISController()
        {
            int index = 1000;
            foreach (var item in new int[] { 19876, 19925, 20012 })
            {
                Projects.Add(item, new List<Project>());

                for (int counter = 0; counter < 15; counter++)
                {
                    Projects[item].Add(new Project() { Id = (index + counter), Name = (index + counter).ToString() });
                }
                index = index + 1000;
            }
        }

        [HttpGet]
        [Route("api/fis/costcenters")]
        public HttpResponseMessage GetCostCenters()
        {
            HttpResponseMessage response = null;

            List<CostCenter> costCenters = new List<CostCenter>();

            try
            {
                //TODO: Get it from service
                costCenters.Add(new CostCenter() { Id = 19876, Name = 19876.ToString() });
                costCenters.Add(new CostCenter() { Id = 19925, Name = 19925.ToString() });
                costCenters.Add(new CostCenter() { Id = 20012, Name = 20012.ToString() });

                var data = new JavaScriptSerializer().Serialize(costCenters);

                response = Request.CreateResponse(HttpStatusCode.OK, data);
            }
            catch (Exception ex)
            {
                //TODO: Log the exception
                response = Request.CreateResponse(HttpStatusCode.InternalServerError);
            }

            return response;
        }

        [HttpGet]
        [Route("api/fis/projects/{costCenterId}")]
        public HttpResponseMessage GetProjectsByCostCenterId(int costCenterId)
        {
            HttpResponseMessage response = null;
            
            try
            {
                //TODO: Get it from service
                var data = new JavaScriptSerializer().Serialize(Projects[costCenterId].OrderBy(item => item.Id));

                response = Request.CreateResponse(HttpStatusCode.OK, data);
            }
            catch (Exception ex)
            {
                //TODO: Log the exception
                response = Request.CreateResponse(HttpStatusCode.InternalServerError);
            }

            return response;
        }
    }

    public class CostCenter
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }

    public class Project
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}
