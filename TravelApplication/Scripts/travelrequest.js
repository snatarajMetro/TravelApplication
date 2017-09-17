var app = angular.module('travelApp', []);

app.controller('estimatedExpenseCtrl', function ($scope,$compile) {

    $scope.parseFloat = function (value) {
        return parseFloat(value).toFixed(2);
    };

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

    //set estimated expense section
    $scope.loadEstimatedExpense = function () {
        $.get('/uitemplates/estimatedexpense.html')
        .done(function (data) {
            $('#estimatedexpensetemplate').html($compile($(data).html())($scope));
            $scope.$apply();
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

    $scope.CostCenters = [
        { Id: 0, Name: 'Texas' },
        { Id: 1, Name: 'California' },
        { Id: 2, Name: 'Washington' }];

    var projectsByCostCenter = [
                    [{ Id: 0, Name: "Houston" }, { Id: 1, Name: "Dallas" }],
                    [{ Id: 2, Name: "Los Angeles" }, { Id: 3, Name: "San Fransisco" }],
                    [{ Id: 4, Name: "Seattle" }, { Id: 5, Name: "Spokane" }]];

        $scope.projects1 = []; 
        $scope.projects2 = [];
        $scope.projects3 = [];
        $scope.projects4 = [];
        $scope.projects5 = [];

        $scope.getProjects = function (source, costCenter) {

            var key = costCenter.Id;
            var newProjects = projectsByCostCenter[key];

            if (source == 'ddlCostCenter1') {
                $scope.projects1 = newProjects;
            }
            else if (source == 'ddlCostCenter2') {
                $scope.projects2 = newProjects;
            }
            else if (source == 'ddlCostCenter3') {
                $scope.projects3 = newProjects;
            }
            else if (source == 'ddlCostCenter4') {
                $scope.projects4 = newProjects;
            }
            else if (source == 'ddlCostCenter5') {
                $scope.projects5 = newProjects;
            }
        };
});