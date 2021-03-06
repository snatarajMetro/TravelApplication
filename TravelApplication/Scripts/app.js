﻿var userName = '';
var fadeOutTimeInMilliseconds = 15000; // 15 seconds
var selectedRoleId = 0;
var maxRowCount = 5;
var currentRowNumber = 3;
var currentRowNumberFIS = 3;
var currentRowNumberTravelRequest = 3;

$(document).ready(function () {

    $("#txtEmail").focus();

    //var scope = angular.element('#fileuploadtemplate').scope();
    //scope.loadFileUpload2(123456);
    //$("#fileuploadtemplate").show();
    //$("#selectedRoleId").text(4);
    //viewdashboard();
    //createnewrequest();
    //$('#travelRequestBadgeNumber').text("1234");
    
    //editTravelRequest();
    //$("#signin").hide();
    //createnewreimbursementrequest();
    //createTravelRequestReimbursement();
    //editTravelReimbursement(null);
    //viewexistingtravelrequests();
    //viewapprovedtravelrequests();
    //viewexistingreimbursements();
    //showApproveSection();
    //showCancelSection();
    //showRejectSection();
  });

function setTwoDecimal(el) {
    el.value = parseFloat(el.value).toFixed(2);
}

function handleEnterOnSigIn(e)
{
    // Enter Key
    if (e.keyCode === 13) {
        e.preventDefault();
        signIn();
    }
}

function closeinvaliduser() {
    $("#invaliduser").hide();
    $("#txtEmail").focus();
}

function logout() {

    // reset
    $("#selectedRoleId").text(0);
    $('#travelRequestId').text(0);
    $('#estimatedExpenseId').text(0);
    $('#signedInUserBadgeNumber').text(0);
    $('#travalAction').text('travelrequest');
    $('#travelReimbursementId').text(0);
    $('#fromDashboard').text("false");
    $('#txtReimbursementId').val(0);
    userName = "";

    $("#action").hide();
    $("#action2").hide();
    $("#invaliduser").hide();
    $("#logout").hide();
    $('#signintemplate').hide();
    $("#signin").show();
    $("#existingtravelrequeststemplate").hide();
    $("#travelrequesttemplate").hide();
    $("#fileuploadtemplate").hide();
    $("#travelreimbursementtemplate").hide();
    $("#existingtravelreimbursementtemplate").hide();
    $("#approvedtravelrequesttemplate").hide();
    $('#dashboardtemplate').hide();
    $('#rejecttemplate').hide();
    $('#approvetemplate').hide();
    $("#txtEmail").focus();
}

function signIn() {

    // Make api call to authenticate the user
    var user = $("#txtEmail").val();
    var password = $("#txtPassword").val();

    $("#txtEmail").attr("class", "datainputsignin");
    $("#txtPassword").attr("class", "datainputsignin");

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
                    $('#signedInUserBadgeNumber').text(result.BadgeNumber);
                    
                    // set user name
                    $("#userName").text(result.UserName);
                    userName = result.UserName;

                    $("#txtPassword").val("");
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

                $("#txtEmail").attr("class", "datainputsigninerror");
                $("#txtPassword").attr("class", "datainputsigninerror");
                $("#txtEmail").focus();
            }
        }
    });
}

function backtosignin() {

    $("#txtPassword").val("");
    $("#logout").hide();
    $("#signintemplate").hide();
    $("#existingtravelrequeststemplate").hide();
    $("#action").hide();
    $("#invaliduser").hide();
    $("#dataentry").hide();
    $("#signin").show();
    $("#txtPassword").focus();
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
            //viewexistingtravelrequests();
            $("#action2").show();
        }
        else if (selectedRoleId == 4) {
            //alert('show admin section');
            viewdashboard();
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
    
    // reset
    $('#travelRequestId').text(0);
    $('#travelRequestBadgeNumber').text(0);
    $('#travalAction').text('travelrequest');

    //load travel request section
    var scope = angular.element('#travelrequesttemplate').scope();
    
    scope.loadTravelRequest();
    scope.loadCostCenters();
}

function viewexistingtravelrequests(status) {
    $("#action").hide();   
    $('#travalAction').text('travelrequest');
    if (!status) {
        status = "";
    }
    $('#estimatedExpenseId').text(0);

    //reset estimated expense section
    var scope = angular.element('#existingtravelrequeststemplate').scope();
    scope.loadExistingTravelRequests(status);
    scope.loadApproveAction();
    scope.loadRejectAction();
    scope.loadCostCenters();

    $('#existingtravelrequeststemplate').show();
}

function backtoactionselection() {

    
    $("#travelrequesttemplate").hide();
    $("#estimatedexpensetemplate").hide();
    $("#existingtravelrequeststemplate").hide();
    $("#existingtravelreimbursementtemplate").hide();
    $("#approvedtravelrequesttemplate").hide();
    $('#estimatedExpenseId').text(0);

    // if selected role is approver, take them back to role selection modal
    if (selectedRoleId == 3) {
        $('#travelRequestId').text(0);
        $("#action2").show();
    }
    else if (($('#travelRequestId').text() != 0) && ($('#travalAction').text() == 'travelrequest')) {
        $('#travelRequestId').text(0);
        $("#travelrequesttemplate").hide();
        $("#action").show();
        //$("#existingtravelrequeststemplate").show();
    }
    else {
        if ($('#fromDashboard').text() == "true") {
            $('#fromDashboard').text("false");
            $('#existingtravelrequeststemplate').hide();
            $('#dashboardtemplate').show();
        }
        else {
            // else, take them to action selection modal
            $('#travelRequestId').text(0);
            $("#action").show();
        }
    }
}

