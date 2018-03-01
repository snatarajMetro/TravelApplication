using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CrystalDecisions.Shared;
using System.IO;
using System.Data.Common;
using System.Configuration;

namespace TravelApplication.Services
{
    public class TravelRequestReportService
    {
        public byte[] RunReport(String reportName, String fileName, string travelRequestId)
        {
            byte[] response = null;
            ConnectionInfo crConnectionInFo = new ConnectionInfo();
            CrystalDecisions.CrystalReports.Engine.Tables crTables;
            TableLogOnInfo crTableLogonInfo = new TableLogOnInfo();
            DiskFileDestinationOptions crDiskFileDestinationOptions = new CrystalDecisions.Shared.DiskFileDestinationOptions();
            ExportOptions crExportOptions = new CrystalDecisions.Shared.ExportOptions();

            CrystalDecisions.CrystalReports.Engine.ReportDocument dReport = new CrystalDecisions.CrystalReports.Engine.ReportDocument();
            String rptPath = System.Web.Hosting.HostingEnvironment.MapPath(System.Configuration.ConfigurationManager.AppSettings["rptPath"]);
            String fName = fileName;
            dReport.Load(rptPath + reportName);

            dReport.SetParameterValue("p_travelrequestID", travelRequestId);
            if (reportName == "Travel_Business_Expense.rpt")
            {
                dReport.SetParameterValue("p_travelrequestID", travelRequestId);
            }


            string defaultConnectionString = ConfigurationManager.ConnectionStrings["CrystalReport"].ConnectionString;
            var builder = new DbConnectionStringBuilder();
            builder.ConnectionString = defaultConnectionString;

            crConnectionInFo.DatabaseName = "";
            crConnectionInFo.ServerName = builder["SERVICE_NAME"].ToString(); 
            crConnectionInFo.UserID = builder["User ID"].ToString();  
            crConnectionInFo.Password = builder["Password"].ToString();  



            crTables = dReport.Database.Tables;
            crTableLogonInfo.ConnectionInfo = crConnectionInFo;

            foreach (CrystalDecisions.CrystalReports.Engine.Table rTable in crTables)
            {
                rTable.ApplyLogOnInfo(crTableLogonInfo);

            }
            foreach (CrystalDecisions.CrystalReports.Engine.ReportDocument subrpt in dReport.Subreports)
            {

                foreach (CrystalDecisions.CrystalReports.Engine.Table rTable in subrpt.Database.Tables)
                {
                    rTable.ApplyLogOnInfo(crTableLogonInfo);
                }
            }

            try
            {
                var memoryStream = new MemoryStream();
                var data = dReport.ExportToStream(ExportFormatType.PortableDocFormat);
                data.CopyTo(memoryStream);
                response = memoryStream.ToArray();
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);

            }
            finally
            {
                dReport.Close();
                dReport.Dispose();
            }
            return response;
        }
    }
}