﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public interface IDocumentsService
    {
        void UploadToSharePoint(int travelRequestId, SharePointUpload sharePointUploadRequest);
        void UploadRequiredFileToSharePoint(int travelRequestId, SharePointUpload sharePointUploadRequest, int requiredFileOrder);
        List<SupportingDocument> GetAllDocumentsByTravelId(int travelRequestId, int badgeNumber);
        List<RequiredDocuments> GetAllRequiredDocumentsByTravelId(int travelRequestId, int badgeNumber);

        void DeleteFilesByTravelId(int travelRequestId, int id);
    }
}