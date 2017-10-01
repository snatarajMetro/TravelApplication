﻿var userName = '';
var fadeOutTimeInMilliseconds = 5000; // 5 seconds
var selectedRoleId = 0;
var isInternetExplorer = false;

$(document).ready(function () {

    $("#txtEmail").focus();

    isInternetExplorer = (navigator.userAgent && navigator.userAgent.search("Trident") >= 0);

    //createnewrequest();
});

function closeinvaliduser() {
    $("#invaliduser").hide();
    $("#txtEmail").focus();
}

function logout() {

    // reset
    selectedRoleId = 0;
    userName = "";

    $("#selectedRoleId").text(selectedRoleId);
    $('#txtBadgeNumber').text(0);
    $('#travelRequestId').text(0);
    $('#estimatedExpenseId').text(0);

    $("#action").hide();
    $("#invaliduser").hide();
    $("#logout").hide();
    $('#signintemplate').hide();
    $("#signin").show();
    $("#existingtravelrequeststemplate").hide();
    $("#travelrequesttemplate").hide();

    $("#txtEmail").focus();
}

function signIn() {

    // Make api call to authenticate the user
    var user = $("#txtEmail").val();
    var password = $("#txtPassword").val();

    $("#txtEmail").attr("class", "datainput");
    $("#txtPassword").attr("class", "datainput");

    $.ajax({
        type: "POST",
        url: "/api/login",
        data: JSON.stringify({ "UserName": user, "Password": password }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            var result = JSON.parse(data);

            //show role selection section
            $.get('/uitemplates/roleselection.html')
                .done(function (data) {
                    $('#signintemplate').html($(data).html());
                    $('#signintemplate').show();

                    // set the roles dropdown
                    var options = $("#roles");
                    options.empty();
                    options.append($("<option />").val(0).text('Please select the role'));

                    for (var index = 0; index < result.Roles.length; index++) {

                        options.append($("<option />").val(result.Roles[index].Id).text(result.Roles[index].Name));
                    }

                    // set badge number
                    $('#badgeNumber').text(result.BadgeNumber);

                    // set user name
                    $("#userName").text(result.UserName);
                    userName = result.UserName;

                    $("#signin").hide();
                    $("#action").hide();
                    $("#logout").show();
                });
        },
        error: function (xhr, options, error) {
            if (xhr.status == 401) {

                $("#invaliduser").fadeIn("slow");
                // fade out in 5 seconds
                $("#invaliduser").fadeOut(fadeOutTimeInMilliseconds);

                $("#txtEmail").attr("class", "datainputerror");
                $("#txtPassword").attr("class", "datainputerror");
                $("#txtEmail").focus();
            }
        }
    });
}

function backtosignin() {
    $("#logout").hide();
    $("#signintemplate").hide();
    $("#existingtravelrequeststemplate").hide();
    $("#action").hide();
    $("#invaliduser").hide();
    $("#dataentry").hide();
    $("#signin").show();
    $("#txtEmail").focus();
}

function actionselection() {

    var userRole = $("#roles option:selected").text();

    if ($("#roles option:selected").val() == 0) {

        $("#invalidrole").fadeIn("slow");

        // fade out in 5 seconds
        $("#invalidrole").fadeOut(fadeOutTimeInMilliseconds);
    }
    else {
        $("#signintemplate").hide();

        // set user name
        $("#userName2").text(userName);

        selectedRoleId = $("#roles option:selected").val();

        // set role
        $("#roleName").text(userRole);
        $("#selectedRoleId").text(selectedRoleId);

        // if Approver, show the exsiting request grid
        if (selectedRoleId == 3) {
            viewexistingtravelrequests();
        }
        else {
            // otherwise, show the action selection modal
            $("#action").show();
        }
    }
}

function backtoroleselection() {
    $("#signin").hide();
    $("#action").hide();
    $('#signintemplate').show();
}

function createnewrequest() {
    $("#action").hide();
    $("#signin").hide();
    $("#signintemplate").hide();
    

    //reset travel request form section
    $.get('/uitemplates/travelrequest.html')
        .done(function (data) {
            $('#travelrequesttemplate').html($(data).html());
            $('#travelrequesttemplate').show();
            
        });
}

