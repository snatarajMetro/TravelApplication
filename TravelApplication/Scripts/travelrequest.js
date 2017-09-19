var app = angular.module('travelApp', []);

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
        $.get('/uitemplates/fileupload.html')
        .done(function (data) {
            $('#fileuploadtemplate').html($compile($(data).html())($scope));
            $scope.$apply();

            Dropzone.autoDiscover = false;

            $("#supportingDocumentZone").dropzone({
                url: "/login/upload",
                //addRemoveLinks: true,
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

                    //New file added
                    self.on("addedfile", function (file) {
                        console.log('new file added ', file);
                    });
                    // Send file starts
                    self.on("sending", function (file) {
                        console.log('upload started', file);
                        $('.meter').show();
                    });

                    // File upload Progress
                    self.on("totaluploadprogress", function (progress) {
                        console.log("progress ", progress);
                        $('.roller').width(progress + '%');
                    });

                    self.on("queuecomplete", function (progress) {
                        $('.meter').delay(999).slideUp(999);
                    });

                    // On removing file
                    self.on("removedfile", function (file) {
                        console.log(file);
                    });
                },
                success: function (file, response) {
                    var imgName = response;
                    file.previewElement.classList.add("dz-success");
                    //console.log("Successfully uploaded :" + imgName);
                },
                error: function (file, response) {
                    file.previewElement.classList.add("dz-error");
                }
            });
        });

        //$('#fileuploadtemplate').show();
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

                // get projects based on cost center id
                $.get('/api/fis/projects/' + value.Id)
                .done(function (data) {

                    $scope.Projects[value.Id] = JSON.parse(data);
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
            $scope.projects1 = $scope.Projects[costCenter.Id];
        }
        else if (source == 'ddlCostCenter2') {
            $scope.projects2 = $scope.Projects[costCenter.Id];;
        }
        else if (source == 'ddlCostCenter3') {
            $scope.projects3 = $scope.Projects[costCenter.Id];;
        }
        else if (source == 'ddlCostCenter4') {
            $scope.projects4 = $scope.Projects[costCenter.Id];;
        }
        else if (source == 'ddlCostCenter5') {
            $scope.projects5 = $scope.Projects[costCenter.Id];;
        }
    };

});