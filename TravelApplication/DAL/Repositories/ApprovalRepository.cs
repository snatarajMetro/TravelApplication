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
using TravelApplication.Services;

namespace TravelApplication.DAL.Repositories
{
    public class ApprovalRepository : IApprovalRepository
    {
        private DbConnection dbConn;

       // TravelRequestRepository travelRequestRepo = new TravelRequestRepository();
        public async Task<List<HeirarchichalPosition>> GetHeirarchichalPositions(int badgeNumber)
        {
            List<HeirarchichalPosition>  heirarchichalPosition = new List<HeirarchichalPosition>();
            List<Approver> result = new List<Approver>(); ;
            var client = new HttpClient();
            try
            {
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                var endpointUrl = System.Configuration.ConfigurationManager.AppSettings["fisServiceUrl"].ToString() + string.Format("/HeirarchichalPositions/{0}", badgeNumber);
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
            approvalOrderList.Add(new BadgeInfo() { BadgeId = submitTravelRequestData.DepartmentHeadBadgeNumber, Name = submitTravelRequestData.DepartmentHeadName });
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
                cmd1.Parameters.Add(new OracleParameter("p4", (submitTravelRequestData.AgreedToTermsAndConditions) ? "Y" : "N"));
                var rowsUpdated1 = cmd1.ExecuteNonQuery();
                cmd1.Dispose();
                dbConn.Close();
                dbConn.Dispose();


                string link = string.Format("<a href=\"http://localhost:2462/\">here</a>");
                string btnApprove = string.Format("<button type=\"button\">Click Me!</button>");
                string subject = string.Format(@"Travel Request Approval for Id - {0} ", submitTravelRequestData.TravelRequestId);
                string body = string.Format(@"Please visit Travel application website " + link + " to Approve/Reject for travel request Id : {0}  btnApprove ", submitTravelRequestData.TravelRequestId);
                sendEmail(Convert.ToInt32(submitTravelRequestData.DepartmentHeadBadgeNumber), subject, submitTravelRequestData.TravelRequestId.ToString());
                return true;

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }

        public void sendEmail(int departmentHeadBadgeNumber, string subject, string travelRequestId)
        {
            try
            {
                var emailAndFirstName = getEmailAddressByBadgeNumber(departmentHeadBadgeNumber);
                var email = new Email()
                {
                    FromAddress = "natarajs@metro.net",
                    ToAddress = emailAndFirstName[0],
                    Body = GetApprovalRequestEmailBody(emailAndFirstName[1],travelRequestId, departmentHeadBadgeNumber),
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

        public void sendRejectionEmail(int badgeNumber, string subject, string travelRequestId)
        {
            try
            {
                string link = string.Format("<a href=\"http://localhost:2462/\">here</a>");
                var emailAndFirstName = getEmailAddressByBadgeNumber(badgeNumber);
                var email = new Email()
                {
                    FromAddress = "natarajs@metro.net",
                    ToAddress = emailAndFirstName[0],
                    Body = string.Format(@"Please visit Travel application website " + link +
                    " you are travel request -{0}  has been rejected.  ", travelRequestId),
                    Subject = subject
                };
                var endpointUrl = "http://localhost:2462/api/email/sendemail";
                var client = new HttpClient();
                var response = client.PostAsJsonAsync(endpointUrl, email).ConfigureAwait(false);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }

        public string GetApprovalRequestEmailBody(string userName, string travelRequestId, int badgeNumber)
        {
            string emailBody = string.Empty;
            string baseUrl = "http://localhost:2462/";

            var x = System.Web.Hosting.HostingEnvironment.MapPath("~/UITemplates");
            using (StreamReader reader = new StreamReader( x+"/ApproveRequest.html"))
            {
                emailBody = reader.ReadToEnd();

                if (!string.IsNullOrEmpty(emailBody))
                {
                    emailBody = emailBody
                                    .Replace("{BASEURL}", baseUrl)
                                    .Replace("{USERNAME}", userName)
                                    .Replace("{TRAVELREQUESTID}", travelRequestId.ToString())
                                    .Replace("{BADGENUMBER}", badgeNumber.ToString());
                }
            }

            return emailBody;
        }

        private List<string> getEmailAddressByBadgeNumber(int departmentHeadBadgeNumber)
        {
            List<string> result = new List<string>();
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                string query = string.Format("select EMAIL,FIRSTNAME from USERS where BadgeNumber = {0}  ", departmentHeadBadgeNumber);
                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();
                
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                         result.Add(dataReader["EMAIL"].ToString());
                        result.Add(dataReader["FIRSTNAME"].ToString());
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
                var isSubmitterRequesting = false;

                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    OracleCommand cmd2 = new OracleCommand();

                    cmd2.Connection = (OracleConnection)dbConn;
                    cmd2.CommandText = string.Format(@"Select * from TRAVELREQUEST_APPROVAL where TravelRequestId = {0}", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId);
                    DbDataReader dataReader = cmd2.ExecuteReader();
                    if (dataReader.HasRows)
                    {
                        foreach (var item in submitTravelRequest.HeirarchichalApprovalRequest.ApproverList)
                        {
                            if (item.ApproverBadgeNumber != 0)
                            {

                                //  Check if the approval already exists 
                                OracleCommand cmd = new OracleCommand();
                                cmd.Connection = (OracleConnection)dbConn;
                                cmd.CommandText = string.Format(@"Update TRAVELREQUEST_APPROVAL SET                                                   
                                                            BADGENUMBER = :p1,
                                                            APPROVERNAME = :p2,                                                                                                                     
                                                            APPROVEROTHERBADGENUMBER = :p3 WHERE TRAVELREQUESTID = {0} AND APPROVALORDER = {1} ", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId, item.ApprovalOrder);
                                cmd.Parameters.Add(new OracleParameter("p1", item.ApproverBadgeNumber));
                                cmd.Parameters.Add(new OracleParameter("p2", item.ApproverName));
                                cmd.Parameters.Add(new OracleParameter("p6", item.ApproverOtherBadgeNumber));
                                var rowsUpdated = cmd.ExecuteNonQuery();
                                cmd.Dispose();
                            }
                            else
                            {

                                OracleCommand cmd = new OracleCommand();
                                cmd.Connection = (OracleConnection)dbConn;
                                cmd.CommandText = string.Format(@"Delete from TRAVELREQUEST_APPROVAL where TravelRequestId = {0} AND APPROVALORDER = {1}", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId, item.ApprovalOrder);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                    else
                    {
                        cmd2.Connection = (OracleConnection)dbConn;
                        cmd2.CommandText = string.Format(@"Delete from TRAVELREQUEST_APPROVAL where TravelRequestId = {0}", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId);
                        cmd2.ExecuteNonQuery();
                        if ((submitTravelRequest.HeirarchichalApprovalRequest.SignedInBadgeNumber != submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestBadgeNumber) && (submitTravelRequest.HeirarchichalApprovalRequest.SignedInBadgeNumber != 85163))
                        {
                            // submit to approval 
                            isSubmitterRequesting = true;

                            cmd2.Connection = (OracleConnection)dbConn;
                            cmd2.CommandText = @"INSERT INTO TRAVELREQUEST_APPROVAL (                                                  
                                                                TRAVELREQUESTID,
                                                                BADGENUMBER,
                                                                APPROVERNAME,
                                                                APPROVALSTATUS,
                                                                APPROVALORDER 
                                                            )
                                                            VALUES
                                                                (:p1,:p2,:p3,:p4,:p5)";
                            cmd2.Parameters.Add(new OracleParameter("p1", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId));
                            cmd2.Parameters.Add(new OracleParameter("p2", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestBadgeNumber));
                            cmd2.Parameters.Add(new OracleParameter("p3", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestName));
                            cmd2.Parameters.Add(new OracleParameter("p4", Common.ApprovalStatus.Pending.ToString()));
                            cmd2.Parameters.Add(new OracleParameter("p5", "0"));
                            var rowsUpdated = cmd2.ExecuteNonQuery();
                            cmd2.Dispose();
                        }
                        foreach (var item in submitTravelRequest.HeirarchichalApprovalRequest.ApproverList)
                        {
                            if (item.ApproverBadgeNumber != 0)
                            {

                                // submit to approval 
                                OracleCommand cmd = new OracleCommand();
                                cmd.Connection = (OracleConnection)dbConn;
                                cmd.CommandText = @"INSERT INTO TRAVELREQUEST_APPROVAL (                                                  
                                                            TRAVELREQUESTID,
                                                            BADGENUMBER,
                                                            APPROVERNAME,
                                                            APPROVALSTATUS,
                                                            APPROVALORDER,
                                                            APPROVEROTHERBADGENUMBER
                                                        )
                                                        VALUES
                                                            (:p1,:p2,:p3,:p4,:p5,:p6)";
                                cmd.Parameters.Add(new OracleParameter("p1", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId));
                                cmd.Parameters.Add(new OracleParameter("p2", item.ApproverBadgeNumber));
                                cmd.Parameters.Add(new OracleParameter("p3", item.ApproverName));
                                cmd.Parameters.Add(new OracleParameter("p4", Common.ApprovalStatus.Pending.ToString()));
                                cmd.Parameters.Add(new OracleParameter("p5", item.ApprovalOrder));
                                cmd.Parameters.Add(new OracleParameter("p6", item.ApproverOtherBadgeNumber));
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
                    }

                    var result = getNextApproverBadgeNumber(dbConn, submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId, "TRAVELREQUEST_APPROVAL");

                    dbConn.Close();
                    dbConn.Dispose();

                    if (submitTravelRequest.HeirarchichalApprovalRequest.SignedInBadgeNumber != result)
                    {
                        string subject = string.Format(@"Travel Request Approval for Id - {0} ", submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId);

                        if (isSubmitterRequesting)
                        {
                            sendEmail(submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestBadgeNumber, subject, submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId);
                        }
                        else
                        {
                            sendEmail(result, subject, submitTravelRequest.HeirarchichalApprovalRequest.TravelRequestId);
                        }
                    }

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
                            ApprovalOrder = Convert.ToInt32(dataReader["APPROVALORDER"]),
                            ApproverOtherBadgeNumber = Convert.ToInt32(dataReader["APPROVEROTHERBADGENUMBER"])
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
                var isSubmitterRequesting = false;
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    OracleCommand cmd3 = new OracleCommand();

                    cmd3.Connection = (OracleConnection)dbConn;
                    cmd3.CommandText = string.Format(@"Select * from REIMBURSE_APPROVAL where TravelRequestId = {0}", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId);
                    DbDataReader dataReader = cmd3.ExecuteReader();
                    if (dataReader.HasRows)
                    {
                        foreach (var item in submitReimburseData.HeirarchichalApprovalRequest.ApproverList)
                        {
                            if (item.ApproverBadgeNumber != 0)
                            {

                                //  Check if the approval already exists 
                                OracleCommand cmd = new OracleCommand();
                                cmd.Connection = (OracleConnection)dbConn;
                                cmd.CommandText = string.Format(@"Update REIMBURSE_APPROVAL SET                                                   
                                                            BADGENUMBER = :p1,
                                                            APPROVERNAME = :p2,                                                                                                                     
                                                            APPROVEROTHERBADGENUMBER = :p3 WHERE TRAVELREQUESTID = {0} AND APPROVALORDER = {1} ", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId, item.ApprovalOrder);
                                cmd.Parameters.Add(new OracleParameter("p1", item.ApproverBadgeNumber));
                                cmd.Parameters.Add(new OracleParameter("p2", item.ApproverName));
                                cmd.Parameters.Add(new OracleParameter("p6", item.ApproverOtherBadgeNumber));
                                var rowsUpdated = cmd.ExecuteNonQuery();
                                cmd.Dispose();
                            }
                            else
                            {

                                OracleCommand cmd = new OracleCommand();
                                cmd.Connection = (OracleConnection)dbConn;
                                cmd.CommandText = string.Format(@"Delete from REIMBURSE_APPROVAL where TravelRequestId = {0} AND APPROVALORDER = {1}", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId, item.ApprovalOrder);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                    else
                    {
                        cmd3.Connection = (OracleConnection)dbConn;
                        cmd3.CommandText = string.Format(@"Delete from REIMBURSE_APPROVAL where TravelRequestId = {0}", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId);
                        cmd3.ExecuteNonQuery();
                        //  OracleCommand cmd2 = new OracleCommand();
                        if (submitReimburseData.HeirarchichalApprovalRequest.SignedInBadgeNumber != submitReimburseData.HeirarchichalApprovalRequest.TravelRequestBadgeNumber)
                        {
                            isSubmitterRequesting = true;
                            cmd3.Connection = (OracleConnection)dbConn;
                            cmd3.CommandText = @"INSERT INTO REIMBURSE_APPROVAL (                                                  
                                                            TRAVELREQUESTID,
                                                            BADGENUMBER,
                                                            APPROVERNAME,
                                                            APPROVALSTATUS,
                                                            APPROVALORDER                                                            
                                                        )
                                                        VALUES
                                                            (:p1,:p2,:p3,:p4,:p5 )";
                            cmd3.Parameters.Add(new OracleParameter("p1", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId));
                            cmd3.Parameters.Add(new OracleParameter("p2", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestBadgeNumber));
                            cmd3.Parameters.Add(new OracleParameter("p3", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestName));
                            cmd3.Parameters.Add(new OracleParameter("p4", Common.ApprovalStatus.Pending.ToString()));
                            cmd3.Parameters.Add(new OracleParameter("p5", "0"));

                            var rowsUpdated = cmd3.ExecuteNonQuery();
                            cmd3.Dispose();

                        }
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
                                                            APPROVALORDER,
                                                            APPROVEROTHERBADGENUMBER
                                                        )
                                                        VALUES
                                                            (:p1,:p2,:p3,:p4,:p5,:p6)";
                                cmd.Parameters.Add(new OracleParameter("p1", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId));
                                cmd.Parameters.Add(new OracleParameter("p2", item.ApproverBadgeNumber));
                                cmd.Parameters.Add(new OracleParameter("p3", item.ApproverName));
                                cmd.Parameters.Add(new OracleParameter("p4", Common.ApprovalStatus.Pending.ToString()));
                                cmd.Parameters.Add(new OracleParameter("p5", item.ApprovalOrder));
                                cmd.Parameters.Add(new OracleParameter("p6", item.ApproverOtherBadgeNumber));
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
                    }
                    var result = getNextApproverBadgeNumber(dbConn, submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId, "REIMBURSE_APPROVAL");


                    if (submitReimburseData.HeirarchichalApprovalRequest.SignedInBadgeNumber != result)
                    {

                        string subject = string.Format(@"Reimbursement Request Approval for Travel Request Id - {0} ", submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId);

                        if (isSubmitterRequesting)
                        {
                            sendEmail(submitReimburseData.HeirarchichalApprovalRequest.TravelRequestBadgeNumber, subject, submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId);
                        }
                        else
                        {
                            sendEmail(result, subject, submitReimburseData.HeirarchichalApprovalRequest.TravelRequestId);
                        }
                    }
                    dbConn.Close();
                    dbConn.Dispose();
                }
                return true;

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

        #region  Private methods


       

        public int getNextApproverBadgeNumber(DbConnection dbConn, string travelRequestId, string tableName)
        {
            var result = 0;
            string query = string.Format(@"SELECT
	                                                    BADGENUMBER,APPROVEROTHERBADGENUMBER
                                                    FROM
	                                                    (
		                                                    SELECT
			                                                    BADGENUMBER, APPROVEROTHERBADGENUMBER
		                                                    FROM
			                                                    {0}
		                                                    WHERE
			                                                    TRAVELREQUESTID = {1}
		                                                    AND APPROVALDATETIME IS NULL
		                                                    ORDER BY
			                                                    APPROVALORDER 
	                                                    )
                                                    WHERE
	                                                    ROWNUM = 1", tableName, travelRequestId);
            OracleCommand cmd1 = new OracleCommand(query, (OracleConnection)dbConn);
            cmd1.CommandText = query;
            DbDataReader dataReader = cmd1.ExecuteReader();

            if (dataReader.HasRows)
            {
                while (dataReader.Read())
                {
                    result = Convert.ToInt32(dataReader["BADGENUMBER"].ToString());
                    if (result == -1)
                    {
                        result = Convert.ToInt32(dataReader["APPROVEROTHERBADGENUMBER"].ToString());
                    }
                }

            }
            else
            {
                result = 0;
            }
            cmd1.Dispose();
            dataReader.Close();
            // dbConn.Close();
            // dbConn.Dispose();
            return result;
        }


        #endregion
    }

    public class BadgeInfo
        {
            public string  Name { get; set; }
            public string  BadgeId { get; set; }
        }


   

}