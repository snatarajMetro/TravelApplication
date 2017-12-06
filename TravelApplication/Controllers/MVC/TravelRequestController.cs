using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TravelApplication.Models;

namespace TravelApplication.Controllers.MVC
{
    public class TravelRequestController : Controller
    {
        [HttpGet]
        public ActionResult Approve(int travelRequestId, string badgeNumber)
        {
            var approveModel = new ApproveModel()
            {
                TravelRequestId = travelRequestId,
                BadgeNumber     = badgeNumber
            };

            return View("Approve", approveModel);
        }
    }
}