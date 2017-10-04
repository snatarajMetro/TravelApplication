var app = angular.module('travelApp', ['ui.grid', 'ui.grid.pagination']);
//var app = angular.module('travelApp', ['ui.grid']);

app.controller('travelAppCtrl', function ($scope, $compile) {

    // Estimated Expense section
    $scope.advanceLodgingAmount = "0.00";
    $scope.advanceAirfareAmount = "0.00";
    $scope.advanceRegistrationAmount = "0.00";
    $scope.advanceMealsAmount = "0.00";
    $scope.advanceCarRentalAmount = "0.00";
    $scope.advanceMiscellaneousAmount = "0.00";
    $scope.estimatedLodgingAmount = "0.00";
    $scope.estimatedAirfareAmount = "0.00";
    $scope.estimatedRegistrationAmount = "0.00";
    $scope.estimatedMealsAmount = "0.00";
    $scope.estimatedCarRentalAmount = "0.00";
    $scope.estimatedMiscellaneousAmount = "0.00";

    $scope.updateTotalAdvanceAmount = function () {
        $scope.totalAdvanceAmount = (
            ($scope.advanceLodgingAmount * 1)
            + ($scope.advanceAirfareAmount * 1)
            + ($scope.advanceRegistrationAmount * 1)
            + ($scope.advanceMealsAmount * 1)
            + ($scope.advanceCarRentalAmount * 1)
            + ($scope.advanceMiscellaneousAmount * 1)
            );
    }

    $scope.updateTotalEstimatedAmount = function () {
        $scope.totalEstimatedAmount = (
            ($scope.estimatedLodgingAmount * 1)
            + ($scope.estimatedAirfareAmount * 1)
            + ($scope.estimatedRegistrationAmount * 1)
            + ($scope.estimatedMealsAmount * 1)
            + ($scope.estimatedCarRentalAmount * 1)
            + ($scope.estimatedMiscellaneousAmount * 1)
            );
    }

    //set estimated expense section
    $scope.loadEstimatedExpense = function () {
        $.get('/uitemplates/estimatedexpense.html')
        .done(function (data) {
            $('#estimatedexpensetemplate').html($compile($(data).html())($scope));
            $scope.$apply();
        });
    }

    // FIS section
    $scope.totalFISAmount1 = "0.00";
    $scope.totalFISAmount2 = "0.00";
    $scope.totalFISAmount3 = "0.00";
    $scope.totalFISAmount4 = "0.00";
    $scope.totalFISAmount5 = "0.00";

    $scope.updateTotalFISAmount = function () {
        $scope.totalFISAmount = (
            ($scope.totalFISAmount1 * 1)
            + ($scope.totalFISAmount2 * 1)
            //+ ($scope.totalFISAmount3 * 1)
            //+ ($scope.totalFISAmount4 * 1)
            //+ ($scope.totalFISAmount5 * 1)
            );
    }

    //set fileupload section
    $scope.loadFileUpload = function () {

        var travelRequestId = $('#travelRequestId').text();

        // load supporting document grid
        $scope.loadSupportingDocuments(travelRequestId);

        $.get('/uitemplates/fileupload.html')
        .done(function (data) {
            $('#fileuploadtemplate').html($compile($(data).html())($scope));
            $scope.$apply();

            Dropzone.autoDiscover = false;

            $("#supportingDocumentZone").dropzone({
                url: "api/documents/upload",
                thumbnailWidth: 10,
                thumbnailHeight: 10,
                maxFilesize: 5, // MB
                addRemoveLinks: true,
                acceptedFiles: ".jpeg,.png,.gif,.txt,.pdf,.docx,.xlxs",
                init: function () {
                    var self = this;
                    // config
                    self.options.addRemoveLinks = true;
                    self.options.dictRemoveFile = "Delete";

                    // on file added
                    self.on("addedfile", function (progress) {
                        var travelRequestId = $('#travelRequestId').text();
                        var badgeNumber = $('#badgeNumber').text();
                        var uploadUrl = "/api/documents/upload?travelRequestId=" + travelRequestId + "&badgeNumber=" + badgeNumber;
                        self.options.url = uploadUrl;
                    });

                    // on file added
                    self.on("success", function (file, response) {
                        this.removeFile(file);
                    });

                    // File upload Progress
                    self.on("totaluploadprogress", function (progress) {
                        $('.roller').width(progress + '%');
                    });

                    self.on("queuecomplete", function (progress) {
                        $('.meter').delay(999).slideUp(999);

                        var travelRequestId = $('#travelRequestId').text();

                        // reload supporting document grid
                        $scope.loadSupportingDocuments(travelRequestId);
                    });
                },
                success: function (file, response) {
                    var imgName = response;
                    file.previewElement.classList.add("dz-success");
                },
                error: function (file, response) {
                    file.previewElement.classList.add("dz-error");
                }
            });
        });
    }

    
    //set fileupload section
    $scope.loadFileUpload2 = function () {

        var travelRequestId = $('#travelRequestId').text();

        // load supporting document grid
        $scope.loadSupportingDocuments(travelRequestId);

        $.get('/uitemplates/uploadandsubmit.html')
        .done(function (data) {
            $('#fileuploadtemplate').html($compile($(data).html())($scope));
            $scope.$apply();

            Dropzone.autoDiscover = false;

            $("#supportingDocumentZone").dropzone({
                url: "api/documents/upload",
                thumbnailWidth: 10,
                thumbnailHeight: 10,
                maxFilesize: 5, // MB
                addRemoveLinks: true,
                acceptedFiles: ".jpeg,.png,.gif,.txt,.pdf,.docx,.xlxs",
                init: function () {
                    var self = this;
                    // config
                    self.options.addRemoveLinks = true;
                    self.options.dictRemoveFile = "Delete";

                    // on file added
                    self.on("addedfile", function (progress) {
                        var travelRequestId = $('#travelRequestId').text();
                        var badgeNumber = $('#badgeNumber').text();
                        var uploadUrl = "/api/documents/upload?travelRequestId=" + travelRequestId + "&badgeNumber=" + badgeNumber;
                        self.options.url = uploadUrl;
                    });

                    // on file added
                    self.on("success", function (file, response) {
                        this.removeFile(file);
                    });

                    // File upload Progress
                    self.on("totaluploadprogress", function (progress) {
                        $('.roller').width(progress + '%');
                    });

                    self.on("queuecomplete", function (progress) {
                        $('.meter').delay(999).slideUp(999);

                        var travelRequestId = $('#travelRequestId').text();

                        // reload supporting document grid
                        $scope.loadSupportingDocuments(travelRequestId);
                    });
                },
                success: function (file, response) {
                    var imgName = response;
                    file.previewElement.classList.add("dz-success");
                },
                error: function (file, response) {
                    file.previewElement.classList.add("dz-error");
                }
            });
        });
    }

    //set fis section
    $scope.loadFIS = function () {
        $.get('/uitemplates/fis.html')
        .done(function (data) {
            $('#datatemplate').html($compile($(data).html())($scope));
            $scope.$apply();
        });
    }

    $scope.loadTravelRequest = function () {
        $.get('/uitemplates/travelrequest.html')
        .done(function (data) {
            $('#travelrequesttemplate').html($compile($(data).html())($scope));
            $scope.$apply();
        });
    }

    // load cost centers and projects
    $scope.loadCostCenters = function () {
        $scope.Projects = {};

        $.get('/api/fis/costcenters')
        .done(function (data) {
            $scope.CostCenters = JSON.parse(data);

            angular.forEach($scope.CostCenters, function (value, index) {

                // get projects based on cost center name
                $.get('/api/fis/projects/' + value.Name)
                .done(function (data) {

                    $scope.Projects[value.Name] = JSON.parse(data);
                    $scope.$apply();
                });
            })
        });
    };

    $scope.projects1 = [];
    $scope.projects2 = [];
    $scope.projects3 = [];
    $scope.projects4 = [];
    $scope.projects5 = [];

    $scope.getProjects = function (source, costCenter) {

        if (source == 'ddlCostCenter1') {
            $scope.projects1 = $scope.Projects[costCenter.Name];
        }
        else if (source == 'ddlCostCenter2') {
            $scope.projects2 = $scope.Projects[costCenter.Name];;
        }
        else if (source == 'ddlCostCenter3') {
            $scope.projects3 = $scope.Projects[costCenter.Name];;
        }
        else if (source == 'ddlCostCenter4') {
            $scope.projects4 = $scope.Projects[costCenter.Name];;
        }
        else if (source == 'ddlCostCenter5') {
            $scope.projects5 = $scope.Projects[costCenter.Name];;
        }
    };

    $scope.loadSupportingDocuments = function (travelRequestNumber) {

        $scope.gridOptions = {
            enableSorting: false,
            rowHeight: 34,
            //enableFiltering: true,
            paginationPageSizes: [10, 20, 30],
            paginationPageSize: 10, 
            columnDefs: [
            {
                field: 'FileName',
                displayName: 'File Name',
                width: '350'
            },
            {
                field: 'UploadDateTime',
                headerCellClass: 'headerStyle',
                displayName: 'Upload Datetime',
                width: '200'
            },
            {
                field: 'actions',
                headerCellClass: 'headerStyle',
                width: '100',
                displayName: 'Actions',
                cellTemplate: "<a href='{{row.entity.DownloadUrl}}'><img title='View/Download Document' class='viewDocument' src='/Images/download.png' width='30' height='30' /></a><a href='#'><img title='Delete Document' class='viewDocument' src='/Images/delete2.png' width='20' height='20' alt='{{row.entity.Id}}' onclick=deletedocument(this); /></a>",
                enableFiltering: false,
                enableColumnMenu: false
            }
            ],
            onRegisterApi: function (gridApi) {
                $scope.grid1Api = gridApi;
            }
        };

        $.ajax({
            type: "GET",
            url: "/api/documents/supportingdocuments?travelRequestId=" + travelRequestNumber + "&badgeNumber=" + $('#badgeNumber').text(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var result = JSON.parse(data);

                $scope.gridOptions.data = result;
                $scope.$apply();
            },
            error: function (xhr, options, error) {
            }
        });
    }

    // load submit section
    $scope.loadSubmit = function () {

        $.get('/uitemplates/submit.html')
        .done(function (data) {
            $('#submittemplate').html($compile($(data).html())($scope));
            $scope.$apply();

            $scope.loadCommonApprovers($('#badgeNumber').text());
           
            $scope.loadTravelCoordinators();
        });

    }

    // load existing travel requests
    $scope.loadExistingTravelRequests = function () {

        var actionTemplate = '<div style="float:left;" ng-if="row.entity.ViewActionVisible == true"><img title="View" class="actionImage" src="/Images/view.png" /></div><div ng-if="row.entity.EditActionVisible == true"><img title="Edit" class="actionImage" src="/Images/edit.png" alt="{{row.entity.TravelRequestId}}" onclick="editTravelRequest(this);" /></div> <div ng-if="row.entity.ApproveActionVisible == true"><img title="Approve" class="actionImage" src="/Images/approve1.png" alt="{{row.entity.TravelRequestId}}" onclick="showApproveSection(this);" /><img title="Reject" class="actionImage2" src="/Images/reject1.png" alt="{{row.entity.TravelRequestId}}" onclick="showRejectSection(this);" /></div>';

        $scope.columns = [{
                field: 'TravelRequestId',
                displayName: 'Travel Request #',
                width: 140,
                headerCellClass:"existingrequestcolumnheader",
                filter: {
                    placeholder: '🔎 search'
                        }
            },
            {
                field: 'Purpose',
                name: 'Purpose',
                width: 300,
                headerCellClass: "existingrequestcolumnheader",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'SubmittedByUser',
                name: 'Submitted By',
                width: 160,
                headerCellClass: "existingrequestcolumnheader",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'SubmittedDateTime',
                displayName: 'Submitted On',
                width: 130,
                headerCellClass: "existingrequestcolumnheader",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: "RequiredApprovers",
                displayName: "Required Approvers",
                width: 340,
                headerCellClass: "existingrequestcolumnheader",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'LastApproveredByUser',
                displayName: 'Last Approvered By',
                width: 150,
                headerCellClass: "existingrequestcolumnheader",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'LastApprovedDateTime',
                displayName: 'Last Approved On',
                width: 140,
                headerCellClass: "existingrequestcolumnheader",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'Status',
                displayName: 'Status',
                width: 120,
                headerCellClass: "existingrequestcolumnheader",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                name: 'Actions',
                cellTemplate: actionTemplate,
                enableFiltering: false,
                width: 112,
                headerCellClass: "existingrequestcolumnheader"
            }];

        $scope.existingRequestsGridOptions = {
            enableSorting: false,
            columnDefs: $scope.columns,
            enableFiltering: true,
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            onRegisterApi: function (gridApi) {
                $scope.grid1Api = gridApi;
            }
        };

        var badgeNumber = $("#badgeNumber").text();
        var selectedRoleId = $("#selectedRoleId").text();
        var url = "api/travelrequests?badgeNumber=" + badgeNumber + "&roleId=" + selectedRoleId;

        $.get(url)
       .done(function (data) {

           $scope.existingRequestsGridOptions.data = data;

           angular.forEach($scope.existingRequestsGridOptions.data, function (value, index) {

               if (value.SubmittedByUser == null || value.SubmittedByUser == '') {
                   $scope.columns[2].visible = false;
               }
           })

           $.get('/uitemplates/existingtravelrequests.html')
           .done(function (data) {

               $('#existingtravelrequeststemplate').html($compile($(data).html())($scope));
               $scope.$apply();
           });
        });
    }

    // Refresh the existing request grid
    $scope.refreshExistingRequest = function () {

        var badgeNumber     = $("#badgeNumber").text();
        var selectedRoleId  = $("#selectedRoleId").text();
        var url = "api/travelrequests?badgeNumber=" + badgeNumber + "&roleId=" + selectedRoleId;

        $.get(url)
       .done(function (data) {

           $scope.existingRequestsGridOptions.data = data;

           angular.forEach($scope.existingRequestsGridOptions.data, function (value, index) {

               if (value.SubmittedByUser == null || value.SubmittedByUser == '') {
                   $scope.columns[2].visible = false;
               }
           })

           $scope.$apply();
       });
    }

    // load data for 1st four approvers dropdown
    $scope.loadCommonApprovers = function (badgeNumber) {

        $.ajax({
            type: "GET",
            url: "api/approval/heirarchichalpositions/" + badgeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                $scope.DepartmentHeads      = data;
                $scope.ExecutiveOfficers    = data;
                $scope.CEOsForInternational = data;
                $scope.CEOsForAPTA          = data;
                $scope.$apply();
            },
            error: function (xhr, options, error) {
            }
        });
    }

    $scope.loadTravelCoordinators = function () {

        $.ajax({
            type: "GET",
            url: "api/approval/TAApprovers",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                $scope.TravelCoordinators = data;
                $scope.$apply();
            },
            error: function (xhr, options, error) {
            }
        });
    }

    // object for submit data
    $scope.travelRequestId = 0;
    $scope.departmentHeadBadgeNumber = "";
    $scope.executiveOfficerBadgeNumber = "";
    $scope.ceoForInternationalBadgeNumber = "";
    $scope.ceoForAPTABadgeNumber = "";
    $scope.travelCoordinatorBadgeNumber = "";
    $scope.agreedToTermsAndConditions = false;
    $scope.submitterUserName = "";
    $scope.submittedDatetime = ""

    $scope.displayOther = function (container, focusElement, clearElement, source) {

        var div = '#' + container;
        var focuselement = '#' + focusElement;

        if(source.BadgeNumber == -1)
        {
            $(div).show();
            $(focuselement).focus();
        } else {
            $(focuselement).val('');
            $('#' + clearElement).val('');

            // enable the submit button
            $('#btnSubmit').prop("disabled", false);

            $(div).hide();
        }
    };

    $scope.submitRequest = function () {

        var canSubmit = false;
        var travelRequestId = $('#travelRequestId').text();

        // Department Head
        var departmentHeadBadgeNumber = $("#ddlDepartmentHead option:selected").val();
        var departmentHeadName = "";

        if (departmentHeadBadgeNumber && departmentHeadBadgeNumber != '?') {

            if (departmentHeadBadgeNumber == '-1') {
                departmentHeadBadgeNumber   = $('#txtDepartmentHeadBadgeNumber').val();
                departmentHeadName          = $('#txtDepartmentHeadName').val();
            }
            else {
                departmentHeadName = $("#ddlDepartmentHead option:selected").text();
            }

            if (departmentHeadBadgeNumber) {

                canSubmit = true;
            }
        }

        // Executive Officer
        var executiveOfficerBadgeNumber = $("#ddlExecutiveOfficer option:selected").val();
        var executiveOfficerName = "";

        if (executiveOfficerBadgeNumber && executiveOfficerBadgeNumber != '?') {

            if (executiveOfficerBadgeNumber == '-1') {
                executiveOfficerBadgeNumber = $('#txtExecutiveOfficerBadgeNumber').val();
                executiveOfficerName = $('#txtExecutiveOfficerName').val();
            }
            else {
                executiveOfficerName = $("#ddlExecutiveOfficer option:selected").text();
            }
        }
        else {
            executiveOfficerBadgeNumber = "";
        }

        // CEO (For International)
        var ceoForInternationalBadgeNumber = $("#ddlCEOForInternational option:selected").val();
        var ceoForInternationalName = "";

        if (ceoForInternationalBadgeNumber && ceoForInternationalBadgeNumber != '?') {

            if (ceoForInternationalBadgeNumber == '-1') {
                ceoForInternationalBadgeNumber = $('#txtCEOForInternationalBadgeNumber').val();
                ceoForInternationalName         = $('#txtCEOForInternationalName').val();
            }
            else {
                ceoForInternationalName = $("#ddlCEOForInternational option:selected").text();
            }
        }
        else {
            ceoForInternationalBadgeNumber = "";
        }

        // CEO (For APTA/CTA conference)
        var ceoForAPTABadgeNumber = $("#ddlCEOForAPTA option:selected").val();
        var ceoForAPTAName = "";

        if (ceoForAPTABadgeNumber && ceoForAPTABadgeNumber != '?') {

            if (ceoForAPTABadgeNumber == '-1') {
                ceoForAPTABadgeNumber   = $('#txtCEOForAPTABadgeNumber').val();
                ceoForAPTAName          = $('#txtCEOForAPTAName').val();
            }
            else {
                ceoForAPTAName = $("#ddlCEOForAPTA option:selected").text();
            }
        }
        else {
            ceoForAPTABadgeNumber = "";
        }

        // Travel Co-ordinator
        var travelCoordinatorBadgeNumber = $("#ddlTravelCoordinator option:selected").val();
        var travelCoordinatorName = "";

        if (travelCoordinatorBadgeNumber && travelCoordinatorBadgeNumber != '?') {

            if (travelCoordinatorBadgeNumber == '-1') {
                travelCoordinatorBadgeNumber    = $('#txtTravelCoordinatorBadgeNumber').val();
                travelCoordinatorName           = $('#txtTravelCoordinatorName').val();
            }
            else {
                travelCoordinatorName = $("#ddlTravelCoordinator option:selected").text();
            }

            if (travelCoordinatorBadgeNumber && canSubmit) {
                canSubmit = true;
            }
        }
        else {
            canSubmit = false;
        }

        // Agree checkbox
        var agreedToTermsAndConditions =  $('#cbAgree').prop('checked');

        if (!agreedToTermsAndConditions)
        {
            canSubmit = false;
        }

        // Submitted by user name
        var submittedByUserName = $('#txtSubmittedByUserName').val().trim();
        if (!submittedByUserName)
        {
            canSubmit = false;
        }

        if (canSubmit)
        {
            $.ajax({
                type: "POST",
                url: "/api/approval/submit",
                data: JSON.stringify({
                    "TravelRequestId": travelRequestId,
                    "DepartmentHeadBadgeNumber": departmentHeadBadgeNumber,
                    "DepartmentHeadName": departmentHeadName,
                    "ExecutiveOfficerBadgeNumber": executiveOfficerBadgeNumber,
                    "ExecutiveOfficerName": executiveOfficerName,
                    "CEOForInternationalBadgeNumber": ceoForInternationalBadgeNumber,
                    "CEOForInternationalName": ceoForInternationalName,
                    "CEOForAPTABadgeNumber": ceoForAPTABadgeNumber,
                    "CEOForAPTAName": ceoForAPTAName,
                    "TravelCoordinatorBadgeNumber": travelCoordinatorBadgeNumber,
                    "TravelCoordinatorName": travelCoordinatorName,
                    "AgreedToTermsAndConditions": agreedToTermsAndConditions,
                    "SubmittedByUserName": submittedByUserName
                }), 
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    $("#submitsuccess").fadeIn("slow");
                    $('#submitsuccessmessage').html("Travel request has been successfully submitted. Travel request# is <b>" + travelRequestId + "</b>.");

                    $('#btnSubmit').prop("disabled", true);
                    $('#btnBack').prop("disabled", true);
                },
                error: function (xhr, options, error) {
                    if (xhr.status == 500) {

                        var errorMessage = xhr.responseText;

                        $("#submiterror").fadeIn("slow");
                        $('#submiterrormessage').text(errorMessage);

                        // fade out in 5 seconds
                        $("#submiterror").fadeOut(fadeOutTimeInMilliseconds);
                    }
                }
            });
        }
        else
        {
            $("#submiterror").fadeIn("slow");
            $('#submiterrormessage').text("Some of the required fields are missing. Please try again.");

            // fade out in 5 seconds
            $("#submiterror").fadeOut(fadeOutTimeInMilliseconds);
        }

    }

    $scope.submitRequest2 = function () {

        var canSubmit = false;
        var travelRequestId = $('#travelRequestId').text();
        var badgeNumber = $('#badgeNumber').text();

        // Department Head
        var departmentHeadBadgeNumber = $("#ddlDepartmentHead option:selected").val();
        var departmentHeadName = "";

        if (departmentHeadBadgeNumber && departmentHeadBadgeNumber != '?') {

            if (departmentHeadBadgeNumber == '-1') {
                departmentHeadBadgeNumber = $('#txtDepartmentHeadBadgeNumber').val();
                departmentHeadName = $('#txtDepartmentHeadName').val();
            }
            else {
                departmentHeadName = $("#ddlDepartmentHead option:selected").text();
            }

            if (departmentHeadBadgeNumber) {

                canSubmit = true;
            }
        }

        // Executive Officer
        var executiveOfficerBadgeNumber = $("#ddlExecutiveOfficer option:selected").val();
        var executiveOfficerName = "";

        if (executiveOfficerBadgeNumber && executiveOfficerBadgeNumber != '?') {

            if (executiveOfficerBadgeNumber == '-1') {
                executiveOfficerBadgeNumber = $('#txtExecutiveOfficerBadgeNumber').val();
                executiveOfficerName = $('#txtExecutiveOfficerName').val();
            }
            else {
                executiveOfficerName = $("#ddlExecutiveOfficer option:selected").text();
            }
        }
        else {
            executiveOfficerBadgeNumber = "";
        }

        // CEO (For International)
        var ceoForInternationalBadgeNumber = $("#ddlCEOForInternational option:selected").val();
        var ceoForInternationalName = "";

        if (ceoForInternationalBadgeNumber && ceoForInternationalBadgeNumber != '?') {

            if (ceoForInternationalBadgeNumber == '-1') {
                ceoForInternationalBadgeNumber = $('#txtCEOForInternationalBadgeNumber').val();
                ceoForInternationalName = $('#txtCEOForInternationalName').val();
            }
            else {
                ceoForInternationalName = $("#ddlCEOForInternational option:selected").text();
            }
        }
        else {
            ceoForInternationalBadgeNumber = "";
        }

        // CEO (For APTA/CTA conference)
        var ceoForAPTABadgeNumber = $("#ddlCEOForAPTA option:selected").val();
        var ceoForAPTAName = "";

        if (ceoForAPTABadgeNumber && ceoForAPTABadgeNumber != '?') {

            if (ceoForAPTABadgeNumber == '-1') {
                ceoForAPTABadgeNumber = $('#txtCEOForAPTABadgeNumber').val();
                ceoForAPTAName = $('#txtCEOForAPTAName').val();
            }
            else {
                ceoForAPTAName = $("#ddlCEOForAPTA option:selected").text();
            }
        }
        else {
            ceoForAPTABadgeNumber = "";
        }

        // Travel Co-ordinator
        var travelCoordinatorBadgeNumber = $("#ddlTravelCoordinator option:selected").val();
        var travelCoordinatorName = "";

        if (travelCoordinatorBadgeNumber && travelCoordinatorBadgeNumber != '?') {

            if (travelCoordinatorBadgeNumber == '-1') {
                travelCoordinatorBadgeNumber = $('#txtTravelCoordinatorBadgeNumber').val();
                travelCoordinatorName = $('#txtTravelCoordinatorName').val();
            }
            else {
                travelCoordinatorName = $("#ddlTravelCoordinator option:selected").text();
            }

            if (travelCoordinatorBadgeNumber && canSubmit) {
                canSubmit = true;
            }
        }
        else {
            canSubmit = false;
        }

        // Agree checkbox
        var agreedToTermsAndConditions = $('#cbAgree').prop('checked');

        if (!agreedToTermsAndConditions) {
            canSubmit = false;
        }

        // Submitted by user name
        var submittedByUserName = $('#txtSubmittedByUserName').val().trim();
        if (!submittedByUserName) {
            canSubmit = false;
        }

        if (canSubmit) {
            $.ajax({
                type: "POST",
                url: "/api/approval/submitnew",
                data: JSON.stringify({
                    "HeirarchichalApprovalRequest":{
                        "TravelRequestId": travelRequestId,
                        "BadgeNumber": badgeNumber,
                        "AgreedToTermsAndConditions": agreedToTermsAndConditions,
                        "SubmittedByUserName": submittedByUserName,
                        "ApproverList": [
                            {
                                "ApproverName": departmentHeadName,
                                "ApproverBadgeNumber": departmentHeadBadgeNumber,
                                "ApprovalOrder":1
                            },
                            {
                                "ApproverName": executiveOfficerName,
                                "ApproverBadgeNumber": executiveOfficerBadgeNumber,
                                "ApprovalOrder": 2
                            },
                            {
                                "ApproverName": ceoForInternationalName,
                                "ApproverBadgeNumber": ceoForInternationalBadgeNumber,
                                "ApprovalOrder": 3
                            },
                            {
                                "ApproverName": ceoForAPTAName,
                                "ApproverBadgeNumber": ceoForAPTABadgeNumber,
                                "ApprovalOrder": 4
                            },
                            {
                                "ApproverName": travelCoordinatorName,
                                "ApproverBadgeNumber": travelCoordinatorBadgeNumber,
                                "ApprovalOrder": 5
                            }
                        ]
                    }
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    $("#submitsuccess").fadeIn("slow");
                    $('#submitsuccessmessage').html("Travel request has been successfully submitted. Travel request# is <b>" + travelRequestId + "</b>.");

                    $('#btnSubmit').prop("disabled", true);
                    $('#btnBack').prop("disabled", true);
                },
                error: function (xhr, options, error) {
                    if (xhr.status == 500) {

                        var errorMessage = xhr.responseText;

                        $("#submiterror").fadeIn("slow");
                        $('#submiterrormessage').text(errorMessage);

                        // fade out in 5 seconds
                        $("#submiterror").fadeOut(fadeOutTimeInMilliseconds);
                    }
                }
            });
        }
        else {
            $("#submiterror").fadeIn("slow");
            $('#submiterrormessage').text("Some of the required fields are missing. Please try again.");

            // fade out in 5 seconds
            $("#submiterror").fadeOut(fadeOutTimeInMilliseconds);
        }

    }

    // travel request fields
    $scope.badgeNumber = 0;
    $scope.travelRequestUserName = "";
    $scope.division = "";
    $scope.section = "";
    $scope.organization = "";
    $scope.meetingLocation = "";
    $scope.meetingBeginDate = "";
    $scope.meetingEndDate = "";
    $scope.depatureDate = "";
    $scope.returnDate = "";

    $scope.showTravelRequestInEditMode = function () {

        // get travel request data and set to scope variables
    }

    $scope.createTravelRequest = function () {

        // Get user inputs
        var badgeNumber = $scope.badgeNumber;

    }

    // load approve action
    $scope.loadApproveAction = function (travelRequestId) {

        $.get('/uitemplates/approve.html')
        .done(function (data) {
            $('#approvetemplate').html($compile($(data).html())($scope));

            $('#travelRequestIdForAction').text(travelRequestId);
            $scope.$apply();

            $('#txtComments').focus();
        });
    }

    // load reject action
    $scope.loadRejectAction = function (travelRequestId) {

        $.get('/uitemplates/reject.html')
        .done(function (data) {
            $('#rejecttemplate').html($compile($(data).html())($scope));

            $('#travelRequestIdForAction').text(travelRequestId);
            $scope.$apply();

            $('#txtComments').focus();
        });
    }

    // load travel request modal in edit mode
    $scope.loadTravelRequestForEdit = function (travelRequestId) {

        $('#travelrequesttemplate').html('');

        // get the data from api
        $.get('api/travelrequest/' + travelRequestId)
        .done(function (data) {

            $scope.TravelRequest = data;

            //reset travel request form section
            $.get('/uitemplates/travelrequestform.html')
            .done(function (data) {
                $('#travelrequesttemplate').html($compile($(data).html())($scope));
                $scope.$apply();

                $('#travelRequestIdForDisplay').html("Travel Request #<b>" + travelRequestId.toString() + "</b>");
                $('#txtBadgeNumber').val($scope.TravelRequest.BadgeNumber);
                $('#txtName').val($scope.TravelRequest.Name);
                $('#txtDivision').val($scope.TravelRequest.Division);
                $('#txtSection').val($scope.TravelRequest.Section);
                $('#txtOrganization').val($scope.TravelRequest.Organization);
                $('#txtMeetingLocation').val($scope.TravelRequest.MeetingLocation);

                if ($scope.TravelRequest.MeetingBeginDateTime.substring(0, 10) != '0001-01-01')
                {
                    $('#txtMeetingBeginDate').val($scope.TravelRequest.MeetingBeginDateTime.substring(0,10));
                }

                if ($scope.TravelRequest.MeetingEndDateTime.substring(0, 10) != '0001-01-01') {

                    $('#txtMeetingEndDate').val($scope.TravelRequest.MeetingEndDateTime.substring(0, 10));
                }

                if ($scope.TravelRequest.DepartureDateTime.substring(0, 10) != '0001-01-01') {

                    $('#txtDepartureDate').val($scope.TravelRequest.DepartureDateTime.substring(0, 10));
                }

                if ($scope.TravelRequest.ReturnDateTime.substring(0, 10) != '0001-01-01') {

                    $('#txtReturnDate').val($scope.TravelRequest.ReturnDateTime.substring(0, 10));
                }
                
                $("#txtBadgeNumber").prop("readonly", true);
                $("#txtBadgeNumber").prop("style", "background-color:lightgray;");
            });

            
            
           // $('').val();
        });
    }
});
