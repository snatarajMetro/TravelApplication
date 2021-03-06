﻿﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using TravelApplication.DAL.Repositories;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public class DocumentsService : IDocumentsService
    {
        IDocumentsRepository documentsRepository = new DocumentsRepository();
        public void UploadToSharePoint(int travelRequestId, SharePointUpload sharePointUploadRequest)
        {
            try
            {
                var endpointUrl = System.Configuration.ConfigurationManager.AppSettings["sharepointServiceUrl"].ToString()+ "/SharePoint/UploadDocument";

                // call Sharepoint 
                var client = new HttpClient();
                var response = client.PostAsJsonAsync(endpointUrl, sharePointUploadRequest).ConfigureAwait(false);

                // Save to database

                documentsRepository.UploadFileInfo(travelRequestId, sharePointUploadRequest.documentName);
            }
            catch (Exception ex )
            {

                throw new Exception("Unable to upload the document" + ex.Message);
            }
        }

        public void UploadRequiredFileToSharePoint(int travelRequestId, SharePointUpload sharePointUploadRequest, int requiredFileOrder )
        {
            try
            {
                var endpointUrl = System.Configuration.ConfigurationManager.AppSettings["sharepointServiceUrl"].ToString() + "/SharePoint/UploadDocument";

                // call Sharepoint 
                var client = new HttpClient();
                var response = client.PostAsJsonAsync(endpointUrl, sharePointUploadRequest).ConfigureAwait(false);

                // Save to database

                documentsRepository.UploadRequiredFileInfo(travelRequestId, sharePointUploadRequest.documentName, requiredFileOrder);
            }
            catch (Exception ex)
            {

                throw new Exception("Unable to upload the document" + ex.Message);
            }
        }

        public List<SupportingDocument> GetAllDocumentsByTravelId(string travelRequestId, int badgeNumber)
        {
            try
            {
                var result = documentsRepository.GetAllDocumentsByTravelId(travelRequestId, badgeNumber);
                return result;
            }
            catch (Exception ex)
            {

                throw new Exception("Unable to get all uploaded documents" + ex.Message);
            }

        }
        public List<RequiredDocuments> GetAllRequiredDocumentsByTravelId(string travelRequestId, int badgeNumber)
        {
            try
            {
                var result = documentsRepository.GetAllRequiredDocumentsByTravelId(travelRequestId, badgeNumber);
                return result;
            }
            catch (Exception ex)
            {

                throw new Exception("Unable to get all uploaded documents :" + ex.Message);
            }

        }

        public void DeleteFilesByTravelId(int travelRequestId, int id)
        {
            try
            {
                documentsRepository.DeleteFilesByTravelId(travelRequestId, id);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public void UploadNotes(DocumentNoteRequest documentNoteRequest)
        {
            try
            {
                documentsRepository.UploadNotes(documentNoteRequest);
            }
            catch (Exception ex)
            {

                throw new Exception("Unable to upload the document" + ex.Message);
            }

        }
    }
}
