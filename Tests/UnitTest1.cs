using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TravelApplication.Services;

namespace Tests
{
    [TestClass]
    public class UnitTest1
    {
        ITravelRequestService travelRequestService = new TravelRequestService();
        [TestMethod]
        public void TestMethod1()
        {
            var response = travelRequestService.GetEmployeeDetails(93467);
        }
    }
}
