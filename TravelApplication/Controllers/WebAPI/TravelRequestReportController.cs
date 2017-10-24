using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TravelApplication.Services;

namespace TravelApplication.Controllers.WebAPI
{
    public class TravelRequestReportController : ApiController
    {
        TravelRequestReportService travelRequestReportService = new TravelRequestReportService();

        [HttpGet]
        [Route("api/travelrequestReport/{travelRequestId}")]
        public HttpResponseMessage GetTravelRequestDetailsNew(string travelRequestId)
        {
            HttpResponseMessage response = null;
            try
            {
                Hashtable myparms = new Hashtable();
                myparms.Add("p_travelrequestID", travelRequestId);
                travelRequestReportService.RunReport("Travel_Request_newish.rpt","test",myparms);
               // response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Couldn't retrive travel request details for the given travel request Id : " + ex.Message);

            }
            return response;
        }
    }
}
