﻿using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Web;
using TravelApplication.DAL.DBProvider;
using TravelApplication.Models;
using TravelApplication.Controllers.WebAPI;

namespace TravelApplication.DAL.Repositories
{

    public class DocumentsRepository : IDocumentsRepository
    {
        private DbConnection dbConn;
        public void UploadFileInfo(int travelRequestId, string fileName)
        {
            try
            {
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    string query = @"Insert into Travel_Uploads (TRAVELREQUESTID, FILENAME, UPLOADEDDATETIME ) values (:tarId, :fileName, :uploadedDateTime)";
                    OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                    command.CommandText = query;
                    command.Parameters.Add(new OracleParameter("tarId", OracleDbType.Int32, travelRequestId, ParameterDirection.Input));
                    command.Parameters.Add(new OracleParameter("fileName", OracleDbType.Varchar2, fileName, ParameterDirection.Input));
                    command.Parameters.Add(new OracleParameter("uploadedDateTime", OracleDbType.Date, System.DateTime.Now, ParameterDirection.Input));
                    command.ExecuteNonQuery();

                    command.Dispose();
                    dbConn.Close();
                    dbConn.Dispose();
                }
            }
            catch (Exception ex)
            {

                throw new Exception("Couldn't save file name to database");
            }
        }


        public void UploadRequiredFileInfo(int travelRequestId, string fileName, int requiredFileOrder)
        {
            try
            {
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    string query = @"Insert into Travel_Uploads (TRAVELREQUESTID, FILENAME, UPLOADEDDATETIME , REQUIRED, REQUIREDORDER ) values (:tarId, :fileName, :uploadedDateTime, :required, :requiredFileOrder)";
                    OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                    command.CommandText = query;
                    command.Parameters.Add(new OracleParameter("tarId", OracleDbType.Int32, travelRequestId, ParameterDirection.Input));
                    command.Parameters.Add(new OracleParameter("fileName", OracleDbType.Varchar2, fileName, ParameterDirection.Input));
                    command.Parameters.Add(new OracleParameter("uploadedDateTime", OracleDbType.Date, System.DateTime.Now, ParameterDirection.Input));
                    command.Parameters.Add(new OracleParameter("required", OracleDbType.Varchar2, "Y", ParameterDirection.Input));
                    command.Parameters.Add(new OracleParameter("requiredorder", OracleDbType.Varchar2, requiredFileOrder, ParameterDirection.Input));
                    command.ExecuteNonQuery();

                    command.Dispose();
                    dbConn.Close();
                    dbConn.Dispose();
                }
            }
            catch (Exception ex)
            {

                throw new Exception("Couldn't save file name to database");
            }
        }
        public List<SupportingDocument> GetAllDocumentsByTravelId(int travelRequestId, int badgeNumber)
        {
            List<SupportingDocument> result = new List<SupportingDocument>();
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                string query = "Select ID, TRAVELREQUESTID, FILENAME, UPLOADEDDATETIME from Travel_Uploads where TRAVELREQUESTID = " + travelRequestId;
                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();

                if (dataReader != null)
                {
                    while (dataReader.Read())
                    {
                        result.Add(new SupportingDocument()
                        {
                            TravelRequestId = Convert.ToInt32(dataReader["TRAVELREQUESTID"]),
                            FileName        = dataReader["FILENAME"].ToString(),
                            Id              = Convert.ToInt32(dataReader["ID"]),
                            UploadDateTime  = dataReader["UPLOADEDDATETIME"].ToString(),
                            DownloadUrl     = System.Configuration.ConfigurationManager.AppSettings["sharepointServiceUrl"].ToString()+ "/Document/GetDocument?siteUrl=http://mymetro/collaboration/InformationManagement/ATMS/apps&documentListName=TravelApp/" + badgeNumber +"-"+travelRequestId+ "/&fileName=" + dataReader["FILENAME"].ToString()
                        }
                        );
                    }
                }

                dataReader.Close();
                command.Dispose();
                dbConn.Close();
                dbConn.Dispose();

                return result;
            }
        }

        public List<RequiredDocuments> GetAllRequiredDocumentsByTravelId(int travelRequestId, int badgeNumber)
        {
            List<RequiredDocuments> result = new List<RequiredDocuments>();
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {
                string query = string.Format("Select ID, TRAVELREQUESTID, FILENAME, DOCUMENTNUMBER from Travel_Uploads where TRAVELREQUESTID = {0} and Requiredorder is not null " , travelRequestId );
                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();

                if (dataReader != null)
                {
                    while (dataReader.Read())
                    {
                        result.Add(new RequiredDocuments()
                        {
                            TravelRequestId = dataReader["TRAVELREQUESTID"].ToString(),
                            FileName = dataReader["FILENAME"].ToString(),
                            DocumentNumber = Convert.ToInt32(dataReader["REQUIREDORDER"])
                            
                        }
                        );
                    }
                }

                dataReader.Close();
                command.Dispose();
                dbConn.Close();
                dbConn.Dispose();

                return result;
            }
        }
        public void DeleteFilesByTravelId(int travelRequestId, int id)
        {

            try
            {
                using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
                {
                    string query = "DELETE FROM  TRAVEL_UPLOADS  WHERE TRAVELREQUESTID = " + travelRequestId + "And Id = " + id;
                    OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                    command.CommandText = query;
                    DbDataReader dataReader = command.ExecuteReader();
                    command.Dispose();
                    dataReader.Close();
                    dbConn.Close();
                    dbConn.Dispose();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Could not delete the requested file");
            }

        }
    }
}
