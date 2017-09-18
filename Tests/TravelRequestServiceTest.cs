using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TravelApplication.Services;

namespace TravelApplication.Tests
{
    [TestClass]
    public class TravelRequestServiceTest
    {
        ITravelRequestService travelRequestService = new TravelRequestService();

        [TestMethod]
        public void GetEmployeeDetailsTest()
        {
            int badgeNumber = 93467;

            var response = travelRequestService.GetEmployeeDetails(badgeNumber);
            Assert.IsNotNull(response);
        }
    }
}
