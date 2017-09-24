using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using TravelApplication.DAL.DBProvider;
using TravelApplication.Models;

namespace TravelApplication.DAL.Repositories
{
    public class ApprovalRepository : IApprovalRepository
    {
        private DbConnection dbConn;
        public async Task<List<HeirarchichalPosition>> GetHeirarchichalPositions(int badgeNumber)
        {
            List<HeirarchichalPosition>  heirarchichalPosition = new List<HeirarchichalPosition>();
            List<Approver> result = new List<Approver>(); ;
            var client = new HttpClient();
            try
            {
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                var endpointUrl = string.Format("http://apitest.metro.net/fis/HeirarchichalPositions/{0}", badgeNumber);
                HttpResponseMessage response = await client.GetAsync(endpointUrl).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {

                    result =  await response.Content.ReadAsAsync<List<Approver>>();
                }
            }
            catch (Exception ex)
            {
                // TODO : Log the exception
                throw new Exception("Unable to get the badge information from FIS service");
            }
            finally
            {
                client.Dispose();
            }

            int count = 1;
            foreach (var item in result)
            {
                heirarchichalPosition.Add(new HeirarchichalPosition() { BadgeNumber = count, Name = item.EmployeeName });
                count +=1;
            }
            return heirarchichalPosition;
        }

        public bool SubmitTravelRequest(SubmitTravelRequestData submitTravelRequestData)
        {
            List<string> approvalOrderList = new List<string>();
            approvalOrderList.Add(submitTravelRequestData.DepartmentHeadBadgeNumber);
            approvalOrderList.Add(submitTravelRequestData.ExecutiveOfficerBadgeNumber);
            approvalOrderList.Add(submitTravelRequestData.CEOForAPTABadgeNumber);
            approvalOrderList.Add(submitTravelRequestData.CEOForInternationalBadgeNumber);
            approvalOrderList.Add(submitTravelRequestData.TravelCoordinatorBadgeNumber);
            try
            {
                int count = 1;
                foreach (var item in approvalOrderList)
                {
                        if (!string.IsNullOrEmpty(item))
                        {
                            // submit to approval 
                            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                            {
                                OracleCommand cmd = new OracleCommand();
                                cmd.Connection = (OracleConnection)dbConn;
                                cmd.CommandText = @"INSERT INTO TRAVELREQUEST_APPROVAL (                                                  
                                                            TRAVELREQUESTID,
                                                            BADGENUMBER,
                                                            APPROVALSTATUS,
                                                            APPROVALORDER
                                                        )
                                                        VALUES
                                                            (:p1,:p2,:p3,:p4)";
                                cmd.Parameters.Add(new OracleParameter("p1", submitTravelRequestData.TravelRequestId));
                                cmd.Parameters.Add(new OracleParameter("p2", item));
                                cmd.Parameters.Add(new OracleParameter("p3", Common.ApprovalStatus.Pending.ToString()));
                                cmd.Parameters.Add(new OracleParameter("p4", count));
                                var rowsUpdated = cmd.ExecuteNonQuery();
                            }
                            count++;
                        }
                }

            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                OracleCommand cmd = new OracleCommand();
                cmd.Connection = (OracleConnection)dbConn;
                cmd.CommandText = string.Format(@"UPDATE TRAVELREQUEST SET                                                 
                                                       SUBMITTEDBYUSERNAME = :p1 ,
                                                        SUBMITTEDDATETIME = :p2,
                                                        STATUS = :p3,
                                                        AGREE = :p4
                                                   WHERE TRAVELREQUESTID = {0}", submitTravelRequestData.TravelRequestId);

                cmd.Parameters.Add(new OracleParameter("p1", submitTravelRequestData.SubmittedByUserName));
                cmd.Parameters.Add(new OracleParameter("p2", DateTime.Now));
                cmd.Parameters.Add(new OracleParameter("p3", Common.ApprovalStatus.Pending.ToString()));
                cmd.Parameters.Add(new OracleParameter("p4", (submitTravelRequestData.AgreedToTermsAndConditions)?"Y":"N"));
                var rowsUpdated = cmd.ExecuteNonQuery();
            }
                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
           
        }
    }
}