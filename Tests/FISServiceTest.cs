using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelApplication.Services;

namespace TravelApplication.Tests
{
 

    [TestClass]
    public class FISServiceTest
    {
        IFISService fisService = new FISService();

        [TestMethod]
        public void GetAllCostCenters()
        {           
            var response = fisService.GetCostCenters();
            Assert.IsNotNull(response);
        }

        [TestMethod]
        public void GetprojectsByCostCenterId()
        {
            var response = fisService.GetProjectsByCostCenterName("9210");
            Assert.IsNotNull(response);
        }
    }
}
