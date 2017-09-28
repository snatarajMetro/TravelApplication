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
 
            foreach (var item in result)
            {
                heirarchichalPosition.Add(new HeirarchichalPosition() { BadgeNumber = Convert.ToInt32(item.EmployeeBadgeNumber), Name = item.EmployeeName });                 
            }
            return heirarchichalPosition;
        }

        public bool SubmitTravelRequest(SubmitTravelRequestData submitTravelRequestData)
        {
            List<BadgeInfo> approvalOrderList = new List<BadgeInfo>();
            approvalOrderList.Add( new BadgeInfo() { BadgeId = submitTravelRequestData.DepartmentHeadBadgeNumber, Name = submitTravelRequestData.DepartmentHeadName });
            approvalOrderList.Add(new BadgeInfo() { BadgeId = submitTravelRequestData.ExecutiveOfficerBadgeNumber, Name = submitTravelRequestData.ExecutiveOfficerName });
            approvalOrderList.Add(new BadgeInfo() { BadgeId = submitTravelRequestData.CEOForAPTABadgeNumber, Name = submitTravelRequestData.CEOForAPTAName });
            approvalOrderList.Add(new BadgeInfo() { BadgeId = submitTravelRequestData.CEOForInternationalBadgeNumber, Name = submitTravelRequestData.CEOForInternationalName });
            approvalOrderList.Add(new BadgeInfo() { BadgeId = submitTravelRequestData.TravelCoordinatorBadgeNumber, Name = submitTravelRequestData.TravelCoordinatorName });

            try
            {

            dbConn = ConnectionFactory.GetOpenDefaultConnection();
                int count = 1;
                foreach (var item in approvalOrderList)
                {
                        if (!string.IsNullOrEmpty(item.BadgeId))
                        {
                            // submit to approval 
                                OracleCommand cmd = new OracleCommand();
                                cmd.Connection = (OracleConnection)dbConn;
                                cmd.CommandText = @"INSERT INTO TRAVELREQUEST_APPROVAL (                                                  
                                                            TRAVELREQUESTID,
                                                            BADGENUMBER,
                                                            APPROVERNAME,
                                                            APPROVALSTATUS,
                                                            APPROVALORDER
                                                        )
                                                        VALUES
                                                            (:p1,:p2,:p3,:p4,:p5)";
                                cmd.Parameters.Add(new OracleParameter("p1", submitTravelRequestData.TravelRequestId));
                                cmd.Parameters.Add(new OracleParameter("p2", item.BadgeId));
                                cmd.Parameters.Add(new OracleParameter("p3", item.Name));
                                cmd.Parameters.Add(new OracleParameter("p4", Common.ApprovalStatus.Pending.ToString()));
                                cmd.Parameters.Add(new OracleParameter("p5", count));
                                var rowsUpdated = cmd.ExecuteNonQuery();
                                cmd.Dispose();                                                                
                                count++;
                        }
                }
                OracleCommand cmd1 = new OracleCommand();
                cmd1.Connection = (OracleConnection)dbConn;
                cmd1.CommandText = string.Format(@"UPDATE TRAVELREQUEST SET                                                 
                                                       SUBMITTEDBYUSERNAME = :p1 ,
                                                        SUBMITTEDDATETIME = :p2,
                                                        STATUS = :p3,
                                                        AGREE = :p4
                                                   WHERE TRAVELREQUESTID = {0}", submitTravelRequestData.TravelRequestId);

                cmd1.Parameters.Add(new OracleParameter("p1", submitTravelRequestData.SubmittedByUserName));
                cmd1.Parameters.Add(new OracleParameter("p2", DateTime.Now));
                cmd1.Parameters.Add(new OracleParameter("p3", Common.ApprovalStatus.Pending.ToString()));
                cmd1.Parameters.Add(new OracleParameter("p4", (submitTravelRequestData.AgreedToTermsAndConditions)?"Y":"N"));
                var rowsUpdated1 = cmd1.ExecuteNonQuery();
                cmd1.Dispose();
                dbConn.Close();
                dbConn.Dispose();


                string link = string.Format("<a href=\"http://localhost:2462/\">here</a>");
                string subject = string.Format(@"Travel Request Approval for Id - {0} ", submitTravelRequestData.TravelRequestId);
                string body = string.Format(@"Please visit Travel application website "+link+ " to Approve/Reject for travel request Id : {0}", submitTravelRequestData.TravelRequestId);
                sendEmail(submitTravelRequestData.DepartmentHeadBadgeNumber, body,subject);
                return true;

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }

        public void sendEmail(string departmentHeadBadgeNumber,string body, string subject)
        {
            try
            {
                var email = new Email()
                {
                    FromAddress = "natarajs@metro.net",
                    ToAddress = getEmailAddressByBadgeNumber(departmentHeadBadgeNumber),
                    Body = body,
                    Subject = subject
                };
                var endpointUrl = "http://localhost:2462/api/email/sendemail";
                var client = new HttpClient();
                var response = client.PostAsJsonAsync(endpointUrl, email).ConfigureAwait(false);
            }
            catch (Exception ex )
            {

                throw new Exception(ex.Message);
            }
            
        }

        private string getEmailAddressByBadgeNumber(string departmentHeadBadgeNumber)
        {
            string result = string.Empty;
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                string query = string.Format("select EMAIL from USERS where BadgeNumber = {0}  ", departmentHeadBadgeNumber);
                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();
                
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                         result = dataReader["EMAIL"].ToString();
                    }
                }

                dataReader.Close();
                command.Dispose();
                dbConn.Close();
                dbConn.Dispose();
            }

            return result;
        }
    }

        public class BadgeInfo
        {
            public string  Name { get; set; }
            public string  BadgeId { get; set; }
        }
       
}