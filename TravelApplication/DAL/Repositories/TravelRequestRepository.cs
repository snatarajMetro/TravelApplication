using Oracle.ManagedDataAccess.Client;
using System;
using System.Data;
using System.Data.Common;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using TravelApplication.DAL.DBProvider;
using TravelApplication.Models;

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
                                                SUBMITTEDBYLOGINID
                                            )
                                            VALUES
                                                (:p2,:p3,:p4,:p5,:p6,:p7,:p8,:p9,:p10,:p11,:p12,:p13) returning TRAVELREQUESTID into :travelRequestId";
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
                    cmd.Parameters.Add(new OracleParameter("p13", request.LoginId));
                    cmd.Parameters.Add("travelRequestId", OracleDbType.Int32, ParameterDirection.ReturnValue);
                    var rowsUpdated = cmd.ExecuteNonQuery();
                    travelRequestId = Decimal.ToInt32(((Oracle.ManagedDataAccess.Types.OracleDecimal)(cmd.Parameters["travelRequestId"].Value)).Value);

                }
                dbConn.Close();
                dbConn.Dispose();

            }
            catch (Exception ex)
            {

                //TODO : log the exception 
                 throw new Exception("Couldn't insert record into Travel Request - "+ex.Message);
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
    }
}