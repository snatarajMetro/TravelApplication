//var app = angular.module('travelApp', ['ui.grid', 'ui.grid.pagination']);
var app = angular.module('travelApp', ['ui.grid']);

app.controller('travelAppCtrl', function ($scope,$compile) {

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
            + ($scope.totalFISAmount3 * 1)
            + ($scope.totalFISAmount4 * 1)
            + ($scope.totalFISAmount5 * 1)
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
                url: "/login/upload",
                thumbnailWidth:10,
                thumbnailHeight:10,
                maxFilesize: 5, // MB
                addRemoveLinks: true,
                acceptedFiles: ".jpeg,.png,.gif,.txt",
                init: function () {
                    var self = this;
                    // config
                    self.options.addRemoveLinks = true;
                    self.options.dictRemoveFile = "Delete";

                    // on file added
                    self.on("addedfile", function (progress) {
                        var travelRequestId = $('#travelRequestId').text();
                        var badgeNumber = $('#badgeNumber').text();
                        var uploadUrl = "/login/upload?travelRequestId=" + travelRequestId + "&badgeNumber=" + badgeNumber;
                        self.options.url = uploadUrl;
                    });

                    // on file added
                    self.on("success", function (file,response) {
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

    // load cost centers and projects
    $scope.loadCostCenters = function () 
    {
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
            rowHeight:34,
            //enableFiltering: true,
            //paginationPageSizes: [5, 10, 15],
            //paginationPageSize: 5, 
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
                cellTemplate: "<a href='#'><img title='View/Download Document' class='viewDocument' src='/Images/download.png' width='30' height='30' alt='{{row.entity.Id}}' onclick=downloaddocument(this); /></a><a href='#'><img title='Delete Document' class='viewDocument' src='/Images/delete2.png' width='20' height='20' alt='{{row.entity.Id}}' onclick=deletedocument(this); /></a>",
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
            url: "api/travelrequest/supportingdocuments/" + travelRequestNumber,
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
        });

    }
});