function backtoactionselection2() {

    $("#travelrequesttemplate").hide();
    $("#estimatedexpensetemplate").hide();
    $("#existingtravelrequeststemplate").hide();
    $("#existingtravelreimbursementtemplate").hide();
    $("#approvedtravelrequesttemplate").hide();

    $("#action").show();
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
    var canSubmit = true;
    var errorMessage = "Some of the required fields are missing. Please try again.";

    // Get user inputs
    var badgeNumber = jQuery.trim($('#txtBadgeNumber').val());
    var name = jQuery.trim($('#txtName').val());
    var division = jQuery.trim($('#txtDivision').val());
    var section = jQuery.trim($('#txtSection').val());
    var organization = jQuery.trim($('#txtOrganization').val());
    var meetingLocation = jQuery.trim($('#txtMeetingLocation').val());
    var meetingBeginDate = jQuery.trim($('#txtMeetingBeginDate').val());
    var meetingEndDate = jQuery.trim($('#txtMeetingEndDate').val());
    var departureDate = jQuery.trim($('#txtDepartureDate').val());
    var returnDate = jQuery.trim($('#txtReturnDate').val());
    var userId = "";
    var travelRequestId = $('#travelRequestId').text();
    var selectedRoleId = $("#selectedRoleId").text();
    var purpose = $('#txtPurpose').val();
    var personalTravelIncluded = $('#cbPersonalTravelRequest').prop('checked');
    var specialInstruction = jQuery.trim($('#txtSpecialInstruction').val());
    var cashAdvanceRequired = ($('input[name=cashadvance]:checked').val() == "1");

    // Get estimated expenses
    var advLodge = $('#txtAdvLodge').val();
    var totalEstimatedLodge = $('#txtTotalEstimatedLodge').val();
    var hotelNameAndAddress = $('#txtHotelNameAndAddress').val();

    var advAirfare = $('#txtAdvAirfare').val();
    var totalEstimatedAirfare = $('#txtTotalEstimatedAirfare').val();
    var schedule = $('#txtSchedule').val();

    var advRegistration = $('#txtAdvRegistration').val();
    var totalEstimatedRegistration = $('#txtTotalEstimatedRegistration').val();
    var payableTo = $('#txtPayableTo').val();

    var advMeals = $('#txtAdvMeals').val();
    var totalEstimatedMeals = $('#txtTotalEstimatedMeals').val();
    var notes = $('#txtNotes').val();

    var advCarRental = $('#txtAdvCarRental').val();
    var totalEstimatedCarRental = $('#txtTotalEstimatedCarRental').val();
    var agencyName = $('#txtAgencyName').val();

    var advMiscellaneous = $('#txtAdvMiscellaneous').val();
    var totalEstimatedMiscellaneous = $('#txtTotalEstimatedMiscellaneous').val();
    var shuttle = $('#txtShuttle').val();
    
    var advanceTotal = $('#txtAdvanceTotal').val();
    var estimatedTotal = $('#txtEstimatedTotal').val();
    var cashAdvanceRequested = $('#txtCashAdvanceRequested').val();
    var dateNeededBy = $('#txtDateNeededBy').val();
    var estimatedExpenseId = $('#estimatedExpenseId').text();

    // Other Estimated costs
    var totalOtherEstimatedLodge = $('#txtTotalOtherEstimatedLodge').val();
    var totalOtherEstimatedAirFare = $('#txtTotalOtherEstimatedAirfare').val();
    var totalOtherEstimatedMeals = $('#txtTotalOtherEstimatedMeals').val();
    var totalOtherEstimatedTotal = $('#txtOtherEstimatedTotal').val();

    // Actual Estimated costs
    var totalActualEstimatedLodge = $('#txtTotalActualEstimatedLodge').val();
    var totalActualEstimatedAirFare = $('#txtTotalActualEstimatedAirfare').val();
    var totalActualEstimatedMeals = $('#txtTotalActualEstimatedMeals').val();
    var totalActualEstimatedTotal = $('#txtActualEstimatedTotal').val();
    var personalTravelExpense = $('#txtPersonalTravelExpense').val();

    if (!badgeNumber || badgeNumber.length <= 0)
    {
        canSubmit = false;
    }

    if (!name || name.length <= 0)
    {
        canSubmit = false;
    }

    if (!division || division.length <= 0) {
        canSubmit = false;
    }
    
    if (!section || section.length <= 0) {
        canSubmit = false;
    }

    if (!organization || organization.length <= 0) {
        canSubmit = false;
    }

    if (!meetingLocation || meetingLocation.length <= 0) {
        canSubmit = false;
    }

    if (!meetingBeginDate || meetingBeginDate.length <= 0) {
        canSubmit = false;
    }

    if (!meetingEndDate || meetingEndDate.length <= 0) {
        canSubmit = false;
    }

    // Validation
    if (canSubmit) {

        // Validate: Meeting begin and end date
        if (meetingBeginDate > meetingEndDate) {
            errorMessage = "Meeting end date should be greater than or equal to meeting begin date. ";
            canSubmit = false;
        }

        // Validate: Departure and Return date
        if (departureDate > returnDate) {
            errorMessage = "Return date should be greater than or equal to depature date. ";
            canSubmit = false;
        }

        // Validate:  Cash advance requested cannot be greater than total estimatated amount
        if ((cashAdvanceRequested * 1)  > (estimatedTotal*1)) {
            errorMessage = "Cash advance requested cannot be more than total estimated cost. ";
            canSubmit = false;
        }

         // Validate:  FIS section
        if (canSubmit) {

            for (var index = 1; index < currentRowNumberTravelRequest; index++) {

                var costCenter = $("#ddlCostCenter" + index + " option:selected").val().replace("?", "");
                var lineItem = $("#txtLineItem" + index).val();
                var project = $("#project" + index + " option:selected").val().replace("?", "");
                var task = $("#txtTask" + index).val();
                var amount = $("#txtAmount" + index).val();

                var dataEntered = ((costCenter.length > 0)
                    || (lineItem.length > 0)
                    || (project.length > 0)
                    || (task.length > 0)
                    || (amount.length > 0));

                if (dataEntered) {

                    var isValid = ((costCenter.length > 0)
                                    && (lineItem.length > 0)
                                    //&& (project.length > 0)
                                    && (task.length > 0)
                                    && (amount.length > 0));

                    if (!isValid) {
                        errorMessage = "On each row of travel funding source section, if one of the fields has data, all of the remaining fields are required and needs to have data.";
                        canSubmit = false;
                        break;
                    }
                }  
            }
        }

        // Validate : Total FIS amount should be equal to the total estimated amount 
        if (canSubmit) {
            var totalFISAmount = $('#txtFISTotal').val();

            if (estimatedTotal != totalFISAmount) {
                errorMessage = "Total travel funding source amount must be equal to total estimated amount.";
                canSubmit = false;
            }
        }
    }

    // if user is not admin and when creating a new travel request, reset to zero
    if (selectedRoleId != 4 && travelRequestId == 0) {

        // Other Estimated costs
        totalOtherEstimatedLodge = 0;
        totalOtherEstimatedAirFare = 0;
        totalOtherEstimatedMeals = 0;
        totalOtherEstimatedTotal = 0;

        // Actual Estimated costs
        totalActualEstimatedLodge = 0;
        totalActualEstimatedAirFare = 0;
        totalActualEstimatedMeals = 0;
        totalActualEstimatedTotal = 0;
        personalTravelExpense = 0;
    }

    if (canSubmit) {
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
                    'Purpose': purpose
                },
                "EstimatedExpenseData": {
                    'EstimatedExpenseId': estimatedExpenseId,
                    'TravelRequestId': travelRequestId,
                    'AdvanceLodging': advLodge,
                    'TotalEstimatedLodge': totalEstimatedLodge,
                    'HotelNameAndAddress': hotelNameAndAddress,
                    'AdvanceAirFare': advAirfare,
                    'TotalEstimatedAirfare': totalEstimatedAirfare,
                    'Schedule': schedule,
                    'AdvanceRegistration': advRegistration,
                    'TotalEstimatedRegistration': totalEstimatedRegistration,
                    'PayableToAndAddress': payableTo,
                    'AdvanceMeals': advMeals,
                    'TotalEstimatedMeals': totalEstimatedMeals,
                    'Note': notes,
                    'AdvanceCarRental': advCarRental,
                    'TotalEstimatedCarRental': totalEstimatedCarRental,
                    'AgencyNameAndReservation': agencyName,
                    'AdvanceMiscellaneous': advMiscellaneous,
                    'TotalEstimatedMiscellaneous': totalEstimatedMiscellaneous,
                    'Shuttle': shuttle,
                    'AdvanceTotal': advanceTotal,
                    'TotalEstimatedTotal': estimatedTotal,
                    'CashAdvance': cashAdvanceRequested,
                    'DateNeededBy': dateNeededBy,
                    'TotalOtherEstimatedLodge': totalOtherEstimatedLodge,
                    'TotalOtherEstimatedAirFare': totalOtherEstimatedAirFare,
                    'TotalOtherEstimatedMeals': totalOtherEstimatedMeals,
                    'TotalOtherEstimatedTotal': totalOtherEstimatedTotal,
                    'TotalActualEstimatedLodge': totalActualEstimatedLodge,
                    'TotalActualEstimatedAirFare': totalActualEstimatedAirFare,
                    'TotalActualEstimatedMeals': totalActualEstimatedMeals,
                    'TotalActualEstimatedTotal': totalActualEstimatedTotal,
                    'PersonalTravelExpense': personalTravelExpense,
                    'PersonalTravelIncluded': personalTravelIncluded,
                    'SpecialInstruction': specialInstruction,
                    'CashAdvanceRequired': cashAdvanceRequired
                },
                "FISData":
                {
                    "FISDetails": [
                        {
                            "CostCenterId": $("#ddlCostCenter1 option:selected").val().replace("?",""),
                            "LineItem": $('#txtLineItem1').val(),
                            "ProjectId": $("#project1 option:selected").val().replace("?", ""),
                            "Task": $('#txtTask1').val(),
                            "Amount": $('#txtAmount1').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter2 option:selected").val().replace("?", ""),
                            "LineItem": $('#txtLineItem2').val(),
                            "ProjectId": $("#project2 option:selected").val().replace("?", ""),
                            "Task": $('#txtTask2').val(),
                            "Amount": $('#txtAmount2').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter3 option:selected").val().replace("?", ""),
                            "LineItem": $('#txtLineItem3').val(),
                            "ProjectId": $("#project3 option:selected").val().replace("?",""),
                            "Task": $('#txtTask3').val(),
                            "Amount": $('#txtAmount3').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter4 option:selected").val().replace("?", ""),
                            "LineItem": $('#txtLineItem4').val(),
                            "ProjectId": $("#project4 option:selected").val().replace("?", ""),
                            "Task": $('#txtTask4').val(),
                            "Amount": $('#txtAmount4').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter5 option:selected").val().replace("?", ""),
                            "LineItem": $('#txtLineItem5').val(),
                            "ProjectId": $("#project5 option:selected").val().replace("?", ""),
                            "Task": $('#txtTask5').val(),
                            "Amount": $('#txtAmount5').val(),
                            "TravelRequestId": travelRequestId
                        }
                    ],
                    "TotalAmount": $('#txtFISTotal').val()
                }
            }),
            success: function (data) {
                var result = JSON.parse(data);

                $('#travelRequestBadgeNumber').text(result.BadgeNumber);
                $('#travelRequestId').text(result.TravelRequestId);
                //$('#estimatedExpenseId').text(0);

                var scope = angular.element('#fileuploadtemplate').scope();
                scope.loadFileUpload2(result.TravelRequestId);
                scope.loadCommonApprovers($('#travelRequestBadgeNumber').text());
                scope.loadTravelCoordinators();
                scope.loadSubmitDetails(result.TravelRequestId);

                $("#travelrequesttemplate").hide();
                $("#fileuploadtemplate").show();
            },
            error: function (xhr, options, error) {

                if (xhr.status == 500) {
                    
                    var errorMessage = xhr.responseText;

                    $("#submiterror").fadeIn("slow");
                    $('#submiterrormessage').text(errorMessage);

                    // fade out in 5 seconds
                    $("#submiterror").fadeOut(fadeOutTimeInMilliseconds);
                }

                $('#travelRequestId').text(0);
                $('#travelRequestBadgeNumber').text(0);
            }
        });
    }
    else {

        $("#submiterror").fadeIn("slow");
        $('#submiterrormessage').text(errorMessage);

        // fade out in 5 seconds
        $("#submiterror").fadeOut(fadeOutTimeInMilliseconds);
    }
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
                $('#txtDivision').val(result.CostCenter);
            },
            error: function (xhr, options, error) {
            }
        });
    }
}

