using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;
using TravelApplication.Class.Common;
using TravelApplication.Models;
using TravelApplication.Services;

namespace TravelApplication.Controllers.WebAPI
{
    public class DocumentsController : ApiController
    {
        IDocumentsService documentService = new DocumentsService();
        [HttpPost]
        [Route("api/documents/upload")]
        public HttpResponseMessage Upload(int travelRequestId, int badgeNumber)
        {
            IDocumentsService documentsService = new DocumentsService();
            HttpResponseMessage msg = null;
            try
            {
                var request = HttpContext.Current.Request;
                HttpFileCollection allFiles = request.Files;
                HttpPostedFile uploadedFile = allFiles[0];
                FileInfo uploadedFileInfo = new FileInfo(uploadedFile.FileName);
                String extension = uploadedFileInfo.Extension;

                int imageLength = uploadedFile.ContentLength;
                string imageType = uploadedFile.ContentType;

                byte[] binaryImagedata = new byte[imageLength];
                uploadedFile.InputStream.Read(binaryImagedata, 0, imageLength);

                var endpointUrl = "http://apitest.metro.net/Document/SharePoint/UploadDocument";

                SharePointUpload uploadRequest = new SharePointUpload()
                {
                    documentStream = binaryImagedata, //System.IO.File.ReadAllBytes(@"c:\Temp\new.docx"),
                    siteUrl = "http://mtaspw01/collaboration/InformationManagement/ATMS/apps",
                    documentListName = "TravelApp",
                    documentName = uploadedFile.FileName,
                    folder = badgeNumber.ToString() +"-"+ travelRequestId                   
                };

                documentsService.UploadToSharePoint(travelRequestId, uploadRequest);

                msg = Request.CreateResponse(HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                LogMessage.Log("api/documents/upload : " + ex.Message);
                msg = Request.CreateResponse(HttpStatusCode.InternalServerError, "Unable to upload document ");
            }
            return msg;

        }

        [HttpGet]
        [Route("api/documents/supportingdocuments")]
        public HttpResponseMessage SupportingDocuments(int travelRequestId, int badgeNumber)
        {
            HttpResponseMessage response = null;

            try
            {
                var supportingDocuments = documentService.GetAllDocumentsByTravelId(travelRequestId, badgeNumber);

                var data = new JavaScriptSerializer().Serialize(supportingDocuments.OrderByDescending(item => item.Id));

                response = Request.CreateResponse(HttpStatusCode.OK, data);
            }
            catch (Exception ex)
            {
                LogMessage.Log("api/documents/supportingdocuments : " + ex.Message);
                response = Request.CreateResponse(HttpStatusCode.InternalServerError);
            }

            return response;

        }
        [HttpDelete]
        [Route("api/documents/deletedocument")]
        public HttpResponseMessage DeleteDocument(int travelRequestId, int documentId)
        {
            HttpResponseMessage response = null;
            try
            {
                documentService.DeleteFilesByTravelId(travelRequestId, documentId);
                response = Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                LogMessage.Log("api/documents/deletedocument : " + ex.Message);
                response = Request.CreateResponse(HttpStatusCode.InternalServerError, "Document cannot be deleted.");
            }
            return response;
        }
    }
}