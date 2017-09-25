using Oracle.ManagedDataAccess.Client;
using System;
using System.Data;
using System.Data.Common;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using TravelApplication.DAL.DBProvider;
using TravelApplication.Models;
using System.Collections.Generic;
using TravelApplication.Common;

namespace TravelApplication.Services
{
    public class TravelRequestRepository : ITravelRequestRepository
    {
        private DbConnection dbConn;

        public async Task<EmployeeDetails> GetEmployeeDetails(int badgeNumber)
        {
            EmployeeDetails employeeDetails = null;
            var client = new HttpClient();
            try
            {
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                var endpointUrl = string.Format("http://apitest.metro.net/fis/EmployeeInfo/{0}", badgeNumber);
                HttpResponseMessage response = await client.GetAsync(endpointUrl).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {

                    employeeDetails = await response.Content.ReadAsAsync<EmployeeDetails>();
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
            return employeeDetails;

        }
        public async Task<int> SaveTravelRequest(TravelRequest request)
        {
            int travelRequestId = 0;
            try
            {
                ValidateTravelRequestInfo(request);
                if (request.TravelRequestId == 0)
                {                   
                    var loginId = getUserName(request.UserId);
                    request.LoginId = loginId;
                    using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                    {
                        OracleCommand cmd = new OracleCommand();
                        cmd.Connection = (OracleConnection)dbConn;
                        cmd.CommandText = @"INSERT INTO TRAVELREQUEST (                                                  
                                                    BADGENUMBER,
                                                    NAME,
                                                    DIVISION,
                                                    SECTION,
                                                    ORGANIZATION,
                                                    MEETINGLOCATION,
                                                    MEETINGBEGINDATETIME,
                                                    DEPARTUREDATETIME,
                                                    MEETINGENDDATETIME,
                                                    RETURNDATETIME,
                                                    CREATIONDATETIME,
                                                    SELECTEDROLEID,
                                                    STATUS
                                                )
                                                VALUES
                                                    (:p2,:p3,:p4,:p5,:p6,:p7,:p8,:p9,:p10,:p11,:p12,:p13,:p14) returning TRAVELREQUESTID into :travelRequestId";
                        cmd.Parameters.Add(new OracleParameter("p2", request.BadgeNumber));
                        cmd.Parameters.Add(new OracleParameter("p3", request.Name));
                        cmd.Parameters.Add(new OracleParameter("p4", request.Division));
                        cmd.Parameters.Add(new OracleParameter("p5", request.Section));
                        cmd.Parameters.Add(new OracleParameter("p6", request.Organization));
                        cmd.Parameters.Add(new OracleParameter("p7", request.MeetingLocation));
                        cmd.Parameters.Add(new OracleParameter("p8", request.MeetingBeginDateTime));
                        cmd.Parameters.Add(new OracleParameter("p9", request.DepartureDateTime));
                        cmd.Parameters.Add(new OracleParameter("p10", request.MeetingEndDateTime));
                        cmd.Parameters.Add(new OracleParameter("p11", request.ReturnDateTime));
                        cmd.Parameters.Add(new OracleParameter("p12", DateTime.Now));
                        cmd.Parameters.Add(new OracleParameter("p13", request.SelectedRoleId));
                        cmd.Parameters.Add(new OracleParameter("p14", ApprovalStatus.New.ToString()));
                        cmd.Parameters.Add("travelRequestId", OracleDbType.Int32, ParameterDirection.ReturnValue);
                        var rowsUpdated = cmd.ExecuteNonQuery();
                        travelRequestId = Decimal.ToInt32(((Oracle.ManagedDataAccess.Types.OracleDecimal)(cmd.Parameters["travelRequestId"].Value)).Value);
                    }
                }
                else
                {
                    var loginId = getUserName(request.UserId);
                    request.LoginId = loginId;
                    using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                    {
                        OracleCommand cmd = new OracleCommand();
                        cmd.Connection = (OracleConnection)dbConn;
                        cmd.CommandText = string.Format(@"UPDATE  TRAVELREQUEST SET                                                  
                                                    BADGENUMBER = :p2,
                                                    NAME = :p3,
                                                    DIVISION  = :p4,
                                                    SECTION  = :p5,
                                                    ORGANIZATION  = :p6,
                                                    MEETINGLOCATION  = :p7,
                                                    MEETINGBEGINDATETIME  = :p8,
                                                    DEPARTUREDATETIME  = :p9,
                                                    MEETINGENDDATETIME  = :p10,
                                                    RETURNDATETIME  = :p11,
                                                    LASTUPDATEDDATETIME  = :p12
                                                    WHERE TRAVELREQUESTID = {0}",request.TravelRequestId);
                        cmd.Parameters.Add(new OracleParameter("p2", request.BadgeNumber));
                        cmd.Parameters.Add(new OracleParameter("p3", request.Name));
                        cmd.Parameters.Add(new OracleParameter("p4", request.Division));
                        cmd.Parameters.Add(new OracleParameter("p5", request.Section));
                        cmd.Parameters.Add(new OracleParameter("p6", request.Organization));
                        cmd.Parameters.Add(new OracleParameter("p7", request.MeetingLocation));
                        cmd.Parameters.Add(new OracleParameter("p8", request.MeetingBeginDateTime));
                        cmd.Parameters.Add(new OracleParameter("p9", request.DepartureDateTime));
                        cmd.Parameters.Add(new OracleParameter("p10", request.MeetingEndDateTime));
                        cmd.Parameters.Add(new OracleParameter("p11", request.ReturnDateTime));
                        cmd.Parameters.Add(new OracleParameter("p12", DateTime.Now));
                        var rowsUpdated = cmd.ExecuteNonQuery();
                        travelRequestId = request.TravelRequestId;
                    }
                }
                dbConn.Close();
                dbConn.Dispose();

            }
            catch (Exception ex)
            {

                //TODO : log the exception 
                 throw new Exception("Couldn't insert/update record into Travel Request - "+ex.Message);
            }

            return travelRequestId;
        }

        public string getUserName(int id)
        {
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                string query = string.Format("Select loginId from users where Id = {0}", id);
                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();
                string userName = string.Empty;
                if (dataReader != null)
                {
                    while (dataReader.Read())
                    {
                        userName = dataReader["LoginId"].ToString();
                    }
                }

                dbConn.Close();
                dbConn.Dispose();
                return userName;
            }
        }

        public void ValidateTravelRequestInfo(TravelRequest request)
        {
            try
            {
                if (request.BadgeNumber <= 0)
                {
                    throw new Exception("Invalid Badge Number");
                }
                if (string.IsNullOrWhiteSpace(request.Name))
                {
                    throw new Exception("Invalid Name");
                }

                if (string.IsNullOrWhiteSpace(request.Division))
                {
                    throw new Exception("Invalid Division");
                }
                if (string.IsNullOrWhiteSpace(request.Section))
                {
                    throw new Exception("Invalid Section");
                }
                if (string.IsNullOrWhiteSpace(request.Organization))
                {
                    throw new Exception("Invalid Organization");
                }
                if (string.IsNullOrWhiteSpace(request.MeetingLocation))
                {
                    throw new Exception("Invalid Meeting Location");
                }

                if (request.MeetingBeginDateTime == DateTime.MinValue)
                {
                    throw new Exception("Invalid Meeting Begin Date");
                }
                if (request.MeetingEndDateTime == DateTime.MinValue)
                {
                    throw new Exception("Invalid Meeting End Date");
                }
                if (request.DepartureDateTime == DateTime.MinValue)
                {
                    throw new Exception("Invalid Departure Date");
                }
                if (request.ReturnDateTime == DateTime.MinValue)
                {
                    throw new Exception("Invalid Return Date");
                }
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public TravelRequest GetTravelRequestDetail(int travelRequestId)
        {
            TravelRequest response = null;
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                string query = string.Format("Select * from TRAVELREQUEST where TRAVELREQUESTID= {0}", travelRequestId);
                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        response = new TravelRequest()
                        {
                            BadgeNumber = Convert.ToInt32(dataReader["BADGENUMBER"]),
                            Name = dataReader["NAME"].ToString(),
                            Division = dataReader["DIVISION"].ToString(),
                            Section = dataReader["SECTION"].ToString(),
                            Organization = dataReader["ORGANIZATION"].ToString(),
                            MeetingLocation = dataReader["MEETINGLOCATION"].ToString(),
                            MeetingBeginDateTime = Convert.ToDateTime(dataReader["MEETINGBEGINDATETIME"]),
                            MeetingEndDateTime = Convert.ToDateTime(dataReader["MEETINGENDDATETIME"]),
                            DepartureDateTime = Convert.ToDateTime(dataReader["DEPARTUREDATETIME"]),
                            ReturnDateTime = Convert.ToDateTime(dataReader["RETURNDATETIME"])
                        };
                    }
                }
                else
                {
                    throw new Exception("Couldn't retrieve travel request");
                }
            }
            return response;
        }