function setOtherUserName(source2, container) {

    var badgeNumber = $('#' + source2).val();

    if (badgeNumber) {
        $.ajax({
            type: "GET",
            url: "/api/travelrequest/employee/" + badgeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var result = JSON.parse(data);

                $('#' + container).val(result.EmployeeFirstName + ' ' + result.EmployeeLastName);

                // enable the submit button
                $('#btnSubmit').prop("disabled", false);
            },
            error: function (xhr, options, error) {

                if (xhr.status == 500) {
                    var errorMessage = xhr.responseText;

                    $("#submiterror").fadeIn("slow");
                    $('#submiterrormessage').text(errorMessage);

                    // fade out in 5 seconds
                    $("#submiterror").fadeOut(fadeOutTimeInMilliseconds);

                    // disable the submit button
                    $('#btnSubmit').prop("disabled", true);
                }
            }
        });
    }
}

function backtotravelrequestsection()
{
    $("#fileuploadtemplate").hide();
    $("#travelrequesttemplate").show();

}

function showaction() {

    $("#submitsuccess").hide();
    $('#btnSubmit').prop("disabled", false);
    $('#btnBack').prop("disabled", false);
    $("#fileuploadtemplate").hide();
    $('#estimatedExpenseId').text(0);
    $("#action").show();
}

function cancelAction() {
    $('#approvetemplate').hide();
    $('#rejecttemplate').hide();
}

function showApproveSection(container) {

    var altObj = $(container).prop('alt');
    var travelRequestId = altObj.split('|')[0];
    var showAlertText = altObj.split('|')[1];

    var scope = angular.element('#approvetemplate').scope();
    scope.loadApproveAction(travelRequestId, showAlertText);

    $('#approvetemplate').show();
}

function showApproveSection2(container) {

    var travelRequestId = $(container).prop('alt');
    $('#travalAction').text('travelreimbursement');

    var scope = angular.element('#approvetemplate').scope();
    scope.loadApproveAction(travelRequestId);

    $('#approvetemplate').show();
}

