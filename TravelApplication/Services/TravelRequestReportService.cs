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
                dReport.SetParameterValue("p_request_id", travelRequestId);
            }
            //String mOleString = System.Configuration.ConfigurationManager.AppSettings["rptConnectionString"];
            //String[] aTags = mOleString.Split(';');

            //Hashtable hTags = new Hashtable();
            //int tagCount = aTags.Length;
            //for (int cnt = 0; cnt < tagCount - 1; cnt++)
            //{
            //    String[] atagParts = aTags[cnt].Split('=');
            //    hTags.Add(atagParts[0].Replace("'", ""), atagParts[1].ToUpper().Replace("'", ""));
            //}

            //String sPassword = Convert.ToString(hTags["Password"]);
            //String sUserId = Convert.ToString(hTags["User ID"]);
            //String sDataSource = Convert.ToString(hTags["Data Source"]);

            string defaultConnectionString = ConfigurationManager.ConnectionStrings["CrystalReport"].ConnectionString;
            var builder = new DbConnectionStringBuilder();
            builder.ConnectionString = defaultConnectionString;

            crConnectionInFo.DatabaseName = "";
            crConnectionInFo.ServerName = builder["SERVICE_NAME"].ToString(); // mtaora50dev";
            crConnectionInFo.UserID = builder["User ID"].ToString(); //"taer";
            crConnectionInFo.Password = builder["Password"].ToString(); // "taer_dev";



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