using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TravelApplication.Class.Common;
using TravelApplication.Common;
using TravelApplication.DAL.DBProvider;
using TravelApplication.Models;
using TravelApplication.Services;

namespace TravelApplication.DAL.Repositories
{
    public class ReimbursementRepository : IReimbursementRepository
    {
        private DbConnection dbConn;
        IEstimatedExpenseRepository estimatedExpenseRepository = new EstimatedExpenseRepository();
        IFISRepository fisRepository = new FISRepository();
        ITravelRequestRepository travelRequestRepository = new TravelRequestRepository();
        public List<TravelRequestDetails> GetApprovedTravelRequestList(int submittedBadgeNumber, int selectedRoleId)
        {
             
            try
            {
                List<TravelRequestDetails> response = new List<TravelRequestDetails>();

                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    if (selectedRoleId == 1 || selectedRoleId == 2)
                    {

                        string query = string.Format("Select * from TRAVELREQUEST where BADGENUMBER= {0} AND SELECTEDROLEID ={1} AND STATUS = '{2}' order by CREATIONDATETIME desc", submittedBadgeNumber, selectedRoleId, ApprovalStatus.Complete);
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
                                    //Description = dataReader["PURPOSE"].ToString(),
                                    SubmittedByUser = dataReader["SUBMITTEDBYUSERNAME"].ToString(),
                                    SubmittedDateTime = dataReader["SUBMITTEDDATETIME"].ToString(),
                                    RequiredApprovers = GetApproversListByTravelRequestId(dbConn, Convert.ToInt32(dataReader["TravelRequestId"])),
                                    LastApproveredByUser = getLastApproverName(dbConn, Convert.ToInt32(dataReader["TravelRequestId"])),
                                    LastApprovedDateTime = getLastApproverDateTime(dbConn, Convert.ToInt32(dataReader["TravelRequestId"])),
                                    EditActionVisible = EditActionEligible(dbConn, Convert.ToInt32(dataReader["TravelRequestId"])) ? true : false,
                                    ViewActionVisible = true,
                                    ApproveActionVisible = false,
                                    Status = dataReader["STATUS"].ToString(),
                                    Purpose = dataReader["PURPOSE"].ToString()
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
	                                                        )   order by CREATIONDATETIME desc", submittedBadgeNumber);
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
                                    Description = dataReader["Purpose"].ToString(),
                                    SubmittedByUser = dataReader["SUBMITTEDBYUSERNAME"].ToString(),
                                    SubmittedDateTime = dataReader["SUBMITTEDDATETIME"].ToString(),
                                    RequiredApprovers = GetApproversListByTravelRequestId(dbConn, Convert.ToInt32(dataReader["TravelRequestId"])),
                                    LastApproveredByUser = getLastApproverName(dbConn, Convert.ToInt32(dataReader["TravelRequestId"])),
                                    LastApprovedDateTime = getLastApproverDateTime(dbConn, Convert.ToInt32(dataReader["TravelRequestId"])),
                                    EditActionVisible = false,
                                    ViewActionVisible = true,
                                    ApproveActionVisible = getApprovalSatus(dbConn, Convert.ToInt32(dataReader["TravelRequestId"]), submittedBadgeNumber) ? true : false,
                                    Status = dataReader["STATUS"].ToString(),
                                    Purpose = dataReader["Purpose"].ToString()
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
            catch (Exception ex)
            {
                LogMessage.Log("GetTravelRequestList : " + ex.Message);
                throw;
            }
        }

        public ReimbursementAllTravelInformation GetTravelRequestInfoForReimbursement(string travelRequestId)
        {
            ReimbursementTravelRequestDetails travelReimbursementDetails = null;
            EstimatedExpense estimatedExpense = null;
            FIS fisDetails = null;
            ReimbursementAllTravelInformation travelRequestReimbursementDetails = null;

            try
            {
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    travelReimbursementDetails = GetTravelReimbursementDetails(dbConn, travelRequestId);
                    estimatedExpense = estimatedExpenseRepository.GetTravelRequestDetailNew(dbConn, travelRequestId);
                    fisDetails = fisRepository.GetFISdetails(dbConn, travelRequestId);
                    dbConn.Close();
                    dbConn.Dispose();
                }
                travelRequestReimbursementDetails = new ReimbursementAllTravelInformation()
                {
                    TravelReimbursementDetails = travelReimbursementDetails,
                    Fis = fisDetails,
                    CashAdvance = estimatedExpense.CashAdvance
                };
            }
            catch (Exception ex)
            {
                LogMessage.Log("Error while getting travel request details - " + ex.Message);
                throw;
            }

            return travelRequestReimbursementDetails;
        }