function approve() {

    var travelRequestId = $('#travelRequestIdForAction').text();
    var badgeNumber = $('#signedInUserBadgeNumber').text();
    var comments = $('#txtComments').val();
    var action = $('#travalAction').text();
    var url = "api/travelrequest/approve";

    if (action)
    {
        if (action == "travelreimbursement") {
            url = "api/reimburse/approve";
        }
    }

    // Disable the approve and cancel button, once the user clicks on it.
    $('#btnApprove').prop("disabled", true);
    $('#btnCancelApprove').prop("disabled", true);
    
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify({ "TravelRequestId": travelRequestId, "ApproverBadgeNumber": badgeNumber, "Comments": comments }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            $('#travalAction').text('travelrequest');
            $("#approvesuccess").fadeIn("fast");
            $('#approvesuccessmessage').text('Travel request has been successfully approved.');

            // fade out in 5 seconds
            $("#approvesuccess").fadeOut("slow");

            $("#approvetemplate").fadeOut("slow");

            // refresh the existing request grid
            var scope = angular.element('#existingtravelrequeststemplate').scope();

            if (action == "travelreimbursement") {
                scope.refreshExistingReimbursements();
            } else {
                scope.refreshExistingRequest();
            }
        },
        error: function (xhr, options, error) {

            // Enable the approve and cancel button
            $('#btnApprove').prop("disabled", false);
            $('#btnCancelApprove').prop("disabled", false);

            if (xhr.status == 500) {
                var errorMessage = xhr.responseText;

                $("#approveerror").fadeIn("slow");
                $('#approveerrormessage').text(errorMessage);

                // fade out in 5 seconds
                $("#approveerror").fadeOut(fadeOutTimeInMilliseconds);
            }
        }
    });
}

function reject() {

    var travelRequestId = $('#travelRequestIdForRejectAction').text();
    var badgeNumber = $('#signedInUserBadgeNumber').text();
    var comments = $('#txtCommentsForReject').val();
    var rejectReason = $("#btnRejectReason").attr('title');
    var action = $('#travalAction').text();
    var url = "api/travelrequest/reject";
    var selectedRoleId = $("#selectedRoleId").text();
    var departmentHeadBadgeNumber = "";
    var executiveOfficerBadgeNumber = "";
    var ceoForInternationalBadgeNumber = "";
    var ceoForAPTABadgeNumber = "";
    var travelCoordinatorBadgeNumber = "";
    var canSubmit = false;
    var travelRequestBadgeNumber = $('#travelRequestBadgeNumber').text();

    if (action) {
        if (action == "travelreimbursement") {
            url = "api/reimburse/reject";
        }
    }

    // Get approvers when an admin rejects
    if ((selectedRoleId == 4) && (action == "travelrequest")) {
        departmentHeadBadgeNumber = $("#ddlDepartmentHead2 option:selected").val();
        executiveOfficerBadgeNumber = $("#ddlExecutiveOfficer2 option:selected").val();
        ceoForInternationalBadgeNumber = $("#ddlCEOForInternational2 option:selected").val();
        ceoForAPTABadgeNumber = $("#ddlCEOForAPTA2 option:selected").val();
        travelCoordinatorBadgeNumber = $("#ddlTravelCoordinator2 option:selected").val();

        // Reject Reason
        if (rejectReason) {
            canSubmit = true;
        }

        // Department Head
        //var departmentHeadBadgeNumber = $("#ddlDepartmentHead2 option:selected").val();

        //if (departmentHeadBadgeNumber && departmentHeadBadgeNumber != '?' && canSubmit) {
        //    canSubmit = true;
        //}

        // Travel Co-ordinator
        var travelCoordinatorBadgeNumber = $("#ddlTravelCoordinator2 option:selected").val();

        if (travelCoordinatorBadgeNumber && travelCoordinatorBadgeNumber != '?') {

            if (travelCoordinatorBadgeNumber && canSubmit) {
                canSubmit = true;
            }
        }
        else {
            canSubmit = false;
        }
    } else {
        canSubmit = true;
    }

    if (canSubmit) {

        // Disable the reject button, once the user clicks on it.
        $('#btnReject').prop("disabled", true);
        $('#btnCancelReject').prop("disabled", true);

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify({
                "TravelRequestId": travelRequestId,
                "ApproverBadgeNumber": badgeNumber,
                "TravelRequestBadgeNumber": travelRequestBadgeNumber,
                "Comments": comments,
                "RejectReason": rejectReason,
                "DepartmentHeadBadgeNumber": departmentHeadBadgeNumber,
                "DepartmentHeadName": $("#ddlDepartmentHead2 option:selected").text(),
                "ExecutiveOfficerBadgeNumber": executiveOfficerBadgeNumber,
                "ExecutiveOfficerName": $("#ddlExecutiveOfficer2 option:selected").text(),
                "CEOForInternationalBadgeNumber": ceoForInternationalBadgeNumber,
                "CEOForInternationalName": $("#ddlCEOForInternational2 option:selected").text(),
                "CEOForAPTABadgeNumber": ceoForAPTABadgeNumber,
                "CEOForAPTAName": $("#ddlCEOForAPTA2 option:selected").text(),
                "TravelCoordinatorBadgeNumber": travelCoordinatorBadgeNumber,
                "TravelCoordinatorName": $("#ddlTravelCoordinator2 option:selected").text(),
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                $('#travalAction').text('travelrequest');
                $("#rejectsuccess").fadeIn("fast");
                $('#rejectsuccessmessage').text('Travel request has been successfully rejected.');

                // fade out in 5 seconds
                $("#rejectsuccess").fadeOut("slow");

                $("#rejecttemplate").fadeOut("slow");

                $('#travelRequestBadgeNumber').text(0);

                // refresh the existing request grid
                var scope = angular.element('#existingtravelrequeststemplate').scope();
                if (action == "travelreimbursement") {
                    scope.refreshExistingReimbursements();
                } else {
                    scope.refreshExistingRequest();
                }

            },
            error: function (xhr, options, error) {

                // Disable the reject button, once the user clicks on it.
                $('#btnReject').prop("disabled", false);
                $('#btnCancelReject').prop("disabled", false);

                if (xhr.status == 500) {
                    var errorMessage = xhr.responseText;

                    $("#rejecterror").fadeIn("slow");
                    $('#rejecterrormessage').text(errorMessage);

                    // fade out in 5 seconds
                    $("#rejecterror").fadeOut(fadeOutTimeInMilliseconds);
                }
            }
        });
    }
    else {
        $("#rejecterror").fadeIn("slow");
        $('#rejecterrormessage').text("Some of the required fields are missing. Please try again.");

        // fade out in 5 seconds
        $("#rejecterror").fadeOut(fadeOutTimeInMilliseconds);
    }
}

function closeapproveerror() {
    $("#approveerror").hide();
}

function closeapprovesuccess() {
    $("#approvesuccess").hide();
}

function closerejecterror() {
    $("#rejecterror").hide();
}

function closerejectsuccess() {
    $("#rejectsuccess").hide();
}

