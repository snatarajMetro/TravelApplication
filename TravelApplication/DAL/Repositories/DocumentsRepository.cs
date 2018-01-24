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
        public List<SupportingDocument> GetAllDocumentsByTravelId(string travelRequestId, int badgeNumber)
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

        public List<RequiredDocuments> GetAllRequiredDocumentsByTravelId(string travelRequestId, int badgeNumber)
        {
            List<RequiredDocuments> result = new List<RequiredDocuments>();
            using (dbConn = ConnectionFactory.GetOpenDefaultConnection())
            {


          

                for (int i = 1; i < 6; i++)
                {
                    result.Add(new RequiredDocuments()
                    {
                        DocumentNumber = i,
                        TravelRequestId = travelRequestId,
                        FileName = string.Empty,
                        DocumentName = string.Empty,
                        Visible = (i == 1 || i == 2 ) ? true : false

                    });
                }

                string query = string.Format("Select CASHADVANCE from TRAVELREQUEST_ESTIMATEDEXPENSE where TRAVELREQUESTID = {0} AND  CASHADVANCE > 0 ", travelRequestId);
                OracleCommand command = new OracleCommand(query, (OracleConnection)dbConn);
                command.CommandText = query;
                DbDataReader dataReader = command.ExecuteReader();
                if (dataReader != null)
                {
                    while (dataReader.Read())
                    {
                        result.FirstOrDefault(p => p.DocumentNumber == 3).Visible = true;
                    }
                }
                dataReader.Close();
                command.Dispose();

                string query1 = string.Format("Select TRAVELREQUESTID, FILENAME, REQUIREDORDER from Travel_Uploads where TRAVELREQUESTID = {0} and Requiredorder is not null ", travelRequestId );
                OracleCommand command1 = new OracleCommand(query1, (OracleConnection)dbConn);
                command1.CommandText = query1;
                DbDataReader dataReader1 = command1.ExecuteReader();


                if (dataReader1 != null)
                {
                    while (dataReader1.Read())
                    {
                        result.FirstOrDefault(p1 => p1.DocumentNumber == Convert.ToInt32(dataReader1["REQUIREDORDER"])).FileName = dataReader1["FILENAME"].ToString();
                    }
                }

                dataReader1.Close();
                command1.Dispose();
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
