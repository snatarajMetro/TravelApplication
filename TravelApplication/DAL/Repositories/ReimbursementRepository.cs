using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
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
    public class ReimbursementRepository : ApprovalRepository, IReimbursementRepository
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
                            TravelRequestId = travelRequestId,
                            BadgeNumber = Convert.ToInt32(dataReader["BADGENUMBER"]),
                            Name = dataReader["NAME"].ToString(),
                            Division = dataReader["DIVISION"].ToString(),
                            DepartureDateTime = Convert.ToDateTime(dataReader["DEPARTUREDATETIME"]),
                            ReturnDateTime = Convert.ToDateTime(dataReader["RETURNDATETIME"])
                        };
                    }

                    var employeeDetails = travelRequestRepository.GetEmployeeDetails(response.BadgeNumber);
                    response.CostCenterId = (employeeDetails.Result.CostCenter  ?? string.Empty);
                    response.Department = (employeeDetails.Result.Department  ?? string.Empty);
                    response.Extension = (employeeDetails.Result.EmployeeWorkPhone  ?? string.Empty);
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


        public string SaveTravelRequestReimbursement(ReimbursementInput reimbursementRequest)
        {
            string reimbursementId = string.Empty;
             
           
            try
            {
                //Validate basic information


                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    // Insert or update travel request in  reimbursement 
                    reimbursementId = SaveReimbursementTravelRequestDetails(dbConn, reimbursementRequest.ReimbursementTravelRequestDetails);
                    if (string.IsNullOrEmpty(reimbursementId))
                    {
                        throw new Exception("Couldn't save/update travel request information");
                    }

                    // Insert or update estimated expense
                     SaveReimburse(dbConn, reimbursementRequest.ReimbursementDetails);

                    // Insert or update FIS expense
                     SaveFISData(dbConn, reimbursementRequest.FIS, reimbursementRequest.ReimbursementTravelRequestDetails.TravelRequestId);
                  

                    return reimbursementId;

                }
                dbConn.Close();
                dbConn.Dispose();
            }
            catch (Exception ex)
            {
                LogMessage.Log("SaveTravelRequestInput : " + ex.Message);
                throw new Exception("Couldn't save record into Travel Request - ");
            }
            return reimbursementId;
        }

        public void SaveReimburse(DbConnection dbConn, ReimbursementDetails reimbursementDetails)
        {
            try
            {
                    foreach (var reimbursement in reimbursementDetails.Reimbursement)
                    {
                        if (!CheckReimburseDataExists(dbConn, reimbursement.Id))
                        {
                            OracleCommand cmd = new OracleCommand();
                            cmd.Connection = (OracleConnection)dbConn;
                            cmd.CommandText = string.Format(@"INSERT INTO REIMBURSE (                                                  
                                                                TRAVELREQUESTID,
                                                                RDATE ,
                                                                CITYSTATEANDBUSINESSPURPOSE ,
                                                                MILES ,
                                                                MILEAGETOWORK ,
                                                                BUSINESSMILES ,
                                                                BUSINESSMILESXRATE,
                                                                PARKINGANDGAS,
                                                                AIRFARE ,
                                                                TAXIRAIL ,
                                                                LODGE ,
                                                                MEALS ,
                                                                REGISTRATION ,
                                                                INTERNET,
                                                                OTHERS,
                                                                DAILYTOTAL ,
                                                                TOTALMILES ,
                                                                TOTALMILEAGETOWORK ,
                                                                TOTALBUSINESSMILES ,
                                                                TOTALBUSINESSMILESXRATE ,
                                                                TOTALPARKIMGGAS,
                                                                TOTALAIRFARE,
                                                                TOTALTAXIRAIL ,
                                                                TOTALLODGE ,
                                                                TOTALMEALS ,
                                                                TOTALREGISTRATION ,
                                                                TOTALINTERNET ,
                                                                TOTALOTHER,
                                                                TOTALDAILYTOTAL,
                                                                TOTALPART1TRAVELEXPENSES ,
                                                                TOTALPART2TRAVELEXPENSES ,
                                                                TOTALEXPSUBMITTEDFORAPPROVAL ,
                                                                SUBTRACTPAIDBYMTA ,
                                                                TOTALEXPENSES ,
                                                                SUBTRACTCASHADVANCE,
                                                                TOTAL
                                                            )
                                                            VALUES
                                                                (:p1,:p2,:p3,:p4,:p5,:p6,:p7,:p8,:p9,:p10,:p11,:p12,:p13,:p14,:p15,:p16,:p17,:p18,:p19,:p20,:p21,:p22,:p23,:p24,:p25,:p26,:p27,:p28,:p29,:p30,:p31,:p32,:p33,:p34,:p35,:p36)");
                            cmd.Parameters.Add(new OracleParameter("p1", reimbursement.TravelRequestId));
                            cmd.Parameters.Add(new OracleParameter("p2", reimbursement.Date));
                            cmd.Parameters.Add(new OracleParameter("p3", reimbursement.CityStateAndBusinessPurpose));
                            cmd.Parameters.Add(new OracleParameter("p4", reimbursement.Miles));
                            cmd.Parameters.Add(new OracleParameter("p5", reimbursement.MileageToWork));
                            cmd.Parameters.Add(new OracleParameter("p6", reimbursement.BusinessMiles));
                            cmd.Parameters.Add(new OracleParameter("p7", reimbursement.BusinessMilesXRate));
                            cmd.Parameters.Add(new OracleParameter("p8", reimbursement.ParkingAndGas));
                            cmd.Parameters.Add(new OracleParameter("p9", reimbursement.AirFare));
                            cmd.Parameters.Add(new OracleParameter("p10", reimbursement.TaxiRail));
                            cmd.Parameters.Add(new OracleParameter("p11", reimbursement.Lodge));
                            cmd.Parameters.Add(new OracleParameter("p12", reimbursement.Meals));
                            cmd.Parameters.Add(new OracleParameter("p13", reimbursement.Registration));
                            cmd.Parameters.Add(new OracleParameter("p14", reimbursement.Internet));
                            cmd.Parameters.Add(new OracleParameter("p15", reimbursement.Others));
                            cmd.Parameters.Add(new OracleParameter("p16", reimbursement.DailyTotal));
                            cmd.Parameters.Add(new OracleParameter("p17", reimbursementDetails.TotalMiles));
                            cmd.Parameters.Add(new OracleParameter("p18", reimbursementDetails.TotalMileageToWork));
                            cmd.Parameters.Add(new OracleParameter("p19", reimbursementDetails.TotalBusinessMiles));
                            cmd.Parameters.Add(new OracleParameter("p20", reimbursementDetails.TotalBusinessMilesXRate));
                            cmd.Parameters.Add(new OracleParameter("p21", reimbursementDetails.TotalParkingGas));
                            cmd.Parameters.Add(new OracleParameter("p22", reimbursementDetails.TotalAirFare));
                            cmd.Parameters.Add(new OracleParameter("p23", reimbursementDetails.TotalTaxiRail));
                            cmd.Parameters.Add(new OracleParameter("p24", reimbursementDetails.TotalLodge));
                            cmd.Parameters.Add(new OracleParameter("p25", reimbursementDetails.TotalMeals));
                            cmd.Parameters.Add(new OracleParameter("p26", reimbursementDetails.TotalRegistration));
                            cmd.Parameters.Add(new OracleParameter("p27", reimbursementDetails.TotalInternet));
                            cmd.Parameters.Add(new OracleParameter("p28", reimbursementDetails.TotalOther));
                            cmd.Parameters.Add(new OracleParameter("p29", reimbursementDetails.TotalDailyTotal));
                            cmd.Parameters.Add(new OracleParameter("p30", reimbursementDetails.TotalPart1TravelExpenses));
                            cmd.Parameters.Add(new OracleParameter("p31", reimbursementDetails.TotalPart2TravelExpenses));
                            cmd.Parameters.Add(new OracleParameter("p32", reimbursementDetails.TotalExpSubmittedForApproval));
                            cmd.Parameters.Add(new OracleParameter("p33", reimbursementDetails.SubtractPaidByMTA));
                            cmd.Parameters.Add(new OracleParameter("p34", reimbursementDetails.TotalExpenses));
                            cmd.Parameters.Add(new OracleParameter("p35", reimbursementDetails.SubtractCashAdvance));
                            cmd.Parameters.Add(new OracleParameter("p36", reimbursementDetails.Total));

                            var rowsUpdated = cmd.ExecuteNonQuery();
                            cmd.Dispose();
                        }
                else
                {
                         OracleCommand cmd = new OracleCommand();
                        cmd.Connection = (OracleConnection)dbConn;
                        cmd.CommandText = string.Format(@"UPDATE REIMBURSE SET                                                  
                                                        TRAVELREQUESTID = :p1,
                                                        RDATE= :p2,
                                                        CITYSTATEANDBUSINESSPURPOSE = :p3,
                                                        MILES = :p4,
                                                        MILEAGETOWORK = :p5,
                                                        BUSINESSMILES = :p6,
                                                        BUSINESSMILESXRATE= :p7,
                                                        PARKINGANDGAS= :p8,
                                                        AIRFARE= :p9,
                                                        TAXIRAIL = :p10,
                                                        LODGE = :p11,
                                                        MEALS = :p12,
                                                        REGISTRATION = :p13,
                                                        INTERNET= :p14,
                                                        OTHERS= :p15,
                                                        DAILYTOTAL = :p16,
                                                        TOTALMILES = :p17,
                                                        TOTALMILEAGETOWORK = :p18,
                                                        TOTALBUSINESSMILES = :p19,
                                                        TOTALBUSINESSMILESXRATE = :p20,
                                                        TOTALPARKIMGGAS= :p21,
                                                        TOTALAIRFARE= :p22,
                                                        TOTALTAXIRAIL = :p23,
                                                        TOTALLODGE = :p24,
                                                        TOTALMEALS = :p25,
                                                        TOTALREGISTRATION = :p26,
                                                        TOTALINTERNET= :p27,
                                                        TOTALOTHER= :p28,
                                                        TOTALDAILYTOTAL= :p29,
                                                        TOTALPART1TRAVELEXPENSES = :p30,
                                                        TOTALPART2TRAVELEXPENSES = :p31,
                                                        TOTALEXPSUBMITTEDFORAPPROVAL = :p32,
                                                        SUBTRACTPAIDBYMTA= :p33,
                                                        TOTALEXPENSES = :p34,
                                                        SUBTRACTCASHADVANCE= :p35,
                                                        TOTAL = :36
                                                        WHERE ID = {0}", reimbursement.Id);
                        cmd.Parameters.Add(new OracleParameter("p1", reimbursement.TravelRequestId));
                        cmd.Parameters.Add(new OracleParameter("p2", reimbursement.Date));
                        cmd.Parameters.Add(new OracleParameter("p3", reimbursement.CityStateAndBusinessPurpose));
                        cmd.Parameters.Add(new OracleParameter("p4", reimbursement.Miles));
                        cmd.Parameters.Add(new OracleParameter("p5", reimbursement.MileageToWork));
                        cmd.Parameters.Add(new OracleParameter("p6", reimbursement.BusinessMiles));
                        cmd.Parameters.Add(new OracleParameter("p7", reimbursement.BusinessMilesXRate));
                        cmd.Parameters.Add(new OracleParameter("p8", reimbursement.ParkingAndGas));
                        cmd.Parameters.Add(new OracleParameter("p9", reimbursement.AirFare));
                        cmd.Parameters.Add(new OracleParameter("p10", reimbursement.TaxiRail));
                        cmd.Parameters.Add(new OracleParameter("p11", reimbursement.Lodge));
                        cmd.Parameters.Add(new OracleParameter("p12", reimbursement.Meals));
                        cmd.Parameters.Add(new OracleParameter("p13", reimbursement.Registration));
                        cmd.Parameters.Add(new OracleParameter("p14", reimbursement.Internet));
                        cmd.Parameters.Add(new OracleParameter("p15", reimbursement.Others));
                        cmd.Parameters.Add(new OracleParameter("p16", reimbursement.DailyTotal));
                        cmd.Parameters.Add(new OracleParameter("p17", reimbursementDetails.TotalMiles));
                        cmd.Parameters.Add(new OracleParameter("p18", reimbursementDetails.TotalMileageToWork));
                        cmd.Parameters.Add(new OracleParameter("p19", reimbursementDetails.TotalBusinessMiles));
                        cmd.Parameters.Add(new OracleParameter("p20", reimbursementDetails.TotalBusinessMilesXRate));
                        cmd.Parameters.Add(new OracleParameter("p21", reimbursementDetails.TotalParkingGas));
                        cmd.Parameters.Add(new OracleParameter("p22", reimbursementDetails.TotalAirFare));
                        cmd.Parameters.Add(new OracleParameter("p23", reimbursementDetails.TotalTaxiRail));
                        cmd.Parameters.Add(new OracleParameter("p24", reimbursementDetails.TotalLodge));
                        cmd.Parameters.Add(new OracleParameter("p25", reimbursementDetails.TotalMeals));
                        cmd.Parameters.Add(new OracleParameter("p26", reimbursementDetails.TotalRegistration));
                        cmd.Parameters.Add(new OracleParameter("p27", reimbursementDetails.TotalInternet));
                        cmd.Parameters.Add(new OracleParameter("p28", reimbursementDetails.TotalOther));
                        cmd.Parameters.Add(new OracleParameter("p29", reimbursementDetails.TotalDailyTotal));
                        cmd.Parameters.Add(new OracleParameter("p30", reimbursementDetails.TotalPart1TravelExpenses));
                        cmd.Parameters.Add(new OracleParameter("p31", reimbursementDetails.TotalPart2TravelExpenses));
                        cmd.Parameters.Add(new OracleParameter("p32", reimbursementDetails.TotalExpSubmittedForApproval));
                        cmd.Parameters.Add(new OracleParameter("p33", reimbursementDetails.SubtractPaidByMTA));
                        cmd.Parameters.Add(new OracleParameter("p34", reimbursementDetails.TotalExpenses));
                        cmd.Parameters.Add(new OracleParameter("p35", reimbursementDetails.SubtractCashAdvance));
                        cmd.Parameters.Add(new OracleParameter("p36", reimbursementDetails.Total));

                        var rowsUpdated = cmd.ExecuteNonQuery();
                        cmd.Dispose();
                    }
                    }
            }
            catch (Exception ex)
            {

                LogMessage.Log("Save Reimburse : " + ex.Message);
                throw new Exception("Couldn't save record into Reimburse ");
            }
        }

        private bool CheckReimburseDataExists(DbConnection dbConn, int id)
        {
            bool result = false;
            string query = string.Format(@"Select * from REIMBURSE where ID = {0}", id);
            OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
            command.CommandText = query;
            DbDataReader dataReader = command.ExecuteReader();
            string userName = string.Empty;
            if (dataReader != null && dataReader.HasRows == true)
            {
                result = true;
            }
            else
            {
                result = false;
            }
            command.Dispose();
            dataReader.Close();
            return result;
        }

        private string SaveReimbursementTravelRequestDetails(DbConnection dbConn, ReimbursementTravelRequestDetails reimbursementDetails)
        {
            string reimbursementId = string.Empty;
            try
            {
                if (string.IsNullOrEmpty(reimbursementDetails.ReimbursementId))
                {
                    OracleCommand cmd = new OracleCommand();
                    cmd.Connection = (OracleConnection)dbConn;
                    cmd.CommandText = @"INSERT INTO REIMBURSE_TRAVELREQUEST(
                                            TRAVELREQUESTID,
                                            BADGENUMBER,
                                            NAME,
                                            EXT,
                                            DIVISION,
                                            DEPARTMENT,
                                            DEPARTUREDATETIME,
                                            RETURNDATETIME,
                                            CREATIONDATETIME, 
                                            SELECTEDROLEID,
                                            SUBMITTEDBYBADGENUMBER,
                                            SUBMITTEDDATETIME,
                                            STATUS
                                            )
                                            VALUES
                                            (:p1,:p2,:p3,:p4,:p5,:p6,:p7,:p8,:p9,:p10,:p11,:p12,:p13) returning REIMBURSEMENTID into :reimbursementId";
                    cmd.Parameters.Add(new OracleParameter("p1", reimbursementDetails.TravelRequestId));
                    cmd.Parameters.Add(new OracleParameter("p2", reimbursementDetails.BadgeNumber));
                    cmd.Parameters.Add(new OracleParameter("p3", reimbursementDetails.Name));
                    cmd.Parameters.Add(new OracleParameter("p4", reimbursementDetails.Extension));
                    cmd.Parameters.Add(new OracleParameter("p5", reimbursementDetails.Division));
                    cmd.Parameters.Add(new OracleParameter("p6", reimbursementDetails.Department));
                    cmd.Parameters.Add(new OracleParameter("p7", reimbursementDetails.DepartureDateTime));
                    cmd.Parameters.Add(new OracleParameter("p8", reimbursementDetails.ReturnDateTime));
                    cmd.Parameters.Add(new OracleParameter("p9", DateTime.Now));
                    cmd.Parameters.Add(new OracleParameter("p10", reimbursementDetails.SelectedRoleId));
                    cmd.Parameters.Add(new OracleParameter("p11", reimbursementDetails.SubmittedByBadgeNumber));
                    cmd.Parameters.Add(new OracleParameter("p12", DateTime.Now));
                    cmd.Parameters.Add(new OracleParameter("p13", ApprovalStatus.New.ToString()));
                    cmd.Parameters.Add("reimbursementId", OracleDbType.Int32, ParameterDirection.ReturnValue);
                    var rowsUpdated = cmd.ExecuteNonQuery();
                    reimbursementId = cmd.Parameters["reimbursementId"].Value.ToString();
                    cmd.Dispose();
                }
                else
                {
                    OracleCommand cmd = new OracleCommand();
                    cmd.Connection = (OracleConnection)dbConn;
                    cmd.CommandText = string.Format(@"UPDATE  REIMBURSE_TRAVELREQUEST SET (
                                                        TRAVELREQUESTID = :p1 ,
                                                        BADGENUMBER = :p2,
                                                        NAME =:p3,
                                                        EXT =:p4
                                                        DIVISION =:p5,
                                                        DEPARTMENT = :p6,
                                                        DEPARTUREDATETIME = :p7,
                                                        RETURNDATETIME = :p8,
                                                        LASTUPDATEDDATETIME = :p9                                                                                        ,
                                                        WHERE REIMBURSEMENTID = {0}", reimbursementDetails.ReimbursementId);
                    cmd.Parameters.Add(new OracleParameter("p1", reimbursementDetails.TravelRequestId));
                    cmd.Parameters.Add(new OracleParameter("p2", reimbursementDetails.BadgeNumber));
                    cmd.Parameters.Add(new OracleParameter("p3", reimbursementDetails.Name));
                    cmd.Parameters.Add(new OracleParameter("p4", reimbursementDetails.Extension));
                    cmd.Parameters.Add(new OracleParameter("p5", reimbursementDetails.Division));
                    cmd.Parameters.Add(new OracleParameter("p6", reimbursementDetails.Department));
                    cmd.Parameters.Add(new OracleParameter("p7", reimbursementDetails.DepartureDateTime));
                    cmd.Parameters.Add(new OracleParameter("p8", reimbursementDetails.ReturnDateTime));
                    cmd.Parameters.Add(new OracleParameter("p9", DateTime.Now));
                    var rowsUpdated = cmd.ExecuteNonQuery();
                    reimbursementId = reimbursementDetails.ReimbursementId;
                    cmd.Dispose();

                }
            }
            catch (Exception ex)
            {

                LogMessage.Log("Save Travel request for reimbursement  : " + ex.Message);
                throw new Exception("Couldn't insert/update record into Travel Request for Reimburse - ");
            }

            return reimbursementId;
             
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
        public bool getReimburseApprovalSatus(DbConnection dbConn, int travelRequestId, int approverBadgeNumber)
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
			                                            REIMBURSE_APPROVAL
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

        public void SaveFISData(DbConnection dbConn, FIS request, string travelRequestId)
        {
            try
            {
                if (!CheckFISDataExistsInReimburse(dbConn, travelRequestId))
                {
                    foreach (var fis in request.FISDetails)
                    {
                        OracleCommand cmd = new OracleCommand();
                        cmd.Connection = (OracleConnection)dbConn;
                        cmd.CommandText = string.Format(@"INSERT INTO REIMBURSE_FIS (                                                  
                                                        TRAVELREQUESTID,
                                                        COSTCENTERID ,
                                                        LINEITEM ,
                                                        PROJECTID ,
                                                        TASK ,
                                                        AMOUNT ,
                                                        TOTALAMOUNT 
                                                    )
                                                    VALUES
                                                        (:p1,:p2,:p3,:p4,:p5,:p6,:p7)");
                        cmd.Parameters.Add(new OracleParameter("p1", travelRequestId));
                        cmd.Parameters.Add(new OracleParameter("p2", fis.CostCenterId));
                        cmd.Parameters.Add(new OracleParameter("p3", fis.LineItem));
                        cmd.Parameters.Add(new OracleParameter("p4", fis.ProjectId));
                        cmd.Parameters.Add(new OracleParameter("p5", fis.Task));
                        cmd.Parameters.Add(new OracleParameter("p6", fis.Amount));
                        cmd.Parameters.Add(new OracleParameter("p7", request.TotalAmount));
                        var rowsUpdated = cmd.ExecuteNonQuery();
                        cmd.Dispose();
                    }
                }
                else
                {

                    foreach (var fis in request.FISDetails)
                    {
                        OracleCommand cmd = new OracleCommand();
                        cmd.Connection = (OracleConnection)dbConn;
                        cmd.CommandText = string.Format(@"UPDATE  REIMBURSE_FIS SET                                                  
                                                TRAVELREQUESTID = :p1,
                                                        COSTCENTERID =:p2,
                                                        LINEITEM =:p3,
                                                        PROJECTID =:p4,
                                                        TASK =:p5,
                                                        AMOUNT =:p6,
                                                        TOTALAMOUNT =:p7
                                                WHERE TRAVELREQUESTID = {0}", travelRequestId);
                        cmd.Parameters.Add(new OracleParameter("p1", travelRequestId));
                        cmd.Parameters.Add(new OracleParameter("p2", fis.CostCenterId));
                        cmd.Parameters.Add(new OracleParameter("p3", fis.LineItem));
                        cmd.Parameters.Add(new OracleParameter("p4", fis.ProjectId));
                        cmd.Parameters.Add(new OracleParameter("p5", fis.Task));
                        cmd.Parameters.Add(new OracleParameter("p6", fis.Amount));
                        cmd.Parameters.Add(new OracleParameter("p7", request.TotalAmount));
                        var rowsUpdated = cmd.ExecuteNonQuery();
                        cmd.Dispose();
                    }
                }
            }
            catch (Exception ex)
            {
                LogMessage.Log("SaveFISData : " + ex.Message);
                throw new Exception("Couldn't insert/update record into Travel Request ");
            }


        }

        public bool CheckFISDataExistsInReimburse(DbConnection dbConn, string travelRequestId)
        {
            bool result = false;
            string query = string.Format(@"Select * from REIMBURSE_FIS where travelRequestId = {0}", travelRequestId);
            OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
            command.CommandText = query;
            DbDataReader dataReader = command.ExecuteReader();
            string userName = string.Empty;
            if (dataReader != null && dataReader.HasRows == true)
            {
                result = true;
            }
            else
            {
                result = false;
            }
            command.Dispose();
            dataReader.Close();
            return result;
        }

        public List<ReimburseGridDetails> GetReimbursementRequestsList(int badgeNumber, int selectedRoleId)
        {
            try
            {
                List<ReimburseGridDetails> response = new List<ReimburseGridDetails>();

                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    if (selectedRoleId == 1 || selectedRoleId == 2)
                    {

                        string query = string.Format("Select * from REIMBURSE_TRAVELREQUEST where BADGENUMBER= {0} AND SELECTEDROLEID ={1}  order by CREATIONDATETIME desc", badgeNumber, selectedRoleId);
                        OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                        command.CommandText = query;
                        DbDataReader dataReader = command.ExecuteReader();
                        if (dataReader.HasRows)
                        {
                            while (dataReader.Read())
                            {
                                response.Add(new ReimburseGridDetails()
                                {
                                    TravelRequestId = dataReader["TravelRequestId"].ToString(),
                                    //Description = dataReader["PURPOSE"].ToString(),
                                    SubmittedByUser = dataReader["SUBMITTEDBYUSERNAME"].ToString(),
                                    SubmittedDateTime = Convert.ToDateTime(dataReader["SUBMITTEDDATETIME"]),
                                    RequiredApprovers = GetReimburseApproversListByTravelRequestId(dbConn, dataReader["TravelRequestId"].ToString()),
                                    LastApprovedByUser = getReimburseLastApproverName(dbConn, dataReader["TravelRequestId"].ToString()),
                                    LastApprovedDateTime = getReimburseLastApproverDateTime(dbConn, dataReader["TravelRequestId"].ToString()),
                                    EditActionVisible = ReimburseEditActionEligible(dbConn, dataReader["TravelRequestId"].ToString()) ? true : false,
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
                                                         REIMBURSE_TRAVELREQUEST
                                                        WHERE
                                                         TRAVELREQUESTID IN (
                                                          SELECT
                                                           TRAVELREQUESTId
                                                          FROM
                                                           REIMBURSE_APPROVAL
                                                          WHERE
                                                           BADGENUMBER = {0}
                                                         )   order by CREATIONDATETIME desc", badgeNumber);
                        OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                        command.CommandText = query;
                        DbDataReader dataReader = command.ExecuteReader();
                        if (dataReader.HasRows)
                        {
                            while (dataReader.Read())
                            {
                                response.Add(new ReimburseGridDetails()
                                {
                                    TravelRequestId = dataReader["TravelRequestId"].ToString(),

                                    SubmittedByUser = dataReader["SUBMITTEDBYUSERNAME"].ToString(),
                                    SubmittedDateTime = Convert.ToDateTime(dataReader["SUBMITTEDDATETIME"]),
                                    RequiredApprovers = GetReimburseApproversListByTravelRequestId(dbConn, dataReader["TravelRequestId"].ToString()),
                                    LastApprovedByUser = getReimburseLastApproverName(dbConn, dataReader["TravelRequestId"].ToString()),
                                    LastApprovedDateTime = getReimburseLastApproverDateTime(dbConn, dataReader["TravelRequestId"].ToString()),                                    
                                    EditActionVisible = false,
                                    ViewActionVisible = true,
                                    ApproveActionVisible = getReimburseApprovalSatus(dbConn, Convert.ToInt32(dataReader["TravelRequestId"]), badgeNumber) ? true : false,
                                    Status = dataReader["STATUS"].ToString(),                                   
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
                LogMessage.Log("GetReimburseGridDetails : " + ex.Message);
                throw;
            }
            
        }

        private string GetReimburseApproversListByTravelRequestId(DbConnection dbConn, string travelRequestId)
        {
            string response = string.Empty;
            string query = string.Format("select APPROVERNAME from REIMBURSE_APPROVAL where TRAVELREQUESTID = {0} order by ApprovalOrder", travelRequestId);
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
        private string getReimburseLastApproverName(DbConnection dbConn, string travelRequestId)
        {
            string response = "";
            string query = string.Format(@"select APPROVERNAME from (
                                                                    SELECT
	                                                                    APPROVERNAME
                                                                    FROM
	                                                                    REIMBURSE_APPROVAL
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
        private string getReimburseLastApproverDateTime(DbConnection dbConn, string travelRequestId)
        {
            string response = "";
            string query = string.Format(@"Select ApprovalDateTime from (
                                            SELECT
	                                        APPROVALDATETIME
                                        FROM
	                                        REIMBURSE_APPROVAL
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

        public bool ReimburseEditActionEligible(DbConnection dbConn, string travelRequestId)
        {
            string response = "";
            string query = string.Format(@"SELECT
	                                        STATUS
                                        FROM
	                                        REIMBURSE_TRAVELREQUEST 
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

        public bool SubmitTravelRequest(SubmitReimburseData submitReimburseData)
        {
            List<BadgeInfo> approvalOrderList = new List<BadgeInfo>();
            approvalOrderList.Add(new BadgeInfo() { BadgeId = submitReimburseData.DepartmentHeadBadgeNumber, Name = submitReimburseData.DepartmentHeadName });
            approvalOrderList.Add(new BadgeInfo() { BadgeId = submitReimburseData.ExecutiveOfficerBadgeNumber, Name = submitReimburseData.ExecutiveOfficerName });
            approvalOrderList.Add(new BadgeInfo() { BadgeId = submitReimburseData.CEOForAPTABadgeNumber, Name = submitReimburseData.CEOForAPTAName });
            approvalOrderList.Add(new BadgeInfo() { BadgeId = submitReimburseData.CEOForInternationalBadgeNumber, Name = submitReimburseData.CEOForInternationalName });
            approvalOrderList.Add(new BadgeInfo() { BadgeId = submitReimburseData.TravelCoordinatorBadgeNumber, Name = submitReimburseData.TravelCoordinatorName });

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
                        cmd.CommandText = @"INSERT INTO REIMBURSE_APPROVAL (                                                  
                                                            TRAVELREQUESTID,
                                                            BADGENUMBER,
                                                            APPROVERNAME,
                                                            APPROVALSTATUS,
                                                            APPROVALORDER
                                                        )
                                                        VALUES
                                                            (:p1,:p2,:p3,:p4,:p5)";
                        cmd.Parameters.Add(new OracleParameter("p1", submitReimburseData.TravelRequestId));
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
                cmd1.CommandText = string.Format(@"UPDATE REIMBURSE_TRAVELREQUEST SET                                                 
                                                       SUBMITTEDBYUSERNAME = :p1 ,
                                                        SUBMITTEDDATETIME = :p2,
                                                        STATUS = :p3,
                                                        AGREE = :p4
                                                   WHERE TRAVELREQUESTID = {0}", submitReimburseData.TravelRequestId);

                cmd1.Parameters.Add(new OracleParameter("p1", submitReimburseData.SubmittedByUserName));
                cmd1.Parameters.Add(new OracleParameter("p2", DateTime.Now));
                cmd1.Parameters.Add(new OracleParameter("p3", Common.ApprovalStatus.Pending.ToString()));
                cmd1.Parameters.Add(new OracleParameter("p4", (submitReimburseData.AgreedToTermsAndConditions) ? "Y" : "N"));
                var rowsUpdated1 = cmd1.ExecuteNonQuery();
                cmd1.Dispose();
                dbConn.Close();
                dbConn.Dispose();


                string link = string.Format("<a href=\"http://localhost:2462/\">here</a>");
                string subject = string.Format(@"Reimburse Request Approval for Id - {0} ", submitReimburseData.TravelRequestId);
                string body = string.Format(@"Please visit Travel application website " + link + " to Approve/Reject for travel request Id : {0}", submitReimburseData.TravelRequestId);
                sendEmail(submitReimburseData.DepartmentHeadBadgeNumber, body, subject);
                return true;

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }
    }
}