function showRejectSection(container) {

    //var travelRequestId = $(container).prop('alt');
    var altObj = $(container).prop('alt');
    var travelRequestId = altObj.split('|')[0];
    var travelRequestBadgeNumber = altObj.split('|')[1];

    //var travelRequestId = 123456;
    var selectedRoleId = $("#selectedRoleId").text();

    var scope = angular.element('#rejecttemplate').scope();
    scope.loadRejectAction(travelRequestId, selectedRoleId, travelRequestBadgeNumber, true);

    $('#rejecttemplate').show();
}

function showRejectSection2(container) {
    
    var altObj = $(container).prop('alt');
    var travelRequestId = altObj.split('|')[0];
    var travelRequestBadgeNumber = altObj.split('|')[1];
    var selectedRoleId = $("#selectedRoleId").text();

    $('#travalAction').text('travelreimbursement');
    var scope = angular.element('#rejecttemplate').scope();
    scope.loadRejectAction(travelRequestId, selectedRoleId, travelRequestBadgeNumber, false);

    $('#rejecttemplate').show();
}

function deletedocument(container) {

    var documentId = $(container).prop('alt');
    var travelRequestId = $('#travelRequestId').text();

    // Call the delete document API
    $.ajax({
        type: "DELETE",
        url: "/api/documents/deletedocument?travelRequestId=" + travelRequestId + "&documentId=" + documentId,
        contentType: "application/json; charset=utf-8",
        success: function () {
           
            // reload supporting documents section
            var scope = angular.element('#fileuploadtemplate').scope();
            scope.loadSupportingDocuments(travelRequestId);

            if (Dropzone.forElement("#supportingDocumentZone1")) {
                Dropzone.forElement("#supportingDocumentZone1").destroy();
            }
            if (Dropzone.forElement("#supportingDocumentZone2")) {
                Dropzone.forElement("#supportingDocumentZone2").destroy();
            }
            if (Dropzone.forElement("#supportingDocumentZone3")) {
                Dropzone.forElement("#supportingDocumentZone3").destroy();
            }
            if (Dropzone.forElement("#supportingDocumentZone4")) {
                Dropzone.forElement("#supportingDocumentZone4").destroy();
            }

            // Others
            if (Dropzone.forElement("#supportingDocumentZone6")) {
                Dropzone.forElement("#supportingDocumentZone6").destroy();
            }

            scope.setUpRequiredDocuments(travelRequestId);
        },
        error: function (xhr, options, error) {

            if (xhr.status == 500) {
                var errorMessage = xhr.responseText;

                $("#fileuploaderror").fadeIn("slow");
                $('#fileuploaderrormessage').text(errorMessage);

                // fade out in 5 seconds
                $("#fileuploaderror").fadeOut(fadeOutTimeInMilliseconds);
            }
        }
    });
}

function editTravelRequest(container) {

    $('#existingtravelrequeststemplate').hide();

    var travelRequestId = $(container).prop('alt');
    //var travelRequestId = 123456;

    var scope = angular.element('#travelrequesttemplate').scope();
    scope.loadTravelRequestForEditNew(travelRequestId);
    scope.loadCostCenters();

    $('#travelRequestId').text(travelRequestId);
}

function editTravelReimbursement(container) {

    $('#existingtravelreimbursementtemplate').hide();
    $('#existingtravelrequeststemplate').hide();

    $('#travalAction').text('travelreimbursement');

    var altObj = $(container).prop('alt');
    var travelRequestId = altObj.split('|')[0];
    var travelReimbursementId = altObj.split('|')[1];

    //var travelRequestId = 123456;
    //var travelReimbursementId = 3456;
    var scope = angular.element('#travelreimbursementtemplate').scope();
    scope.loadTravelReimbursementForEdit(travelRequestId);
    scope.loadCostCenters();

    $('#travelreimbursementtemplate').show();

    $('#travelRequestId').text(travelRequestId);
    $('#travelReimbursementId').text(travelReimbursementId);
    $('#txtTravelRequestNumber1').text(travelRequestId);
    
}


//function createnewreimbursementrequest() {

//    //load travel request section
//    var scope = angular.element('#travelreimbursementtemplate').scope();

//    scope.loadTravelReimbursementRequest();
//    scope.loadCostCenters();
//}

function createTravelRequestReimbursement(container) {

    //window.location.reload(true);

    $('#approvedtravelrequesttemplate').hide();
    $('#travelRequestId').text(0);

    var travelRequestId = $(container).prop('alt');
   // var travelRequestId = 1234567;

    var scope = angular.element('#travelreimbursementtemplate').scope();
    scope.loadTravelReimbursementRequest(travelRequestId);
    scope.loadCostCenters();

    $('#travelRequestId').text(travelRequestId);
}

function setreimbursement() {
    $('#tab1content').hide();
    $('#tab2content').show();

    $('#link1').prop("class", "");
    $('#link2').prop("class", "active");
}

function setreimbursement2() {
    $('#tab1content1').hide();
    $('#tab2content1').show();

    $('#link11').prop("class", "");
    $('#link21').prop("class", "active");
}

function settravelrequest() {
    $('#tab2content').hide();
    $('#tab1content').show();

    $('#link2').prop("class", "");
    $('#link1').prop("class", "active");
}

function settravelrequest2() {
    $('#tab2content1').hide();
    $('#tab1content1').show();

    $('#link21').prop("class", "");
    $('#link11').prop("class", "active");
}

function viewapprovedtravelrequests() {
    $("#action").hide();
    $("#action2").hide();
    $('#travalAction').text('travelreimbursement');

    var scope = angular.element('#approvedtravelrequesttemplate').scope();
    scope.loadApprovedTravelRequests();

    $('#approvedtravelrequesttemplate').show();
}

function viewexistingreimbursements(status) {

    $("#signin").hide();
    $("#action").hide();
    $("#action2").hide();
    $('#travalAction').text('travelreimbursement');
    $('#travelReimbursementId').text(0);
    if (!status) {
        status = "";
    }

    var scope = angular.element('#existingtravelrequeststemplate').scope();
    scope.loadExistingTravelReimbursementRequests(status);
    scope.loadApproveAction();
    scope.loadRejectAction();
    scope.loadCostCenters();
    
    $('#existingtravelrequeststemplate').show();
}

function showapprovedtravelrequests() {

    var travelRequestId = $('#travelRequestId').text();
   // alert(travelRequestId);

    if (($('#travalAction').text() == 'travelreimbursement') && ($('#travelReimbursementId').text() != 0)) {
        $('#travelreimbursementtemplate').hide();
        viewexistingreimbursements();
    }
    else {
        if (travelRequestId) {
            $('#travelreimbursementtemplate').hide();
            $('#approvedtravelrequesttemplate').show();
            // $('#existingtravelreimbursementtemplate').show();

            $('#travelRequestId').text(0);
        }
        else {
            $('#travelreimbursementtemplate').hide();
            $("#action").hide();

            $('#approvedtravelrequesttemplate').show();
        }
    }
}

