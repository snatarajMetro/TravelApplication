using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using TravelApplication.Models;
using TravelApplication.Services;

namespace TravelApplication.Controllers.WebAPI
{
    public class TravelRequestController : ApiController
    {
        ITravelRequestService travelRequestService = new TravelRequestService();

        [HttpGet]
        [Route("api/travelrequest/employee/{badgeNumber}")]
        public HttpResponseMessage GetEmployeeDetails(int badgeNumber)
        {
            HttpResponseMessage response = null;
            try
            {
                var result = travelRequestService.GetEmployeeDetails(badgeNumber);
                var data = new JavaScriptSerializer().Serialize(result);

                response = Request.CreateResponse(HttpStatusCode.OK, data);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Couldn't retrieve EmployeeInfo for Badge # : " + ex.Message);

            }
            return response;
        }

        [HttpPost]
        [Route("api/travelrequest/save")]
        public HttpResponseMessage Save(TravelRequest travelRequest)
        {
            HttpResponseMessage response = null;
            try
            {
                var result = travelRequestService.SaveTravelRequest(travelRequest).Result;
                var data = new JavaScriptSerializer().Serialize(result);

                response = Request.CreateResponse(HttpStatusCode.OK, data);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Couldn't save travel request : " + ex.Message);

            }
            return response;
        }

        [HttpGet]
        [Route("api/travelrequest/{travelRequestId}")]
        public HttpResponseMessage GetTravelRequestDetails(int travelRequestId)
        {
            HttpResponseMessage response = null;
            try
            {
                TravelRequest result = travelRequestService.GetTravelRequestDetail(travelRequestId);
                response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Couldn't retrive travel request details for the given travel request Id : " + ex.Message);

            }
            return response;
        }

        [HttpGet]
        [Route("api/travelrequests")]
        public HttpResponseMessage GetTravelrequestList(int badgeNumber, int roleId)
        {

            HttpResponseMessage response = null;
            try
            {
                var result = travelRequestService.GetTravelrequestList(badgeNumber, roleId);

                response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Couldn't retrieve EmployeeInfo for Badge # : " + ex.Message);

            }
            return response;
        }
    }

}

  
    