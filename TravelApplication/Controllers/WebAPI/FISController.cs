using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Script.Serialization;
using TravelApplication.Models;
using TravelApplication.Services;

namespace TravelApplication.Controllers.WebAPI
{
    public class FISController : ApiController
    {
        private Dictionary<string, List<Project>> Projects = new Dictionary<string, List<Project>>();

        IFISService fisService = new FISService();
        public FISController()
        {
            int index = 4000;
            foreach (var item in new string[] { "19876", "19925", "20012" })
            {
                Projects.Add(item, new List<Project>());

                for (int counter = 0; counter < 15; counter++)
                {
                    Projects[item].Add(new Project() { Id = (index + counter).ToString(), Name = (index + counter).ToString() });
                }
                index = index + 1000;
            }
        }

        [HttpGet]
        [Route("api/fis/costcenters")]
        public HttpResponseMessage GetCostCenters()
        {
            //HttpResponseMessage response = null;

            //List<CostCenter> costCenters = new List<CostCenter>();

            //try
            //{
            //    //TODO: Get it from service
            //    costCenters.Add(new CostCenter() { Id = 19876, Name = 19876.ToString() });
            //    costCenters.Add(new CostCenter() { Id = 19925, Name = 19925.ToString() });
            //    costCenters.Add(new CostCenter() { Id = 20012, Name = 20012.ToString() });

            //    var data = new JavaScriptSerializer().Serialize(costCenters);

            //    response = Request.CreateResponse(HttpStatusCode.OK, data);
            //}
            //catch (Exception ex)
            //{
            //    //TODO: Log the exception
            //    response = Request.CreateResponse(HttpStatusCode.InternalServerError);
            //}

            //return response;

            HttpResponseMessage response = null;
            try
            {
                //List<CostCenter> costCenters = new List<CostCenter>();

                ////TODO: Get it from service
                //costCenters.Add(new CostCenter() { CostCenterValue = "19876-0000000004", Name = "19876" });
                //costCenters.Add(new CostCenter() { CostCenterValue = "19925-0000000005", Name = "19925" });
                //costCenters.Add(new CostCenter() { CostCenterValue = "20012-0000000006", Name = "20012" });

                //var data = new JavaScriptSerializer().Serialize(costCenters);

                var result = fisService.GetCostCenters().Result;
                var data = new JavaScriptSerializer().Serialize(result);

                response = Request.CreateResponse(HttpStatusCode.OK, data);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Couldn't retrieve cost centers from FIS  " + ex.Message);

            }
            return response;


        }

        [HttpGet]
        [Route("api/fis/projects/{costCenterName}")]
        public HttpResponseMessage GetProjectsByCostCenterName(string costCenterName)
        {
            //HttpResponseMessage response = null;

            //try
            //{
            //    //TODO: Get it from service
            //    var data = new JavaScriptSerializer().Serialize(Projects[costCenterName].OrderBy(item => item.Id));

            //    response = Request.CreateResponse(HttpStatusCode.OK, data);
            //}
            //catch (Exception ex)
            //{
            //    //TODO: Log the exception
            //    response = Request.CreateResponse(HttpStatusCode.InternalServerError);
            //}

            //return response;

            HttpResponseMessage response = null;

            try
            {
                var result = fisService.GetProjectsByCostCenterName(costCenterName).Result;
                var data = new JavaScriptSerializer().Serialize(result);

                response = Request.CreateResponse(HttpStatusCode.OK, data);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Couldn't retrieve projects by cost center Id  " + ex.Message);

            }

            return response;
        }
    }




}
