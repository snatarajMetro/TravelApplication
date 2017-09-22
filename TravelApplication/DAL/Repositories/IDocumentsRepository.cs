﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelApplication.Models;

namespace TravelApplication.DAL.Repositories
{
    public interface IDocumentsRepository
    {
        void UploadFileInfo(int travelRequestId, string fileName);
        List<SupportingDocument> GetAllDocumentsByTravelId(int travelRequestId, int badgeNumber);

        void DeleteFilesByTravelId(int travelRequestId, int id);
    }
}