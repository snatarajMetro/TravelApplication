﻿using Oracle.ManagedDataAccess.Client;
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
using TravelApplication.DAL.Repositories;

namespace TravelApplication.Services
{
    public class TravelRequestRepository :  ApprovalRepository, ITravelRequestRepository
    {
        private DbConnection dbConn;
        EstimatedExpenseRepository estimatedExpenseRepository = new EstimatedExpenseRepository();


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
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    var loginId = getUserName(dbConn,request.UserId);
                    request.LoginId = loginId;
                    if (request.TravelRequestId == 0)
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
                                                    STATUS,
                                                    SUBMITTEDBYBADGENUMBER
                                                )
                                                VALUES
                                                    (:p2,:p3,:p4,:p5,:p6,:p7,:p8,:p9,:p10,:p11,:p12,:p13,:p14,:P15) returning TRAVELREQUESTID into :travelRequestId";
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
                        cmd.Parameters.Add(new OracleParameter("p14", request.SubmittedByBadgeNumber));
                        cmd.Parameters.Add("travelRequestId", OracleDbType.Int32, ParameterDirection.ReturnValue);
                        var rowsUpdated = cmd.ExecuteNonQuery();
                        travelRequestId = Decimal.ToInt32(((Oracle.ManagedDataAccess.Types.OracleDecimal)(cmd.Parameters["travelRequestId"].Value)).Value);
                        cmd.Dispose();
                    }                 
                else        
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
                    cmd.Dispose();
                    
                }
                    dbConn.Close();
                    dbConn.Dispose();
                }
            }
            catch (Exception ex)
            {

                //TODO : log the exception 
                 throw new Exception("Couldn't insert/update record into Travel Request - "+ex.Message);
            }

            return travelRequestId;
        }

        public string getUserName(DbConnection dbConn, int id)
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
                command.Dispose();
                dataReader.Close();
                return userName;
    
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
                command.Dispose();
                dataReader.Close();
                dbConn.Close();
                dbConn.Dispose();
            }
            return response;
        }

        public TravelRequest GetTravelRequestDetail(DbConnection dbConn, string travelRequestId)
        {
            TravelRequest response = null;
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
                command.Dispose();
                dataReader.Close();
                return response;
        }
        public List<TravelRequestDetails> GetTravelRequestList(int submittedBadgeNumber, int selectedRoleId)
        {
            List<TravelRequestDetails> response = new List<TravelRequestDetails>();

            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                if (selectedRoleId == 1 || selectedRoleId == 2)
                {
               
                    string query = string.Format("Select * from TRAVELREQUEST where BADGENUMBER= {0} AND SELECTEDROLEID ={1}", submittedBadgeNumber, selectedRoleId);
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
                                RequiredApprovers = GetApproversListByTravelRequestId(dbConn,Convert.ToInt32(dataReader["TravelRequestId"])),
                                LastApproveredByUser = getLastApproverName(dbConn,Convert.ToInt32(dataReader["TravelRequestId"])),
                                LastApprovedDateTime = getLastApproverDateTime(dbConn,Convert.ToInt32(dataReader["TravelRequestId"])),
                                EditActionVisible = EditActionEligible(dbConn,Convert.ToInt32(dataReader["TravelRequestId"])) ? true : false,
                                ViewActionVisible = true,
                                ApproveActionVisible = false,
                                Status = dataReader["STATUS"].ToString()
                            });
                        }
                    }
                    command.Dispose();
                    dataReader.Close();                  
                }                
                else
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
	                                                    )", submittedBadgeNumber);
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
                                RequiredApprovers = GetApproversListByTravelRequestId(dbConn,Convert.ToInt32(dataReader["TravelRequestId"])),
                                LastApproveredByUser = getLastApproverName(dbConn,Convert.ToInt32(dataReader["TravelRequestId"])),
                                LastApprovedDateTime = getLastApproverDateTime(dbConn,Convert.ToInt32(dataReader["TravelRequestId"])),
                                EditActionVisible = false,
                                ViewActionVisible = true,
                                ApproveActionVisible = getApprovalSatus(dbConn,Convert.ToInt32(dataReader["TravelRequestId"]), submittedBadgeNumber) ? true : false,
                                Status = dataReader["STATUS"].ToString()
                            });
                        }
                    }
                    command.Dispose();
                    dataReader.Close();                   
                }
                dbConn.Close();
                dbConn.Dispose();
                return response;
            }
        }

        private string getLastApproverDateTime(DbConnection dbConn,int travelRequestId)
        {
            string response = "";
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
            command.Dispose();
            dataReader.Close();
            return response;
        }

        private string getLastApproverName(DbConnection dbConn,int travelRequestId)
        {
            string response = "";
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
            command.Dispose();
            dataReader.Close();
            return response;
        }

        private string GetApproversListByTravelRequestId(DbConnection dbConn,int travelRequestId)
        {
            string response = string.Empty;  
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
            command.Dispose();
            dataReader.Close(); 
            return response;
        }

        public bool Approve(int badgeNumber, int travelRequestId, string comments)
        {
            string approvalOrderResult = string.Empty;
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                //Update travel request _approval
                OracleCommand cmd = new OracleCommand();
                cmd.Connection = (OracleConnection)dbConn;
                cmd.CommandText = string.Format(@"UPDATE  TRAVELREQUEST_APPROVAL SET                                                  
                                                    APPROVERCOMMENTS = :p1,
                                                    APPROVALSTATUS = :p2 ,
                                                    APPROVALDATETIME = :p3
                                                    WHERE TRAVELREQUESTID = {0} AND BADGENUMBER = {1} ", travelRequestId, badgeNumber);
                cmd.Parameters.Add(new OracleParameter("p1", comments));
                cmd.Parameters.Add(new OracleParameter("p2", ApprovalStatus.Approved.ToString()));
                cmd.Parameters.Add(new OracleParameter("p3", DateTime.Now));             
                var rowsUpdated = cmd.ExecuteNonQuery();
                cmd.Dispose();
                // Get the approval badgeNumber 
                var result = 0;
                string query = string.Format(@"SELECT
	                                                BADGENUMBER
                                                FROM
	                                                (
		                                                SELECT
			                                                BADGENUMBER
		                                                FROM
			                                                TRAVELREQUEST_APPROVAL
		                                                WHERE
			                                                TRAVELREQUESTID = {0}
		                                                AND APPROVALDATETIME IS NULL
		                                                ORDER BY
			                                                APPROVALORDER 
	                                                )
                                                WHERE
	                                                ROWNUM = 1", travelRequestId);
                OracleCommand cmd1 = new OracleCommand(query, (OracleConnection)dbConn);
                cmd1.CommandText = query;
                DbDataReader dataReader = cmd1.ExecuteReader();
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        result = Convert.ToInt32(dataReader["BADGENUMBER"].ToString());
                    }
                    // update travel request for the latest status 
                    cmd1.CommandText = string.Format(@"UPDATE  TRAVELREQUEST SET                                                  
                                                     STATUS = :p1 
                                                    WHERE TRAVELREQUESTID = {0}", travelRequestId);
                    cmd1.Parameters.Add(new OracleParameter("p1", ApprovalStatus.Pending.ToString()));
                    var rowsUpdated1 = cmd1.ExecuteNonQuery();
    
                    //Send Email for next approver
                    string link = string.Format("<a href=\"http://localhost:2462/\">here</a>");
                    string subject = string.Format(@"Travel Request Approval for Id - {0} ", travelRequestId);
                    string body = string.Format(@"Please visit Travel application website " + link + " to Approve/Reject for travel request Id : {0}", travelRequestId);
                    sendEmail(result.ToString(), body, subject);

                }
                else
                {
                    cmd1.Parameters.Add(new OracleParameter("p1", ApprovalStatus.Complete.ToString()));
                    var rowsUpdated1 = cmd1.ExecuteNonQuery();
                }
              
                cmd1.Dispose();
                dataReader.Close();
                dbConn.Close();
                dbConn.Dispose();
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
                                                    WHERE TRAVELREQUESTID = {0} AND BADGENUMBER = {1} ", travelRequestId, badgeNumber);
                cmd.Parameters.Add(new OracleParameter("p1", comments));
                cmd.Parameters.Add(new OracleParameter("p2", ApprovalStatus.Rejected.ToString()));
                cmd.Parameters.Add(new OracleParameter("p3", DateTime.Now));
                var rowsUpdated = cmd.ExecuteNonQuery();
                cmd.Dispose();

                //Update travel request _approval
                OracleCommand cmd1 = new OracleCommand();
                cmd1.Connection = (OracleConnection)dbConn;
                // update travel request for the latest status 
                cmd1.CommandText = string.Format(@"UPDATE  TRAVELREQUEST SET                                                  
                                                     STATUS = :p1 
                                                    WHERE TRAVELREQUESTID = {0}", travelRequestId);
 
                cmd1.Parameters.Add(new OracleParameter("p1", ApprovalStatus.Rejected.ToString()));
                
                var rowsUpdated1 = cmd1.ExecuteNonQuery();

                cmd1.Dispose();
                dbConn.Close();
                dbConn.Dispose();
            }


            return true;
        }

        public bool  getApprovalSatus(DbConnection dbConn,int travelRequestId , int approverBadgeNumber)
        {
            bool result = false;
            int response = 0;
            string query = string.Format(@"SELECT
	                                            *
                                            FROM
	                                            (
		                                            SELECT
			                                            BadgeNumber
		                                            FROM
			                                            TRAVELREQUEST_APPROVAL
		                                            WHERE
			                                            TRAVELREQUESTID = {0}
		                                            AND APPROVALDATETIME IS NULL
		                                            ORDER BY
			                                            APPROVALORDER
	                                            )
                                            WHERE
	                                            ROWNUM <= 1", travelRequestId);

            OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
            command.CommandText = query;
            DbDataReader dataReader = command.ExecuteReader();
            if (dataReader.HasRows)
            {
                while (dataReader.Read())
                {
                    response = Convert.ToInt32(dataReader["BADGENUMBER"].ToString());
                }
            }
            command.Dispose();
            dataReader.Close();
           
            if ( response == approverBadgeNumber)
            {
                result =  true;
            }

            return result;
        }

        public bool EditActionEligible(DbConnection dbConn,int travelRequestId)
        {
            string response = "";
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
            command.Dispose();
            dataReader.Close();

            if (response == ApprovalStatus.New.ToString())
            {
                return true;
            }
            return false;
            
        }

        public bool SaveTravelRequestInput(TravelRequestInput travelRequest)
        {
            string travelRequestId = string.Empty;
            int estimatedExpenseId = 0;
            try
            {
                //Validate basic information
                ValidateTravelRequestInfo(travelRequest.TravelRequestData);
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    // Insert or update travel request
                    travelRequestId = SaveTravelRequestNew(dbConn, travelRequest.TravelRequestData);
                    if (string.IsNullOrEmpty(travelRequestId))
                    {
                        throw new Exception("Couldn't save/update travel request information");
                    }

                    // Insert or update estimated expense
                    estimatedExpenseId = SaveEstimatedExpenseRequestNew(dbConn, travelRequest.EstimatedExpenseData);
                    if(estimatedExpenseId == 0)
                    {
                        throw new Exception("Couldn't save/update estimated expense information");
                    }
                    // Insert or update FIS expense

                    return true;

                }
                dbConn.Close();
                dbConn.Dispose();
            }
            catch (Exception ex)
            {

                //TODO : log the exception 
                throw new Exception("Couldn't save record into Travel Request - " + ex.Message);
            }
        }

        public  string SaveTravelRequestNew(DbConnection dbConn , TravelRequest travelRequest)
        {
            string travelRequestIdNew = string.Empty;
            try
            {
                var loginId = getUserName(dbConn, travelRequest.UserId);
                travelRequest.LoginId = loginId;
                    if (string.IsNullOrEmpty(travelRequest.TravelRequestIdNew))
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
                                                    STATUS,
                                                    SUBMITTEDBYBADGENUMBER
                                                )
                                                VALUES
                                                    (:p2,:p3,:p4,:p5,:p6,:p7,:p8,:p9,:p10,:p11,:p12,:p13,:p14,:P15) returning TRAVELREQUESTID into :travelRequestId";
                        cmd.Parameters.Add(new OracleParameter("p2", travelRequest.BadgeNumber));
                        cmd.Parameters.Add(new OracleParameter("p3", travelRequest.Name));
                        cmd.Parameters.Add(new OracleParameter("p4", travelRequest.Division));
                        cmd.Parameters.Add(new OracleParameter("p5", travelRequest.Section));
                        cmd.Parameters.Add(new OracleParameter("p6", travelRequest.Organization));
                        cmd.Parameters.Add(new OracleParameter("p7", travelRequest.MeetingLocation));
                        cmd.Parameters.Add(new OracleParameter("p8", travelRequest.MeetingBeginDateTime));
                        cmd.Parameters.Add(new OracleParameter("p9", travelRequest.DepartureDateTime));
                        cmd.Parameters.Add(new OracleParameter("p10", travelRequest.MeetingEndDateTime));
                        cmd.Parameters.Add(new OracleParameter("p11", travelRequest.ReturnDateTime));
                        cmd.Parameters.Add(new OracleParameter("p12", DateTime.Now));
                        cmd.Parameters.Add(new OracleParameter("p13", travelRequest.SelectedRoleId));
                        cmd.Parameters.Add(new OracleParameter("p14", ApprovalStatus.New.ToString()));
                        cmd.Parameters.Add(new OracleParameter("p14", travelRequest.SubmittedByBadgeNumber));
                        cmd.Parameters.Add("travelRequestId", OracleDbType.Int32, ParameterDirection.ReturnValue);
                        var rowsUpdated = cmd.ExecuteNonQuery();
                        travelRequestIdNew = cmd.Parameters["travelRequestId"].Value.ToString();
                        cmd.Dispose();
                    }
                    else
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
                                                WHERE TRAVELREQUESTID = {0}", travelRequest.TravelRequestId);
                        cmd.Parameters.Add(new OracleParameter("p2", travelRequest.BadgeNumber));
                        cmd.Parameters.Add(new OracleParameter("p3", travelRequest.Name));
                        cmd.Parameters.Add(new OracleParameter("p4", travelRequest.Division));
                        cmd.Parameters.Add(new OracleParameter("p5", travelRequest.Section));
                        cmd.Parameters.Add(new OracleParameter("p6", travelRequest.Organization));
                        cmd.Parameters.Add(new OracleParameter("p7", travelRequest.MeetingLocation));
                        cmd.Parameters.Add(new OracleParameter("p8", travelRequest.MeetingBeginDateTime));
                        cmd.Parameters.Add(new OracleParameter("p9", travelRequest.DepartureDateTime));
                        cmd.Parameters.Add(new OracleParameter("p10", travelRequest.MeetingEndDateTime));
                        cmd.Parameters.Add(new OracleParameter("p11", travelRequest.ReturnDateTime));
                        cmd.Parameters.Add(new OracleParameter("p12", DateTime.Now));
                        var rowsUpdated = cmd.ExecuteNonQuery();
                        travelRequestIdNew = travelRequest.TravelRequestId.ToString();
                        cmd.Dispose();
                    }
            }
            catch (Exception ex)
            {

                //TODO : log the exception 
                throw new Exception("Couldn't insert/update record into Travel Request - " + ex.Message);
            }

            return travelRequestIdNew;
        }

        public int SaveEstimatedExpenseRequestNew(DbConnection dbConn, EstimatedExpense request)
        {
            int estimatedExpenseId = 0;
            try
            {
                if (request.EstimatedExpenseId == 0)
                {
                    using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                    {
                        OracleCommand cmd = new OracleCommand();
                        cmd.Connection = (OracleConnection)dbConn;
                        cmd.CommandText = @"INSERT INTO TRAVELREQUEST_ESTIMATEDEXPENSE(
                        TRAVELREQUESTID,
                        ADVANCELODGING,
                        ADVANCEAIRFARE,
						ADVANCEREGISTRATION,
						ADVANCEMEALS,
						ADVANCECARRENTAL,
						ADVANCEMISCELLANEOUS,
						ADVANCETOTAL,
                        TOTALESTIMATEDLODGE,
                        TOTALESTIMATEDAIRFARE,
						TOTALESTIMATEDREGISTRATION,
						TOTALESTIMATEDMEALS,
						TOTALESTIMATEDCARRENTAL,
						TOTALESTIMATEDMISCELLANEOUS,
						TOTALESTIMATEDTOTAL,
                        HOTELNAMEANDADDRESS,
						SCHEDULE,
						PAYABLETOANDADDRESS,
						NOTE,
						AGENCYNAMEANDRESERVATION,
						SHUTTLE,
						CASHADVANCE,
						DATENEEDEDBY					 
						 ) VALUES (:p1 ,:p2,:p3,:p4,:p5,:p6,:p7,:p8,:p9,:p10,:p11,:p12,:p13,:p14,:p15,:p16,:p17,:p18,:p19,:p20,:p21,:p22,:p23 ) returning ESTIMATEDEXPENSEID into : estimatedExpenseId ";
                        cmd.Parameters.Add(new OracleParameter("p1", request.TravelRequestId));
                        cmd.Parameters.Add(new OracleParameter("p2", request.AdvanceLodging));
                        cmd.Parameters.Add(new OracleParameter("p3", request.AdvanceAirFare));
                        cmd.Parameters.Add(new OracleParameter("p4", request.AdvanceRegistration));
                        cmd.Parameters.Add(new OracleParameter("p5", request.AdvanceMeals));
                        cmd.Parameters.Add(new OracleParameter("p6", request.AdvanceCarRental));
                        cmd.Parameters.Add(new OracleParameter("p7", request.AdvanceMiscellaneous));
                        cmd.Parameters.Add(new OracleParameter("p8", request.AdvanceTotal));
                        cmd.Parameters.Add(new OracleParameter("p9", request.TotalEstimatedLodge));
                        cmd.Parameters.Add(new OracleParameter("p10", request.TotalEstimatedAirFare));
                        cmd.Parameters.Add(new OracleParameter("p11", request.TotalEstimatedRegistration));
                        cmd.Parameters.Add(new OracleParameter("p12", request.TotalEstimatedMeals));
                        cmd.Parameters.Add(new OracleParameter("p13", request.TotalEstimatedCarRental));
                        cmd.Parameters.Add(new OracleParameter("p14", request.TotalEstimatedMiscellaneous));
                        cmd.Parameters.Add(new OracleParameter("p15", request.TotalEstimatedTotal));
                        cmd.Parameters.Add(new OracleParameter("p16", request.HotelNameAndAddress));
                        cmd.Parameters.Add(new OracleParameter("p17", request.Schedule));
                        cmd.Parameters.Add(new OracleParameter("p18", request.PayableToAndAddress));
                        cmd.Parameters.Add(new OracleParameter("p19", request.Note));
                        cmd.Parameters.Add(new OracleParameter("p20", request.AgencyNameAndReservation));
                        cmd.Parameters.Add(new OracleParameter("p21", request.Shuttle));
                        cmd.Parameters.Add(new OracleParameter("p22", request.CashAdvance));
                        cmd.Parameters.Add(new OracleParameter("p23", request.DateNeededBy));
                        cmd.Parameters.Add("estimatedExpenseId", OracleDbType.Int32, ParameterDirection.ReturnValue);
                        var rowsUpdated = cmd.ExecuteNonQuery();
                        estimatedExpenseId = Decimal.ToInt32(((Oracle.ManagedDataAccess.Types.OracleDecimal)(cmd.Parameters["estimatedExpenseId"].Value)).Value);

                        cmd.Dispose();
                        dbConn.Close();
                        dbConn.Dispose();
                    }
                }
                else
                {
                    using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                    {
                        OracleCommand cmd = new OracleCommand();
                        cmd.Connection = (OracleConnection)dbConn;
                        cmd.CommandText = string.Format(@"UPDATE  TRAVELREQUEST_ESTIMATEDEXPENSE SET
                        TRAVELREQUESTID = :p1,
                        ADVANCELODGING = :p2,
                        ADVANCEAIRFARE = :p3,
						ADVANCEREGISTRATION = :p4,
						ADVANCEMEALS = :p5,
						ADVANCECARRENTAL = :p6,
						ADVANCEMISCELLANEOUS = :p7,
						ADVANCETOTAL = :p8,
                        TOTALESTIMATEDLODGE = :p9,
                        TOTALESTIMATEDAIRFARE = :p10,
						TOTALESTIMATEDREGISTRATION = :p11,
						TOTALESTIMATEDMEALS = :p12,
						TOTALESTIMATEDCARRENTAL = :p13,
						TOTALESTIMATEDMISCELLANEOUS = :p14,
						TOTALESTIMATEDTOTAL = :p15,
                        HOTELNAMEANDADDRESS = :p16,
						SCHEDULE = :p17,
						PAYABLETOANDADDRESS = :p18,
						NOTE = :p19,
						AGENCYNAMEANDRESERVATION = :p20,
						SHUTTLE = :p21,
						CASHADVANCE = :p22,
						DATENEEDEDBY  = :p23
                        WHERE TRAVELREQUESTID = {0}", request.TravelRequestId);
                        cmd.Parameters.Add(new OracleParameter("p1", request.TravelRequestId));
                        cmd.Parameters.Add(new OracleParameter("p2", request.AdvanceLodging));
                        cmd.Parameters.Add(new OracleParameter("p3", request.AdvanceAirFare));
                        cmd.Parameters.Add(new OracleParameter("p4", request.AdvanceRegistration));
                        cmd.Parameters.Add(new OracleParameter("p5", request.AdvanceMeals));
                        cmd.Parameters.Add(new OracleParameter("p6", request.AdvanceCarRental));
                        cmd.Parameters.Add(new OracleParameter("p7", request.AdvanceMiscellaneous));
                        cmd.Parameters.Add(new OracleParameter("p8", request.AdvanceTotal));
                        cmd.Parameters.Add(new OracleParameter("p9", request.TotalEstimatedLodge));
                        cmd.Parameters.Add(new OracleParameter("p10", request.TotalEstimatedAirFare));
                        cmd.Parameters.Add(new OracleParameter("p11", request.TotalEstimatedRegistration));
                        cmd.Parameters.Add(new OracleParameter("p12", request.TotalEstimatedMeals));
                        cmd.Parameters.Add(new OracleParameter("p13", request.TotalEstimatedCarRental));
                        cmd.Parameters.Add(new OracleParameter("p14", request.TotalEstimatedMiscellaneous));
                        cmd.Parameters.Add(new OracleParameter("p15", request.TotalEstimatedTotal));
                        cmd.Parameters.Add(new OracleParameter("p16", request.HotelNameAndAddress));
                        cmd.Parameters.Add(new OracleParameter("p17", request.Schedule));
                        cmd.Parameters.Add(new OracleParameter("p18", request.PayableToAndAddress));
                        cmd.Parameters.Add(new OracleParameter("p19", request.Note));
                        cmd.Parameters.Add(new OracleParameter("p20", request.AgencyNameAndReservation));
                        cmd.Parameters.Add(new OracleParameter("p21", request.Shuttle));
                        cmd.Parameters.Add(new OracleParameter("p22", request.CashAdvance));
                        cmd.Parameters.Add(new OracleParameter("p23", request.DateNeededBy));
                        var rowsUpdated = cmd.ExecuteNonQuery();
                        estimatedExpenseId = request.EstimatedExpenseId;
                        cmd.Dispose();
                        dbConn.Close();
                        dbConn.Dispose();
                    }
                }
            }
            catch (Exception ex)
            {

                throw new Exception("Could not save estimated expense successfully");
            }

            return estimatedExpenseId;
        }

        public TravelRequestInput GetTravelRequestDetailNew(string travelRequestId)
        {
            TravelRequest travelRequest = null;
            EstimatedExpense estimatedExpense = null;
            TravelRequestInput travelRequestInput = null;
            try
            {
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    travelRequest = GetTravelRequestDetail(dbConn, travelRequestId);
                    estimatedExpense = estimatedExpenseRepository.GetTravelRequestDetailNew(dbConn, travelRequestId);
                    dbConn.Close();
                    dbConn.Dispose();
                }
                travelRequestInput = new TravelRequestInput()
                {
                    TravelRequestData = travelRequest,
                    EstimatedExpenseData = estimatedExpense
                };
            }
            catch (Exception)
            {

                throw;
            }
            return travelRequestInput;
        }
    }
}