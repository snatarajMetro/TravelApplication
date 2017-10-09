var userName = '';
var fadeOutTimeInMilliseconds = 5000; // 5 seconds
var selectedRoleId = 0;

$(document).ready(function () {

    $("#txtEmail").focus();
});

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
    userName = "";

    $("#action").hide();
    $("#invaliduser").hide();
    $("#logout").hide();
    $('#signintemplate').hide();
    $("#signin").show();
    $("#existingtravelrequeststemplate").hide();
    $("#travelrequesttemplate").hide();
    $("#fileuploadtemplate").hide();

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
    
    // reset
    $('#travelRequestId').text(0);
    $('#travelRequestBadgeNumber').text(0);

    //load travel request section
    var scope = angular.element('#travelrequesttemplate').scope();
    //scope.loadFIS();
    //scope.loadCostCenters();

    scope.loadTravelRequest();
    //scope.loadFileUpload2();
    $('#travelrequesttemplate').show();
    $("#txtBadgeNumber").focus();

    scope.loadCostCenters();
}

function viewexistingtravelrequests() {
    $("#action").hide();

    //reset estimated expense section
    var scope = angular.element('#existingtravelrequeststemplate').scope();
    scope.loadExistingTravelRequests();
    scope.loadApproveAction();
    scope.loadRejectAction();

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
                'AdvanceAirFare': advAirfare,
                'TotalEstimatedAirfare': totalEstimatedAirfare,
                'Schedule': schedule,
                'AdvanceRegistration': advRegistration,
                'TotalEstimatedRegistration': totalEstimatedRegistration,
                'PayableToAndAddress': payableTo,
                'AdvanceMeals': advMeals,
                'TotalEstimatedMeals': totalEstimatedMeals,
                'Note':notes,
                'AdvanceCarRental': advCarRental,
                'TotalEstimatedCarRental': totalEstimatedCarRental,
                'AgencyNameAndReservation': agencyName,
                'AdvanceMiscellaneous': advMiscellaneous,
                'TotalEstimatedMiscellaneous': totalEstimatedMiscellaneous,
                'Shuttle': shuttle,
                'AdvanceTotal': advanceTotal,
                'TotalEstimatedTotal': estimatedTotal,
                'CashAdvance': cashAdvanceRequested,
                'DateNeededBy': dateNeededBy
            },
            "FISData": 
            {
                "FISDetails":[
                    {
                        "CostCenterId": $("#ddlCostCenter1 option:selected").val(),
                        "LineItem":$('#txtLineItem1').val(),
                        "ProjectId": $("#project1 option:selected").val(),
                        "Task": $('#txtTask1').val(),
                        "Amount": $('#txtAmount1').val(),
                        "TravelRequestId": travelRequestId
                    },
                    {
                        "CostCenterId": $("#ddlCostCenter2 option:selected").val(),
                        "LineItem": $('#txtLineItem2').val(),
                        "ProjectId": $("#project2 option:selected").val(),
                        "Task": $('#txtTask2').val(),
                        "Amount": $('#txtAmount2').val(),
                        "TravelRequestId": travelRequestId
                    }
                ],
                "TotalAmount":$('#txtFISTotal').val()
            }
        }),
        success: function (data) {
            var result = JSON.parse(data);
            
            $('#travelRequestBadgeNumber').text(result.BadgeNumber);
            $('#travelRequestId').text(result.TravelRequestId);

            var scope = angular.element('#fileuploadtemplate').scope();
            scope.loadFileUpload2(result.TravelRequestId);
            scope.loadCommonApprovers($('#travelRequestBadgeNumber').text());
            scope.loadTravelCoordinators();
            //scope.loadSupportingDocuments(travelRequestId);

            $("#travelrequesttemplate").hide();
            $("#fileuploadtemplate").show();
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
            $('#travelRequestBadgeNumber').text(0);
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
    $("#action").show();
}

function cancelAction() {
    $('#approvetemplate').hide();
    $('#rejecttemplate').hide();
}

function showApproveSection(container) {

    var travelRequestId = $(container).prop('alt');

    var scope = angular.element('#approvetemplate').scope();
    scope.loadApproveAction(travelRequestId);

    $('#approvetemplate').show();
}

function approve() {

    var travelRequestId = $('#travelRequestIdForAction').text();
    var badgeNumber = $('#signedInUserBadgeNumber').text();
    var comments = $('#txtComments').val();

    $.ajax({
        type: "POST",
        url: "api/travelrequest/approve",
        data: JSON.stringify({ "TravelRequestId": travelRequestId, "ApproverBadgeNumber": badgeNumber, "Comments": comments }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            $("#approvesuccess").fadeIn("fast");
            $('#approvesuccessmessage').text('Travel request has been successfully approved.');

            // fade out in 5 seconds
            $("#approvesuccess").fadeOut("slow");

            $("#approvetemplate").fadeOut("slow");

            // refresh the existing request grid
            var scope = angular.element('#existingtravelrequeststemplate').scope();
            scope.refreshExistingRequest();
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

function reject() {

    var travelRequestId = $('#travelRequestIdForRejectAction').text();
    var badgeNumber = $('#signedInUserBadgeNumber').text();
    var comments = $('#txtCommentsForReject').val();

    $.ajax({
        type: "POST",
        url: "api/travelrequest/reject",
        data: JSON.stringify({ "TravelRequestId": travelRequestId, "ApproverBadgeNumber": badgeNumber, "Comments": comments }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            $("#rejectsuccess").fadeIn("fast");
            $('#rejectsuccessmessage').text('Travel request has been successfully rejected.');

            // fade out in 5 seconds
            $("#rejectsuccess").fadeOut("slow");

            $("#rejecttemplate").fadeOut("slow");

            // refresh the existing request grid
            var scope = angular.element('#existingtravelrequeststemplate').scope();
            scope.refreshExistingRequest();

        },
        error: function (xhr, options, error) {

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

    var travelRequestId = $(container).prop('alt');
    var scope = angular.element('#rejecttemplate').scope();
    scope.loadRejectAction(travelRequestId);

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
    var scope = angular.element('#travelrequesttemplate').scope();
    scope.loadTravelRequestForEditNew(travelRequestId);

    $('#travelRequestId').text(travelRequestId);
}