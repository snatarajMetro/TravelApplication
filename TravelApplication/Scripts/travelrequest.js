var app = angular.module('travelApp', []);

app.controller('estimatedExpenseCtrl', function ($scope) {

    $scope.parseFloat = function (value) {
        return parseFloat(value);
    }

    $scope.advanceLodgingAmount = "0.00";
    $scope.advanceAirfareAmount = "0.00";
    //$scope.advanceRegistrationAmount = "0.00";
    //$scope.advanceMealsAmount = "0.00";
    //$scope.advanceCarRentalAmount = "0.00";
    //$scope.advanceMiscellaneousAmount = "0.00";
    $scope.totalAdvanceAmount = parseFloat($scope.advanceLodgingAmount) + parseFloat($scope.advanceAirfareAmount);// + $scope.advanceRegistrationAmount + $scope.advanceMealsAmount + $scope.advanceCarRentalAmount + $scope.advanceMiscellaneousAmount;
});