﻿using System;
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
        IDocumentsService documentService = new DocumentsService();
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
        [Route("api/travelrequest/supportingdocuments")]
        public HttpResponseMessage SupportingDocuments(int travelRequestId, int badgeNumber)
        {
            HttpResponseMessage response = null;

            try
            {
                var supportingDocuments = documentService.GetAllDocumentsByTravelId(travelRequestId, badgeNumber);

                //List<SupportingDocument> supportingDocuments = new List<SupportingDocument>();

                //if (travelRequestId > 0)
                //{
                //    Random number = new Random(1000);

                //    int maxCount = 5;
                //    if (DateTime.Now.Minute % 2 == 0) { maxCount = 6; }
                //    DateTime now = DateTime.Now;

                //    for (int counter = 1; counter < maxCount; counter++)
                //    {
                //        supportingDocuments.Add(new SupportingDocument()
                //        {
                //            Id                  = counter,
                //            FileName            = string.Format(@"Test{0}.txt", number.Next()),
                //            UploadDateTime      = now.AddMinutes(counter).ToString("MM/dd/yyyy h:mm tt"),
                //            DownloadUrl         = string.Format(@"/download/download/{0}", counter),
                //            DeleteUrl           = string.Format(@"/download/delete/{0}", counter)
                //        }
                //        );
                //    }
                //}
                var data = new JavaScriptSerializer().Serialize(supportingDocuments.OrderByDescending(item => item.Id));

                response = Request.CreateResponse(HttpStatusCode.OK, data);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError);
            }
            
            return response;

        }

        [HttpGet]
        [Route("api/travelrequest/deletedocument")]
        public HttpResponseMessage DeleteDocument(int travelRequestId, int id)
        {
            HttpResponseMessage response = null;

            try
            {
                  documentService.DeleteFilesByTravelId(travelRequestId, id);

                response = Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError);
            }

            return response;

        }
    }


}
