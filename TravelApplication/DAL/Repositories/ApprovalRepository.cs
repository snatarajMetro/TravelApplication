using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
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
                string btnApprove = string.Format("<button type=\"button\">Click Me!</button>");
                string subject = string.Format(@"Travel Request Approval for Id - {0} ", submitTravelRequestData.TravelRequestId);
                string body = string.Format(@"Please visit Travel application website "+link+ " to Approve/Reject for travel request Id : {0}  btnApprove ", submitTravelRequestData.TravelRequestId);
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

        public string GetApprovalRequestEmailBody(string userName, int travaleRequestId, string badgeNumber)
        {
            string emailBody = string.Empty;
            string baseUrl = "http://localhost:2462/";

            using (StreamReader reader = new StreamReader("~/uitemplates/ApproveRequest.html"))
            {
                emailBody = reader.ReadToEnd();

                if (!string.IsNullOrEmpty(emailBody))
                {
                    emailBody = emailBody
                                    .Replace("{BASEURL}", baseUrl)
                                    .Replace("{USERNAME}", userName)
                                    .Replace("{TRAVELREQUESTID}", travaleRequestId.ToString())
                                    .Replace("{BADGENUMBER}", badgeNumber);
                }
            }

            return emailBody;
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

        public bool SubmitTravelRequestNew(SubmitTravelRequest submitTravelRequest)
        {
            try
            {
                using(dbConn = ConnectionFactory.GetOpenDefaultConnection())
                    {
                    foreach (var item in submitTravelRequest.HeirarchichalApprovalRequest.ApproverList)
                    {
                        if ( item.ApproverBadgeNumber != 0)
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
                            cmd.Parameters.Add(new OracleParameter("p1", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId));
                            cmd.Parameters.Add(new OracleParameter("p2", item.ApproverBadgeNumber));
                            cmd.Parameters.Add(new OracleParameter("p3", item.ApproverName));
                            cmd.Parameters.Add(new OracleParameter("p4", Common.ApprovalStatus.Pending.ToString()));
                            cmd.Parameters.Add(new OracleParameter("p5", item.ApprovalOrder));
                            var rowsUpdated = cmd.ExecuteNonQuery();
                            cmd.Dispose();
                        }
                    }
                    OracleCommand cmd1 = new OracleCommand();
                    cmd1.Connection = (OracleConnection)dbConn;
                    cmd1.CommandText = string.Format(@"UPDATE TRAVELREQUEST SET                                                 
                                                       SUBMITTEDBYUSERNAME = :p1 ,
                                                        SUBMITTEDDATETIME = :p2,
                                                        STATUS = :p3,
                                                        AGREE = :p4
                                                   WHERE TRAVELREQUESTID = {0}", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId);

                    cmd1.Parameters.Add(new OracleParameter("p1", submitTravelRequest.HeirarchichalApprovalRequest.SubmittedByUserName));
                    cmd1.Parameters.Add(new OracleParameter("p2", DateTime.Now));
                    cmd1.Parameters.Add(new OracleParameter("p3", Common.ApprovalStatus.Pending.ToString()));
                    cmd1.Parameters.Add(new OracleParameter("p4", (submitTravelRequest.HeirarchichalApprovalRequest.AgreedToTermsAndConditions) ? "Y" : "N"));
                    var rowsUpdated1 = cmd1.ExecuteNonQuery();
                    cmd1.Dispose();
                    dbConn.Close();
                    dbConn.Dispose();


                    string link = string.Format("<a href=\"http://localhost:2462/\"><img src =\"c:\\temp\\approve1.png\" height=\"40\" width = \"40\"></a>");
                    string subject = string.Format(@"Travel Request Approval for Id - {0} ", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId);
                    string body = string.Format(@"Please visit Travel application website " + link + " to Approve/Reject for travel request Id : {0}", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId);
                    sendEmail(submitTravelRequest.HeirarchichalApprovalRequest.ApproverList[0].ApproverBadgeNumber.ToString(), body, subject);
                    return true;
                }

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public SubmitTravelRequest GetApproverDetails(string travelRequestId)
        {
            SubmitTravelRequest response = new Models.SubmitTravelRequest();
            HeirarchichalApprovalRequest heirarchichalApprovalRequest = new HeirarchichalApprovalRequest();
            List<HeirarchichalOrder> approverList = new List<HeirarchichalOrder>();
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {

                //Get the approvers data
                string query = string.Format("Select * from TRAVELREQUEST_APPROVAL where TRAVELREQUESTID = {0} ", travelRequestId);
                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        approverList.Add(new HeirarchichalOrder()
                        {
                            ApproverBadgeNumber = Convert.ToInt32(dataReader["BADGENUMBER"]),
                            ApproverName = dataReader["APPROVERNAME"].ToString(),
                            ApprovalOrder = Convert.ToInt32(dataReader["APPROVALORDER"])
                        });
                    }
                }
                //Get the submission data from travel request

                string query1 = string.Format("Select SubmittedByUserName, SubmittedDatetime ,AGREE from TRAVELREQUEST where TRAVELREQUESTID = {0} ", travelRequestId);
                OracleCommand command1 = new OracleCommand(query, (OracleConnection)dbConn);
                command1.CommandText = query;
                DbDataReader dataReader1 = command.ExecuteReader();
                if (dataReader1.HasRows)
                {
                    while (dataReader1.Read())
                    {
                        heirarchichalApprovalRequest.SubmittedByUserName = dataReader1["SubmittedByUserName"].ToString();
                        heirarchichalApprovalRequest.SubmittedDatetime = Convert.ToDateTime(dataReader["SubmittedDateTime"]);
                        heirarchichalApprovalRequest.AgreedToTermsAndConditions = (dataReader["Agree"].ToString() == "Y") ? true : false;
                    }
                }
                command.Dispose();
                dataReader.Close();
                heirarchichalApprovalRequest.ApproverList = approverList;
                dbConn.Close();
                dbConn.Dispose();
            }
            response.HeirarchichalApprovalRequest = heirarchichalApprovalRequest;
            return response;
        }

        public bool SubmitReimburse(SubmitReimburseData submitReimburseData)
        {
            try
            {
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    foreach (var item in submitReimburseData.HeirarchichalApprovalRequest.ApproverList)
                    {
                        if (item.ApproverBadgeNumber != 0)
                        {

                            // submit to approval 
                            OracleCommand cmd = new OracleCommand();
                            cmd.Connection = (OracleConnection)dbConn;
                            cmd.CommandText = @"INSERT INTO REIMBURSE_APPROVAL (                                                  
                                                            TRAVELREQUESTID,
                                                            BADGENUMBER,
                                                            APPROVERNAME,
                                                            APPROVALSTATUS,
                                                            APPROVALORDER
                                                        )
                                                        VALUES
                                                            (:p1,:p2,:p3,:p4,:p5)";
                            cmd.Parameters.Add(new OracleParameter("p1", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId));
                            cmd.Parameters.Add(new OracleParameter("p2", item.ApproverBadgeNumber));
                            cmd.Parameters.Add(new OracleParameter("p3", item.ApproverName));
                            cmd.Parameters.Add(new OracleParameter("p4", Common.ApprovalStatus.Pending.ToString()));
                            cmd.Parameters.Add(new OracleParameter("p5", item.ApprovalOrder));
                            var rowsUpdated = cmd.ExecuteNonQuery();
                            cmd.Dispose();
                        }
                    }
                    OracleCommand cmd1 = new OracleCommand();
                    cmd1.Connection = (OracleConnection)dbConn;
                    cmd1.CommandText = string.Format(@"UPDATE REIMBURSE_TRAVELREQUEST SET                                                 
                                                       SUBMITTEDBYUSERNAME = :p1 ,
                                                        SUBMITTEDDATETIME = :p2,
                                                        STATUS = :p3,
                                                        AGREE = :p4
                                                   WHERE TRAVELREQUESTID = {0}", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId);

                    cmd1.Parameters.Add(new OracleParameter("p1", submitReimburseData.HeirarchichalApprovalRequest.SubmittedByUserName));
                    cmd1.Parameters.Add(new OracleParameter("p2", DateTime.Now));
                    cmd1.Parameters.Add(new OracleParameter("p3", Common.ApprovalStatus.Pending.ToString()));
                    cmd1.Parameters.Add(new OracleParameter("p4", (submitReimburseData.HeirarchichalApprovalRequest.AgreedToTermsAndConditions) ? "Y" : "N"));
                    var rowsUpdated1 = cmd1.ExecuteNonQuery();
                    cmd1.Dispose();
                    dbConn.Close();
                    dbConn.Dispose();


                    string link = string.Format("<a href=\"http://localhost:2462/\">here</a>");
                    string subject = string.Format(@"Reimbursement Request Approval for Travel Request Id - {0} ", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId);
                    string body = string.Format(@"Please visit Travel application website " + link + " to Approve/Reject for travel request Id : {0}", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId);
                    sendEmail(submitReimburseData.HeirarchichalApprovalRequest.ApproverList[0].ApproverBadgeNumber.ToString(), body, subject);
                    return true;
                }

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public bool UpdateApproveStatus(EmailApprovalDetails emailApproveDetails)
        {
            throw new NotImplementedException();
        }
    }

        public class BadgeInfo
        {
            public string  Name { get; set; }
            public string  BadgeId { get; set; }
        }
       
}