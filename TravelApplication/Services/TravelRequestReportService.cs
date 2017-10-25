using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CrystalDecisions.Shared;

namespace TravelApplication.Services
{
    public class TravelRequestReportService
    {
        public void RunReport(String reportName, String fileName, Hashtable htParameters)
        {
            ConnectionInfo crConnectionInFo = new ConnectionInfo();
            CrystalDecisions.CrystalReports.Engine.Tables crTables;
            TableLogOnInfo crTableLogonInfo = new TableLogOnInfo();
            DiskFileDestinationOptions crDiskFileDestinationOptions = new CrystalDecisions.Shared.DiskFileDestinationOptions();
            ExportOptions crExportOptions = new CrystalDecisions.Shared.ExportOptions();

            CrystalDecisions.CrystalReports.Engine.ReportDocument dReport = new CrystalDecisions.CrystalReports.Engine.ReportDocument();
            String rptPath = System.Web.Hosting.HostingEnvironment.MapPath(System.Configuration.ConfigurationManager.AppSettings["rptPath"]);
            String fName = fileName;
            dReport.Load(rptPath + reportName);

            foreach (DictionaryEntry de in htParameters)
            {
                String parm_name = System.Convert.ToString(de.Key);  
                String[] parm_values_array = (System.Convert.ToString(de.Value)).Split(',');

             //   dReport.SetParameterValue("p_travelrequestID", "406");
            }
            dReport.SetParameterValue("p_travelrequestID", "406");
            String mOleString = System.Configuration.ConfigurationManager.AppSettings["rptConnectionString"];
            String[] aTags = mOleString.Split(';');

            Hashtable hTags = new Hashtable();
            int tagCount = aTags.Length;
            for (int cnt = 0; cnt < tagCount - 1; cnt++)
            {
                String[] atagParts = aTags[cnt].Split('=');
                hTags.Add(atagParts[0].Replace("'", ""), atagParts[1].ToUpper().Replace("'", ""));
            }

            String sPassword = Convert.ToString(hTags["Password"]);
            String sUserId = Convert.ToString(hTags["User ID"]);
            String sDataSource = Convert.ToString(hTags["Data Source"]);

            crConnectionInFo.DatabaseName = "";
            crConnectionInFo.Password = "taer_dev";
            crConnectionInFo.UserID = "TAER";
            crConnectionInFo.ServerName = "mtaora50dev";    

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

                fName = fName + ".pdf";
                crDiskFileDestinationOptions.DiskFileName = rptPath + fName;
                crExportOptions = dReport.ExportOptions;

                crExportOptions.DestinationOptions = crDiskFileDestinationOptions;
                crExportOptions.ExportDestinationType = ExportDestinationType.DiskFile;
                crExportOptions.ExportFormatType = ExportFormatType.PortableDocFormat;
                dReport.Export(crExportOptions);
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
        }
    }
}