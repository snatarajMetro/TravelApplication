var app = angular.module('travelApp', ['ui.grid', 'ui.grid.pagination','ui.grid.resizeColumns']);
//var app = angular.module('travelApp', ['ui.grid']);

app.controller('travelAppCtrl', function ($scope, $compile) {

    // Estimated Expense section
    $scope.advanceLodgingAmount = 0.00;
    $scope.advanceAirfareAmount = 0.00;
    $scope.advanceRegistrationAmount = 0.00;
    $scope.advanceMealsAmount = 0.00;
    $scope.advanceCarRentalAmount = 0.00;
    $scope.advanceMiscellaneousAmount = 0.00;
    $scope.estimatedLodgingAmount = 0.00;
    $scope.estimatedAirfareAmount = 0.00;
    $scope.estimatedRegistrationAmount = 0.00;
    $scope.estimatedMealsAmount = 0.00;
    $scope.estimatedCarRentalAmount = 0.00;
    $scope.estimatedMiscellaneousAmount = 0.00;

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

    // Daily Total section
    $scope.dailyTotalAmount1 = "";
    $scope.dailyTotalAmount2 = "";
    $scope.totalDailyAmount = "";

    $scope.BusinessMileRate = 0.555;
    $scope.TotalMileA1 = "";
    $scope.TotalMileA2 = "";
    $scope.TotalMileA3 = "";
    $scope.TotalMileB1 = "";
    $scope.TotalMileB2 = "";
    $scope.BusinessMile1 = "";
    $scope.BusinessMile2 = "";
    $scope.BusinessMileAmount1 = "";
    $scope.BusinessMileAmount2 = "";
    $scope.Parking1 = "";
    $scope.Parking2 = "";
    $scope.Airfare1 = "";
    $scope.Airfare2 = "";
    $scope.Taxi1 = "";
    $scope.Taxi2 = "";
    $scope.Lodging1 = "";
    $scope.Lodging2 = "";
    $scope.Meals1 = "";
    $scope.Meals2 = "";
    $scope.Registration1 = "";
    $scope.Registration2 = "";
    $scope.Internet1 = "";
    $scope.Internet2 = "";
    $scope.Other1 = "";
    $scope.Other2 = "";

    $scope.totalMileA = "";
    $scope.totalMileB = "";
    $scope.totalBusinessMile = "";
    $scope.totalBusinessMileAmount = "";
    $scope.totalParking = "";
    $scope.totalAirfare = "";
    $scope.totalTaxi = "";
    $scope.totalLodging = "";
    $scope.totalMeals = "";
    $scope.totalRegistration = "";
    $scope.totalInternet = "";
    $scope.totalOther = "";
    $scope.totalPart2NonTravelExpenseAmount = "";
    $scope.totalSubmittedForApprovalAmount = "";
    $scope.totalPrePaidByMTAAmount = "";
    $scope.totalExpenseAmount = "";
    $scope.totalCashAdvanceAmount = "";
    $scope.totalAmount = "";

    $scope.updateTotalDailyAmount = function () {
        $scope.totalDailyAmount = (
            ($scope.dailyTotalAmount1 * 1)
            + ($scope.dailyTotalAmount2 * 1)
            );
    }

    $scope.updateSubmittedForApprovalAmount = function () {
        $scope.totalSubmittedForApprovalAmount = $scope.totalDailyAmount + $scope.totalPart2NonTravelExpenseAmount;
        updatetotalExpenseAmount();
    }

    $scope.updateMileATotal = function () {

        var totalA = 0;

        for (var index = 2; index < rowCounter; index++) {
            totalA = (totalA * 1) + ($("#txtTotalMiles" + (index + 1)).val() * 1);
        }

        $scope.totalMileA = (
            ($scope.TotalMileA1 * 1)
            + ($scope.TotalMileA2 * 1)
            + (totalA * 1)
            );

        updateBusinessMile();
        updateDailyTotal();
    }

    $scope.updateMileBTotal = function () {
        $scope.totalMileB = (
            ($scope.TotalMileB1 * 1)
            + ($scope.TotalMileB2 * 1)
            );

        updateBusinessMile();
        updateDailyTotal();
    }

    function updatetotalExpenseAmount() {
        $scope.totalExpenseAmount = ($scope.totalSubmittedForApprovalAmount * 1) - ($scope.totalPrePaidByMTAAmount * 1);

        
        $scope.totalAmount = $scope.totalExpenseAmount - ($scope.totalCashAdvanceAmount * 1)

    }

    function updateBusinessMile () {

        $scope.BusinessMile1 = (($scope.TotalMileA1 * 1) - ($scope.TotalMileB1 * 1));
        $scope.BusinessMile2 = (($scope.TotalMileA2 * 1) - ($scope.TotalMileB2 * 1));

        $scope.BusinessMileAmount1 = ($scope.BusinessMile1 * $scope.BusinessMileRate);
        $scope.BusinessMileAmount2 = ($scope.BusinessMile2 * $scope.BusinessMileRate);

        $scope.totalBusinessMile = (
            ($scope.BusinessMile1 * 1)
            + ($scope.BusinessMile2 * 1)
            );

        $scope.totalBusinessMileAmount = (
            ($scope.BusinessMileAmount1 * 1)
            + ($scope.BusinessMileAmount2 * 1)
            );
    }

    function updateDailyTotal() {

        $scope.dailyTotalAmount1 = (
                ($scope.BusinessMileAmount1 * 1)
                + ($scope.Parking1 * 1)
                + ($scope.Airfare1 * 1)
                + ($scope.Taxi1 * 1)
                + ($scope.Lodging1 * 1)
                + ($scope.Meals1 * 1)
                + ($scope.Registration1 * 1)
                + ($scope.Internet1 * 1)
                + ($scope.Other1 * 1)
            );

        $scope.dailyTotalAmount2 = (
                ($scope.BusinessMileAmount2 * 1)
                + ($scope.Parking2 * 1)
                + ($scope.Airfare2 * 1)
                + ($scope.Taxi2 * 1)
                + ($scope.Lodging2 * 1)
                + ($scope.Meals2 * 1)
                + ($scope.Registration2 * 1)
                + ($scope.Internet2 * 1)
                + ($scope.Other2 * 1)
            );

        $scope.totalDailyAmount = (
            ($scope.dailyTotalAmount1 * 1)
            + ($scope.dailyTotalAmount2 * 1)
            );

        $scope.totalSubmittedForApprovalAmount = $scope.totalDailyAmount + $scope.totalPart2NonTravelExpenseAmount * 1;

        updatetotalExpenseAmount();
    }

    $scope.updatePrePaidByMTAAmount = function () {
        updatetotalExpenseAmount();
    }

    $scope.updateParkingTotal = function () {
        $scope.totalParking = (
            ($scope.Parking1 * 1)
            + ($scope.Parking2 * 1)
            );

        updateDailyTotal();
    }

    $scope.updateAirfareTotal = function () {
        $scope.totalAirfare = (
            ($scope.Airfare1 * 1)
            + ($scope.Airfare2 * 1)
            );

        updateDailyTotal();
    }

    $scope.updateTaxiTotal = function () {
        $scope.totalTaxi = (
            ($scope.Taxi1 * 1)
            + ($scope.Taxi2 * 1)
            );

        updateDailyTotal();
    }

    $scope.updateLodgingTotal = function () {
        $scope.totalLodging = (
            ($scope.Lodging1 * 1)
            + ($scope.Lodging2 * 1)
            );

        updateDailyTotal();
    }

    $scope.updateMealTotal = function () {
        $scope.totalMeals = (
            ($scope.Meals1 * 1)
            + ($scope.Meals2 * 1)
            );

        updateDailyTotal();
    }

    $scope.updateRegistrationTotal = function () {
        $scope.totalRegistration = (
            ($scope.Registration1 * 1)
            + ($scope.Registration2 * 1)
            );

        updateDailyTotal();
    }

    $scope.updateInternetTotal = function () {
        $scope.totalInternet = (
            ($scope.Internet1 * 1)
            + ($scope.Internet2 * 1)
            );

        updateDailyTotal();
    }

    $scope.updateOtherTotal = function () {
        $scope.totalOther = (
            ($scope.Other1 * 1)
            + ($scope.Other2 * 1)
            );

        updateDailyTotal();
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
    $scope.totalFISAmount1 = 0.00;
    $scope.totalFISAmount2 = 0.00;
    $scope.totalFISAmount3 = 0.00;
    $scope.totalFISAmount4 = 0.00;
    $scope.totalFISAmount5 = 0.00;
    

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
    $scope.loadFileUpload2 = function (travelRequestId) {

        //var travelRequestId = $('#travelRequestId').text();

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
                        var badgeNumber = $('#travelRequestBadgeNumber').text();

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

            $('#travelrequesttemplate').show();
            $("#txtBadgeNumber").focus();

            // Date picker options
            var options = {
                format: 'mm/dd/yyyy',
                orientation: "top right",
                todayHighlight: true,
                autoclose: true,
            };

            //$('input[name="txtToday"]').datepicker(options);
            $('input[name="txtMeetingBeginDate"]').datepicker(options);
            $('input[name="txtMeetingEndDate"]').datepicker(options);
            $('input[name="txtDepartureDate"]').datepicker(options);
            $('input[name="txtReturnDate"]').datepicker(options);
            $('input[name="txtDateNeededBy"]').datepicker(options);

            $("#txtToday")
                .datepicker({ dateFormat: "mm/dd/yyyy" })
                .datepicker("setDate", new Date());
        });
    }

    // load cost centers and projects
    $scope.loadCostCenters = function () {
        //$scope.Projects = {};

        $.get('/api/fis/costcenters')
        .done(function (data) {
            $scope.CostCenters = JSON.parse(data);
            $scope.$apply();
        });


    };

    $scope.Projects = {};
    $scope.projects1 = {};
    $scope.projects2 = {};
    $scope.projects3 = [];
    $scope.projects4 = [];
    $scope.projects5 = [];

    $scope.getProjectsByCostCenterName = function (source, costCenterName) {

        // get projects based on cost center name
        // get the list only if it doesn't exists
        if (!$scope.Projects[costCenterName]) {
            $.get('/api/fis/projects/' + costCenterName)
            .done(function (data) {
                var result = JSON.parse(data);

                if (source == 'ddlCostCenter1') {
                    $scope.projects1 = result;
                    $scope.$apply();
                    $('#project1').val("?");
                }
                else if (source == 'ddlCostCenter2') {
                    $scope.projects2 = result;
                    $scope.$apply();
                    $('#project2').val("?");
                }
                else if (source == 'ddlCostCenter3') {
                    $scope.projects3 = result;
                }
                else if (source == 'ddlCostCenter4') {
                    $scope.projects4 = result;
                }
                else if (source == 'ddlCostCenter5') {
                    $scope.projects5 = result;
                }

                $scope.Projects[costCenterName] = result;
            });
        }
        else {
            if (source == 'ddlCostCenter1') {
                $scope.projects1 = $scope.Projects[costCenterName];
            }
            else if (source == 'ddlCostCenter2') {
                $scope.projects2 = $scope.Projects[costCenterName];
            }
            else if (source == 'ddlCostCenter3') {
                $scope.projects3 = $scope.Projects[costCenterName];
                $scope.$apply();
            }
            else if (source == 'ddlCostCenter4') {
                $scope.projects4 = $scope.Projects[costCenterName];
                $scope.$apply();
            }
            else if (source == 'ddlCostCenter5') {
                $scope.projects5 = $scope.Projects[costCenterName];
                $scope.$apply();
            }
        }
    };

    $scope.getProjects = function (source, costCenter) {
        $scope.getProjectsByCostCenterName(source, costCenter.Name);
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
            url: "/api/documents/supportingdocuments?travelRequestId=" + travelRequestNumber + "&badgeNumber=" + $('#travelRequestBadgeNumber').text(),
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

            $scope.loadCommonApprovers($('#travelRequestBadgeNumber').text());
           
            $scope.loadTravelCoordinators();
        });

    }

    // load existing travel requests
    $scope.loadExistingTravelRequests = function () {

        var actionTemplate = '<div style="float:left;" ng-if="row.entity.ViewActionVisible == true"><img title="View" class="actionImage" src="/Images/view.png" /></div><div ng-if="row.entity.EditActionVisible == true"><img title="Edit" class="actionImage" src="/Images/edit.png" alt="{{row.entity.TravelRequestId}}" onclick="editTravelRequest(this);" /></div> <div ng-if="row.entity.ApproveActionVisible == true"><img title="Approve" class="actionImage" src="/Images/approve1.png" alt="{{row.entity.TravelRequestId}}" onclick="showApproveSection(this);" /><img title="Reject" class="actionImage2" src="/Images/reject1.png" alt="{{row.entity.TravelRequestId}}" onclick="showRejectSection(this);" /></div>';

        $scope.columns = [{
                field: 'TravelRequestId',
                displayName: 'Travel Request#',
                //width: 130,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search',
                    cellClass: 'travelrequestidcolumn'
                        }
            },
            {
                field: 'Purpose',
                name: 'Purpose',
                //width: 300,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                cellTooltip:
                        function (row, col) {
                            return row.entity.Purpose;
                        },
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'SubmittedByUser',
                name: 'Submitted By',
                //width: 160,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'SubmittedDateTime',
                displayName: 'Submitted On',
                //width: 115,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: "RequiredApprovers",
                displayName: "Required Approvers",
                //width: 340,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                cellTooltip: 
                        function( row, col ) {
                            return row.entity.RequiredApprovers;
                    },
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'LastApproveredByUser',
                displayName: 'Last Approvered By',
                width: 150,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'LastApprovedDateTime',
                displayName: 'Last Approved On',
                //width: 150,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'Status',
                displayName: 'Status',
                //width: 120,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                name: 'Actions',
                cellTemplate: actionTemplate,
                enableFiltering: false,
                width: 112,
                headerCellClass: "existingrequestcolumnheader",
                enableColumnResizing: false,
            }];

        $scope.existingRequestsGridOptions = {
            enableSorting: false,
            enableColumnResizing: true,
            columnDefs: $scope.columns,
            enableFiltering: true,
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            onRegisterApi: function (gridApi) {
                $scope.grid1Api = gridApi;
            }
        };

        var badgeNumber = $("#signedInUserBadgeNumber").text();
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

        var badgeNumber     = $("#signedInUserBadgeNumber").text();
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

                    $("#submitsuccess2").fadeIn("slow");
                    $('#submitsuccessmessage2').html("Travel request has been successfully submitted. Travel request# is <b>" + travelRequestId + "</b>.");

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
        var badgeNumber = $('#signedInUserBadgeNumber').text();

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

                    $("#submitsuccess2").fadeIn("slow");
                    $('#submitsuccessmessage2').html("Travel request has been successfully submitted. Travel Request# is <b>" + travelRequestId + "</b>.");

                    $('#btnSubmit').prop("disabled", true);
                    $('#btnBack').prop("disabled", true);
                },
                error: function (xhr, options, error) {
                    if (xhr.status == 500) {

                        var errorMessage = xhr.responseText;

                        $("#submiterror2").fadeIn("slow");
                        $('#submiterrormessage2').text(errorMessage);

                        // fade out in 5 seconds
                        $("#submiterror2").fadeOut(fadeOutTimeInMilliseconds);
                    }
                }
            });
        }
        else {
            $("#submiterror2").fadeIn("slow");
            $('#submiterrormessage2').text("Some of the required fields are missing. Please try again.");

            // fade out in 5 seconds
            $("#submiterror2").fadeOut(fadeOutTimeInMilliseconds);
        }

    }

    $scope.submitRequestReimbursement = function () {

        var canSubmit = false;
        var travelRequestId = $('#travelRequestId').text();
        var badgeNumber = $('#signedInUserBadgeNumber').text();

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
                url: "/api/approval/submitReimburse",
                data: JSON.stringify({
                    "HeirarchichalApprovalRequest": {
                        "TravelRequestId": travelRequestId,
                        "BadgeNumber": badgeNumber,
                        "AgreedToTermsAndConditions": agreedToTermsAndConditions,
                        "SubmittedByUserName": submittedByUserName,
                        "ApproverList": [
                            {
                                "ApproverName": departmentHeadName,
                                "ApproverBadgeNumber": departmentHeadBadgeNumber,
                                "ApprovalOrder": 1
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

                    $("#submitsuccess2").fadeIn("slow");
                    $('#submitsuccessmessage2').html("Reimbursement request has been successfully submitted. Reimbursement Request# is <b>" + travelRequestId + "</b>.");

                    $('#btnSubmit').prop("disabled", true);
                    $('#btnBack').prop("disabled", true);
                },
                error: function (xhr, options, error) {
                    if (xhr.status == 500) {

                        var errorMessage = xhr.responseText;

                        $("#submiterror2").fadeIn("slow");
                        $('#submiterrormessage2').text(errorMessage);

                        // fade out in 5 seconds
                        $("#submiterror2").fadeOut(fadeOutTimeInMilliseconds);
                    }
                }
            });
        }
        else {
            $("#submiterror2").fadeIn("slow");
            $('#submiterrormessage2').text("Some of the required fields are missing. Please try again.");

            // fade out in 5 seconds
            $("#submiterror2").fadeOut(fadeOutTimeInMilliseconds);
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

            $('#travelRequestIdForRejectAction').text(travelRequestId);
            $scope.$apply();

            $('#txtCommentsForReject').focus();
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
        });
    }

    // load travel request modal in edit mode
    $scope.loadTravelRequestForEditNew = function (travelRequestId) {

        $('#travelrequesttemplate').html('');

        // get the data from api
        $.get('api/travelrequestNew/' + travelRequestId)
        .done(function (data) {

            $scope.Data = data;

            //reset travel request form section
            $.get('/uitemplates/travelrequest.html')
            .done(function (data) {
                $('#travelrequesttemplate').html($compile($(data).html())($scope));
                $scope.$apply();

                // set user data section
                $('#travelRequestIdForDisplay').html("Travel Request #<b>" + travelRequestId.toString() + "</b>");
                $('#txtBadgeNumber').val($scope.Data.TravelRequestData.BadgeNumber);
                $('#txtName').val($scope.Data.TravelRequestData.Name);
                $('#txtDivision').val($scope.Data.TravelRequestData.Division);
                $('#txtSection').val($scope.Data.TravelRequestData.Section);
                $('#txtOrganization').val($scope.Data.TravelRequestData.Organization);
                $('#txtMeetingLocation').val($scope.Data.TravelRequestData.MeetingLocation);
                $('#txtPurpose').val($scope.Data.TravelRequestData.Purpose);
                $('#txtMeetingBeginDate').val($scope.Data.TravelRequestData.StrMeetingBeginDateTime);
                $('#txtMeetingEndDate').val($scope.Data.TravelRequestData.StrMeetingEndDateTime);
                $('#txtDepartureDate').val($scope.Data.TravelRequestData.StrDepartureDateTime);
                $('#txtReturnDate').val($scope.Data.TravelRequestData.StrReturnDateTime);
                $("#txtBadgeNumber").prop("readonly", true);
                $("#txtBadgeNumber").prop("style", "background-color:lightgray;");

                // set estimated expense section
                $('#txtAdvLodge').val($scope.Data.EstimatedExpenseData.AdvanceLodging);
                $('#txtTotalEstimatedLodge').val($scope.Data.EstimatedExpenseData.TotalEstimatedLodge);
                $('#txtAdvAirfare').val($scope.Data.EstimatedExpenseData.AdvanceAirFare);
                $('#txtTotalEstimatedAirfare').val($scope.Data.EstimatedExpenseData.TotalEstimatedAirFare);
                $('#txtAdvRegistration').val($scope.Data.EstimatedExpenseData.AdvanceRegistration);
                $('#txtTotalEstimatedRegistration').val($scope.Data.EstimatedExpenseData.TotalEstimatedRegistration);
                $('#txtAdvMeals').val($scope.Data.EstimatedExpenseData.AdvanceMeals);
                $('#txtTotalEstimatedMeals').val($scope.Data.EstimatedExpenseData.TotalEstimatedMeals);
                $('#txtAdvCarRental').val($scope.Data.EstimatedExpenseData.AdvanceCarRental);
                $('#txtTotalEstimatedCarRental').val($scope.Data.EstimatedExpenseData.TotalEstimatedCarRental);
                $('#txtAdvMiscellaneous').val($scope.Data.EstimatedExpenseData.AdvanceMiscellaneous);
                $('#txtTotalEstimatedMiscellaneous').val($scope.Data.EstimatedExpenseData.TotalEstimatedMiscellaneous);
                $('#txtAdvanceTotal').val($scope.Data.EstimatedExpenseData.AdvanceTotal);
                $('#txtEstimatedTotal').val($scope.Data.EstimatedExpenseData.TotalEstimatedTotal);
                $('#txtHotelNameAndAddress').val($scope.Data.EstimatedExpenseData.HotelNameAndAddress);
                $('#txtSchedule').val($scope.Data.EstimatedExpenseData.Schedule);
                $('#txtPayableTo').val($scope.Data.EstimatedExpenseData.PayableToAndAddress);
                $('#txtNotes').val($scope.Data.EstimatedExpenseData.Note);
                $('#txtAgencyName').val($scope.Data.EstimatedExpenseData.AgencyNameAndReservation);
                $('#txtShuttle').val($scope.Data.EstimatedExpenseData.Shuttle);
                $('#txtCashAdvanceRequested').val($scope.Data.EstimatedExpenseData.CashAdvance);
                
                if ($scope.Data.EstimatedExpenseData.DateNeededBy.substring(0, 10) != '0001-01-01') {

                    $('#txtDateNeededBy').val($scope.Data.EstimatedExpenseData.DateNeededBy.substring(0, 10));
                }

                // set fis section
                $('#txtFISTotal').val($scope.Data.FISData.TotalAmount);

                 //set 1st row of FIS data
                if ($scope.Data.FISData.FISDetails[0]) {

                    var costCenterName = $scope.Data.FISData.FISDetails[0].CostCenterId;

                    $("#ddlCostCenter1").val(costCenterName);
                    angular.element("#ddlCostCenter1").triggerHandler('change');
                    $("#txtLineItem1").val($scope.Data.FISData.FISDetails[0].LineItem);
                    $("#txtTask1").val($scope.Data.FISData.FISDetails[0].Task);
                    $("#txtAmount1").val($scope.Data.FISData.FISDetails[0].Amount);

                    $.get('/api/fis/delay')
                    .done(function () {
                       
                        var projectName = $scope.Data.FISData.FISDetails[0].ProjectId;
                        $('#project1').val(projectName);
                    });
                }

                // set 2nd row of FIS data
                if ($scope.Data.FISData.FISDetails[1]) {

                    var costCenterName = $scope.Data.FISData.FISDetails[1].CostCenterId;

                    $("#ddlCostCenter2").val(costCenterName);
                    angular.element("#ddlCostCenter2").triggerHandler('change');
                    $("#txtLineItem2").val($scope.Data.FISData.FISDetails[1].LineItem);
                    $("#txtTask2").val($scope.Data.FISData.FISDetails[1].Task);
                    $("#txtAmount2").val($scope.Data.FISData.FISDetails[1].Amount);

                    $.get('/api/fis/delay')
                    .done(function () {

                        var projectName = $scope.Data.FISData.FISDetails[1].ProjectId;
                        $('#project2').val(projectName);
                    });
                }

                $('#travelrequesttemplate').show();

            });
        });
    }

    $scope.loadTravelReimbursementRequest = function (travelRequestId) {
        $.get('/uitemplates/travelreimbursement.html')
        .done(function (data) {
            $('#travelreimbursementtemplate').html($compile($(data).html())($scope));
            $('#travelreimbursementtemplate').show();

            // Date picker options
            var options = {
                format: 'mm/dd/yyyy',
                orientation: "top right",
                todayHighlight: true,
                autoclose: true,
            };

            $('input[name="txtTravelPeriodFrom"]').datepicker(options);
            $('input[name="txtTravelPeriodTo"]').datepicker(options);
            $('input[name="txtTravelDate1"]').datepicker(options);
            $('input[name="txtTravelDate2"]').datepicker(options);

            $("#txtToday")
                .datepicker({ dateFormat: "mm/dd/yyyy" })
                .datepicker("setDate", new Date());

            $.get('api/reimburse/TravelrequestDetails/' + travelRequestId)
            .done(function (data) {

                // Set user detail section
                $("#txtTravelRequestNumber1").val(data.TravelReimbursementDetails.TravelRequestId);
                $("#txtBadgeNumber").val(data.TravelReimbursementDetails.BadgeNumber);
                $("#txtTravelPeriodFrom").val(data.TravelReimbursementDetails.DepartureDateTime);
                $("#txtTravelPeriodTo").val(data.TravelReimbursementDetails.ReturnDateTime);
                $("#txtVendorNumber").val(data.TravelReimbursementDetails.VendorNumber);
                $("#txtCostCenterNumber").val(data.TravelReimbursementDetails.CostCenterId);
                $("#txtName").val(data.TravelReimbursementDetails.Name);
                $("#txtExtension").val(data.TravelReimbursementDetails.Extension);
                $("#txtDivision").val(data.TravelReimbursementDetails.Division);
                $("#txtDepartment").val(data.TravelReimbursementDetails.Department);
                $("#txtCashAdvance").val(data.CashAdvance);
                $scope.totalCashAdvanceAmount = data.CashAdvance;

                // Set FIS section
                angular.forEach(data.Fis.FISDetails, function (value, index) {

                    var counter = index + 1;

                    $("#ddlCostCenter" + counter).val(value.CostCenterId);
                    $("#txtAccount" + counter).val(value.LineItem);
                    $("#txtTask" + counter).val(value.Task);
                    $("#txtAmount" + counter).val(value.Amount);

                    angular.element("#ddlCostCenter" + counter).triggerHandler('change');

                    $.get('/api/fis/delay')
                    .done(function () {
                        $("#ddlProjects" + counter).val(value.ProjectId);
                        $scope.$apply();
                    });
                })
            });

            $scope.$apply();

            $("#btnAddRow").on("click", function () {

                rowCounter++;

                var newRow = $("<tr ng-app='travelApp' ng-controller='travelAppCtrl' class='tablerow' id='row" + rowCounter + "' name='row" + rowCounter + "'>");

                var cols = "";

                cols += "<td style='padding:0px;'>";
                cols += "   <input type='text' placeholder='MM/DD/YYYY' id='txtTravelDate" + rowCounter + "' name='txtTravelDate" + rowCounter + "' class='datainputdate2' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='text' id='txtCityState" + rowCounter + "' name='txtCityState" + rowCounter + "' class='datainputname2' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='text' id='txtTotalMiles" + rowCounter + "' name='txtTotalMiles" + rowCounter + "' class='datatransportationcolumn' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='TotalMileA" + rowCounter + "' ng-change='updateMileATotal()' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='text' id='txtNormalMiles" + rowCounter + "' name='txtNormalMiles" + rowCounter + "' class='datatransportationcolumn' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='TotalMileB" + rowCounter + "' ng-change='updateMileBTotal()' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='text' id='txtBusinessMiles" + rowCounter + "' name='txtBusinessMiles" + rowCounter + "' class='datatransportationcolumn' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='BusinessMile" + rowCounter + "' disabled readonly />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='number' min='0.00' max='999999.99' step='0.01' placeholder='0.00' id='txtBusinessMilesTotal" + rowCounter + "' name='txtBusinessMilesTotal" + rowCounter + "' class='inputtransportationnumber' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='BusinessMileAmount" + rowCounter + "' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='number' min='0.00' max='999999.99' step='0.01' placeholder='0.00' id='txtParking" + rowCounter + "' name='txtParking" + rowCounter + "' class='inputtransportationnumber' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='Parking" + rowCounter + "' ng-change='updateParkingTotal()' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='number' min='0.00' max='999999.99' step='0.01' placeholder='0.00' id='txtAirfare" + rowCounter + "' name='txtAirfare" + rowCounter + "' class='inputtransportationnumber' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='Airfare" + rowCounter + "' ng-change='updateAirfareTotal()' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='number' min='0.00' max='999999.99' step='0.01' placeholder='0.00' id='txtTaxi" + rowCounter + "' name='txtTaxi" + rowCounter + "' class='inputtransportationnumber' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='Taxi" + rowCounter + "' ng-change='updateTaxiTotal()' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='number' min='0.00' max='999999.99' step='0.01' placeholder='0.00' id='txtLodging" + rowCounter + "' name='txtLodging" + rowCounter + "' class='inputtransportationnumber' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='Lodging" + rowCounter + "' ng-change='updateLodgingTotal()' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='number' min='0.00' max='999999.99' step='0.01' placeholder='0.00' id='txtMeals" + rowCounter + "' name='txtMeals" + rowCounter + "' class='inputtransportationnumber' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='Meals" + rowCounter + "' ng-change='updateMealTotal()' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='number' min='0.00' max='999999.99' step='0.01' placeholder='0.00' id='txtRegistration" + rowCounter + "' name='txtRegistration" + rowCounter + "' class='inputtransportationnumber' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='Registration" + rowCounter + "' ng-change='updateRegistrationTotal()' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='number' min='0.00' max='999999.99' step='0.01' placeholder='0.00' id='txtInternet" + rowCounter + "' name='txtInternet" + rowCounter + "' class='inputtransportationnumber' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='Internet" + rowCounter + "' ng-change='updateInternetTotal()' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='number' min='0.00' max='999999.99' step='0.01' placeholder='0.00' id='txtOther" + rowCounter + "' name='txtOther" + rowCounter + "' class='inputtransportationnumber' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='Other" + rowCounter + "' ng-change='updateOtherTotal()' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'>";
                cols += "   <input type='number' min='0.00' max='999999.99' step='0.01' placeholder='0.00' id='txtDailyTotal" + rowCounter + "' name='txtDailyTotal" + rowCounter + "' class='inputtransportationnumber' maxlength='4' onkeypress='return isNumberKey(event)' ng-model='dailyTotalAmount" + rowCounter + "' />";
                cols += "</td>";
                cols += "<td style='padding:0px;'><input type='button' class='deleterow btn btn-md btn-danger'  value='Delete'></td>";
                cols += "</tr>";

                newRow.append(cols);

                newRow.insertBefore($('#part1columntotal'));

                //var s = $("#row" + rowCounter);

                //var element = angular.element($("#divpart1"));

                //$compile(element.contents())($scope);

                //angular.element("#row3").triggerHandler('change');

                // Date picker options
                var options = {
                    format: 'mm/dd/yyyy',
                    orientation: "top right",
                    todayHighlight: true,
                    autoclose: true,
                };

                $("input[name=" + "'txtTravelDate" + rowCounter + "']").datepicker(options);

                //$("#txtTravelDate" + rowCounter).focus();

                $scope.$apply();
            });

            $("table.tablepart1").on("click", ".deleterow", function (event) {
                $(this).closest("tr").remove();
                rowCounter -= 1
            });
            
        });
    }

    $scope.loadExistingTravelReimbursementRequestsOld = function () {

        $.get('/uitemplates/existingtravelreimbursements.html')
        .done(function (data) {
            $('#existingtravelreimbursementtemplate').html($compile($(data).html())($scope));
            $scope.$apply();

            $('#existingtravelreimbursementtemplate').show();
        });
    }

    $scope.loadExistingTravelReimbursementRequests = function () {

        //var actionTemplate = '<div style="float:left;" ng-if="row.entity.ViewActionVisible == true"><img title="View" class="actionImage" src="/Images/view.png" /></div><div ng-if="row.entity.EditActionVisible == true"><img title="Create Travel Reimbursement" class="actionImage" src="/Images/reimbursement.png" alt="{{row.entity.TravelRequestId}}" onclick="createTravelRequestReimbursement(this);" /></div>';
        var actionTemplate = '<div style="float:left;" ng-if="row.entity.ViewActionVisible == true"><img title="View" class="actionImage" src="/Images/view.png" /></div><div ng-if="row.entity.EditActionVisible == true"><img title="Edit" class="actionImage" src="/Images/edit.png" alt="{{row.entity.TravelRequestId}}" onclick="editTravelRequest(this);" /></div> <div ng-if="row.entity.ApproveActionVisible == true"><img title="Approve" class="actionImage" src="/Images/approve1.png" alt="{{row.entity.TravelRequestId}}" onclick="showApproveSection(this);" /><img title="Reject" class="actionImage2" src="/Images/reject1.png" alt="{{row.entity.TravelRequestId}}" onclick="showRejectSection(this);" /></div>';

        $scope.columns = [{
                field: 'ReimbursementId',
                displayName: 'Reimbursement #',
                width: 150,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search',
                    cellClass: 'travelrequestidcolumn'
                }
            },
            {
                field: 'TravelRequestId',
                displayName: 'Travel Request#',
                width: 135,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search',
                    cellClass: 'travelrequestidcolumn'
                }
            },
            {
                field: 'Purpose',
                name: 'Purpose',
                //width: 300,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                cellTooltip:
                        function (row, col) {
                            return row.entity.Purpose;
                        },
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'SubmittedByUser',
                name: 'Submitted By',
                //width: 160,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'SubmittedDateTime',
                displayName: 'Submitted On',
                //width: 115,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: "RequiredApprovers",
                displayName: "Required Approvers",
                //width: 340,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                cellTooltip:
                        function (row, col) {
                            return row.entity.RequiredApprovers;
                        },
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'LastApprovedByUser',
                displayName: 'Last Approvered By',
                width: 150,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'LastApprovedDateTime',
                displayName: 'Last Approved On',
                //width: 150,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'Status',
                displayName: 'Status',
                //width: 120,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                name: 'Actions',
                cellTemplate: actionTemplate,
                enableFiltering: false,
                width: 112,
                headerCellClass: "existingrequestcolumnheader",
                enableColumnResizing: false,
            }];

        $scope.existingRequestsGridOptions = {
            enableSorting: false,
            enableColumnResizing: true,
            columnDefs: $scope.columns,
            enableFiltering: true,
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            onRegisterApi: function (gridApi) {
                $scope.grid1Api = gridApi;
            }
        };

        var badgeNumber = $("#signedInUserBadgeNumber").text();
        var selectedRoleId = $("#selectedRoleId").text();
        var url = "api/reimburse/reimbursementRequests?badgeNumber=" + badgeNumber + "&roleId=" + selectedRoleId;

        $.get(url)
       .done(function (data) {

           $scope.existingRequestsGridOptions.data = data;

           angular.forEach($scope.existingRequestsGridOptions.data, function (value, index) {

               if (value.SubmittedByUser == null || value.SubmittedByUser == '') {
                   $scope.columns[2].visible = false;
               }
           })

           $.get('/uitemplates/existingtravelreimbursements.html')
           .done(function (data) {
            $('#existingtravelreimbursementtemplate').html($compile($(data).html())($scope));
            $scope.$apply();
           });

       });
    }

    $scope.loadApprovedTravelRequests = function () {
        var actionTemplate = '<div style="display:flex;"><div syle="float:left;" ng-if="row.entity.ViewActionVisible == true"><input  type="button" id="btnView" name="btnView" value="View" alt="{{row.entity.TravelRequestId}}" onclick="" /></div><div><input  type="button" id="btnOk" name="btnOk" value="Reimburse" alt="{{row.entity.TravelRequestId}}" class="reimbursebutton" onclick="createTravelRequestReimbursement(this);" /></div></div>';

        $scope.columns = [{
            field: 'TravelRequestId',
            displayName: 'Travel Request#',
            //width: 130,
            headerCellClass: "existingrequestcolumnheader",
            cellClass: "existingrequestcolumnvalue",
            filter: {
                placeholder: '🔎 search',
                cellClass: 'travelrequestidcolumn'
            }
        },
            {
                field: 'Purpose',
                name: 'Purpose',
                //width: 300,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                cellTooltip:
                        function (row, col) {
                            return row.entity.Purpose;
                        },
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'SubmittedByUser',
                name: 'Submitted By',
                //width: 160,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'SubmittedDateTime',
                displayName: 'Submitted On',
                //width: 115,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: "RequiredApprovers",
                displayName: "Required Approvers",
                //width: 340,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                cellTooltip:
                        function (row, col) {
                            return row.entity.RequiredApprovers;
                        },
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'LastApproveredByUser',
                displayName: 'Last Approvered By',
                width: 150,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'LastApprovedDateTime',
                displayName: 'Last Approved On',
                //width: 150,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                field: 'Status',
                displayName: 'Status',
                //width: 120,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: '🔎 search'
                }
            },
            {
                name: 'Reimbursement',
                width: 150,
                cellTemplate: actionTemplate,
                enableFiltering: false,
                headerCellClass: "existingrequestcolumnheader",
                enableColumnResizing: false,
            }];

        $scope.existingRequestsGridOptions = {
            enableSorting: false,
            enableColumnResizing: true,
            columnDefs: $scope.columns,
            enableFiltering: true,
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            onRegisterApi: function (gridApi) {
                $scope.grid1Api = gridApi;
            }
        };

        var badgeNumber = $("#signedInUserBadgeNumber").text();
        var selectedRoleId = $("#selectedRoleId").text();
        var url = "api/reimburse/approvedTravelrequests?badgeNumber=" + badgeNumber + "&roleId=" + selectedRoleId;

        $.get(url)
       .done(function (data) {

           $scope.existingRequestsGridOptions.data = data;

           angular.forEach($scope.existingRequestsGridOptions.data, function (value, index) {

               if (value.SubmittedByUser == null || value.SubmittedByUser == '') {
                   $scope.columns[2].visible = false;
               }
           })

           $.get('/uitemplates/approvedtravelrequests.html')
           .done(function (data) {
               $('#approvedtravelrequesttemplate').html($compile($(data).html())($scope));
               $scope.$apply();
           });

       });
    }

    $scope.loadFileUploadForReimbursement = function (travelRequestId) {

        //var travelRequestId = $('#travelRequestId').text();

        // load supporting document grid
        $scope.loadSupportingDocuments(travelRequestId);

        $.get('/uitemplates/uploadandsubmitreimbursement.html')
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
                        var badgeNumber = $('#travelRequestBadgeNumber').text();

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

    

});