function viewexistingtravelrequests() {
    $("#action").hide();

    //reset estimated expense section
    var scope = angular.element('#existingtravelrequeststemplate').scope();
    scope.loadExistingTravelRequests();
    scope.loadApproveAction();

    $('#existingtravelrequeststemplate').show();
}

function backtoactionselection() {

    $("#travelrequesttemplate").hide();
    $("#estimatedexpensetemplate").hide();
    $("#existingtravelrequeststemplate").hide();

    // if selected role is approver, take them back to role selection modal
    if (selectedRoleId == 3) {
        $("#signintemplate").show();
    }
    else if ($('#travelRequestId').text() != 0) {
        $('#travelRequestId').text(0);
        $("#travelrequesttemplate").hide();
        $("#existingtravelrequeststemplate").show();
    }
    else {
        // else, take them to action selection modal
        $("#action").show();
    }
}

function removeplaceholder(input) {

    if (isInternetExplorer) {

        var ph = $(input).attr('placeholder');

        if (ph) {
            $(input).val("");
            $(input).prop("placeholder", "");
        }
    }
}

function resetplaceholder(input,placeholdertext) {
    
    if (isInternetExplorer) {

        if (!$(input).val()) {
            $(input).prop("placeholder", placeholdertext);
        }
    }
}

function addPlaceHolder(input) {

    if (!Modernizr.input.placeholder) {
        input.focus(function () {
            if ($(this).val() == $(this).attr('placeholder')) {
                $(this).val('');
                $(this).removeClass('placeholder');
            }
        }).blur(function () {
            if ($(this).val() == '' || $(this).val() == $(this).attr('placeholder')) {
                $(this).addClass('placeholder');
                $(this).val($(this).attr('placeholder'));
            }
        }).blur();
        $(input).parents('form').submit(function () {
            $(this).find(input).each(function () {
                if ($(this).val() == $(this).attr('placeholder')) {
                    $(this).val('');
                }
            })
        });
    }
}