        public List<TravelRequestDetails> GetTravelRequestList(int badgeNumber, int selectedRoleId)
        {
            List<TravelRequestDetails> response = new List<TravelRequestDetails>();

            if (selectedRoleId == 1 || selectedRoleId == 2)
            {
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    string query = string.Format("Select * from TRAVELREQUEST where BADGENUMBER= {0} AND SELECTEDROLEID ={1}", badgeNumber, selectedRoleId);
                    OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                    command.CommandText = query;
                    DbDataReader dataReader = command.ExecuteReader();
                    if (dataReader.HasRows)
                    {
                        while (dataReader.Read())
                        {
                            response.Add(new TravelRequestDetails()
                            {
                                TravelRequestId = Convert.ToInt32(dataReader["TravelRequestId"]),
                                Description = dataReader["Description"].ToString(),
                                SubmittedByUser = dataReader["SUBMITTEDBYUSERNAME"].ToString(),
                                SubmittedDateTime = dataReader["SUBMITTEDDATETIME"].ToString(),
                                RequiredApprovers = GetApproversListByTravelRequestId(Convert.ToInt32(dataReader["TravelRequestId"])),
                                LastApproveredByUser = getLastApproverName(Convert.ToInt32(dataReader["TravelRequestId"])),
                                LastApprovedDateTime = getLastApproverDateTime(Convert.ToInt32(dataReader["TravelRequestId"])),
                                EditActionVisible = EditActionEligible(Convert.ToInt32(dataReader["TravelRequestId"])) ? true : false,
                                ViewActionVisible = true,
                                ApproveActionVisible = false,
                                Status = dataReader["STATUS"].ToString()
                            });
                        }
                    }
                }
                return response;
            }
            else
            {
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    string query = string.Format(@"SELECT
	                                                    *
                                                    FROM
	                                                    TRAVELREQUEST
                                                    WHERE
	                                                    TRAVELREQUESTID IN (
		                                                    SELECT
			                                                    TRAVELREQUESTId
		                                                    FROM
			                                                    TRAVELREQUEST_APPROVAL
		                                                    WHERE
			                                                    BADGENUMBER = {0}
	                                                    )", badgeNumber);
                    OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                    command.CommandText = query;
                    DbDataReader dataReader = command.ExecuteReader();
                    if (dataReader.HasRows)
                    {
                        while (dataReader.Read())
                        {
                            response.Add(new TravelRequestDetails()
                            {
                                TravelRequestId = Convert.ToInt32(dataReader["TravelRequestId"]),
                                Description = dataReader["Description"].ToString(),
                                SubmittedByUser = dataReader["SUBMITTEDBYUSERNAME"].ToString(),
                                SubmittedDateTime = dataReader["SUBMITTEDDATETIME"].ToString(),
                                RequiredApprovers = GetApproversListByTravelRequestId(Convert.ToInt32(dataReader["TravelRequestId"])),
                                LastApproveredByUser = getLastApproverName(Convert.ToInt32(dataReader["TravelRequestId"])),
                                LastApprovedDateTime = getLastApproverDateTime(Convert.ToInt32(dataReader["TravelRequestId"])),
                                EditActionVisible = false,
                                ViewActionVisible = true,
                                ApproveActionVisible = getApprovalSatus(Convert.ToInt32(dataReader["TravelRequestId"])) ? true : false,
                                Status = dataReader["STATUS"].ToString()
                            });
                        }
                    }
                    //else
                    //{
                    //    throw new Exception("Couldn't retrieve travel request");
                    //}
                }
                return response;
            }
        }

