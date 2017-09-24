using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using TravelApplication.Services;

namespace TravelApplication.Controllers.WebAPI
{
    public class ApprovalController : ApiController
    {
        IApprovalService approvalService = new ApprovalService();
        [HttpGet]
        [Route("api/approval/HeirarchichalPositions/{badgeNumber}")]
        public HttpResponseMessage GetHeirarchichalPositions(int badgeNumber)
        {
            HttpResponseMessage response = null;
            try
            {
                var result = approvalService.GetHeirarchichalPositions(badgeNumber).Result;

                response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Couldn't retrieve cost centers from FIS  " + ex.Message);

            }
            return response;


        }
    }
}