function savedataentry()
{
    // Get user inputs
    var badgeNumber = $('#txtBadgeNumber').val();
    var name = $('#txtName').val();
    var division = $('#txtDivision').val();
    var section = $('#txtSection').val();
    var organization = $('#txtOrganization').val();
    var meetingLocation = $('#txtMeetingLocation').val();
    var meetingBeginDate = $('#txtMeetingBeginDate').val();
    var meetingEndDate = $('#txtMeetingEndDate').val();
    var departureDate = $('#txtDepartureDate').val();
    var returnDate = $('#txtReturnDate').val();
    var userId = "";
    var travelRequestId = $('#travelRequestId').text();
    var selectedRoleId = $("#selectedRoleId").text();
    var purpose = $('#txtPurpose').val();
    var today = $('#txtToday').val();

    // Get estimated expenses
    var advLodge = $('#txtAdvLodge').val();
    var totalEstimatedLodge = $('#txtTotalEstimatedLodge').val();
    var hotelNameAndAddress = $('#txtHotelNameAndAddress').val();
    var hotelNotes = $('#txtHotelNotes').val();

    var advAirfare = $('#txtAdvAirfare').val();
    var totalEstimatedAirfare = $('#txtTotalEstimatedAirfare').val();
    var schedule = $('#txtSchedule').val();
    var flightSpecifics = $('#txtFlightSpecifics').val();

    var advRegistration = $('#txtAdvRegistration').val();
    var totalEstimatedRegistration = $('#txtTotalEstimatedRegistration').val();
    var payableTo = $('#txtPayableTo').val();
    var paidViaPCard = $('#txtPaidViaPCard').val();

    var advMeals = $('#txtAdvMeals').val();
    var totalEstimatedMeals = $('#txtTotalEstimatedMeals').val();
    var mealNotes1 = $('#txtMealNotes1').val();
    var mealNotes2 = $('#txtMealNotes2').val();

    var advCarRental = $('#txtAdvCarRental').val();
    var totalEstimatedCarRental = $('#txtTotalEstimatedCarRental').val();
    var agencyName = $('#txtAgencyName').val();
    var carRentalNotes = $('#txtCarRentalNotes').val();

    var advMiscellaneous = $('#txtAdvMiscellaneous').val();
    var totalEstimatedMiscellaneous = $('#txtTotalEstimatedMiscellaneous').val();
    var shuttle = $('#txtShuttle').val();
    var mileageAndParking = $('#txtMileageAndParking').val();
    
    var advanceTotal = $('#txtAdvanceTotal').val();
    var estimatedTotal = $('#txtEstimatedTotal').val();
    var cashAdvanceRequested = $('#txtCashAdvanceRequested').val();
    var dateNeededBy = $('#txtDateNeededBy').val();

    $.ajax({
        type: "POST",
        url: "/api/travelrequest/savenew",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            "TravelRequestData": {
                'TravelRequestId': travelRequestId,
                'BadgeNumber': badgeNumber,
                'Name': name,
                'Division': division,
                'Section': section,
                'Organization': organization,
                'MeetingLocation': meetingLocation,
                'MeetingBeginDateTime': meetingBeginDate,
                'DepartureDateTime': departureDate,
                'MeetingEndDateTime': meetingEndDate,
                'ReturnDateTime': returnDate,
                'UserId': userId,
                'SelectedRoleId': selectedRoleId,
                'Purpose': purpose,
                'Today': today
            },
            "EstimatedExpenseData": {
                'EstimatedExpenseId': 0,
                'TravelRequestId': travelRequestId,
                'AdvanceLodging': advLodge,
                'TotalEstimatedLodge': totalEstimatedLodge,
                'HotelNameAndAddress': hotelNameAndAddress,
                'HotealNotes': hotelNotes,
                'AdvanceAirFare': advAirfare,
                'TotalEstimatedAirfare': totalEstimatedAirfare,
                'Schedule': schedule,
                'FlightSpecifics':flightSpecifics,
                'AdvanceRegistration': advRegistration,
                'TotalEstimatedRegistration': totalEstimatedRegistration,
                'PayableToAndAddress': payableTo,
                'PaidViaPCard':paidViaPCard,
                'AdvanceMeals': advMeals,
                'TotalEstimatedMeals': totalEstimatedMeals,
                'MealNotes1':mealNotes1,
                'MealNotes2': mealNotes2,
                'AdvanceCarRental': advCarRental,
                'TotalEstimatedCarRental': totalEstimatedCarRental,
                'AgencyNameAndReservation': agencyName,
                'CarRentalNotes':carRentalNotes,
                'AdvanceMiscellaneous': advMiscellaneous,
                'TotalEstimatedMiscellaneous': totalEstimatedMiscellaneous,
                'Shuttle': shuttle,
                'MileageAndParking': mileageAndParking,
                'AdvanceTotal': advanceTotal,
                'TotalEstimatedTotal': estimatedTotal,
                'CashAdvance': cashAdvanceRequested,
                'DateNeededBy': dateNeededBy
            }
        }),
        success: function (data) {
            var result = JSON.parse(data);
            //$('#travelRequestId').text(result);
            $('#badgeNumber').text(badgeNumber);

            alert('success');

            //show estimated expense section
            //$('#travelrequesttemplate').hide();
            //$('#estimatedexpensetemplate').show();
            //$("#txtAdvLodge").focus();
        },
        error: function (xhr, options, error) {

            if (xhr.status == 500) {
                var errorMessage = xhr.responseText;

                $("#travelrequesterror").fadeIn("slow");
                $('#travelrequesterrormessage').text(errorMessage);

                // fade out in 5 seconds
                $("#travelrequesterror").fadeOut(fadeOutTimeInMilliseconds);
            }

            $('#travelRequestId').text(0);
            $('#badgeNumber').text(0);
        }
    });
}

function setUserName() {

    var badgeNumber = $('#txtBadgeNumber').val();

    if (badgeNumber) {
        $.ajax({
            type: "GET",
            url: "/api/travelrequest/employee/" + badgeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var result = JSON.parse(data);

                $('#txtName').val(result.EmployeeFirstName + ' ' + result.EmployeeLastName);
                $('#txtOrganization').val(result.Department);
            },
            error: function (xhr, options, error) {
            }
        });
    }
}