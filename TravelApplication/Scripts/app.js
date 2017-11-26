var userName = '';
var fadeOutTimeInMilliseconds = 5000; // 5 seconds
var selectedRoleId = 0;
var maxRowCount = 5;
var currentRowNumber = 3;
var currentRowNumberFIS = 3;
var currentRowNumberTravelRequest = 3;

$(document).ready(function () {

    $("#txtEmail").focus();

    //viewdashboard();
    //createnewrequest();
    //editTravelRequest();

    //$("#signin").hide();
    //createnewreimbursementrequest();
    //createTravelRequestReimbursement();
    //editTravelReimbursement(null);
    //viewexistingtravelrequests();
    //viewapprovedtravelrequests();
    //viewexistingreimbursements();
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

function viewexistingtravelrequests() {
    $("#action").hide();

    $('#travalAction').text('travelrequest');

    //reset estimated expense section
    var scope = angular.element('#existingtravelrequeststemplate').scope();
    scope.loadExistingTravelRequests();
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
        // else, take them to action selection modal
        $('#travelRequestId').text(0);
        $("#action").show();
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

    if (!departureDate || departureDate.length <= 0) {
        canSubmit = false;
    }

    if (!returnDate || returnDate.length <= 0) {
        canSubmit = false;
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
                    'DateNeededBy': dateNeededBy
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
    var action = $('#travalAction').text();
    var url = "api/travelrequest/reject";

    if (action) {
        if (action == "travelreimbursement") {
            url = "api/reimburse/reject";
        }
    }

    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify({ "TravelRequestId": travelRequestId, "ApproverBadgeNumber": badgeNumber, "Comments": comments }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            $('#travalAction').text('travelrequest');
            $("#rejectsuccess").fadeIn("fast");
            $('#rejectsuccessmessage').text('Travel request has been successfully rejected.');

            // fade out in 5 seconds
            $("#rejectsuccess").fadeOut("slow");

            $("#rejecttemplate").fadeOut("slow");

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

function showRejectSection2(container) {

    var travelRequestId = $(container).prop('alt');
    $('#travalAction').text('travelreimbursement');

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
    var scope = angular.element('#travelreimbursementtemplate').scope();
    scope.loadTravelReimbursementForEdit(travelRequestId);
    scope.loadCostCenters();

    $('#travelreimbursementtemplate').show();

    $('#travelRequestId').text(travelRequestId);
    $('#travelReimbursementId').text(travelReimbursementId);
    $('#txtTravelRequestNumber1').text(travelRequestId);
    
}

function createnewreimbursementrequest() {

    //load travel request section
    var scope = angular.element('#travelreimbursementtemplate').scope();

    scope.loadTravelReimbursementRequest();
    scope.loadCostCenters();
}

function createTravelRequestReimbursement(container) {

    $('#approvedtravelrequesttemplate').hide();
    $('#travelRequestId').text(0);

    var travelRequestId = $(container).prop('alt');
    //travelRequestId = 1234567;

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

function viewexistingreimbursements() {

    $("#signin").hide();
    $("#action").hide();
    $("#action2").hide();
    $('#travalAction').text('travelreimbursement');
    $('#travelReimbursementId').text(0);

    var scope = angular.element('#existingtravelrequeststemplate').scope();
    scope.loadExistingTravelReimbursementRequests();
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
    var badgeNumber = jQuery.trim($('#txtBadgeNumber').val());
    var travelPeriodFrom = $('#txtTravelPeriodFrom').val();
    var travelPeriodTo = $('#txtTravelPeriodTo').val();
    var vendorNumber = $('#txtVendorNumber').val();
    var costCenterNumber = $('#txtCostCenterNumber').val();
    var name = jQuery.trim($('#txtName').val());
    var extension = $('#txtExtension').val();
    var division = jQuery.trim($('#txtDivision').val());
    var department = jQuery.trim($('#txtDepartment').val());
    var purpose = jQuery.trim($('#txtPurpose').val());
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
                            "CostCenterId": $("#ddlCostCenter1 option:selected").val(),
                            "LineItem": $('#txtAccount1').val(),
                            "ProjectId": $("#ddlProjects1 option:selected").val(),
                            "Task": $('#txtTask1').val(),
                            "Amount": $('#txtAmount1').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter2 option:selected").val(),
                            "LineItem": $('#txtAccount2').val(),
                            "ProjectId": $("#ddlProjects2 option:selected").val(),
                            "Task": $('#txtTask2').val(),
                            "Amount": $('#txtAmount2').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter3 option:selected").val(),
                            "LineItem": $('#txtAccount3').val(),
                            "ProjectId": $("#ddlProjects3 option:selected").val(),
                            "Task": $('#txtTask3').val(),
                            "Amount": $('#txtAmount3').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter4 option:selected").val(),
                            "LineItem": $('#txtAccount4').val(),
                            "ProjectId": $("#ddlProjects4 option:selected").val(),
                            "Task": $('#txtTask4').val(),
                            "Amount": $('#txtAmount4').val(),
                            "TravelRequestId": travelRequestId
                        },
                        {
                            "CostCenterId": $("#ddlCostCenter5 option:selected").val(),
                            "LineItem": $('#txtAccount5').val(),
                            "ProjectId": $("#ddlProjects5 option:selected").val(),
                            "Task": $('#txtTask5').val(),
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
                    "Total": $('#txtTotal').val()
                }
            }),
            success: function (data) {
                //var result = JSON.parse(data);

                $('#travelRequestBadgeNumber').text(badgeNumber);
                $('#travelRequestId').text(travelRequestId);

                var scope = angular.element('#fileuploadtemplate').scope();
                scope.loadFileUploadForReimbursement(travelRequestId);
                scope.loadCommonApprovers($('#travelRequestBadgeNumber').text());
                scope.loadTravelCoordinators();

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