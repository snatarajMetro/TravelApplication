var app = angular.module('travelApp', ['ui.grid', 'ui.grid.pagination','ui.grid.resizeColumns']);
//var app = angular.module('travelApp', ['ui.grid']);

app.controller('travelAppCtrl', function ($scope, $compile,$timeout) {

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

    $scope.BusinessMileRate = 0.555;

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

    $scope.updateMileATotal = function (model) {

        var totalA = 0;
        
        for (var index = 0; index < 3; index++) {
            if (model && model[index].TotalMiles) {
                totalA = (totalA * 1) + (model[index].TotalMiles * 1);
            }
        }

        if (totalA > 0)
        {
            $scope.totalMileA = (totalA * 1);

           updateBusinessMile();
           updateDailyTotal();
        }
        
    }

    $scope.updateMileBTotal = function (model) {

        var totalB = 0;
      
        for (var index = 0; index < maxRowCount; index++) {
            if (model && model[index].MileageToWork) {
                totalB = (totalB * 1) + (model[index].MileageToWork * 1);
            }
        }

        
        if (totalB > 0) {
            $scope.totalMileB = (totalB * 1);

            updateBusinessMile();
            updateDailyTotal();
        }
    }

    function updatetotalExpenseAmount() {
        $scope.totalExpenseAmount   = ($scope.totalSubmittedForApprovalAmount * 1) - ($scope.totalPrePaidByMTAAmount * 1);     
        $scope.totalAmount          = $scope.totalExpenseAmount - ($scope.totalCashAdvanceAmount * 1)
    }

    function updateBusinessMile () {

        var totalBusinessMile = 0;
        var totalBusinessMileAmount = 0;

        for (var index = 0; index < maxRowCount; index++) {

            $scope.TravelModel[index].BusinessMiles = (($scope.TravelModel[index].TotalMiles * 1) - ($scope.TravelModel[index].MileageToWork * 1));
            $scope.TravelModel[index].BusinessMileAmount = ($scope.TravelModel[index].BusinessMiles * $scope.BusinessMileRate);

            totalBusinessMile += ($scope.TravelModel[index].BusinessMiles * 1);
            totalBusinessMileAmount += ($scope.TravelModel[index].BusinessMileAmount * 1);
        }

        $scope.totalBusinessMile = totalBusinessMile;
        $scope.totalBusinessMileAmount = totalBusinessMileAmount;
    }

    function updateDailyTotal(model) {

        var totalDailyAmount = 0;

        if (model) {

            for (var index = 0; index < maxRowCount; index++) {

                model[index].DailyTotal = (
                        (model[index].BusinessMileAmount * 1)
                        + (model[index].Parking * 1)
                        + (model[index].Airfare * 1)
                        + (model[index].Taxi * 1)
                        + (model[index].Lodging * 1)
                        + (model[index].Meals * 1)
                        + (model[index].Registration * 1)
                        + (model[index].Internet * 1)
                        + (model[index].Other * 1)
                    );

                totalDailyAmount += (model[index].DailyTotal * 1);
            }

            $scope.totalDailyAmount = totalDailyAmount;
        }

        $scope.totalSubmittedForApprovalAmount = ($scope.totalDailyAmount * 1) + ($scope.totalPart2NonTravelExpenseAmount * 1);

        updatetotalExpenseAmount();
    }

    $scope.updatePrePaidByMTAAmount = function () {
        updatetotalExpenseAmount();
    }

    $scope.updateParkingTotal = function (model) {

        var totalParking = 0;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalParking += (model[index].Parking * 1);
            }

            $scope.totalParking = totalParking;
            updateDailyTotal(model);
        }  
    }

    $scope.updateAirfareTotal = function (model) {

        var totalAirfare = 0;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalAirfare += (model[index].Airfare * 1);
            }

            $scope.totalAirfare = totalAirfare;
            updateDailyTotal(model);
        }
    }

    $scope.updateTaxiTotal = function (model) {

        var totalTaxi = 0;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalTaxi += (model[index].Taxi * 1);
            }

            $scope.totalTaxi = totalTaxi;
            updateDailyTotal(model);
        }
    }

    $scope.updateLodgingTotal = function (model) {

        var totalLodging = 0;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalLodging += (model[index].Lodging * 1);
            }

            $scope.totalLodging = totalLodging;
            updateDailyTotal(model);
        }
    }

    $scope.updateMealTotal = function (model) {

        var totalMeals = 0;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalMeals += (model[index].Meals * 1);
            }

            $scope.totalMeals = totalMeals;
            updateDailyTotal(model);
        }
    }

    $scope.updateRegistrationTotal = function (model) {

        var totalRegistration = 0;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalRegistration += (model[index].Registration * 1);
            }

            $scope.totalRegistration = totalRegistration;
            updateDailyTotal(model);
        }
    }

    $scope.updateInternetTotal = function (model) {

        var totalInternet = 0;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalInternet += (model[index].Internet * 1);
            }

            $scope.totalInternet = totalInternet;
            updateDailyTotal(model);
        }
    }

    $scope.updateOtherTotal = function (model) {

        var totalOther = 0;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalOther += (model[index].Other * 1);
            }

            $scope.totalOther = totalOther;
            updateDailyTotal(model);
        }
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

                    if ($scope.SelectedProject) {
                        $("#ddlProjects1").val($scope.SelectedProject[0].Id);
                        $scope.SelectedProject[0].Id = "";
                    }
                }
                else if (source == 'ddlCostCenter2') {
                    $scope.projects2 = result;
                    $scope.$apply();
                    $('#project2').val("?");

                    if ($scope.SelectedProject) {
                        $("#ddlProjects2").val($scope.SelectedProject[1].Id);
                        $scope.SelectedProject[1].Id = "";
                    }
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
                //alert('here');
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

        $scope.existingRequestsGridOptions3 = {
            enableSorting: false,
            enableColumnResizing: true,
            columnDefs: $scope.columns,
            enableFiltering: true,
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        var badgeNumber = $("#signedInUserBadgeNumber").text();
        var selectedRoleId = $("#selectedRoleId").text();
        var url = "api/travelrequests?badgeNumber=" + badgeNumber + "&roleId=" + selectedRoleId;

        $.get(url)
       .done(function (data) {

           $scope.existingRequestsGridOptions3.data = data;

           angular.forEach($scope.existingRequestsGridOptions3.data, function (value, index) {

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

           $scope.existingRequestsGridOptions3.data = data;

           angular.forEach($scope.existingRequestsGridOptions3.data, function (value, index) {

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

        $scope.TravelModel = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        $scope.totalMileA = 0;
        $scope.totalMileB = 0;
        $scope.totalBusinessMile = 0;
        $scope.totalBusinessMileAmount = 0;
        $scope.totalAirfare = 0;
        $scope.totalPart2NonTravelExpenseAmount = 0;
        $scope.totalSubmittedForApprovalAmount = 0;
        $scope.totalPrePaidByMTAAmount = 0;
        $scope.totalExpenseAmount = 0;
        $scope.totalCashAdvanceAmount = 0;
        $scope.totalAmount = 0;
        $scope.totalFISAmount = 0;
        $scope.SelectedProject = [{}, {}];

        setWatch(); 

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
            $('input[name="txtTravelDate3"]').datepicker(options);

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
                $("#txtPurpose").val(data.Purpose);
                
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

            $scope.$apply(function () {

                // set default values
                for (var index = 0; index < maxRowCount; index++) {
                    $scope.TravelModel[index].TravelDate = "";
                    $scope.TravelModel[index].City = "";
                    $scope.TravelModel[index].TotalMiles = 0;
                    $scope.TravelModel[index].MileageToWork = 0;
                    $scope.TravelModel[index].BusinessMiles = 0;
                    $scope.TravelModel[index].BusinessMileAmount = 0;
                    $scope.TravelModel[index].Parking = 0;
                    $scope.TravelModel[index].Airfare = 0;
                    $scope.TravelModel[index].Taxi = 0;
                    $scope.TravelModel[index].Lodging = 0;
                    $scope.TravelModel[index].Meals = 0
                    $scope.TravelModel[index].Registration = 0;
                    $scope.TravelModel[index].Internet = 0;
                    $scope.TravelModel[index].Other = 0;
                    $scope.TravelModel[index].DailyTotal = 0;
                }

                $("#btnAddRow").on("click", function () {

                    $("#row" + currentRowNumber).show();

                    // disable "add" button if max rouw count has been reached
                    if (currentRowNumber == maxRowCount) {
                        $("#btnAddRow").prop('disabled', 'disabled');
                    }

                    currentRowNumber++;
                });

                $("table.tablepart1").on("click", ".deleterow", function (event) {

                    currentRowNumber -= 1;

                    $scope.$apply(function () {

                        var index = (currentRowNumber - 1);

                        // reset
                        $scope.totalMileA = ($scope.totalMileA * 1) - ($scope.TravelModel[index].TotalMiles * 1);
                        $scope.totalMileB = ($scope.totalMileB * 1) - ($scope.TravelModel[index].MileageToWork * 1);
                        $scope.totalBusinessMile = ($scope.totalBusinessMile * 1) - ($scope.TravelModel[index].BusinessMiles * 1);
                        $scope.totalBusinessMileAmount = ($scope.totalBusinessMileAmount * 1) - ($scope.TravelModel[index].BusinessMileAmount * 1);

                        $scope.TravelModel[index].TravelDate = "";
                        $scope.TravelModel[index].City = "";
                        $scope.TravelModel[index].TotalMiles = 0;
                        $scope.TravelModel[index].MileageToWork = 0;
                        $scope.TravelModel[index].BusinessMiles = 0;
                        $scope.TravelModel[index].BusinessMileAmount = 0;
                        $scope.TravelModel[index].Parking = 0;
                        $scope.TravelModel[index].Airfare = 0;
                        $scope.TravelModel[index].Taxi = 0;
                        $scope.TravelModel[index].Lodging = 0;
                        $scope.TravelModel[index].Meals = 0;
                        $scope.TravelModel[index].Registration = 0;
                        $scope.TravelModel[index].Internet = 0;
                        $scope.TravelModel[index].Other = 0;

                        updateTotal($scope.TravelModel);
                    });

                    $("#row" + currentRowNumber).hide();
                    $("#btnAddRow").prop('disabled', '');
                });
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
        var actionTemplate = '<div style="float:left;" ng-if="row.entity.ViewActionVisible == true"><img title="View" class="actionImage" src="/Images/view.png" /></div><div ng-if="row.entity.EditActionVisible == true"><img title="Edit" class="actionImage" src="/Images/edit.png" alt="{{row.entity.TravelRequestId}}" onclick="editTravelReimbursement(this);" /></div> <div ng-if="row.entity.ApproveActionVisible == true"><img title="Approve" class="actionImage" src="/Images/approve1.png" alt="{{row.entity.TravelRequestId}}" onclick="showApproveSection(this);" /><img title="Reject" class="actionImage2" src="/Images/reject1.png" alt="{{row.entity.TravelRequestId}}" onclick="showRejectSection(this);" /></div>';

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
                width: 182,
                headerCellClass: "existingrequestcolumnheader",
                enableColumnResizing: false,
            }];

        $scope.existingRequestsGridOptions2 = {
            enableSorting: false,
            enableColumnResizing: true,
            columnDefs: $scope.columns,
            enableFiltering: true,
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        var badgeNumber = $("#signedInUserBadgeNumber").text();
        var selectedRoleId = $("#selectedRoleId").text();
        var url = "api/reimburse/reimbursementRequests?badgeNumber=" + badgeNumber + "&roleId=" + selectedRoleId;

        $.get(url)
       .done(function (data) {

           $scope.existingRequestsGridOptions2.data = data;

           angular.forEach($scope.existingRequestsGridOptions2.data, function (value, index) {

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

        $scope.existingRequestsGridOptions1 = {
            enableSorting: false,
            enableColumnResizing: true,
            columnDefs: $scope.columns,
            enableFiltering: true,
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        var badgeNumber = $("#signedInUserBadgeNumber").text();
        var selectedRoleId = $("#selectedRoleId").text();
        var url = "api/reimburse/approvedTravelrequests?badgeNumber=" + badgeNumber + "&roleId=" + selectedRoleId;

        $.get(url)
       .done(function (data) {

           $scope.existingRequestsGridOptions1.data = data;

           angular.forEach($scope.existingRequestsGridOptions1.data, function (value, index) {

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

    function setWatch() {
        var i = 0;
        for (var index = 0; index < maxRowCount; index++) {

            $scope.$watch('TravelModel[' + index + '].TotalMiles', function () {
                updateTotal($scope.TravelModel);
            });

            $scope.$watch('TravelModel[' + index + '].MileageToWork', function () {
                updateTotal($scope.TravelModel);
            });

            $scope.$watch('TravelModel[' + index + '].Parking', function () {
                updateTotal($scope.TravelModel);
            });

            $scope.$watch('TravelModel[' + index + '].Airfare', function () {
                updateTotal($scope.TravelModel);
            });

            $scope.$watch('TravelModel[' + index + '].Taxi', function () {
                updateTotal($scope.TravelModel);
            });

            $scope.$watch('TravelModel[' + index + '].Lodging', function () {
                updateTotal($scope.TravelModel);
            });

            $scope.$watch('TravelModel[' + index + '].Meals', function () {
                updateTotal($scope.TravelModel);
            });

            $scope.$watch('TravelModel[' + index + '].Registration', function () {
                updateTotal($scope.TravelModel);
            });

            $scope.$watch('TravelModel[' + index + '].Internet', function () {
                updateTotal($scope.TravelModel);
            });

            $scope.$watch('TravelModel[' + index + '].Other', function () {
                updateTotal($scope.TravelModel);
            });
            
            //$scope.$watch('ddlCostCenter' + (i + 1), function () {
            //    if ($scope.CostCenters) {
            //        //alert('2:' + 'ddlCostCenter' + (i + 1));
            //        $scope.getProjects('ddlCostCenter' + (i + 1), $scope.CostCenters[i]);
            //        i = i + 1;
            //        $scope.$apply();
            //    }
            //});
        }
    }

    function updateTotal(model) {

        //alert('here');
        $scope.updateMileATotal(model);
        $scope.updateMileBTotal(model);
        $scope.updateParkingTotal(model);
        $scope.updateAirfareTotal(model);
        $scope.updateTaxiTotal(model);
        $scope.updateLodgingTotal(model);
        $scope.updateMealTotal(model);
        $scope.updateRegistrationTotal(model);
        $scope.updateInternetTotal(model);
        $scope.updateOtherTotal(model);
    }

    // load travel reimbursement modal in edit mode
    $scope.loadTravelReimbursementForEdit = function (travelRequestId) {

        $scope.TravelModel = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        $scope.totalBusinessMile = 0;
        $scope.totalAirfare = 0;
        $scope.totalPart2NonTravelExpenseAmount = 0;
        $scope.totalSubmittedForApprovalAmount = 0;
        $scope.totalPrePaidByMTAAmount = 0;
        $scope.totalExpenseAmount = 0;
        $scope.totalCashAdvanceAmount = 0;
        $scope.totalAmount = 0;
        $scope.totalFISAmount = 0;
        $scope.SelectedProject = [{}, {}];

        setWatch();

        $('#travelrequesttemplate').html('');

        // get the data from api
        $.get('api/reimburse/' + travelRequestId)
        .done(function (data) {

            $scope.Data = data;

            //reset travel request form section
            $.get('/uitemplates/travelreimbursement.html')
            .always(function (data) {
                $('#travelreimbursementtemplate').html($compile($(data).html())($scope));
                $scope.$apply();

                $scope.$apply(function () {

                // set default values
                    for (var index = 0; index < maxRowCount; index++) {
                    $scope.TravelModel[index].TravelDate = "";
                    $scope.TravelModel[index].City = "";
                    $scope.TravelModel[index].TotalMiles = 0;
                    $scope.TravelModel[index].MileageToWork = 0;
                    $scope.TravelModel[index].BusinessMiles = 0;
                    $scope.TravelModel[index].BusinessMileAmount = 0;
                    $scope.TravelModel[index].Parking = 0;
                    $scope.TravelModel[index].Airfare = 0;
                    $scope.TravelModel[index].Taxi = 0;
                    $scope.TravelModel[index].Lodging = 0;
                    $scope.TravelModel[index].Meals = 0
                    $scope.TravelModel[index].Registration = 0;
                    $scope.TravelModel[index].Internet = 0;
                    $scope.TravelModel[index].Other = 0;
                    $scope.TravelModel[index].DailyTotal = 0;
                }

                // set user data section
                $('#travelRequestIdForDisplay').html("Travel Request #<b>" + travelRequestId.toString() + "</b>");
                $('#txtBadgeNumber').val($scope.Data.ReimbursementTravelRequestDetails.BadgeNumber);
                $('#txtName').val($scope.Data.ReimbursementTravelRequestDetails.Name);
                $('#txtTravelRequestNumber1').val($scope.Data.ReimbursementTravelRequestDetails.TravelRequestId);
                $('#txtDivision').val($scope.Data.ReimbursementTravelRequestDetails.Division);
                $('#txtVendorNumber').val($scope.Data.ReimbursementTravelRequestDetails.VendorNumber);
                $('#txtCostCenterNumber').val($scope.Data.ReimbursementTravelRequestDetails.CostCenterId);
                $('#txtTravelPeriodFrom').val($scope.Data.ReimbursementTravelRequestDetails.StrDepartureDateTime);
                $('#txtTravelPeriodTo').val($scope.Data.ReimbursementTravelRequestDetails.StrReturnDateTime);
                $('#txtPurpose').val($scope.Data.ReimbursementTravelRequestDetails.Purpose);
                $('#txtDepartment').val($scope.Data.ReimbursementTravelRequestDetails.Department);
                $('#txtExtension').val($scope.Data.ReimbursementTravelRequestDetails.Extension);

                // set travel data section
                for (var index = 0; index < $scope.Data.ReimbursementDetails.Reimbursement.length; index++) {

                    $scope.TravelModel[index].TravelDate            = $scope.Data.ReimbursementDetails.Reimbursement[index].Date;
                    $scope.TravelModel[index].City                  = $scope.Data.ReimbursementDetails.Reimbursement[index].CityStateAndBusinessPurpose;
                    $scope.TravelModel[index].TotalMiles            = $scope.Data.ReimbursementDetails.Reimbursement[index].Miles;
                    $scope.TravelModel[index].MileageToWork         = $scope.Data.ReimbursementDetails.Reimbursement[index].MileageToWork;
                    $scope.TravelModel[index].BusinessMiles         = $scope.Data.ReimbursementDetails.Reimbursement[index].BusinessMiles;
                    $scope.TravelModel[index].BusinessMileAmount    = $scope.Data.ReimbursementDetails.Reimbursement[index].BusinessMilesXRate;
                    $scope.TravelModel[index].Parking               = $scope.Data.ReimbursementDetails.Reimbursement[index].ParkingAndGas;
                    $scope.TravelModel[index].Airfare               = $scope.Data.ReimbursementDetails.Reimbursement[index].AirFare;
                    $scope.TravelModel[index].Taxi                  = $scope.Data.ReimbursementDetails.Reimbursement[index].TaxiRail;
                    $scope.TravelModel[index].Lodging               = $scope.Data.ReimbursementDetails.Reimbursement[index].Lodge;
                    $scope.TravelModel[index].Meals                 = $scope.Data.ReimbursementDetails.Reimbursement[index].Meals;
                    $scope.TravelModel[index].Registration          = $scope.Data.ReimbursementDetails.Reimbursement[index].Registration;
                    $scope.TravelModel[index].Internet              = $scope.Data.ReimbursementDetails.Reimbursement[index].Internet;
                    $scope.TravelModel[index].Other                 = $scope.Data.ReimbursementDetails.Reimbursement[index].Others;
                    $scope.TravelModel[index].DailyTotal            = $scope.Data.ReimbursementDetails.Reimbursement[index].DailyTotal;
                }

                // set FIS expense section
                $scope.totalFISAmount = $scope.Data.FIS.TotalAmount;

                for (var index = 0; index < $scope.Data.FIS.FISDetails.length; index++) {

                    var costCenterName = $scope.Data.FIS.FISDetails[index].CostCenterId;

                    $("#ddlCostCenter" + (index + 1)).val(costCenterName);
                    $("#txtAccount" + (index + 1)).val($scope.Data.FIS.FISDetails[index].LineItem);
                    $("#txtTask" + (index + 1)).val($scope.Data.FIS.FISDetails[index].Task);
                    $("#txtAmount" + (index + 1)).val($scope.Data.FIS.FISDetails[index].Amount);
                }

                });

                for (var index2 = 0; index2 < $scope.Data.FIS.FISDetails.length; index2++) {

                    var projectName = $scope.Data.FIS.FISDetails[index2].ProjectId;
                    $scope.SelectedProject[index2].Id = projectName;
                    $timeout(angular.element("#ddlCostCenter" + (index2 + 1)).triggerHandler('change'), 0, true);

                }
            });
        });
    }

});
