using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TravelApplication.DAL.DBProvider;
using TravelApplication.Models;

namespace TravelApplication.DAL.Repositories
{
    public class EstimatedExpenseRepository : IEstimatedExpenseRepository
    {
        private DbConnection dbConn;
        public async Task<int> SaveEstimatedExpenseRequest(EstimatedExpense request)
        {
            int estimatedExpenseId = 0;
            try
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
						 ) VALUES (:p1 ,:p2,:p3,:p4,:p5,:p6,:p7,:p8,:p9,:p10,:p11,:p12,:p13,:p14,:p15,:p16,:p17,:p18,:p19,:p20,:p21,:p22,:p23 ) returning ESTIMATEDID into : estimatedExpenseId ";
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
                }
                dbConn.Close();
                dbConn.Dispose();

            }
            catch (Exception ex)
            {

                throw new Exception("Could not save estimated expense successfully");
            }

            return estimatedExpenseId;
        }
    }
}