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

        [HttpGet]
        [Route("api/approval/TAApprovers")]
        public HttpResponseMessage GetTAAprovers()
        {
            HttpResponseMessage response = null;
            try
            {
                var result = approvalService.GetTAAprovers();
                response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Couldn't retrieve cost centers from FIS  " + ex.Message);

            }
            return response;


        }

        [HttpPost]
        [Route("api/approval/submit")]
        public HttpResponseMessage SubmitTravelRequest(SubmitTravelRequestData submitTravelRequestData)
        {
            HttpResponseMessage response = null;

            try
            {
                var result = approvalService.SubmitTravelRequest(submitTravelRequestData);
                response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Travel request was not successfully submited. Please try again.");
            }

            return response;
        }

        [HttpPost]
        [Route("api/approval/submitNew")]
        public HttpResponseMessage SubmitTravelRequestNew(SubmitTravelRequest submitTravelRequest)
        {
            HttpResponseMessage response = null;

            try
            {
                var result = approvalService.SubmitTravelRequestNew(submitTravelRequest);
                response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Travel request was not successfully submited. Please try again.");
            }

            return response;
        }

        [HttpGet]
        [Route("api/approval/approverDetails/{travelRequestId}")]
        public HttpResponseMessage GetapproverDetails(string travelRequestId)
        {
            HttpResponseMessage response = null;
            try
            {
                SubmitTravelRequest  result = approvalService.GetapproverDetails(travelRequestId);
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