        private string getLastApproverDateTime(int travelRequestId)
        {
            string response = "";
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                string query = string.Format(@"SELECT
	                                            APPROVALDATETIME
                                            FROM
	                                            TRAVELREQUEST_APPROVAL
                                            WHERE
	                                            TRAVELREQUESTID = {0}
                                            AND APPROVALDATETIME IS NOT NULL
                                            AND ROWNUM = 1
                                            ORDER BY
	                                            APPROVALDATETIME DESC", travelRequestId);

                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        response = dataReader["APPROVALDATETIME"].ToString();
                    }
                }
            }
            return response;
        }

        private string getLastApproverName(int travelRequestId)
        {
            string response = "";
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                string query = string.Format(@"SELECT
	                                            APPROVERNAME
                                            FROM
	                                            TRAVELREQUEST_APPROVAL
                                            WHERE
	                                            TRAVELREQUESTID = {0}
                                            AND APPROVALDATETIME IS NOT NULL
                                            AND ROWNUM = 1
                                            ORDER BY
	                                            APPROVALDATETIME DESC", travelRequestId);

                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        response = dataReader["APPROVERNAME"].ToString();
                    }
                }
            }
            return response;
        }

        private string GetApproversListByTravelRequestId(int travelRequestId)
        {
            string response = string.Empty;
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    string query = string.Format("select APPROVERNAME from TRAVELREQUEST_APPROVAL where TRAVELREQUESTID = {0} order by ApprovalOrder", travelRequestId);
                    OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                    command.CommandText = query;
                    DbDataReader dataReader = command.ExecuteReader();
                    List<string> result = new List<string>();
                    if (dataReader.HasRows)
                    {
                        while (dataReader.Read())
                        {
                            result.Add(dataReader["APPROVERNAME"].ToString());
                        }
                    }
                    response = string.Join(", ", result);
                }
           
            return response;

              
        }

        public bool Approve(int badgeNumber, int travelRequestId, string comments)
        {
            int approvalOrder = 0;
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                //Update travel request _approval
                OracleCommand cmd = new OracleCommand();
                cmd.Connection = (OracleConnection)dbConn;
                cmd.CommandText = string.Format(@"UPDATE  TRAVELREQUEST_APPROVAL SET                                                  
                                                    APPROVERCOMMENTS = :p1,
                                                    APPROVALSTATUS = :p2 ,
                                                    APPROVALDATETIME = :p3
                                                    WHERE TRAVELREQUESTID = {0} AND BADGENUMBER = {1} returning APPROVALORDER into :approvalOrder", travelRequestId,badgeNumber);
                cmd.Parameters.Add(new OracleParameter("p1", comments));
                cmd.Parameters.Add(new OracleParameter("p2", ApprovalStatus.Approved.ToString()));
                cmd.Parameters.Add(new OracleParameter("p3", DateTime.Now));
                cmd.Parameters.Add("approvalOrder", OracleDbType.Int32, ParameterDirection.ReturnValue);
                var rowsUpdated = cmd.ExecuteNonQuery();
                approvalOrder = Decimal.ToInt32(((Oracle.ManagedDataAccess.Types.OracleDecimal)(cmd.Parameters["approvalOrder"].Value)).Value);
                
                // Get the approval order 
                var result = 0;
                string query = string.Format(@"Select Max(ApprovalOrder) as count from TRAVELREQUEST_APPROVAL  WHERE TRAVELREQUESTID = {0}", travelRequestId);
                OracleCommand cmd1 = new OracleCommand(query, (OracleConnection)dbConn);
                cmd1.CommandText = query;
                DbDataReader dataReader = cmd1.ExecuteReader();
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        result = Convert.ToInt32(dataReader["count"]);
                    }
                }

                // update travel request for the latest status 
                cmd1.CommandText = string.Format(@"UPDATE  TRAVELREQUEST SET                                                  
                                                     STATUS = :p1 
                                                    WHERE TRAVELREQUESTID = {0}", travelRequestId);
                if (approvalOrder < result)
                {                    
                    cmd1.Parameters.Add(new OracleParameter("p1", ApprovalStatus.Pending.ToString()));                                       
                }
                else
                {
                    cmd1.Parameters.Add(new OracleParameter("p1", ApprovalStatus.Complete.ToString()));
                }

                var rowsUpdated1 = cmd1.ExecuteNonQuery();
            }

                
            return true;
        }

        public bool Reject(int badgeNumber, int travelRequestId, string comments)
        {
            int approvalOrder = 0;
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                //Update travel request _approval
                OracleCommand cmd = new OracleCommand();
                cmd.Connection = (OracleConnection)dbConn;
                cmd.CommandText = string.Format(@"UPDATE  TRAVELREQUEST_APPROVAL SET                                                  
                                                    APPROVERCOMMENTS = :p1,
                                                    APPROVALSTATUS = :p2 ,
                                                    APPROVALDATETIME = :p3
                                                    WHERE TRAVELREQUESTID = {0} AND BADGENUMBER = {1} returning APPROVALORDER into :approvalOrder", travelRequestId, badgeNumber);
                cmd.Parameters.Add(new OracleParameter("p1", comments));
                cmd.Parameters.Add(new OracleParameter("p2", ApprovalStatus.Rejected.ToString()));
                cmd.Parameters.Add(new OracleParameter("p3", DateTime.Now));
                cmd.Parameters.Add("approvalOrder", OracleDbType.Int32, ParameterDirection.ReturnValue);
                var rowsUpdated = cmd.ExecuteNonQuery();
                approvalOrder = Decimal.ToInt32(((Oracle.ManagedDataAccess.Types.OracleDecimal)(cmd.Parameters["approvalOrder"].Value)).Value);
  

                // update travel request for the latest status 
                cmd.CommandText = string.Format(@"UPDATE  TRAVELREQUEST SET                                                  
                                                     STATUS = :p1 
                                                    WHERE TRAVELREQUESTID = {0}", travelRequestId);
 
                cmd.Parameters.Add(new OracleParameter("p1", ApprovalStatus.Rejected.ToString()));
                
                var rowsUpdated1 = cmd.ExecuteNonQuery();
            }


            return true;
        }

        public bool  getApprovalSatus(int travelRequestId)
        {
            bool result = true;
            List<string> response = new List<string>();
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                string query = string.Format(@"SELECT
	                                            APPROVALSTATUS
                                            FROM
	                                            TRAVELREQUEST_APPROVAL
                                            WHERE
	                                            TRAVELREQUESTID = {0} ", travelRequestId);

                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        response.Add(dataReader["APPROVALSTATUS"].ToString());
                    }
                }
            }
            foreach (var item in response)
            {
                if (item == ApprovalStatus.Pending.ToString() || item == ApprovalStatus.Approved.ToString())
                {
                    result =  false;
                }
            }
            return result;
        }

        public bool EditActionEligible(int travelRequestId)
        {
            string response = "";
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                string query = string.Format(@"SELECT
	                                            STATUS
                                            FROM
	                                            TRAVELREQUEST 
                                            WHERE
	                                            TRAVELREQUESTID = {0}  ", travelRequestId );

                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        response = dataReader["STATUS"].ToString();
                    }
                }
            }

            if (response == ApprovalStatus.New.ToString())
            {
                return true;
            }
            return false;
            
        }
    }
}