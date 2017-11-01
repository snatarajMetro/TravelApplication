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
    public class ReimbursementController : ApiController
    {
        IReimbursementService reimbursementService = new ReimbursementService();
        // Reimbursement section 
        [HttpGet]
        [Route("api/reimburse/approvedTravelrequests")]
        public HttpResponseMessage GetapprovedTravelrequestList(int badgeNumber, int roleId)
        {

            HttpResponseMessage response = null;
            try
            {
                var result = reimbursementService.GetApprovedTravelrequestList(badgeNumber, roleId);

                response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Couldn't retrieve EmployeeInfo for Badge # : " + ex.Message);

            }
            return response;
        }

        [HttpGet]
        [Route("api/reimburse/TravelrequestDetails/{travelRequestId}")]
        public HttpResponseMessage GetapprovedTravelrequestList(string travelRequestId)
        {

            HttpResponseMessage response = null;
            try
            {
                var result = reimbursementService.GetTravelRequestInfoForReimbursement(travelRequestId);

                response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Couldn't retrieve EmployeeInfo for Badge # : " + ex.Message);

            }
            return response;
        }

        [HttpPost]
        [Route("api/reimburse/save")]
        public HttpResponseMessage SaveReimbursement(ReimbursementInput reimbursementRequest)
        {
            HttpResponseMessage response = null;
            try
            {
                var result = reimbursementService.SaveTravelRequestReimbursement(reimbursementRequest);
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
    }
}
