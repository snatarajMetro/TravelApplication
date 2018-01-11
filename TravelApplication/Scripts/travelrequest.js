var app = angular.module('travelApp', ['ui.grid', 'ui.grid.pagination', 'ui.grid.resizeColumns']);
//var app = angular.module('travelApp', ['ui.grid']);

app.controller('travelAppCtrl', function ($scope, $compile, $timeout, uiGridConstants) {

    // Estimated Expense section
    //$scope.advanceLodgingAmount = 0.00;
    //$scope.advanceAirfareAmount = 0.00;
    //$scope.advanceRegistrationAmount = 0.00;
    //$scope.advanceMealsAmount = 0.00;
    //$scope.advanceCarRentalAmount = 0.00;
    //$scope.advanceMiscellaneousAmount = 0.00;
    //$scope.estimatedLodgingAmount = 0.00;
    //$scope.estimatedAirfareAmount = 0.00;
    //$scope.estimatedRegistrationAmount = 0.00;
    //$scope.estimatedMealsAmount = 0.00;
    //$scope.estimatedCarRentalAmount = 0.00;
    //$scope.estimatedMiscellaneousAmount = 0.00;

    $scope.updateTotalAdvanceAmount = function () {

        $scope.totalAdvanceAmount = parseFloat((
            ($scope.advanceLodgingAmount * 1)
            + ($scope.advanceAirfareAmount * 1)
            + ($scope.advanceRegistrationAmount * 1)
            + ($scope.advanceMealsAmount * 1)
            + ($scope.advanceCarRentalAmount * 1)
            + ($scope.advanceMiscellaneousAmount * 1)
            ).toFixed(2));

        $scope.totalCashAdvanceAmount = parseFloat((
            ($scope.advanceLodgingAmount * 1)
            + ($scope.advanceMealsAmount * 1)
            + ($scope.advanceMiscellaneousAmount * 1)
            ).toFixed(2));
    }

    $scope.updateTotalEstimatedAmount = function () {

        $scope.FISRequestModel = [{}, {}, {}, {}, {}];

        $scope.totalEstimatedAmount = parseFloat((
            ($scope.estimatedLodgingAmount * 1)
            + ($scope.estimatedAirfareAmount * 1)
            + ($scope.estimatedRegistrationAmount * 1)
            + ($scope.estimatedMealsAmount * 1)
            + ($scope.estimatedCarRentalAmount * 1)
            + ($scope.estimatedMiscellaneousAmount * 1)
            ).toFixed(2));

        if (($scope.estimatedRegistrationAmount * 1) > 0) {
            $('#txtLineItem2').val("50915");
            $('#txtAmount2').val(($scope.estimatedRegistrationAmount * 1));
            $timeout(angular.element("#txtAmount2").triggerHandler('change'), 0, true);
        } else {
            $('#txtLineItem2').val("");
            $('#txtAmount2').val("");
            $timeout(angular.element("#txtAmount2").triggerHandler('change'), 0, true);
        }
    }

    $scope.updateTotalOtherEstimatedAmount = function () {

        $scope.FISRequestModel = [{}, {}, {}, {}, {}];

        $scope.totalOtherEstimatedAmount = parseFloat((
            ($scope.estimatedOtherLodgingAmount * 1)
            + ($scope.estimatedOtherAirfareAmount * 1)
            + ($scope.estimatedOtherMealsAmount * 1)
        ).toFixed(2));

    }

    $scope.updateTotalActualEstimatedAmount = function () {

        $scope.FISRequestModel = [{}, {}, {}, {}, {}];

        $scope.totalActualEstimatedAmount = parseFloat((
            ($scope.estimatedActualLodgingAmount * 1)
            + ($scope.estimatedActualAirfareAmount * 1)
            + ($scope.estimatedActualMealsAmount * 1)
        ).toFixed(2));

    }

    $scope.BusinessMileRate = 0.555;

    $scope.updateFISTotal = function (model) {
        var totalFISAmount = 0;

        for (var index = 0; index < maxRowCount; index++) {
            if (model && model[index].Amount) {
                totalFISAmount = (totalFISAmount * 1) + (model[index].Amount * 1);
            }
        }

        if (totalFISAmount > 0) {
            $scope.totalFISAmount = parseFloat((totalFISAmount * 1).toFixed(2));
        }
    }

    $scope.updateTotalDailyAmount = function () {
        $scope.totalDailyAmount = (
            ($scope.dailyTotalAmount1 * 1)
            + ($scope.dailyTotalAmount2 * 1)
            );
    }

    $scope.updateSubmittedForApprovalAmount = function () {
        $scope.totalSubmittedForApprovalAmount = parseFloat((($scope.totalDailyAmount * 1) + ($scope.totalPart2NonTravelExpenseAmount * 1)).toFixed(2));
        updatetotalExpenseAmount();
    }

    $scope.updateMileATotal = function (model) {

        var totalA = 0;

        for (var index = 0; index < maxRowCount; index++) {
            if (model && model[index].TotalMiles) {
                totalA = (totalA * 1) + (model[index].TotalMiles * 1);
            }
        }

        if (totalA > 0) {
            $scope.totalMileA = (totalA * 1);

            updateBusinessMile();
            updateDailyTotal(model);
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
        $scope.totalExpenseAmount = ($scope.totalSubmittedForApprovalAmount * 1) - ($scope.totalPrePaidByMTAAmount * 1);
        $scope.totalAmount = parseFloat(($scope.totalExpenseAmount - ($scope.totalCashAdvanceAmount * 1) - ($scope.totalPersonalAdvanceAmount * 1)).toFixed(2));
    }

    function updateBusinessMile() {

        var totalBusinessMile = 0;
        var totalBusinessMileAmount = 0;

        for (var index = 0; index < maxRowCount; index++) {

            $scope.TravelModel[index].BusinessMiles = (($scope.TravelModel[index].TotalMiles * 1) - ($scope.TravelModel[index].MileageToWork * 1));
            $scope.TravelModel[index].BusinessMileAmount = parseFloat(($scope.TravelModel[index].BusinessMiles * $scope.BusinessMileRate).toFixed(2));

            totalBusinessMile += ($scope.TravelModel[index].BusinessMiles * 1);
            totalBusinessMileAmount += ($scope.TravelModel[index].BusinessMileAmount * 1);
        }

        //alert(totalBusinessMile);
        $scope.totalBusinessMile = totalBusinessMile;
        $scope.totalBusinessMileAmount = parseFloat(totalBusinessMileAmount.toFixed(2));
    }

    function updateDailyTotal(model) {

        var totalDailyAmount = 0;

        if (model) {

            for (var index = 0; index < maxRowCount; index++) {

                model[index].DailyTotal = parseFloat((
                        (model[index].BusinessMileAmount * 1)
                        + (model[index].Parking * 1)
                        + (model[index].Airfare * 1)
                        + (model[index].Taxi * 1)
                        + (model[index].Lodging * 1)
                        + (model[index].Meals * 1)
                        + (model[index].Registration * 1)
                        + (model[index].Internet * 1)
                        + (model[index].Other * 1)
                    ).toFixed(2));

                totalDailyAmount += (model[index].DailyTotal * 1);

            }
            $scope.totalDailyAmount = parseFloat(totalDailyAmount.toFixed(2));
        }

        $scope.totalSubmittedForApprovalAmount = parseFloat((($scope.totalDailyAmount * 1) + ($scope.totalPart2NonTravelExpenseAmount * 1)).toFixed(2));

        updatetotalExpenseAmount();
    }

    $scope.updatePrePaidByMTAAmount = function () {
        updatetotalExpenseAmount();
    }

    $scope.updatePersonalAdvanceAmount = function () {
        updatetotalExpenseAmount();
    }

    $scope.updateParkingTotal = function (model) {

        var totalParking = -1;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalParking += (model[index].Parking * 1);
            }

            if (totalParking >= 0) {
                $scope.totalParking = parseFloat(totalParking.toFixed(2)) + 1;
                updateDailyTotal(model);
            }
        }
    }

    $scope.updateAirfareTotal = function (model) {

        var totalAirfare = -1;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalAirfare += (model[index].Airfare * 1);
            }

            if (totalAirfare >= 0) {
                $scope.totalAirfare = parseFloat(totalAirfare.toFixed(2)) + 1;
                updateDailyTotal(model);
            }
        }
    }

    $scope.updateTaxiTotal = function (model) {

        var totalTaxi = -1;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalTaxi += (model[index].Taxi * 1);
            }

            if (totalTaxi >= 0) {
                $scope.totalTaxi = parseFloat(totalTaxi.toFixed(2)) + 1;
                updateDailyTotal(model);
            }
        }
    }

    $scope.updateLodgingTotal = function (model) {

        var totalLodging = -1;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalLodging += (model[index].Lodging * 1);
            }

            if (totalLodging >= 0) {
                $scope.totalLodging = parseFloat(totalLodging.toFixed(2)) + 1;
                updateDailyTotal(model);
            }
        }
    }

    $scope.updateMealTotal = function (model) {

        var totalMeals = -1;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalMeals += (model[index].Meals * 1);
            }

            if (totalMeals >= 0) {
                $scope.totalMeals = parseFloat(totalMeals.toFixed(2)) + 1;
                updateDailyTotal(model);
            }
        }
    }

    $scope.updateRegistrationTotal = function (model) {

        var totalRegistration = -1;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalRegistration += (model[index].Registration * 1);
            }

            if (totalRegistration >= 0) {
                $scope.totalRegistration = parseFloat(totalRegistration.toFixed(2)) + 1;
                updateDailyTotal(model);
            }
        }
    }

    $scope.updateInternetTotal = function (model) {

        var totalInternet = -1;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalInternet += (model[index].Internet * 1);
            }

            if (totalInternet >= 0) {
                $scope.totalInternet = parseFloat(totalInternet.toFixed(2)) + 1;
                updateDailyTotal(model);
            }
        }
    }

    $scope.updateOtherTotal = function (model) {

        var totalOther = -1;

        if (model) {
            for (var index = 0; index < maxRowCount; index++) {
                totalOther += (model[index].Other * 1);
            }

            if (totalOther >= 0) {
                $scope.totalOther = parseFloat(totalOther.toFixed(2)) + 1;
                updateDailyTotal(model);
            }
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
    //$scope.totalFISAmount1 = 0.00;
    //$scope.totalFISAmount2 = 0.00;
    //$scope.totalFISAmount3 = 0.00;
    //$scope.totalFISAmount4 = 0.00;
    //$scope.totalFISAmount5 = 0.00;


    //$scope.updateTotalFISAmount = function () {
    //    $scope.totalFISAmount = parseFloat((
    //        ($scope.totalFISAmount1 * 1)
    //        + ($scope.totalFISAmount2 * 1)
    //        + ($scope.totalFISAmount3 * 1)
    //        + ($scope.totalFISAmount4 * 1)
    //        + ($scope.totalFISAmount5 * 1)
    //        ).toFixed(2));
    //}

    $scope.updateTotalFISAmount = function (model) {

        var totalFISAmount = 0;

        if (model) {
            $scope.totalFISAmount = "";

            for (var index = 0; index < maxRowCount; index++) {
                totalFISAmount += (model[index].Amount * 1);
            }
        }

        if (totalFISAmount > 0) {
            $scope.totalFISAmount = parseFloat((totalFISAmount * 1).toFixed(2));
        }
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

            // Change the text of submit button to "Close" when "Admin" logs in
            if ($("#selectedRoleId").text() == "4") {
                $("#btnSubmit").val("Close");
            }
            $scope.$apply();

            // Add upload listners
            for (var index = 1; index < 6; index++) {

                // TODO: Base this on existing document result set
                if (index == 2) {
                    $("#supportingDocumentZone" + index + " .dz-message")
                       .css("background", "lightgray")
                       .css("height", "30px");
                    $("#uploaddocumenttext" + index).html("File has been uploaded");
                    $("#uploaddocumenticon" + index).show();
                }
                else {
                    setUpDropzone(index);
                }
            }
        });
    }

    // set fis section
    $scope.loadFIS = function () {
        $.get('/uitemplates/fis.html')
        .done(function (data) {
            $('#datatemplate').html($compile($(data).html())($scope));
            $scope.$apply();
        });
    }

    function setUpDropzone(index) {
        Dropzone.autoDiscover = false;

        var obj = $("#supportingDocumentZone" + index);

        obj.dropzone({
            url: "api/documents/upload",
            thumbnailWidth: 10,
            thumbnailHeight: 10,
            maxFilesize: 5, // MB
            addRemoveLinks: true,
            acceptedFiles: ".jpeg,.png,.gif,.txt,.pdf,.docx,.xlxs",
            init: function () {
                var self = this;

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
                file.previewElement.classList.add("dz-success");
                $(".dz-success-mark svg").css("background", "green");
                $(".dz-error-mark").css("display", "none");

                this.removeEventListeners();

                $("#supportingDocumentZone" + index + " .dz-message")
                    .css("background", "lightgray")
                    .css("height", "30px");
                $("#uploaddocumenttext" + index).html("File successfully uploaded");
                $("#uploaddocumenticon" + index).show();
            },
            error: function (file, response) {
                file.previewElement.classList.add("dz-error");
            }
        });
    }

    $scope.loadTravelRequest = function () {

        $scope.FISRequestModel = [{}, {}, {}, {}, {}];

        for (var index = 0; index < maxRowCount; index++) {

            $scope.$watch('FISRequestModel[' + index + '].Amount', function () {
                updateTotal3($scope.FISRequestModel);
            });
        }

        $.get('/uitemplates/travelrequest.html')
        .done(function (data) {

            $('#travelrequesttemplate').html($compile($(data).html())($scope));
            $scope.$apply();

            $scope.advanceLodgingAmount = "";
            $scope.advanceAirfareAmount = "";
            $scope.advanceRegistrationAmount = "";
            $scope.advanceMealsAmount = "";
            $scope.advanceCarRentalAmount = "";
            $scope.advanceMiscellaneousAmount = "";
            $scope.estimatedLodgingAmount = "";
            $scope.estimatedAirfareAmount = "";
            $scope.estimatedRegistrationAmount = "";
            $scope.estimatedMealsAmount = "";
            $scope.estimatedCarRentalAmount = "";
            $scope.estimatedMiscellaneousAmount = "";
            $scope.totalFISAmount = "";
            //$scope.totalFISAmount1 = "";
            //$scope.totalFISAmount2 = "";
            //$scope.totalFISAmount3 = "";
            //$scope.totalFISAmount4 = "";
            //$scope.totalFISAmount5 = "";

            // set default values
            for (var index = 0; index < maxRowCount; index++) {
                $scope.FISRequestModel[index].Amount = "";
            }

            $('#travelrequesttemplate').show();
            $("#txtBadgeNumber").focus();

            // Date picker options
            var options = {
                format: 'mm/dd/yyyy',
                orientation: "top right",
                todayHighlight: true,
                autoclose: true,
            };

            $('input[name="txtMeetingBeginDate"]').datepicker(options);
            $('input[name="txtMeetingEndDate"]').datepicker(options);
            $('input[name="txtDepartureDate"]').datepicker(options);
            $('input[name="txtReturnDate"]').datepicker(options);
            $('input[name="txtDateNeededBy"]').datepicker(options);

            $scope.$apply(function () {

                // add fis section row
                $("#btnAddRowRequest").on("click", function () {

                    $("#row" + currentRowNumberTravelRequest).show();

                    // disable "add" button if max row count has been reached
                    if (currentRowNumberTravelRequest == maxRowCount) {
                        $("#btnAddRowRequest").prop('disabled', 'disabled');
                    }

                    currentRowNumberTravelRequest++;
                });

                // delete fis section row
                $("div.tablebody").on("click", ".deleterowrequest", function (event) {

                    currentRowNumberTravelRequest -= 1;

                    $scope.$apply(function () {

                        var index = (currentRowNumberTravelRequest - 1);

                        // reset
                        $("#ddlCostCenter" + currentRowNumberTravelRequest).val("?");
                        $("#txtLineItem" + currentRowNumberFIS).val("");
                        $("#project" + currentRowNumberFIS).val("?");
                        $("#txtTask" + currentRowNumberFIS).val("");
                        //$("#txtAmount" + currentRowNumberFIS).val("");

                        $scope.FISRequestModel[index].Amount = "";

                        updateTotal3($scope.FISRequestModel);
                    });

                    $("#row" + currentRowNumberTravelRequest).hide();
                    $("#btnAddRowRequest").prop('disabled', '');
                });
            });

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
    //$scope.projects1 = {};
    //$scope.projects2 = {};
    //$scope.projects3 = {};
    //$scope.projects4 = {};
    //$scope.projects5 = {};

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
                        $("#project1").val($scope.SelectedProject[0].Id);
                        $scope.SelectedProject[0].Id = "";
                    }
                }
                else if (source == 'ddlCostCenter2') {
                    $scope.projects2 = result;
                    $scope.$apply();
                    $('#project2').val("?");

                    if ($scope.SelectedProject) {
                        $("#ddlProjects2").val($scope.SelectedProject[1].Id);
                        $("#project2").val($scope.SelectedProject[1].Id);
                        $scope.SelectedProject[1].Id = "";
                    }
                }
                else if (source == 'ddlCostCenter3') {
                    $scope.projects3 = result;
                    $scope.$apply();
                    $('#project3').val("?");

                    if ($scope.SelectedProject) {
                        $("#ddlProjects3").val($scope.SelectedProject[2].Id);
                        $("#project3").val($scope.SelectedProject[2].Id);
                        $scope.SelectedProject[2].Id = "";
                    }
                }
                else if (source == 'ddlCostCenter4') {
                    $scope.projects4 = result;
                    $scope.$apply();
                    $('#project4').val("?");

                    if ($scope.SelectedProject) {
                        $("#ddlProjects4").val($scope.SelectedProject[3].Id);
                        $("#project4").val($scope.SelectedProject[3].Id);
                        $scope.SelectedProject[3].Id = "";
                    }
                }
                else if (source == 'ddlCostCenter5') {
                    $scope.projects5 = result;
                    $scope.$apply();
                    $('#project5').val("?");

                    if ($scope.SelectedProject) {
                        $("#ddlProjects5").val($scope.SelectedProject[4].Id);
                        $("#project5").val($scope.SelectedProject[4].Id);
                        $scope.SelectedProject[4].Id = "";
                    }
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
            }
            else if (source == 'ddlCostCenter4') {
                $scope.projects4 = $scope.Projects[costCenterName];
            }
            else if (source == 'ddlCostCenter5') {
                $scope.projects5 = $scope.Projects[costCenterName];
            }
        }
    };

    $scope.getProjects = function (source, costCenter) {
        $scope.getProjectsByCostCenterName(source, costCenter.Name);
    };

    $scope.loadSupportingDocuments = function (travelRequestNumber) {

        //var cellTemplate2 = "<a href='{{row.entity.DownloadUrl}}'><img title='View/Download Document' class='viewDocument' src='/Images/download.png' width='30' height='30' /></a><a href='#'><img title='Delete Document' class='viewDocument' src='/Images/delete2.png' width='20' height='20' alt='{{row.entity.Id}}' onclick=deletedocument(this); /></a>";
        var cellTemplate2 = "<span ng-if='row.entity.AllowUpload == true'><a><img title='Upload Document' class='dz-clickable supportingDocumentZoneUpload' id='supportingDocumentZoneUpload{{row.entity.Id}}' src='/Images/upload.png' width='30' height='30' /></a></span><a href='{{row.entity.DownloadUrl}}'><img title='View/Download Document' class='viewDocument' src='/Images/download.png' width='30' height='30' /></a><a href='#'><img title='Delete Document' class='viewDocument' src='/Images/delete2.png' width='20' height='20' alt='{{row.entity.Id}}' onclick=deletedocument(this); /></a>";

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
                width: '150',
                displayName: 'Actions',
                cellTemplate: cellTemplate2,
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
    $scope.loadExistingTravelRequests = function (status) {

        var actionTemplate = '<div style="float:left;" ng-if="row.entity.ViewActionVisible == true"><a target="_blank" href="api/travelrequestReport/{{row.entity.TravelRequestId}}"><img title="View" class="actionImage" src="/Images/view.png" /></a></div><div style="float:left;" ng-if="row.entity.EditActionVisible == true"><img title="Edit" class="actionImage" src="/Images/edit.png" alt="{{row.entity.TravelRequestId}}" onclick="editTravelRequest(this);" /></div><div style="float:left;" ng-if="row.entity.CancelActionVisible == true"><img title="Cancel" class="actionImage" src="/Images/cancel.jpg" alt="{{row.entity.TravelRequestId}}|{{row.entity.BadgeNumber}}" onclick="showCancelSection(this);" /></div><div style="float:left;" ng-if="row.entity.ApproveActionVisible == true"><img title="Approve" class="actionImage" src="/Images/approve1.png" alt="{{row.entity.TravelRequestId}}|{{row.entity.ShowApproverAlert}}" onclick="showApproveSection(this);" /><img title="Reject" class="actionImage2" src="/Images/reject1.png" alt="{{row.entity.TravelRequestId}}" onclick="showRejectSection(this);" /></div>';
        //alert(status);

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
                width: 120,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: 'search',
                    term: status,
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [
                        { value: "", label: 'All' },
                        { value: "Cancelled", label: 'Cancelled' },
                        { value: "Completed", label: 'Completed' },
                        { value: "New", label: 'New' },
                        { value: "Pending", label: 'Pending' },
                        { value: "Rejected", label: 'Rejected' }
                    ],
                    disableCancelFilterButton: true
                }
            },
            {
                name: 'Actions',
                cellTemplate: actionTemplate,
                enableFiltering: false,
                width: 155,
                headerCellClass: "existingrequestcolumnheader",
                //enableColumnResizing: false,
            }];

        $scope.existingRequestsGridOptions3 = {
            enableSorting: false,
            //enableColumnResizing: true,
            columnDefs: $scope.columns,
            enableFiltering: true,
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            onRegisterApi: function (gridApiRequests) {
                $scope.gridApi = gridApiRequests;
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

           $scope.$apply();
       });
    }

    // Refresh the existing reimbursements grid
    $scope.refreshExistingReimbursements = function () {

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

           $scope.$apply();
       });
    }

    $scope.loadSubmitDetails = function (travelRequestId) {

        var url = "api/travelrequest/submitdetails/" + travelRequestId;

        $.get(url)
        .done(function (data) {

            // Set Department Head
            if (parseInt(data.TravelRequestSubmitDetail.DepartmentHeadBadgeNumber) == -1) {

                displayOtherSection('otherForDepartmentHead')
                $("#ddlDepartmentHead").val(data.TravelRequestSubmitDetail.DepartmentHeadBadgeNumber);
                $("#txtDepartmentHeadBadgeNumber").val(data.TravelRequestSubmitDetail.DepartmentHeadOtherBadgeNumber);
                $("#txtDepartmentHeadName").val(data.TravelRequestSubmitDetail.DepartmentHeadOtherName);
            }
            else if (parseInt(data.TravelRequestSubmitDetail.DepartmentHeadBadgeNumber) > 0) {
                $("#ddlDepartmentHead").val(parseInt(data.TravelRequestSubmitDetail.DepartmentHeadBadgeNumber));
            }

            // Set Executive Officer
            if (parseInt(data.TravelRequestSubmitDetail.ExecutiveOfficerBadgeNumber) == -1) {

                displayOtherSection('otherForExecutiveOfficer')
                $("#ddlExecutiveOfficer").val(parseInt(data.TravelRequestSubmitDetail.ExecutiveOfficerBadgeNumber));
                $("#txtExecutiveOfficerBadgeNumber").val(data.TravelRequestSubmitDetail.ExecutiveOfficerOtherBadgeNumber.toString());
                $("#txtExecutiveOfficerName").val(data.TravelRequestSubmitDetail.ExecutiveOfficerOtherName.toString());
            }
            else if (parseInt(data.TravelRequestSubmitDetail.ExecutiveOfficerBadgeNumber) > 0) {
                $("#ddlExecutiveOfficer").val(parseInt(data.TravelRequestSubmitDetail.ExecutiveOfficerBadgeNumber));
            }

            // Set CEO International
            if (parseInt(data.TravelRequestSubmitDetail.CEOInternationalBadgeNumber) == -1) {

                displayOtherSection('otherForCEOForInternational')
                $("#ddlCEOForInternational").val(parseInt(data.TravelRequestSubmitDetail.CEOInternationalBadgeNumber));
                $("#txtCEOForInternationalBadgeNumber").val(data.TravelRequestSubmitDetail.CEOInternationalOtherBadgeNumber.toString());
                $("#txtCEOForInternationalName").val(data.TravelRequestSubmitDetail.CEOInternationalOtherName.toString());
            }
            else if (parseInt(data.TravelRequestSubmitDetail.CEOInternationalBadgeNumber) > 0) {
                $("#ddlCEOForInternational").val(parseInt(data.TravelRequestSubmitDetail.CEOInternationalBadgeNumber));
            }

            // Set CEO APTA/CTA
            if (parseInt(data.TravelRequestSubmitDetail.CEOAPTABadgeNumber) == -1) {

                displayOtherSection('otherForCEOForAPTA')
                $("#ddlCEOForAPTA").val(parseInt(data.TravelRequestSubmitDetail.CEOAPTABadgeNumber));
                $("#txtCEOForAPTABadgeNumber").val(data.TravelRequestSubmitDetail.CEOAPTAOtherBadgeNumber.toString());
                $("#txtCEOForAPTAName").val(data.TravelRequestSubmitDetail.CEOAPTAOtherName.toString());
            }
            else if (parseInt(data.TravelRequestSubmitDetail.CEOAPTABadgeNumber) > 0) {
                $("#ddlCEOForAPTA").val(parseInt(data.TravelRequestSubmitDetail.CEOAPTABadgeNumber));
            }


            if (data.TravelRequestSubmitDetail.RejectedTravelRequest) {

                // Reset
                $("#ddlExecutiveOfficer").val("?");
                $("#ddlCEOForInternational").val("?");
                $("#ddlCEOForAPTA").val("?");

                // Hide following approvers when editing a rejected travel request
                // Executive Officer, CEO International, CEO APTA/CTA
                $("#additionalApprovers").hide();
            }

            // Set Travel Coordinator
            if (parseInt(data.TravelRequestSubmitDetail.TravelCoordinatorBadgeNumber) == -1) {

                displayOtherSection('otherForTravelCoordinator')
                $("#ddlTravelCoordinator").val(parseInt(data.TravelRequestSubmitDetail.TravelCoordinatorBadgeNumber));
                $("#txtTravelCoordinatorBadgeNumber").val(data.TravelRequestSubmitDetail.TravelCoordinatorOtherBadgeNumber.toString());
                $("#txtTravelCoordinatorName").val(data.TravelRequestSubmitDetail.TravelCoordinatorOtherName.toString());
            }
            else if (parseInt(data.TravelRequestSubmitDetail.TravelCoordinatorBadgeNumber) > 0) {
                $("#ddlTravelCoordinator").val(parseInt(data.TravelRequestSubmitDetail.TravelCoordinatorBadgeNumber));
            }

            // Set Agree
            $("#cbAgree").attr("checked", (data.TravelRequestSubmitDetail.Agree == true));

            // Set Submitter Name
            $("#txtSubmittedByUserName").val(data.TravelRequestSubmitDetail.SubmitterName);

            $scope.$apply();

        });
    }

    // load data for 1st four approvers dropdown
    $scope.loadCommonApprovers = function (badgeNumber, selectedApprovers) {

        $.ajax({
            type: "GET",
            url: "api/approval/heirarchichalpositions/" + badgeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                $scope.DepartmentHeads = data;
                $scope.ExecutiveOfficers = data;
                $scope.CEOsForInternational = data;
                $scope.CEOsForAPTA = data;
                $scope.$apply();

                if (selectedApprovers) {

                    $('#ddlDepartmentHead').val(selectedApprovers.DepartmentHead);
                    $('#ddlExecutiveOfficer').val(selectedApprovers.ExecutiveOfficer);
                    $('#ddlCEOForInternational').val(selectedApprovers.CEOForInternational);
                    $('#ddlCEOForAPTA').val(selectedApprovers.CEOForAPTA);
                }
            },
            error: function (xhr, options, error) {
            }
        });
    }

    $scope.loadTravelCoordinators = function (selectedApprovers) {

        $.ajax({
            type: "GET",
            url: "api/approval/TAApprovers",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                $scope.TravelCoordinators = data;
                $scope.$apply();

                if (selectedApprovers) {
                    $("#ddlTravelCoordinator").val(selectedApprovers.TravelCoordinator);
                }
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

        if (source.BadgeNumber == -1) {
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

    function displayOtherSection(container) {
        var div = '#' + container;
        $(div).show();
    }

    $scope.submitRequest = function () {

        var canSubmit = false;
        var travelRequestId = $('#travelRequestId').text();

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
        else {
            $("#submiterror").fadeIn("slow");
            $('#submiterrormessage').text("Some of the required fields are missing. Please try again.");

            // fade out in 5 seconds
            $("#submiterror").fadeOut(fadeOutTimeInMilliseconds);
        }

    }

    $scope.submitRequest2 = function () {

        var canSubmit = false;
        var travelRequestId = $('#travelRequestId').text();
        var signedInBadgeNumber = $('#signedInUserBadgeNumber').text();
        var travelRequestBadgeNumber = $('#travelRequestBadgeNumber').text();
        var txtName = $('#txtName').val();
        var action = $("#btnSubmit").val();

        if (action == "Close") {
            $("#fileuploadtemplate").hide();
            viewexistingtravelrequests();
            return;
        }

        // Department Head
        var departmentHeadBadgeNumber = $("#ddlDepartmentHead option:selected").val();
        var departmentHeadName = "";
        var departmentHeadOtherBadgeNumber = -1;

        if (departmentHeadBadgeNumber && departmentHeadBadgeNumber != '?') {

            if (departmentHeadBadgeNumber == '-1') {
                departmentHeadOtherBadgeNumber = $('#txtDepartmentHeadBadgeNumber').val();
                departmentHeadName = $('#txtDepartmentHeadName').val();
            }
            else {
                departmentHeadOtherBadgeNumber = -1;
                departmentHeadName = $("#ddlDepartmentHead option:selected").text();
            }

            if (departmentHeadBadgeNumber) {

                canSubmit = true;
            }
        }

        // Executive Officer
        var executiveOfficerBadgeNumber = $("#ddlExecutiveOfficer option:selected").val();
        var executiveOfficerName = "";
        var executiveOfficerOtherBadgeNumber = -1;

        if (executiveOfficerBadgeNumber && executiveOfficerBadgeNumber != '?') {

            if (executiveOfficerBadgeNumber == '-1') {
                executiveOfficerOtherBadgeNumber = $('#txtExecutiveOfficerBadgeNumber').val();
                executiveOfficerName = $('#txtExecutiveOfficerName').val();
            }
            else {
                executiveOfficerOtherBadgeNumber = -1;
                executiveOfficerName = $("#ddlExecutiveOfficer option:selected").text();
            }
        }
        else {
            executiveOfficerBadgeNumber = "";
        }

        // CEO (For International)
        var ceoForInternationalBadgeNumber = $("#ddlCEOForInternational option:selected").val();
        var ceoForInternationalName = "";
        var ceoForInternationalOtherBadgeNumber = -1;

        if (ceoForInternationalBadgeNumber && ceoForInternationalBadgeNumber != '?') {

            if (ceoForInternationalBadgeNumber == '-1') {
                ceoForInternationalOtherBadgeNumber = $('#txtCEOForInternationalBadgeNumber').val();
                ceoForInternationalName = $('#txtCEOForInternationalName').val();
            }
            else {
                ceoForInternationalOtherBadgeNumber = -1;
                ceoForInternationalName = $("#ddlCEOForInternational option:selected").text();
            }
        }
        else {
            ceoForInternationalBadgeNumber = "";
        }

        // CEO (For APTA/CTA conference)
        var ceoForAPTABadgeNumber = $("#ddlCEOForAPTA option:selected").val();
        var ceoForAPTAName = "";
        var ceoForAPTAOtherBadgeNumber = -1;

        if (ceoForAPTABadgeNumber && ceoForAPTABadgeNumber != '?') {

            if (ceoForAPTABadgeNumber == '-1') {
                ceoForAPTAOtherBadgeNumber = $('#txtCEOForAPTABadgeNumber').val();
                ceoForAPTAName = $('#txtCEOForAPTAName').val();
            }
            else {
                ceoForAPTAOtherBadgeNumber = -1;
                ceoForAPTAName = $("#ddlCEOForAPTA option:selected").text();
            }
        }
        else {
            ceoForAPTABadgeNumber = "";
        }

        // Travel Co-ordinator
        var travelCoordinatorBadgeNumber = $("#ddlTravelCoordinator option:selected").val();
        var travelCoordinatorName = "";
        var travelCoordinatorOtherBadgeNumber = -1;

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
                    "HeirarchichalApprovalRequest": {
                        "TravelRequestId": travelRequestId,
                        "SignedInBadgeNumber": signedInBadgeNumber,
                        "TravelRequestBadgeNumber": travelRequestBadgeNumber,
                        "TravelRequestName": txtName,
                        "AgreedToTermsAndConditions": agreedToTermsAndConditions,
                        "SubmittedByUserName": submittedByUserName,
                        "ApproverList": [
                            {
                                "ApproverName": departmentHeadName,
                                "ApproverBadgeNumber": departmentHeadBadgeNumber,
                                "ApproverOtherBadgeNumber": departmentHeadOtherBadgeNumber,
                                "ApprovalOrder": 1
                            },
                            {
                                "ApproverName": executiveOfficerName,
                                "ApproverBadgeNumber": executiveOfficerBadgeNumber,
                                "ApproverOtherBadgeNumber": executiveOfficerOtherBadgeNumber,
                                "ApprovalOrder": 2
                            },
                            {
                                "ApproverName": ceoForInternationalName,
                                "ApproverBadgeNumber": ceoForInternationalBadgeNumber,
                                "ApproverOtherBadgeNumber": ceoForInternationalOtherBadgeNumber,
                                "ApprovalOrder": 3
                            },
                            {
                                "ApproverName": ceoForAPTAName,
                                "ApproverBadgeNumber": ceoForAPTABadgeNumber,
                                "ApproverOtherBadgeNumber": ceoForAPTAOtherBadgeNumber,
                                "ApprovalOrder": 4
                            },
                            {
                                "ApproverName": travelCoordinatorName,
                                "ApproverBadgeNumber": travelCoordinatorBadgeNumber,
                                "ApproverOtherBadgeNumber": travelCoordinatorOtherBadgeNumber,
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
        var departmentHeadOtherBadgeNumber = -1;

        if (departmentHeadBadgeNumber && departmentHeadBadgeNumber != '?') {

            if (departmentHeadBadgeNumber == '-1') {
                departmentHeadOtherBadgeNumber = $('#txtDepartmentHeadBadgeNumber').val();
                departmentHeadName = $('#txtDepartmentHeadName').val();
            }
            else {
                departmentHeadOtherBadgeNumber = -1;
                departmentHeadName = $("#ddlDepartmentHead option:selected").text();
            }

            if (departmentHeadBadgeNumber) {

                canSubmit = true;
            }
        }

        // Executive Officer
        var executiveOfficerBadgeNumber = $("#ddlExecutiveOfficer option:selected").val();
        var executiveOfficerName = "";
        var executiveOfficerOtherBadgeNumber = -1;

        if (executiveOfficerBadgeNumber && executiveOfficerBadgeNumber != '?') {

            if (executiveOfficerBadgeNumber == '-1') {
                executiveOfficerOtherBadgeNumber = $('#txtExecutiveOfficerBadgeNumber').val();
                executiveOfficerName = $('#txtExecutiveOfficerName').val();
            }
            else {
                executiveOfficerOtherBadgeNumber = -1;
                executiveOfficerName = $("#ddlExecutiveOfficer option:selected").text();
            }
        }
        else {
            executiveOfficerBadgeNumber = "";
        }

        // CEO (For International)
        var ceoForInternationalBadgeNumber = $("#ddlCEOForInternational option:selected").val();
        var ceoForInternationalName = "";
        var ceoForInternationalOtherBadgeNumber = -1;

        if (ceoForInternationalBadgeNumber && ceoForInternationalBadgeNumber != '?') {

            if (ceoForInternationalBadgeNumber == '-1') {
                ceoForInternationalOtherBadgeNumber = $('#txtCEOForInternationalBadgeNumber').val();
                ceoForInternationalName = $('#txtCEOForInternationalName').val();
            }
            else {
                ceoForInternationalOtherBadgeNumber = -1;
                ceoForInternationalName = $("#ddlCEOForInternational option:selected").text();
            }
        }
        else {
            ceoForInternationalBadgeNumber = "";
        }

        // CEO (For APTA/CTA conference)
        var ceoForAPTABadgeNumber = $("#ddlCEOForAPTA option:selected").val();
        var ceoForAPTAName = "";
        var ceoForAPTAOtherBadgeNumber = -1;

        if (ceoForAPTABadgeNumber && ceoForAPTABadgeNumber != '?') {

            if (ceoForAPTABadgeNumber == '-1') {
                ceoForAPTAOtherBadgeNumber = $('#txtCEOForAPTABadgeNumber').val();
                ceoForAPTAName = $('#txtCEOForAPTAName').val();
            }
            else {
                ceoForAPTAOtherBadgeNumber = -1;
                ceoForAPTAName = $("#ddlCEOForAPTA option:selected").text();
            }
        }
        else {
            ceoForAPTABadgeNumber = "";
        }

        // Travel Co-ordinator
        var travelCoordinatorBadgeNumber = $("#ddlTravelCoordinator option:selected").val();
        var travelCoordinatorName = "";
        var travelCoordinatorOtherBadgeNumber = -1;

        if (travelCoordinatorBadgeNumber && travelCoordinatorBadgeNumber != '?') {

            if (travelCoordinatorBadgeNumber == '-1') {
                travelCoordinatorOtherBadgeNumber = $('#txtTravelCoordinatorBadgeNumber').val();
                travelCoordinatorName = $('#txtTravelCoordinatorName').val();
            }
            else {
                travelCoordinatorOtherBadgeNumber = -1;
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
                                "ApproverName": travelCoordinatorName,
                                "ApproverBadgeNumber": travelCoordinatorBadgeNumber,
                                "ApproverOtherBadgeNumber": travelCoordinatorOtherBadgeNumber,
                                "ApprovalOrder": 1
                            },
                            {
                                "ApproverName": departmentHeadName,
                                "ApproverBadgeNumber": departmentHeadBadgeNumber,
                                "ApproverOtherBadgeNumber": departmentHeadOtherBadgeNumber,
                                "ApprovalOrder": 2
                            },
                            {
                                "ApproverName": executiveOfficerName,
                                "ApproverBadgeNumber": executiveOfficerBadgeNumber,
                                "ApproverOtherBadgeNumber": executiveOfficerOtherBadgeNumber,
                                "ApprovalOrder": 3
                            },
                            {
                                "ApproverName": ceoForInternationalName,
                                "ApproverBadgeNumber": ceoForInternationalBadgeNumber,
                                "ApproverOtherBadgeNumber": ceoForInternationalOtherBadgeNumber,
                                "ApprovalOrder": 4
                            },
                            {
                                "ApproverName": ceoForAPTAName,
                                "ApproverBadgeNumber": ceoForAPTABadgeNumber,
                                "ApproverOtherBadgeNumber": ceoForAPTAOtherBadgeNumber,
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
    $scope.loadApproveAction = function (travelRequestId, showAlertText) {

        $.get('/uitemplates/approve.html')
        .done(function (data) {
            $('#approvetemplate').html($compile($(data).html())($scope));

            $('#travelRequestIdForAction').text(travelRequestId);

            if (showAlertText == 'true') {
                $('#approverAlert').show();
                $('#approvercontainer').prop("class", "main approveactioncontainerwithalert");
            }

            $scope.$apply();

            $('#txtComments').focus();
        });
    }

    // load reject action
    $scope.loadRejectAction = function (travelRequestId, selectedRoleId) {

        var url = "/uitemplates/reject.html";
        var selectedApprovers = {};

        // Get selected approvers if admin role
        if (selectedRoleId == 4) {
            url = "/uitemplates/adminreject.html";

            //selectedApprovers = {
            //    "DepartmentHead": 1002,
            //    "ExecutiveOfficer": 0,
            //    "CEOForInternational": 1003,
            //    "CEOForAPTA": 1001,
            //    "TravelCoordinator": 1234,
            //};
        }

        $.get(url)
        .done(function (data) {
            $('#rejecttemplate').html($compile($(data).html())($scope));

            $('#travelRequestIdForRejectAction').text(travelRequestId);
            $scope.$apply();

            if (selectedRoleId == 4) {
                $scope.loadCommonApprovers($('#travelRequestBadgeNumber').text(), selectedApprovers);
                $scope.loadTravelCoordinators(selectedApprovers);
            }

            $('#txtCommentsForReject').focus();
        });
    }

    // load cancel action
    $scope.loadCancelAction = function (travelRequestId, travelRequestBadgeNumber) {

        $.get('/uitemplates/cancel.html')
            .done(function (data) {
                $('#approvetemplate').html($compile($(data).html())($scope));

                $('#travelRequestIdForAction').text(travelRequestId);
                $('#travelrequestBadgeNumber').text(travelRequestBadgeNumber);
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

                if ($scope.TravelRequest.MeetingBeginDateTime.substring(0, 10) != '0001-01-01') {
                    $('#txtMeetingBeginDate').val($scope.TravelRequest.MeetingBeginDateTime.substring(0, 10));
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
        $scope.SelectedProject = [{}, {}, {}, {}, {}];
        $scope.FISRequestModel = [{}, {}, {}, {}, {}];
        $scope.advanceLodgingAmount = "";
        $scope.advanceAirfareAmount = "";
        $scope.advanceRegistrationAmount = "";
        $scope.advanceMealsAmount = "";
        $scope.advanceCarRentalAmount = "";
        $scope.advanceMiscellaneousAmount = "";
        $scope.estimatedLodgingAmount = "";
        $scope.estimatedAirfareAmount = "";
        $scope.estimatedRegistrationAmount = "";
        $scope.estimatedMealsAmount = "";
        $scope.estimatedCarRentalAmount = "";
        $scope.estimatedMiscellaneousAmount = "";
        $scope.totalFISAmount = "";
        $scope.estimatedOtherLodgingAmount = "";
        $scope.estimatedOtherAirfareAmount = "";
        $scope.estimatedOtherMealsAmount = "";
        $scope.estimatedActualLodgingAmount = "";
        $scope.estimatedActualAirfareAmount = "";
        $scope.estimatedActualMealsAmount = "";
        $scope.totalCashAdvanceAmount = "";
        $scope.personalTravelExpense = "";
        //$scope.totalFISAmount1 = "";
        //$scope.totalFISAmount2 = "";

        // set default values
        for (var index = 0; index < maxRowCount; index++) {
            $scope.FISRequestModel[index].Amount = "";
        }

        for (var index = 0; index < maxRowCount; index++) {
            $scope.$watch('FISRequestModel[' + index + '].Amount', function () {
                updateTotal3($scope.FISRequestModel);
            });
        }

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
                $('#txtAdvanceTotal').val($scope.Data.EstimatedExpenseData.AdvanceTotal);
                $('#txtEstimatedTotal').val($scope.Data.EstimatedExpenseData.TotalEstimatedTotal);
                $('#txtHotelNameAndAddress').val($scope.Data.EstimatedExpenseData.HotelNameAndAddress);
                $('#txtSchedule').val($scope.Data.EstimatedExpenseData.Schedule);
                $('#txtPayableTo').val($scope.Data.EstimatedExpenseData.PayableToAndAddress);
                $('#txtNotes').val($scope.Data.EstimatedExpenseData.Note);
                $('#txtAgencyName').val($scope.Data.EstimatedExpenseData.AgencyNameAndReservation);
                $('#txtShuttle').val($scope.Data.EstimatedExpenseData.Shuttle);
                //$('#txtCashAdvanceRequested').val($scope.Data.EstimatedExpenseData.CashAdvance);
                $('#estimatedExpenseId').text($scope.Data.EstimatedExpenseData.EstimatedExpenseId);

                $scope.advanceLodgingAmount = $scope.Data.EstimatedExpenseData.AdvanceLodging;
                $scope.advanceAirfareAmount = $scope.Data.EstimatedExpenseData.AdvanceAirFare;
                $scope.advanceRegistrationAmount = $scope.Data.EstimatedExpenseData.AdvanceRegistration;
                $scope.advanceMealsAmount = $scope.Data.EstimatedExpenseData.AdvanceMeals;
                $scope.advanceCarRentalAmount = $scope.Data.EstimatedExpenseData.AdvanceCarRental;
                $scope.advanceMiscellaneousAmount = $scope.Data.EstimatedExpenseData.AdvanceMiscellaneous;

                $scope.estimatedLodgingAmount = $scope.Data.EstimatedExpenseData.TotalEstimatedLodge;
                $scope.estimatedAirfareAmount = $scope.Data.EstimatedExpenseData.TotalEstimatedAirFare;
                $scope.estimatedRegistrationAmount = $scope.Data.EstimatedExpenseData.TotalEstimatedRegistration;
                $scope.estimatedMealsAmount = $scope.Data.EstimatedExpenseData.TotalEstimatedMeals;
                $scope.estimatedCarRentalAmount = $scope.Data.EstimatedExpenseData.TotalEstimatedCarRental;
                $scope.estimatedMiscellaneousAmount = $scope.Data.EstimatedExpenseData.TotalEstimatedMiscellaneous;

                $scope.estimatedOtherLodgingAmount = $scope.Data.EstimatedExpenseData.TotalOtherEstimatedLodge;
                $scope.estimatedOtherAirfareAmount = $scope.Data.EstimatedExpenseData.TotalOtherEstimatedAirFare;
                $scope.estimatedOtherMealsAmount = $scope.Data.EstimatedExpenseData.TotalOtherEstimatedMeals;
                $scope.totalOtherEstimatedAmount = $scope.Data.EstimatedExpenseData.TotalOtherEstimatedTotal;

                $scope.estimatedActualLodgingAmount = $scope.Data.EstimatedExpenseData.TotalActualEstimatedLodge;
                $scope.estimatedActualAirfareAmount = $scope.Data.EstimatedExpenseData.TotalActualEstimatedAirFare;
                $scope.estimatedActualMealsAmount = $scope.Data.EstimatedExpenseData.TotalActualEstimatedMeals;
                $scope.totalActualEstimatedAmount = $scope.Data.EstimatedExpenseData.TotalActualEstimatedTotal;

                if ($scope.Data.EstimatedExpenseData.PersonalTravelExpense > 0) {
                    $scope.personalTravelExpense = $scope.Data.EstimatedExpenseData.PersonalTravelExpense;
                }

                if ($scope.Data.EstimatedExpenseData.CashAdvance > 0) {
                    $scope.totalCashAdvanceAmount = $scope.Data.EstimatedExpenseData.CashAdvance;
                }

                if ($scope.Data.EstimatedExpenseData.DateNeededBy.substring(0, 10) != '0001-01-01') {

                    $('#txtDateNeededBy').val($scope.Data.EstimatedExpenseData.DateNeededBy.substring(0, 10));
                }

                // set fis section
                $('#txtFISTotal').val($scope.Data.FISData.TotalAmount);

                // Display Other estimated cost section, only if logged-in as "Admin" role
                var selectedRoleId = $("#selectedRoleId").text();

                // Admin role
                if (selectedRoleId == 4) {
                    $(".otherestimatecostsection").removeAttr("style");
                }

                // set FIS expense section
                if ($scope.Data.FISData) {
                    //$scope.totalFISAmount = $scope.Data.FIS.TotalAmount;

                    if ($scope.Data.FISData.FISDetails) {

                        for (var index = 0; index < $scope.Data.FISData.FISDetails.length; index++) {

                            var costCenterName = $scope.Data.FISData.FISDetails[index].CostCenterId;

                            $("#ddlCostCenter" + (index + 1)).val(costCenterName);
                            $("#txtLineItem" + (index + 1)).val($scope.Data.FISData.FISDetails[index].LineItem);
                            $("#txtTask" + (index + 1)).val($scope.Data.FISData.FISDetails[index].Task);

                            $scope.FISRequestModel[index].Amount = $scope.Data.FISData.FISDetails[index].Amount;

                            $("#row" + (index + 1)).show();
                            $("#deletefisrow" + (index + 1)).hide();

                            currentRowNumberTravelRequest = ((index + 1) + 1);

                            updateTotal3($scope.FISRequestModel);
                        }
                    }
                }

                // add fis section row
                $("#btnAddRowRequest").on("click", function () {

                    $("#row" + currentRowNumberTravelRequest).show();

                    // disable "add" button if max row count has been reached
                    if (currentRowNumberTravelRequest == maxRowCount) {
                        $("#btnAddRowRequest").prop('disabled', 'disabled');
                    }

                    currentRowNumberTravelRequest++;
                });

                // delete fis section row
                $("div.tablebody").on("click", ".deleterowrequest", function (event) {

                    currentRowNumberTravelRequest -= 1;

                    $scope.$apply(function () {

                        var index = (currentRowNumberTravelRequest - 1);

                        // reset
                        $("#ddlCostCenter" + currentRowNumberTravelRequest).val("?");
                        $("#txtLineItem" + currentRowNumberTravelRequest).val("");
                        $("#project" + currentRowNumberTravelRequest).val("?");
                        $("#txtTask" + currentRowNumberTravelRequest).val("");
                        //$("#txtAmount" + currentRowNumberFIS).val("");

                        $scope.FISRequestModel[index].Amount = "";

                        updateTotal3($scope.FISRequestModel);
                    });

                    $("#row" + currentRowNumberTravelRequest).hide();
                    $("#btnAddRowRequest").prop('disabled', '');
                });

                if ($scope.Data.FISData) {

                    if ($scope.Data.FISData.FISDetails) {
                        for (var index2 = 0; index2 < $scope.Data.FISData.FISDetails.length; index2++) {

                            var projectName = $scope.Data.FISData.FISDetails[index2].ProjectId;
                            $scope.SelectedProject[index2].Id = projectName;
                            $timeout(angular.element("#ddlCostCenter" + (index2 + 1)).triggerHandler('change'), 0, true);
                        }
                    }
                }

                $('#travelrequesttemplate').show();

            });
        });
    }

    $scope.loadTravelReimbursementRequest = function (travelRequestId) {

        $scope.TravelModel = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        $scope.FISModel = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        $scope.totalMileA = "";
        $scope.totalMileB = "";
        $scope.totalBusinessMile = "";
        $scope.totalBusinessMileAmount = "";
        $scope.totalAirfare = "";
        $scope.totalPart2NonTravelExpenseAmount = "";
        $scope.totalSubmittedForApprovalAmount = "";
        $scope.totalPrePaidByMTAAmount = "";
        $scope.totalExpenseAmount = "";
        $scope.totalCashAdvanceAmount = "";
        $scope.totalPersonalAdvanceAmount = "";
        $scope.totalAmount = "";
        $scope.totalFISAmount = "";
        $scope.SelectedProject = [{}, {}, {}, {}, {}];

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

            //$("#txtToday")
            //    .datepicker({ dateFormat: "mm/dd/yyyy" })
            //    .datepicker("setDate", new Date());

            $.get('api/reimburse/TravelrequestDetails/' + travelRequestId)
            .done(function (data) {

                // Set user detail section
                $("#txtTravelRequestNumber1").val(data.TravelReimbursementDetails.TravelRequestId);
                $("#txtBadgeNumber").val(data.TravelReimbursementDetails.BadgeNumber);
                $("#txtTravelPeriodFrom").val(data.TravelReimbursementDetails.StrDepartureDateTime);
                $("#txtTravelPeriodTo").val(data.TravelReimbursementDetails.StrReturnDateTime);
                $("#txtVendorNumber").val(data.TravelReimbursementDetails.VendorNumber);
                $("#txtCostCenterNumber").val(data.TravelReimbursementDetails.CostCenterId);
                $("#txtName").val(data.TravelReimbursementDetails.Name);
                $("#txtExtension").val(data.TravelReimbursementDetails.Extension);
                $("#txtDivision").val(data.TravelReimbursementDetails.Division);
                $("#txtDepartment").val(data.TravelReimbursementDetails.Department);
                $("#txtCashAdvance").val(data.CashAdvance);
                $("#txtPurpose").val(data.TravelReimbursementDetails.Purpose);

                // set advance amounts
                $scope.totalCashAdvanceAmount = data.CashAdvance;
                $scope.totalPersonalAdvanceAmount = data.PersonalTravelExpense;

                // Set TA other expense amounts
                $("#lblTAAirfare").html("$" + data.TravelReimbursementDetails.TAEstimatedAirFare);
                $("#lblTALodging").html("$" + data.TravelReimbursementDetails.TAEstimatedLodge);
                $("#lblTAMeals").html("$" + data.TravelReimbursementDetails.TAEstimatedMeals);
                $("#lblTAActualLodging").html("$" + data.TravelReimbursementDetails.TAActualLodge);
                $("#lblTAActualMeals").html("$" + data.TravelReimbursementDetails.TAActualMeals);

                // Set FIS section
                angular.forEach(data.Fis.FISDetails, function (value, index) {

                    var counter = index + 1;

                    $("#ddlCostCenter" + counter).val(value.CostCenterId);
                    $("#txtAccount" + counter).val(value.LineItem);
                    $("#txtTask" + counter).val(value.Task);
                    //$("#txtAmount" + counter).val(value.Amount);

                    $scope.FISModel[index].Amount = value.Amount;

                    $("#rowfis" + (index + 1)).show();
                    $("#deletefisrow" + (index + 1)).hide();

                    currentRowNumberFIS = ((index + 1) + 1);

                    $scope.SelectedProject[index].Id = value.ProjectId;
                    $timeout(angular.element("#ddlCostCenter" + (index + 1)).triggerHandler('change'), 0, true);

                    //angular.element("#ddlCostCenter" + counter).triggerHandler('change');

                    //$.get('/api/fis/delay')
                    //.done(function () {
                    //    $("#ddlProjects" + counter).val(value.ProjectId);
                    //    $scope.$apply();
                    //});
                })
            });

            $scope.$apply(function () {

                // set default values
                for (var index = 0; index < maxRowCount; index++) {
                    $scope.TravelModel[index].TravelDate = "";
                    $scope.TravelModel[index].City = "";
                    $scope.TravelModel[index].TotalMiles = "";
                    $scope.TravelModel[index].MileageToWork = "";
                    $scope.TravelModel[index].BusinessMiles = "";
                    $scope.TravelModel[index].BusinessMileAmount = "";
                    $scope.TravelModel[index].Parking = "";
                    $scope.TravelModel[index].Airfare = "";
                    $scope.TravelModel[index].Taxi = "";
                    $scope.TravelModel[index].Lodging = "";
                    $scope.TravelModel[index].Meals = "";
                    $scope.TravelModel[index].Registration = "";
                    $scope.TravelModel[index].Internet = "";
                    $scope.TravelModel[index].Other = "";
                    $scope.TravelModel[index].DailyTotal = "";
                    $scope.FISModel[index].Amount = "";
                }

                // add travel section row
                $("#btnAddRow").on("click", function () {

                    $("#row" + currentRowNumber).show();

                    // disable "add" button if max row count has been reached
                    if (currentRowNumber == maxRowCount) {
                        $("#btnAddRow").prop('disabled', 'disabled');
                    }

                    currentRowNumber++;
                });

                // delete travel section row
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

                // add fis section row
                $("#btnAddRowFIS").on("click", function () {

                    $("#rowfis" + currentRowNumberFIS).show();

                    // disable "add" button if max row count has been reached
                    if (currentRowNumberFIS == maxRowCount) {
                        $("#btnAddRowFIS").prop('disabled', 'disabled');
                    }

                    currentRowNumberFIS++;
                });

                // delete fis section row
                $("table.tablepartfis").on("click", ".deleterowfis", function (event) {

                    currentRowNumberFIS -= 1;

                    $scope.$apply(function () {

                        var index = (currentRowNumberFIS - 1);

                        // reset
                        $("#ddlCostCenter" + currentRowNumberFIS).val("?");
                        $("#txtAccount" + currentRowNumberFIS).val("");
                        $("#ddlProjects" + currentRowNumberFIS).val("?");
                        $("#txtTask" + currentRowNumberFIS).val("");
                        //$("#txtAmount" + currentRowNumberFIS).val("");

                        $scope.FISModel[index].Amount = "";

                        updateTotal2($scope.FISModel);
                    });

                    $("#rowfis" + currentRowNumberFIS).hide();
                    $("#btnAddRowFIS").prop('disabled', '');
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

    $scope.loadExistingTravelReimbursementRequests = function (status) {

        var actionTemplate = '<div style="float:left;" ng-if="row.entity.ViewActionVisible == true"><a target="_blank" href="api/travelReimbursementReport/{{row.entity.TravelRequestId}}"><img title="View" class="actionImage" src="/Images/view.png" /></a></div><div style="float:left;" ng-if="row.entity.EditActionVisible == true"><img title="Edit" class="actionImage" src="/Images/edit.png" alt="{{row.entity.TravelRequestId}}|{{row.entity.ReimbursementId}}" onclick="editTravelReimbursement(this);" /></div> <div ng-if="row.entity.ApproveActionVisible == true"><img title="Approve" class="actionImage" src="/Images/approve1.png" alt="{{row.entity.TravelRequestId}}" onclick="showApproveSection2(this);" /><img title="Reject" class="actionImage2" src="/Images/reject1.png" alt="{{row.entity.TravelRequestId}}" onclick="showRejectSection2(this);" /></div>';

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
                width: 120,
                headerCellClass: "existingrequestcolumnheader",
                cellClass: "existingrequestcolumnvalue",
                filter: {
                    placeholder: 'search',
                    term: status,
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [
                        { value: "", label: 'All' },
                        { value: "Cancelled", label: 'Cancelled' },
                        { value: "Completed", label: 'Completed' },
                        { value: "New", label: 'New' },
                        { value: "Pending", label: 'Pending' },
                        { value: "Rejected", label: 'Rejected' }
                    ],
                    disableCancelFilterButton: true
                }
            },
            {
                name: 'Actions',
                cellTemplate: actionTemplate,
                enableFiltering: false,
                width: 182,
                headerCellClass: "existingrequestcolumnheader",
                //enableColumnResizing: false,
            }];

        $scope.existingRequestsGridOptions2 = {
            enableSorting: false,
            //enableColumnResizing: true,
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
               $('#existingtravelrequeststemplate').html($compile($(data).html())($scope));
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
                //enableColumnResizing: false,
            }];

        $scope.existingRequestsGridOptions1 = {
            enableSorting: false,
            //enableColumnResizing: true,
            columnDefs: $scope.columns,
            enableFiltering: true,
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            onRegisterApi: function (gridApi2) {
                $scope.gridApi = gridApi2;
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

            $scope.$watch('FISModel[' + index + '].Amount', function () {
                updateTotal2($scope.FISModel);
            });

            $scope.$watch('FISRequestModel[' + index + '].Amount', function () {
                updateTotal3($scope.FISRequestModel);
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

    function updateTotal2(model) {
        $scope.updateFISTotal(model);
    }

    function updateTotal3(model) {
        $scope.updateTotalFISAmount(model);
    }

    // load travel reimbursement modal in edit mode
    $scope.loadTravelReimbursementForEdit = function (travelRequestId) {

        $scope.TravelModel = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        $scope.FISModel = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        $scope.totalBusinessMile = 0;
        $scope.totalAirfare = 0;
        $scope.totalPart2NonTravelExpenseAmount = "";
        $scope.totalSubmittedForApprovalAmount = "";
        $scope.totalPrePaidByMTAAmount = "";
        $scope.totalExpenseAmount = 0;
        $scope.totalCashAdvanceAmount = 0;
        $scope.totalPersonalAdvanceAmount = 0;
        $scope.totalAmount = 0;
        $scope.totalFISAmount = 0;
        $scope.SelectedProject = [{}, {}, {}, {}, {}];

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
                    $('input[name="txtTravelDate4"]').datepicker(options);
                    $('input[name="txtTravelDate5"]').datepicker(options);

                    // set default values
                    for (var index = 0; index < maxRowCount; index++) {
                        $scope.TravelModel[index].Id = 0;
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
                        $scope.FISModel[index].Amount = "";
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
                    $('#txtReimbursementId').val($scope.Data.ReimbursementTravelRequestDetails.ReimbursementId);

                    // set TA other expense amounts
                    $("#lblTAAirfare").html("$" + $scope.Data.ReimbursementTravelRequestDetails.TAEstimatedAirFare);
                    $("#lblTALodging").html("$" + $scope.Data.ReimbursementTravelRequestDetails.TAEstimatedLodge);
                    $("#lblTAMeals").html("$" + $scope.Data.ReimbursementTravelRequestDetails.TAEstimatedMeals);
                    $("#lblTAActualLodging").html("$" + $scope.Data.ReimbursementTravelRequestDetails.TAActualLodge);
                    $("#lblTAActualMeals").html("$" + $scope.Data.ReimbursementTravelRequestDetails.TAActualMeals);

                    // set travel data section
                    for (var index = 0; index < $scope.Data.ReimbursementDetails.Reimbursement.length; index++) {
                        $scope.TravelModel[index].Id = $scope.Data.ReimbursementDetails.Reimbursement[index].Id;
                        $scope.TravelModel[index].TravelDate = $scope.Data.ReimbursementDetails.Reimbursement[index].DtReimburse;
                        $scope.TravelModel[index].City = $scope.Data.ReimbursementDetails.Reimbursement[index].CityStateAndBusinessPurpose;
                        $scope.TravelModel[index].TotalMiles = $scope.Data.ReimbursementDetails.Reimbursement[index].Miles;
                        $scope.TravelModel[index].MileageToWork = $scope.Data.ReimbursementDetails.Reimbursement[index].MileageToWork;
                        $scope.TravelModel[index].BusinessMiles = $scope.Data.ReimbursementDetails.Reimbursement[index].BusinessMiles;
                        $scope.TravelModel[index].BusinessMileAmount = $scope.Data.ReimbursementDetails.Reimbursement[index].BusinessMilesXRate;
                        $scope.TravelModel[index].Parking = $scope.Data.ReimbursementDetails.Reimbursement[index].ParkingAndGas;
                        $scope.TravelModel[index].Airfare = $scope.Data.ReimbursementDetails.Reimbursement[index].AirFare;
                        $scope.TravelModel[index].Taxi = $scope.Data.ReimbursementDetails.Reimbursement[index].TaxiRail;
                        $scope.TravelModel[index].Lodging = $scope.Data.ReimbursementDetails.Reimbursement[index].Lodge;
                        $scope.TravelModel[index].Meals = $scope.Data.ReimbursementDetails.Reimbursement[index].Meals;
                        $scope.TravelModel[index].Registration = $scope.Data.ReimbursementDetails.Reimbursement[index].Registration;
                        $scope.TravelModel[index].Internet = $scope.Data.ReimbursementDetails.Reimbursement[index].Internet;
                        $scope.TravelModel[index].Other = $scope.Data.ReimbursementDetails.Reimbursement[index].Others;
                        $scope.TravelModel[index].DailyTotal = $scope.Data.ReimbursementDetails.Reimbursement[index].DailyTotal;

                        $("#row" + (index + 1)).show();
                        //$("#deleterow" + (index + 1)).hide();

                        currentRowNumber = ((index + 1) + 1);
                    }

                    // set advance amounts
                    $scope.totalCashAdvanceAmount = $scope.Data.ReimbursementDetails.SubtractCashAdvance;
                    $scope.totalPersonalAdvanceAmount = $scope.Data.ReimbursementDetails.SubtractPersonalAdvance;

                    // set FIS expense section
                    if ($scope.Data.FIS) {
                        //$scope.totalFISAmount = $scope.Data.FIS.TotalAmount;

                        if ($scope.Data.FIS.FISDetails) {

                            for (var index = 0; index < $scope.Data.FIS.FISDetails.length; index++) {

                                var costCenterName = $scope.Data.FIS.FISDetails[index].CostCenterId;

                                $("#ddlCostCenter" + (index + 1)).val(costCenterName);
                                $("#txtAccount" + (index + 1)).val($scope.Data.FIS.FISDetails[index].LineItem);
                                $("#txtTask" + (index + 1)).val($scope.Data.FIS.FISDetails[index].Task);

                                $scope.FISModel[index].Amount = $scope.Data.FIS.FISDetails[index].Amount;

                                $("#rowfis" + (index + 1)).show();
                                //$("#deletefisrow" + (index + 1)).hide();

                                currentRowNumberFIS = ((index + 1) + 1);
                            }
                        }
                    }

                    // add travel section row
                    $("#btnAddRow").on("click", function () {

                        $("#row" + currentRowNumber).show();

                        // disable "add" button if max row count has been reached
                        if (currentRowNumber == maxRowCount) {
                            $("#btnAddRow").prop('disabled', 'disabled');
                        }

                        currentRowNumber++;
                    });

                    // delete travel section row
                    $("table.tablepart1").on("click", ".deleterow", function (event) {

                        currentRowNumber -= 1;

                        $scope.$apply(function () {

                            var index = (currentRowNumber - 1);

                            // reset
                            $scope.totalMileA = ($scope.totalMileA * 1) - ($scope.TravelModel[index].TotalMiles * 1);
                            $scope.totalMileB = ($scope.totalMileB * 1) - ($scope.TravelModel[index].MileageToWork * 1);
                            $scope.totalBusinessMile = ($scope.totalBusinessMile * 1) - ($scope.TravelModel[index].BusinessMiles * 1);
                            $scope.totalBusinessMileAmount = ($scope.totalBusinessMileAmount * 1) - ($scope.TravelModel[index].BusinessMileAmount * 1);

                            $scope.TravelModel[index].Id = 0;
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
                            updateTotal2($scope.FISModel);
                        });

                        $("#row" + currentRowNumber).hide();
                        $("#btnAddRow").prop('disabled', '');
                    });

                    // add fis section row
                    $("#btnAddRowFIS").on("click", function () {

                        $("#rowfis" + currentRowNumberFIS).show();

                        // disable "add" button if max row count has been reached
                        if (currentRowNumberFIS == maxRowCount) {
                            $("#btnAddRowFIS").prop('disabled', 'disabled');
                        }

                        currentRowNumberFIS++;
                    });

                    // delete fis section row
                    $("table.tablepartfis").on("click", ".deleterowfis", function (event) {

                        currentRowNumberFIS -= 1;

                        $scope.$apply(function () {

                            var index = (currentRowNumberFIS - 1);

                            // reset
                            $("#ddlCostCenter" + currentRowNumberFIS).val("?");
                            $("#txtAccount" + currentRowNumberFIS).val("");
                            $("#ddlProjects" + currentRowNumberFIS).val("?");
                            $("#txtTask" + currentRowNumberFIS).val("");

                            $scope.FISModel[index].Amount = "";
                        });

                        $("#rowfis" + currentRowNumberFIS).hide();
                        $("#btnAddRowFIS").prop('disabled', '');
                    });


                });

                if ($scope.Data.FIS) {

                    if ($scope.Data.FIS.FISDetails) {
                        for (var index2 = 0; index2 < $scope.Data.FIS.FISDetails.length; index2++) {

                            var projectName = $scope.Data.FIS.FISDetails[index2].ProjectId;
                            $scope.SelectedProject[index2].Id = projectName;
                            $timeout(angular.element("#ddlCostCenter" + (index2 + 1)).triggerHandler('change'), 0, true);
                        }
                    }
                }
            });
        });
    }


    $scope.loadDashboard = function () {
        $.get('/uitemplates/dashboard.html')
        .always(function (data) {
            $('#dashboardtemplate').html($compile($(data).html())($scope));
            $scope.$apply(function () {

                // get the data from travel request dashboard
                $.get('api/travelrequest/dashboard')
                    .done(function (result) {
                        loadTravelRequestBarGraph(JSON.parse(result));
                        loadTravelRequestPieChartGraph(JSON.parse(result));
                    });

                // get the data from travel reimbursement dashboard
                $.get('api/travelreimbursement/dashboard')
                    .done(function (result) {
                        loadTravelReimbursementBarGraph(JSON.parse(result));
                        loadTravelReimbursementPieChartGraph(JSON.parse(result));
                    });
            });
        });
    }

    function loadTravelRequestBarGraph(data) {
        var axisMargin = 20,
            margin = 20,
            valueMargin = 7,
            width = 600,
            height = 250,
            barHeight = 22,
            barPadding = 18,
            bar, svg, scale, xAxis, labelWidth = 0;

        max = d3.max(data, function (d) { return d.Value; });

        svg = d3.select('#travelrequestbargraphsection')
                .append("svg")
                .attr("class", "svgclass")
                .attr("width", width)
                .attr("height", height);


        bar = svg.selectAll("g")
                .data(data)
                .enter()
                .append("g");


        bar.attr("class", "bar")
                .attr("cx", 0)
                .attr("transform", function (d, i) {
                    return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
                });

        bar.append("text")
                .attr("class", "label2")
                .attr("y", barHeight / 2)
                .attr("dy", ".35em") //vertical align middle		
                .text(function (d) {
                    return d.Label;
                })
                .each(function () {
                    labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width)) + 2;
                });

        scale = d3.scale.linear()
                .domain([0, max])
                .range([0, width - margin * 2 - labelWidth]);

        xAxis = d3.svg.axis()
                .scale(scale)
                .tickSize(-height + 2 * margin + axisMargin)
                .orient("bottom");

        bar.append("rect")
                .attr("transform", "translate(" + labelWidth + ", 0)")
                .attr("height", barHeight)
                .attr("class", "cursor")
                .on("click", drillDownTravelRequest)
                .style("fill", function (d) {
                    return d.Color;
                })
                .attr("width", function (d) {
                    return scale(d.Value);
                });

        bar.append("text")
                .attr("class", "value")
                .attr("y", barHeight / 2)
                .attr("dx", -valueMargin + labelWidth) //margin right
                .attr("dy", ".35em") //vertical align middle
                .attr("text-anchor", "end")
                .text(function (d) {
                    return (d.Value);
                })
                .style("fill", "white")
                .attr("x", function (d) {
                    var width = this.getBBox().width;
                    return Math.max(width + valueMargin, scale(d.Value));
                });

        svg.append("text")
            .attr("x", height + 70)
            .attr("y", barHeight - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .style("font-weight", "bold")
            .text("TRAVEL REQUESTS");

        svg.append("text")
            .attr("x", height + 70)
            .attr("y", barHeight + 215)
            .attr("text-anchor", "middle")
            .attr("class", "titlelabel")
            .text("# of travel requests");

        svg.insert("g", ":first-child")
                .attr("class", "axisHorizontal")
                .attr("transform", "translate(" + (margin + labelWidth) + "," + (height - axisMargin - margin) + ")")
                .call(xAxis);
    }

    function loadTravelReimbursementBarGraph(data) {
        var axisMargin = 20,
            margin = 20,
            valueMargin = 7,
            width = 600,
            height = 250,
            barHeight = 22,
            barPadding = 18,
            bar, svg, scale, xAxis, labelWidth = 0;

        max = d3.max(data, function (d) { return d.Value; });

        svg = d3.select('#travelreimbursementbargraphsection')
            .append("svg")
            .attr("class", "svgclass")
            .attr("width", width)
            .attr("height", height);


        bar = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");


        bar.attr("class", "bar")
            .attr("cx", 0)
            .attr("transform", function (d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

        bar.append("text")
            .attr("class", "label2")
            .attr("y", barHeight / 2)
            .attr("dy", ".35em") //vertical align middle		
            .text(function (d) {
                return d.Label;
            })
            .each(function () {
                labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width)) + 2;
            });

        scale = d3.scale.linear()
            .domain([0, max])
            .range([0, width - margin * 2 - labelWidth]);

        xAxis = d3.svg.axis()
            .scale(scale)
            .tickSize(-height + 2 * margin + axisMargin)
            .orient("bottom");

        bar.append("rect")
            .attr("transform", "translate(" + labelWidth + ", 0)")
            .attr("height", barHeight)
            .attr("class", "cursor")
            .on("click", drillDownTravelReimbursement)
            .style("fill", function (d) {
                return d.Color;
            })
            .attr("width", function (d) {
                return scale(d.Value);
            });

        bar.append("text")
            .attr("class", "value")
            .attr("y", barHeight / 2)
            .attr("dx", -valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .text(function (d) {
                return (d.Value);
            })
            .style("fill", "white")
            .attr("x", function (d) {
                var width = this.getBBox().width;
                return Math.max(width + valueMargin, scale(d.Value));
            });

        svg.append("text")
            .attr("x", height + 70)
            .attr("y", barHeight - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .style("font-weight", "bold")
            .text("TRAVEL REIMBURSEMENTS");

        svg.append("text")
            .attr("x", height + 70)
            .attr("y", barHeight + 215)
            .attr("text-anchor", "middle")
            .attr("class", "titlelabel")
            .text("# of travel reimbursements");

        svg.insert("g", ":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + "," + (height - axisMargin - margin) + ")")
            .call(xAxis);
    }

    function loadTravelRequestPieChartGraph(data) {
        var values = [];
        var colors = [];
        var legends = [];
        var totalCount = 0;
        var outerRadius = 95;
        var innerRadius = 150;

        for (index in data) {

            values.push(data[index].Value);
            colors.push(data[index].Color);
            legends.push(data[index].Label);

            totalCount += data[index].Value;
        }

        var color = d3.scale.ordinal().range(colors);
        var legendText = d3.scale.ordinal().range(legends);

        var canvas = d3.select('#travelrequestpiechartsection')
            .append("svg")
            .attr("class", "svgclass2")
            .attr("width", 200)
            .attr("height", 200);

        var group = canvas.append("g")
            .attr("transform", "translate(325,275)");

        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var pie = d3.layout.pie()
            .value(function (d) { return d; });

        var arcs = group.selectAll(".arc")
            .data(pie(values))
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("class", "cursor")
            .on("click", function (d, i) {
                var status = legendText(i);
                $('#dashboardtemplate').hide();
                $('#fromDashboard').text("true");
                viewexistingtravelrequests(status);
            })
            .attr("fill", function (d) { return color(d.data); });

        arcs.append("text")
            .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("fill", "white")
            .text(function (d) { return d.data; });

        arcs.append("text")
            .attr("class", "totalcount")
            .attr("text-anchor", "middle")
            .attr("x", 1)
            .attr("y", 20)
            .text(totalCount);

        var textTop = arcs.append("text")
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .attr("class", "textTop")
            .text("TOTAL")
            .attr("x", 5)
            .attr("y", -10);

        var legend = arcs
            .attr("class", "legend");

        arcs.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", -290)
            .attr("y", function (d, i) { return -170 + (i * 30); })
            .style("fill", function (d, i) {
                return colors[i];
            });

        arcs.append("text")
            .style("font-size", "12px")
            .attr("x", -276)
            .attr("y", function (d, i) { return -160 + (i * 30); })
            .text(function (d, i) {
                var c = legendText(i);
                return c;
            });

        arcs.append("text")
            .attr("x", -300)
            .attr("y", 155)
            .attr("class", "linkpiechart")
            .on("click", function (d, i) {
                $('#dashboardtemplate').hide();
                $('#fromDashboard').text("true");
                viewexistingtravelrequests("");
            })
            .text("View all travel requests");
    }

    function loadTravelReimbursementPieChartGraph(data) {
        var values = [];
        var colors = [];
        var legends = [];
        var totalCount = 0;
        var outerRadius = 95;
        var innerRadius = 150;

        for (index in data) {

            values.push(data[index].Value);
            colors.push(data[index].Color);
            legends.push(data[index].Label);

            totalCount += data[index].Value;
        }

        var color = d3.scale.ordinal().range(colors);
        var legendText = d3.scale.ordinal().range(legends);

        var canvas = d3.select('#travelreimbursementpiechartsection')
            .append("svg")
            .attr("class", "svgclass2")
            .attr("width", 200)
            .attr("height", 200);

        var group = canvas.append("g")
            .attr("transform", "translate(325,275)");

        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var pie = d3.layout.pie()
            .value(function (d) { return d; });

        var arcs = group.selectAll(".arc")
            .data(pie(values))
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("class", "cursor")
            .on("click", function (d, i) {
                var status = legendText(i);
                $('#dashboardtemplate').hide();
                $('#fromDashboard').text("true");
                viewexistingreimbursements(status);
            })
            .attr("fill", function (d) { return color(d.data); });

        arcs.append("text")
            .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("fill", "white")
            .text(function (d) { return d.data; });

        arcs.append("text")
            .attr("class", "totalcount")
            .attr("text-anchor", "middle")
            .attr("x", 1)
            .attr("y", 20)
            .text(totalCount);

        var textTop = arcs.append("text")
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .attr("class", "textTop")
            .text("TOTAL")
            .attr("x", 5)
            .attr("y", -10);

        var legend = arcs
            .attr("class", "legend");

        arcs.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", -290)
            .attr("y", function (d, i) { return -170 + (i * 30); })
            .style("fill", function (d, i) {
                return colors[i];
            });

        arcs.append("text")
            .style("font-size", "12px")
            .attr("x", -276)
            .attr("y", function (d, i) { return -160 + (i * 30); })
            .text(function (d, i) {
                var c = legendText(i);
                return c;
            });

        arcs.append("text")
            .attr("x", -300)
            .attr("y", 155)
            .attr("class", "linkpiechart")
            .on("click", function (d, i) {
                $('#dashboardtemplate').hide();
                $('#fromDashboard').text("true");
                viewexistingreimbursements("");
            })
            .text("View all travel reimbursements");
    }

    function drillDownTravelReimbursement(d, i) {
        var status = d.Label;
        $('#dashboardtemplate').hide();
        $('#fromDashboard').text("true");
        viewexistingreimbursements(status);
    }

    function drillDownTravelRequest(d, i) {
        var status = d.Label;
        $('#dashboardtemplate').hide();
        $('#fromDashboard').text("true");
        viewexistingtravelrequests(status);
    }

    function loadTravelReimbursementBarGraphOld() {

        var axisMargin = 20,
            margin = 20,
            valueMargin = 7,
            width = 600,//parseInt(d3.select('body').style('width'), 10),
            height = 250,//parseInt(d3.select('body').style('height'), 10),
            barHeight = 22,//(height-axisMargin-margin*2)* 0.4/data.length,
            barPadding = 18,//(height-axisMargin-margin*2)*0.6/data.length,
            bar, svg, scale, xAxis, labelWidth = 0;

        var data = [
            { label: "New", value: 9, color: "orange" },
            { label: "Pending", value: 35, color: "dodgerblue" },
            { label: "Rejected", value: 3, color: "red" },
            { label: "Completed", value: 12, color: "green" },
            { label: "Cancelled", value: 7, color: "purple" }
        ];

        max = d3.max(data, function (d) { return d.value; });

        svg = d3.select('#travelreimbursementbargraphsection')
            .append("svg")
            //.attr("style", "outline: thin solid gray;")
            .attr("class", "svgclass")
            .attr("width", width)
            .attr("height", height);


        bar = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");


        bar.attr("class", "bar")
            .attr("cx", 0)
            .attr("transform", function (d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

        bar.append("text")
            .attr("class", "label2")
            .attr("y", barHeight / 2)
            .attr("dy", ".35em") //vertical align middle		
            .text(function (d) {
                return d.label;
            })
            .each(function () {
                labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width)) + 2;
            });

        scale = d3.scale.linear()
            .domain([0, max])
            .range([0, width - margin * 2 - labelWidth]);

        xAxis = d3.svg.axis()
            .scale(scale)
            .tickSize(-height + 2 * margin + axisMargin)
            .orient("bottom");

        bar.append("rect")
            .attr("transform", "translate(" + labelWidth + ", 0)")
            .attr("height", barHeight)
            .attr("class", "cursor")
            .on("click", drillDownTravelReimbursement)
            .style("fill", function (d) {
                return d.color;
            })
            .attr("width", function (d) {
                return scale(d.value);
            });

        bar.append("text")
            .attr("class", "value")
            .attr("y", barHeight / 2)
            .attr("dx", -valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .text(function (d) {
                return (d.value);
            })
            .style("fill", "white")
            .attr("x", function (d) {
                var width = this.getBBox().width;
                return Math.max(width + valueMargin, scale(d.value));
            });

        svg.append("text")
            .attr("x", height + 70)
            .attr("y", barHeight - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .style("font-weight", "bold")
            .text("TRAVEL REIMBURSEMENTS");

        svg.append("text")
            .attr("x", height + 70)
            .attr("y", barHeight + 215)
            .attr("text-anchor", "middle")
            .attr("class", "titlelabel")
            .text("# of travel reimbursements");

        svg.insert("g", ":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + "," + (height - axisMargin - margin) + ")")
            .call(xAxis);
    }

    function loadTravelReimbursementPieChartGraphOld() {
        var data = [3, 35, 12, 9, 7];
        var r = 95;
        var totalCount = 66;

        var color = d3.scale.ordinal()
                    .range(["red", "dodgerblue", "green", "orange", "purple"]);

        var legendText = d3.scale.ordinal()
                    .range(["Rejected", "Pending", "Completed", "New", "Cancelled"]);

        var canvas = d3.select('#travelreimbursementpiechartsection')
                    .append("svg")
                    .attr("class", "svgclass2")
                    .attr("width", 200)
                    .attr("height", 200);

        var group = canvas.append("g")
                    .attr("transform", "translate(325,275)");

        var arc = d3.svg.arc()
        .innerRadius(150)
        .outerRadius(r);

        var pie = d3.layout.pie()
        .value(function (d) { return d; });

        var arcs = group.selectAll(".arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("class", "cursor")
            .on("click", function (d, i) {
                var status = legendText(i);
                $('#dashboardtemplate').hide();
                $('#fromDashboard').text("true");
                viewexistingreimbursements(status);
            })
            .attr("fill", function (d) { return color(d.data); });

        arcs.append("text")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "white")
        .text(function (d) { return d.data; });

        arcs.append("text")
        .attr("class", "totalcount")
	    .attr("text-anchor", "middle")
        .attr("x", 1)
         .attr("y", 20)
	    .text(totalCount);

        var textTop = arcs.append("text")
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .attr("class", "textTop")
            .text("TOTAL")
            .attr("x", 5)
            .attr("y", -10);

        var legend = arcs
          .attr("class", "legend");

        arcs.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", -290)
            .attr("y", function (d, i) { return -170 + (i * 30); })
            .style("fill", function (d, i) {
                var c = color(i);
                if (i == 3) {
                    c = 'orange';
                }
                else if (i == 4) {
                    c = 'purple';
                }
                return c;
            });

        arcs.append("text")
            .style("font-size", "12px")
            .attr("x", -276)
            .attr("y", function (d, i) { return -160 + (i * 30); })
            .text(function (d, i) {
                var c = legendText(i);
                return c;
            });

        arcs.append("text")
            .attr("x", -300)
            .attr("y", 155)
            .attr("class", "linkpiechart")
            .on("click", function (d, i) {
                $('#dashboardtemplate').hide();
                $('#fromDashboard').text("true");
                viewexistingreimbursements("");
            })
            .text("View all travel reimbursements");
    }
});