function savereimbursementdataentry() {

    var canSubmit = true;
    var selectedRoleId = $("#selectedRoleId").text();
    var signedInUserBadgeNumber = $('#signedInUserBadgeNumber').text();

    // Get user inputs
    var travelRequestId = $('#txtTravelRequestNumber1').val();
    var badgeNumber = jQuery.trim($('#txtBadgeNumber2').val());
    var travelPeriodFrom = $('#txtTravelPeriodFrom').val();
    var travelPeriodTo = $('#txtTravelPeriodTo').val();
    var vendorNumber = $('#txtVendorNumber2').val();
    var costCenterNumber = $('#txtCostCenterNumber').val();
    var name = jQuery.trim($('#txtName2').val());
    var extension = $('#txtExtension').val();
    var division = jQuery.trim($('#txtDivision2').val());
    var department = jQuery.trim($('#txtDepartment').val());
    var purpose = jQuery.trim($('#txtPurpose2').val());
    var reimbursementId = $('#txtReimbursementId').val();

    // Get travel inputs
    if (canSubmit) {
        $.ajax({
            type: "POST",
            url: "api/reimburse/save",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "ReimbursementTravelRequestDetails": {
                    'TravelRequestId': travelRequestId,
                    'ReimbursementId': reimbursementId,
                    'BadgeNumber': badgeNumber,
                    'DepartureDateTime': travelPeriodFrom,
                    'ReturnDateTime': travelPeriodTo,
                    'VendorNumber': vendorNumber,
                    'CostCenterId': costCenterNumber,
                    'Name': name,
                    'Extension': extension,
                    'Division': division,
                    'Department': department,
                    'SelectedRoleId': selectedRoleId,
                    'SubmittedByBadgeNumber': signedInUserBadgeNumber,
                    'Purpose':purpose
                },
                "FIS":
                {
                    "FISDetails": [
                        {
                            "CostCenterId": $("#ddlCostCenter11 option:selected").val(),
                            "LineItem": $('#txtAccount1').val(),
                            "ProjectId": $("#ddlProjects11 option:selected").val(),
                            "Task": $('#txtTaskForReimbursement1').val(),
                            "Amount": $('#txtAmount1').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter12 option:selected").val(),
                            "LineItem": $('#txtAccount2').val(),
                            "ProjectId": $("#ddlProjects12 option:selected").val(),
                            "Task": $('#txtTaskForReimbursement2').val(),
                            "Amount": $('#txtAmount2').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter13 option:selected").val(),
                            "LineItem": $('#txtAccount3').val(),
                            "ProjectId": $("#ddlProjects13 option:selected").val(),
                            "Task": $('#txtTaskForReimbursement3').val(),
                            "Amount": $('#txtAmount3').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter14 option:selected").val(),
                            "LineItem": $('#txtAccount4').val(),
                            "ProjectId": $("#ddlProjects14 option:selected").val(),
                            "Task": $('#txtTaskForReimbursement4').val(),
                            "Amount": $('#txtAmount4').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter15 option:selected").val(),
                            "LineItem": $('#txtAccount5').val(),
                            "ProjectId": $("#ddlProjects15 option:selected").val(),
                            "Task": $('#txtTaskForReimbursement5').val(),
                            "Amount": $('#txtAmount5').val(),
                            "TravelRequestId": travelRequestId
                        }
                    ],
                    "TotalAmount": $('#txFISTotalAmount').val()
                },
                "ReimbursementDetails": {
                    "Reimbursement":[
                        {
                            "Id": $('#txtTravelId1').val(),
                            "TravelRequestId": travelRequestId,
                            "Date": $('#txtTravelDate1').val(),
                            "CityStateAndBusinessPurpose": $('#txtCityState1').val(),
                            "Miles": $('#txtTotalMiles1').val(),
                            "MileageToWork": $('#txtNormalMiles1').val(),
                            "BusinessMiles": $('#txtBusinessMiles1').val(),
                            "BusinessMilesXRate": $('#txtBusinessMilesTotal1').val(),
                            "ParkingAndGas": $('#txtParking1').val(),
                            "AirFare": $('#txtAirfare1').val(),
                            "TaxiRail": $('#txtTaxi1').val(),
                            "Lodge": $('#txtLodging1').val(),
                            "Meals": $('#txtMeals1').val(),
                            "Registration": $('#txtRegistration1').val(),
                            "Internet": $('#txtInternet1').val(),
                            "Others": $('#txtOther1').val(),
                            "DailyTotal": $('#txtDailyTotal1').val()
                        },
                        {
                            "Id": $('#txtTravelId2').val(),
                            "TravelRequestId": travelRequestId,
                            "Date": $('#txtTravelDate2').val(),
                            "CityStateAndBusinessPurpose": $('#txtCityState2').val(),
                            "Miles": $('#txtTotalMiles2').val(),
                            "MileageToWork": $('#txtNormalMiles2').val(),
                            "BusinessMiles": $('#txtBusinessMiles2').val(),
                            "BusinessMilesXRate": $('#txtBusinessMilesTotal2').val(),
                            "ParkingAndGas": $('#txtParking2').val(),
                            "AirFare": $('#txtAirfare2').val(),
                            "TaxiRail": $('#txtTaxi2').val(),
                            "Lodge": $('#txtLodging2').val(),
                            "Meals": $('#txtMeals2').val(),
                            "Registration": $('#txtRegistration2').val(),
                            "Internet": $('#txtInternet2').val(),
                            "Others": $('#txtOther2').val(),
                            "DailyTotal": $('#txtDailyTotal2').val()
                        },
                        {
                            "Id": $('#txtTravelId3').val(),
                            "TravelRequestId": travelRequestId,
                            "Date": $('#txtTravelDate3').val(),
                            "CityStateAndBusinessPurpose": $('#txtCityState3').val(),
                            "Miles": $('#txtTotalMiles3').val(),
                            "MileageToWork": $('#txtNormalMiles3').val(),
                            "BusinessMiles": $('#txtBusinessMiles3').val(),
                            "BusinessMilesXRate": $('#txtBusinessMilesTotal3').val(),
                            "ParkingAndGas": $('#txtParking3').val(),
                            "AirFare": $('#txtAirfare3').val(),
                            "TaxiRail": $('#txtTaxi3').val(),
                            "Lodge": $('#txtLodging3').val(),
                            "Meals": $('#txtMeals3').val(),
                            "Registration": $('#txtRegistration3').val(),
                            "Internet": $('#txtInternet3').val(),
                            "Others": $('#txtOther3').val(),
                            "DailyTotal": $('#txtDailyTotal3').val()
                        },
                        {
                            "Id": $('#txtTravelId4').val(),
                            "TravelRequestId": travelRequestId,
                            "Date": $('#txtTravelDate4').val(),
                            "CityStateAndBusinessPurpose": $('#txtCityState4').val(),
                            "Miles": $('#txtTotalMiles4').val(),
                            "MileageToWork": $('#txtNormalMiles4').val(),
                            "BusinessMiles": $('#txtBusinessMiles4').val(),
                            "BusinessMilesXRate": $('#txtBusinessMilesTotal4').val(),
                            "ParkingAndGas": $('#txtParking4').val(),
                            "AirFare": $('#txtAirfare4').val(),
                            "TaxiRail": $('#txtTaxi4').val(),
                            "Lodge": $('#txtLodging4').val(),
                            "Meals": $('#txtMeals4').val(),
                            "Registration": $('#txtRegistration4').val(),
                            "Internet": $('#txtInternet4').val(),
                            "Others": $('#txtOther4').val(),
                            "DailyTotal": $('#txtDailyTotal4').val()
                        },
                        {
                            "Id": $('#txtTravelId5').val(),
                            "TravelRequestId": travelRequestId,
                            "Date": $('#txtTravelDate5').val(),
                            "CityStateAndBusinessPurpose": $('#txtCityState5').val(),
                            "Miles": $('#txtTotalMiles5').val(),
                            "MileageToWork": $('#txtNormalMiles5').val(),
                            "BusinessMiles": $('#txtBusinessMiles5').val(),
                            "BusinessMilesXRate": $('#txtBusinessMilesTotal5').val(),
                            "ParkingAndGas": $('#txtParking5').val(),
                            "AirFare": $('#txtAirfare5').val(),
                            "TaxiRail": $('#txtTaxi5').val(),
                            "Lodge": $('#txtLodging5').val(),
                            "Meals": $('#txtMeals5').val(),
                            "Registration": $('#txtRegistration5').val(),
                            "Internet": $('#txtInternet5').val(),
                            "Others": $('#txtOther5').val(),
                            "DailyTotal": $('#txtDailyTotal5').val()
                        }
                    ],
                    "TotalMiles":$('#txtTotalMiles').val(),
                    "TotalMileageToWork": $('#txtTotalNormalMiles').val(),
                    "TotalBusinessMiles": $('#txtTotalBusinessMiles').val(),
                    "TotalBusinessMilesXRate": $('#txtBusinessMilesAmountTotal').val(),
                    "TotalParkingGas": $('#txtParkingTotal').val(),
                    "TotalAirFare": $('#txtAirfareTotal').val(),
                    "TotalTaxiRail": $('#txtTaxiTotal').val(),
                    "TotalLodge": $('#txtLodgingTotal').val(),
                    "TotalMeals": $('#txtMealsTotal').val(),
                    "TotalRegistration": $('#txtRegistrationTotal').val(),
                    "TotalInternet": $('#txtInternetTotal').val(),
                    "TotalOther": $('#txtOtherTotal').val(),
                    "TotalDailyTotal": $('#txtTotalDailyAmount').val(),
                    "TotalPart1TravelExpenses": $('#txtTotalPart1TravelExpense').val(),
                    "TotalPart2TravelExpenses": $('#txtTotalPart2NonTravelExpense').val(),
                    "TotalExpSubmittedForApproval": $('#txtTotalSubmittedForApproval').val(),
                    "SubtractPaidByMTA": $('#txtTotalPrePaidByMTA').val(),
                    "TotalExpenses": $('#txtTotalExpenses').val(),
                    "SubtractCashAdvance": $('#txtCashAdvance').val(),
                    "SubtractPersonalAdvance": $('#txtPersonalAdvance').val(),
                    "Total": $('#txtTotal').val()
                }
            }),
            success: function (data) {
                reimbursementId = JSON.parse(data);
                $('#txtReimbursementId').val(reimbursementId);

                $('#travelRequestBadgeNumber').text(badgeNumber);
                $('#travelRequestId').text(travelRequestId);

                var scope = angular.element('#fileuploadtemplate').scope();
                scope.loadFileUploadForReimbursement(travelRequestId);
                scope.loadCommonApprovers($('#travelRequestBadgeNumber').text());
                scope.loadTravelCoordinators();
                scope.loadSubmitDetailsForReimbursement(travelRequestId);

                $("#travelreimbursementtemplate").hide();
                $("#fileuploadtemplate").show();
            },
            error: function (xhr, options, error) {

                if (xhr.status == 500) {
                    var errorMessage = xhr.responseText;

                    $("#submiterror").fadeIn("slow");
                    $('#submiterrormessage').text(errorMessage);

                    // fade out in 5 seconds
                    $("#submiterror").fadeOut(fadeOutTimeInMilliseconds);
                }

                $('#travelRequestId').text(0);
                $('#travelRequestBadgeNumber').text(0);
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

function backtotravelreimbursementsection() {

    $("#fileuploadtemplate").hide();
    $("#travelreimbursementtemplate").show();
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function updateTotal(obj) {

    var total = 0;
    for (var i = 1; i <= maxRowCount; i++)
    {
        var value = $("#txtTotalMiles" + i).val();

        if (value) {
            total += parseInt(value);
        }
    }
    $("#txtTotalMiles").val(total);
}

function checkDec(el) {
    var ex = /^\d+(?:\.\d{1,2})?$/;
    if (ex.test(el.value) == false) {
        el.value = el.value.substring(0, el.value.length - 1);
    }
}

function backtorolesection() {
    $("#action").hide();
    $("#action2").hide();
    $('#signintemplate').show();
}

function viewdashboard() {

    $("#signin").hide();

    var scope = angular.element('#dashboardtemplate').scope();
    scope.loadDashboard();

    $('#dashboardtemplate').show();
   
}

function backfromdashboard() {
    $('#dashboardtemplate').hide();
    $("#signintemplate").show();
}

function viewexistingreimbursements2() {

    $("#signin").hide();
    $("#action").hide();
    $("#action2").hide();
    $("#dashboardtemplate").hide();
    $('#travalAction').text('travelreimbursement');
    $('#travelReimbursementId').text(0);

    var scope = angular.element('#existingtravelrequeststemplate').scope();
    scope.loadExistingTravelReimbursementRequests();
    scope.loadApproveAction();
    scope.loadRejectAction();
    scope.loadCostCenters();

    $('#existingtravelrequeststemplate').show();
}

function viewexistingtravelrequests2() {
    $("#action").hide();
    $("#dashboardtemplate").hide();

    $('#travalAction').text('travelrequest');

    //reset estimated expense section
    var scope = angular.element('#existingtravelrequeststemplate').scope();
    scope.loadExistingTravelRequests();
    scope.loadApproveAction();
    scope.loadRejectAction();
    scope.loadCostCenters();

    $('#existingtravelrequeststemplate').show();
}

function emailapprove() {
    var travelRequestId = $("#travelRequestId").text();
    var badgeNumber = $("#badgeNumber").text();
    var comments = $("#txtComments").text();
    $.ajax({
        type: "POST",
        url: "/api/Approval/Approve",
        data: JSON.stringify({             
                "TravelRequestId": travelRequestId,
                "BadgeNumber": badgeNumber,
                "Comments": comments            
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            alert('Successfully approved the request');
            window.close();
        },
        error: function (xhr, options, error) {
            alert('error');
        }
    });
}

function setRejectReason(container)
{
    var data = $(container).html();

    $("#btnRejectReason").html(data.substring(0, 25) + '&nbsp;&nbsp;<span class="caret" style="float:right;margin-top:7px;"></span>');
    $("#btnRejectReason").prop("title", data);
    $("#txtCommentsForReject").focus();

    return false;
}

function showCancelSection(container) {

    var altObj = $(container).prop('alt');
    var travelRequestId = altObj.split('|')[0];
    var travelRequestBadgeNumber = altObj.split('|')[1];

    //var travelRequestId = 123456;
    //var travelRequestBadgeNumber = 454567;

    var scope = angular.element('#approvetemplate').scope();
    scope.loadCancelAction(travelRequestId, travelRequestBadgeNumber);
    $('#approvetemplate').show();
}

function cancel() {

    var travelRequestId = $('#travelRequestIdForAction').text();
    var badgeNumber = $('#signedInUserBadgeNumber').text();
    var travelrequestBadgeNumber = $('#travelrequestBadgeNumber').text();
    var comments = $('#txtComments').val();
    var action = $('#travalAction').text();
    var url = "api/travelrequest/cancel";

    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify({
            "TravelRequestId": travelRequestId,
            "ApproverBadgeNumber": badgeNumber,
            "TravelRequestBadgeNumber": travelrequestBadgeNumber,
            "Comments": comments
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            $('#travalAction').text('travelrequest');
            $("#approvesuccess").fadeIn("fast");
            $('#approvesuccessmessage').text('Travel request has been successfully canceled.');

            // fade out in 5 seconds
            $("#approvesuccess").fadeOut("slow");

            $("#approvetemplate").fadeOut("slow");

            // refresh the existing request grid
            var scope = angular.element('#existingtravelrequeststemplate').scope();

            if (action == "travelreimbursement") {
                scope.refreshExistingReimbursements();
            } else {
                scope.refreshExistingRequest();
            }
        },
        error: function (xhr, options, error) {

            if (xhr.status == 500) {
                var errorMessage = xhr.responseText;

                $("#approveerror").fadeIn("slow");
                $('#approveerrormessage').text(errorMessage);

                // fade out in 5 seconds
                $("#approveerror").fadeOut(fadeOutTimeInMilliseconds);
            }
        }
    });
}

function closesubmiterror() {
    $("#submiterror2").hide();
}

function closetravelrequesterror() {
    $("#submiterror").hide();
}

function setmaxlength(id, event) {
    var element = $("#" + id);
    var len = element.val().length + 1;
    var max = element.attr("maxlength");

    var cond = (45 < event.which && event.which < 58) || (45 < event.keyCode && event.keyCode < 58);

    if (!(cond && len <= max)) {
        event.preventDefault();
        return false;
    }
}

function displayCashAdvance(display) {
    if (display == 1) {
        // display cash advance section
        $(".advancedneeded").removeAttr("style");
    } else {

        // reset cash advance fields
        $("#txtAdvLodge").val("");
        $("#txtAdvMeals").val("");
        $("#txtAdvMiscellaneous").val("");
        $("#txtAdvanceTotal").val("");
        $("#txtCashAdvanceRequested").val("");

        // hide cash advance section
        $(".advancedneeded").attr("style","display:none;");
    }
}

function editNotes(container) {

    var altObj = $(container).prop('alt');
    var documentId = altObj.split('|')[0];
    var fileName = altObj.split('|')[1];
    var notes = altObj.split('|')[2];

    if (notes) {
        $("#taNotes").val(notes);
        $("#ddlNoteOptions").val(fileName);
    }
}

function cancelEditNotes() {

    // clear the notes
    $("#taNotes").val("");

    // reset the notes option dropdown value to its default value
    $("#ddlNoteOptions").val("Justification Memo");

}

function saveTravelRequestNotes() {

    var travelRequestId = $('#travelRequestId').text();
    var notes = $("#taNotes").val();
    var noteOption = $("#ddlNoteOptions option:selected").val();
    var documentId = "";

    if (notes) {

        // call save notes api
        $('#btnSaveNotes').prop("disabled", true);
        $('#btnCancelNotes').prop("disabled", true);

        $.ajax({
            type: "POST",
            url: "api/documents/savenotes",
            data: JSON.stringify({
                "DocumentNoteRequest": {
                    "TravelRequestId": travelRequestId,
                    "DocumentId": documentId,
                    "Notes": notes,
                    "NotesOption": noteOption
                }
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {

                $("#submitsuccess2").fadeIn("slow");
                $('#submitsuccessmessage2').text("Notes has been successfully saved.");

                $('#btnSaveNotes').prop("disabled", false);
                $('#btnCancelNotes').prop("disabled", false);

                // refresh supporting document grid
                var scope = angular.element('#fileuploadtemplate').scope();
                scope.loadSupportingDocuments(travelRequestId);

                // clear the notes
                $("#taNotes").val("");

                // reset the notes option dropdpwn value to its default value
                $("#ddlNoteOptions").val("Justification Memo");
            },
            error: function (xhr, options, error) {
                if (xhr.status == 500) {

                    $('#btnSaveNotes').prop("disabled", false);
                    $('#btnCancelNotes').prop("disabled", false);

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
        $('#btnSaveNotes').prop("disabled", false);
        $('#btnCancelNotes').prop("disabled", false);

        errorMessage = "Please enter some value for notes";

        $("#submiterror2").fadeIn("slow");
        $('#submiterrormessage2').text(errorMessage);

        // fade out in 5 seconds
        $("#submiterror2").fadeOut(fadeOutTimeInMilliseconds);
    }
}

function setDefaultNotes() {
    var selectedJustificationMemoType = $("#ddlNoteOptions option:selected").text();

    if (selectedJustificationMemoType == "Approved Travel") {
        $("#taNotes").text("Approved Travel...");
    }
    else if (selectedJustificationMemoType == "Local Lodging") {
        $("#taNotes").text("Local Lodging...");
    }
    else if (selectedJustificationMemoType == "Car Rental") {
        $("#taNotes").text("Car Rental...");
    }
    else if (selectedJustificationMemoType == "Personal Vehicle Use") {
        $("#taNotes").text("Personal Vehicle Use...");
    }
    else if (selectedJustificationMemoType == "Cash Advance") {
        $("#taNotes").text("Cash Advance...");
    }
    else if (selectedJustificationMemoType == "Personal time off approval") {
        $("#taNotes").text("Personal time off approval");
    }

    $("#taNotes").focus();
}