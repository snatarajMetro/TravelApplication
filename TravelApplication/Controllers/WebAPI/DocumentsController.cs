﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using TravelApplication.Models;
using TravelApplication.Services;

namespace TravelApplication.Controllers.WebAPI
{
    public class DocumentsController : ApiController
    {
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
                    folder = badgeNumber.ToString()

                };

                documentsService.UploadToSharePoint(travelRequestId, uploadRequest);

                msg = Request.CreateResponse(HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                // TODO: Log the exception message
                msg = Request.CreateResponse(HttpStatusCode.InternalServerError, "Unable to upload document ");
            }
            return msg;

        }
    }
}
