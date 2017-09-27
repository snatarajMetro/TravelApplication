using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TravelApplication.Models;
using TravelApplication.Services;

namespace TravelApplication.Controllers.WebAPI
{
    public class EmailController : ApiController
    {
        IEmailService emailService = new EmailService();

        [HttpPost]
        [Route("api/email/sendemail")]
        public HttpResponseMessage Email(Email email)
        {
            HttpResponseMessage response = null;

            try
            {

                var result = emailService.SendEmail(email.FromAddress , email.ToAddress, email.Subject,email.Body);
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