        public ReimbursementTravelRequestDetails GetTravelReimbursementDetails(DbConnection dbConn, string travelRequestId)
        {
            try
            {

                ReimbursementTravelRequestDetails response = null;
                string query = string.Format("Select * from TRAVELREQUEST where TRAVELREQUESTID= {0}", travelRequestId);
                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();

                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {

                        response = new ReimbursementTravelRequestDetails()
                        {
                            BadgeNumber = Convert.ToInt32(dataReader["BADGENUMBER"]),
                            Name = dataReader["NAME"].ToString(),
                            Division = dataReader["DIVISION"].ToString(),
                            DepartureDateTime = Convert.ToDateTime(dataReader["DEPARTUREDATETIME"]),
                            ReturnDateTime = Convert.ToDateTime(dataReader["RETURNDATETIME"])
                        };
                    }

                    var employeeDetails = travelRequestRepository.GetEmployeeDetails(response.BadgeNumber);
                    response.CostCenterId = employeeDetails.Result.CostCenter;
                    response.Department = employeeDetails.Result.Department;
                    response.Extension = employeeDetails.Result.EmployeeWorkPhone;
                    response.VendorNumber = travelRequestRepository.GetVendorNumber(response.BadgeNumber).Result;
                }
                else
                {
                    throw new Exception("Couldn't retrieve travel request");
                }
                command.Dispose();
                dataReader.Close();
                return response;

            }
            catch (Exception ex)
            {
                LogMessage.Log("GetTravelRequestDetail : " + ex.Message);
                throw;
            }
        }

        public string GetVendorId(DbConnection dbConn, int badgeNumber)
        {
            throw new NotImplementedException();
        }


        public Task<int> SaveTravelRequestReimbursement(ReimbursementInput reimbursementRequest)
        {
            //string travelRequestId = string.Empty;
            //int estimatedExpenseId = 0;
            //TravelRequestInputResponse response = null;
            //try
            //{
            //    //Validate basic information


            //    using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            //    {
            //        // Insert or update travel request
            //        travelRequestId = SaveReimbursementTravelRequestDetails(dbConn, reimbursementRequest.reimbursementDetails);
            //        if (string.IsNullOrEmpty(travelRequestId))
            //        {
            //            throw new Exception("Couldn't save/update travel request information");
            //        }

            //        // Insert or update estimated expense
            //        //estimatedExpenseId = SaveEstimatedExpenseRequestNew(dbConn, reimbursementRequest.EstimatedExpenseData, travelRequestId);
            //        //if (estimatedExpenseId == 0)
            //        //{
            //        //    throw new Exception("Couldn't save/update estimated expense information");
            //        //}
            //        //// Insert or update FIS expense
            //        //SaveFISData(dbConn, reimbursementRequest.fis, travelRequestId);

            //        //response = new TravelRequestInputResponse() { TravelRequestId = travelRequestId, BadgeNumber = travelRequest.TravelRequestData.BadgeNumber };

            //        return response;

            //    }
            //    dbConn.Close();
            //    dbConn.Dispose();
            //}
            //catch (Exception ex)
            //{
            //    LogMessage.Log("SaveTravelRequestInput : " + ex.Message);
            //    throw new Exception("Couldn't save record into Travel Request - ");
            //}
            return null;
        }

        public string SaveReimbursementTravelRequestDetails(DbConnection dbConn, ReimbursementDetails reimbursementDetails)
        {
            throw new NotImplementedException();
        }


        private string GetApproversListByTravelRequestId(DbConnection dbConn, int travelRequestId)
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

        private string getLastApproverName(DbConnection dbConn, int travelRequestId)
        {
            string response = "";
            string query = string.Format(@"select APPROVERNAME from (
                                                                    SELECT
	                                                                    APPROVERNAME
                                                                    FROM
	                                                                    TRAVELREQUEST_APPROVAL
                                                                    WHERE
	                                                                    TRAVELREQUESTID = {0}
                                                                    AND APPROVALDATETIME IS NOT NULL
                                                                    ORDER BY
	                                                                    APPROVALDATETIME desc )
                                                                    where ROWNUM =1", travelRequestId);

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

        private string getLastApproverDateTime(DbConnection dbConn, int travelRequestId)
        {
            string response = "";
            string query = string.Format(@"Select ApprovalDateTime from (
                                            SELECT
	                                        APPROVALDATETIME
                                        FROM
	                                        TRAVELREQUEST_APPROVAL
                                        WHERE
	                                        TRAVELREQUESTID = {0}
                                        AND APPROVALDATETIME IS NOT NULL
                                        ORDER BY
	                                        APPROVALDATETIME DESC)
                                            where ROWNUM =1", travelRequestId);

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

        public bool getApprovalSatus(DbConnection dbConn, int travelRequestId, int approverBadgeNumber)
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

            if (response == approverBadgeNumber)
            {
                result = true;
            }

            return result;
        }
        public bool EditActionEligible(DbConnection dbConn, int travelRequestId)
        {
            string response = "";
            string query = string.Format(@"SELECT
	                                        STATUS
                                        FROM
	                                        TRAVELREQUEST 
                                        WHERE
	                                        TRAVELREQUESTID = {0}  ", travelRequestId);

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
    }
}