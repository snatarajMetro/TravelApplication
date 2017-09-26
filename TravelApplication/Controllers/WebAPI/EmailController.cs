using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TravelApplication.Services;

namespace TravelApplication.Controllers.WebAPI
{
    public class EmailController : ApiController
    {
        IEmailService emailService = new EmailService();

        [HttpGet]
        [Route("api/email/sendemail")]
        public HttpResponseMessage Email(string fromAddress, string ToAddress, string Subject, string Body)
        {
            HttpResponseMessage response = null;

            try
            {

                var result = emailService.SendEmail(fromAddress, ToAddress, Subject,Body);
                response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Approve was not sucessfull. Please try again.");
            }

            return response;
        }
    }
}
