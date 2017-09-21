var userName = '';
var fadeOutTimeInMilliseconds = 5000; // 5 seconds

$(document).ready(function () {

    $("#txtEmail").focus();

    //load estimated expense section
    var scope = angular.element('#estimatedexpensetemplate').scope();
    scope.loadEstimatedExpense();

    //load fis section
    scope = angular.element('#datatemplate').scope();
    scope.loadFIS();
    scope.loadCostCenters();
    scope.loadFileUpload();
    scope.loadSubmit();
});

function closeinvaliduser() {
    $("#invaliduser").hide();
    $("#txtEmail").focus();
}

function closeinvalidrole() {
    $("#invalidrole").hide();
    $("#roles").focus();
}

function closetravelrequesterror() {
    $("#travelrequesterror").hide();
    $("#badgeNumber").focus();
}

function closeestimatedexpenseerror() {
    $("#estimatedexpenseerror").hide();
    $("#txtAdvLodge").focus();
}
function closefiserror() {
    $("#fiserror").hide();
    $("#ddlCostCenter1").focus();
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
        data: JSON.stringify({ "UserName":user, "Password":password }),
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
                    //options.append($("<option />").val(0));
                    options.append($("<option />").val(0).text('Please select the role'));

                    for (var index = 0; index < result.Roles.length; index++) {

                        options.append($("<option />").val(result.Roles[index].Id).text(result.Roles[index].Name));
                        //if (result.Roles[index].Name == "Traveler") {
                        //    options.append($("<option selected />").val(result.Roles[index].Id).text(result.Roles[index].Name));
                        //}
                        //else {
                        //    options.append($("<option />").val(result.Roles[index].Id).text(result.Roles[index].Name));
                        //}
                    }

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
        $("#action").show();

        // set user name
        $("#userName2").text(userName);

        // set role
        $("#roleName").text(userRole);
    }
}

function backtoroleselection() {
    $("#signin").hide();
    $("#action").hide();
    $('#signintemplate').show();
}

function backtoactionselection()
{
    $("#travelrequesttemplate").hide();
    $("#estimatedexpensetemplate").hide();
    $("#datatemplate").hide();
    $("#action").show();
}

function logout()
{
    $("#action").hide();
    $("#action").hide();
    $("#invaliduser").hide();
    $("#logout").hide();
    $("#travelrequesttemplate").hide();
    $("#estimatedexpensetemplate").hide();
    $("#datatemplate").hide();
    $("#fileuploadtemplate").hide();
    $("#submittemplate").hide();
    $('#signintemplate').hide();
    $("#signin").show();

    $("#txtEmail").focus();
}

function createnewrequest() {
    $("#action").hide();

    //reset estimated expense section
    var scope = angular.element('#estimatedexpensetemplate').scope();
    scope.loadEstimatedExpense();

    //reset travel request form section
    $.get('/uitemplates/travelrequestform.html')
        .done(function (data) {
            $('#travelrequesttemplate').html($(data).html());
            $('#travelrequesttemplate').show();
            $("#txtBadgeNumber").focus();

            // reset travelRequestId
            $('#travelRequestId').text('0');
            $('#badgeNumber').text('0');
        });
}

function setUserName() {

    var badgeNumber = $('#txtBadgeNumber').val();

    $.ajax({
        type: "GET",
        url: "/api/travelrequest/employee/" + badgeNumber,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var result = JSON.parse(data);

            $('#txtName').val(result.Result.EmployeeFirstName + ' ' + result.Result.EmployeeLastName);
            $('#txtOrganization').val(result.Result.Department);
        },
        error: function (xhr, options, error) {
        }
    });

}

function savedataentry()
{
    // Get user inputs
    var badgeNumber         = $('#txtBadgeNumber').val();
    var name                = $('#txtName').val();
    var division            = $('#txtDivision').val();
    var section             = $('#txtSection').val();
    var organization        = $('#txtOrganization').val();
    var meetingLocation     = $('#txtMeetingLocation').val();
    var meetingBeginDate    = $('#txtMeetingBeginDate').val();
    var meetingEndDate      = $('#txtMeetingEndDate').val();
    var departureDate       = $('#txtDepartureDate').val();
    var returnDate          = $('#txtReturnDate').val();
    var userId              = "";
    var travelRequestId     = $('#travelRequestId').text();



    $.ajax({
        type: "POST",
        url: "/api/travelrequest/save",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            'TravelRequestId':travelRequestId,
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
            'UserId': userId
        }),
        success: function (data) {
            var result = JSON.parse(data);
            $('#travelRequestId').text(result);
            $('#badgeNumber').text(badgeNumber);

            //show estimated expense section
            $('#travelrequesttemplate').hide();
            $('#estimatedexpensetemplate').show();
            $("#txtAdvLodge").focus();
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

function showtravelrequestformsection() {

    $("#estimatedexpensetemplate").hide();
    $("#datatemplate").hide();
    $("#travelrequesttemplate").show();
    $("#txtBadgeNumber").focus();
}

function saveestimatedexpense() {

    // save estimated data expense section
    var travelRequestId = $('#travelRequestId').text();
    var advLodge = $('#txtAdvLodge').val();
    var advAirfare = $('#txtAdvAirfare').val();
    var advRegistration = $('#txtAdvRegistration').val();
    var advMeals = $('#txtAdvMeals').val();
    var advCarRental = $('#txtAdvCarRental').val();
    var advMiscellaneous = $('#txtAdvMiscellaneous').val();
    var expenseItemTotal = $('#txtExpenseItemTotal').val();
    var totalEstimatedLodge = $('#txtTotalEstimatedLodge').val();
    var totalEstimatedAirfare = $('#txtTotalEstimatedAirfare').val();
    var totalEstimatedRegistration = $('#txtTotalEstimatedRegistration').val();
    var totalEstimatedMeals = $('#txtTotalEstimatedMeals').val();
    var totalEstimatedCarRental = $('#txtTotalEstimatedCarRental').val();
    var totalEstimatedMiscellaneous = $('#txtTotalEstimatedMiscellaneous').val();
    var totalEstimatedTotal = $('#txtTotalEstimatedTotal').val();
    var hotelNameAndAddress = $('#txtHotelNameAndAddress').val();
    var payableTo = $('#txtPayableTo').val();
    var schedule = $('#txtSchedule').val();
    var agencyName = $('#txtAgencyName').val();
    var shuttle = $('#txtShuttle').val();
    var cashAdvance = $('#txtCashAdvance').val();
    var dateNeededBy = $('#dtDateNeededBy').val();
    var noteAnyMeals = $('#txtNoteAnyMeals').val();

 
    $.ajax({
    type: "POST",
    url: "/api/estimatedexpense/save",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
        'TravelRequestId':travelRequestId,
        'AdvanceLodging': advLodge,
        'AdvanceAirFare': advAirfare,
        'AdvanceRegistration': advRegistration,
        'AdvanceMeals': advMeals,
        'AdvanceCarRental': advCarRental,
        'AdvanceMiscellaneous': advMiscellaneous,
        'AdvanceTotal': expenseItemTotal,
        'TotalEstimatedLodge': totalEstimatedLodge,
        'TotalEstimatedAirfare': totalEstimatedAirfare,
        'TotalEstimatedRegistration': totalEstimatedRegistration,
        'TotalEstimatedMeals': totalEstimatedMeals,
        'TotalEstimatedCarRental': totalEstimatedCarRental,
        'TotalEstimatedMiscellaneous': totalEstimatedMiscellaneous,
        'TotalEstimatedTotal': totalEstimatedTotal,
        'HotelNameAndAddress': hotelNameAndAddress,
        'PayableToAndAddress': payableTo,
        'Schedule': schedule,
        'AgencyNameAndReservation': agencyName,
        'Shuttle': shuttle,
        'CashAdvance': cashAdvance,
        'DateNeededBy': dateNeededBy,
        'Note' : noteAnyMeals

        }),
        success: function (data) {
            var result = JSON.parse(data);
            $('#travelRequestId').text(result);

            //show fis section
            $('#travelrequesttemplate').hide();
            $('#estimatedexpensetemplate').hide();
            $('#datatemplate').show();
            $("#ddlCostCenter1").focus();
        },
        error: function (xhr, options, error) {
      
            if (xhr.status == 500) {
                var errorMessage = xhr.responseText;

                $("#estimatedexpenseerror").fadeIn("slow");
                $('#estimatedexpenseerrormessage').text(errorMessage);

                // fade out in 5 seconds
                $("#estimatedexpenseerror").fadeOut(fadeOutTimeInMilliseconds);
            }
        }
    });
}

function showestimatedexpensesection() {

    $("#datatemplate").hide();
    $("#estimatedexpensetemplate").show();
}

function savefis() {

    // save fis data
    $.ajax({
        type: "POST",
        url: "/api/fis/save",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            //'TravelRequestId': travelRequestId,
            //'AdvanceLodging': advLodge,
            //'AdvanceAirFare': advAirfare,
            //'AdvanceRegistration': advRegistration,
            //'AdvanceMeals': advMeals,
            //'AdvanceCarRental': advCarRental,
            //'AdvanceMiscellaneous': advMiscellaneous,
            //'AdvanceTotal': expenseItemTotal,
            //'TotalEstimatedLodge': totalEstimatedLodge,
            //'TotalEstimatedAirfare': totalEstimatedAirfare,
            //'TotalEstimatedRegistration': totalEstimatedRegistration,
            //'TotalEstimatedMeals': totalEstimatedMeals,
            //'TotalEstimatedCarRental': totalEstimatedCarRental,
            //'TotalEstimatedMiscellaneous': totalEstimatedMiscellaneous,
            //'TotalEstimatedTotal': totalEstimatedTotal,
            //'HotelNameAndAddress': hotelNameAndAddress,
            //'PayableToAndAddress': payableTo,
            //'Schedule': schedule,
            //'AgencyNameAndReservation': agencyName,
            //'Shuttle': shuttle,
            //'CashAdvance': cashAdvance,
            //'DateNeededBy': dateNeededBy,
            //'Note': noteAnyMeals
        }),
        success: function (data) {

            // show file upload section
            $("#datatemplate").hide();
            $("#fileuploadtemplate").show();

            var travelRequestId = $('#travelRequestId').text();
            var scope = angular.element('#fileuploadtemplate').scope();
            scope.loadSupportingDocuments(travelRequestId);
        },
        error: function (xhr, options, error) {

            if (xhr.status == 500) {
            var errorMessage = xhr.responseText;

                $("#fiserror").fadeIn("slow");
                $('#fiserrormessage').text(errorMessage);

                // fade out in 5 seconds
                $("#fiserror").fadeOut(fadeOutTimeInMilliseconds);
            }
        }
    });

    // TODO: Remove these lines of code after save API is implemented
    $("#datatemplate").hide();
    $("#fileuploadtemplate").show();

    var travelRequestId = $('#travelRequestId').text();
    var scope = angular.element('#fileuploadtemplate').scope();
    scope.loadSupportingDocuments(travelRequestId);
}

function showfissection() {
    $("#fileuploadtemplate").hide();
    $("#datatemplate").show();
}

function downloaddocument(obj) {
    var documentId = obj.alt;
    //TODO: Call the download document API
 
}

function deletedocument(obj) {
    var documentId = obj.alt;
    //TODO: Call the delete document API
 
}

function showsubmitsection()
{
    // hide upload section
    $("#fileuploadtemplate").hide();

    // show submit section
    var scope = angular.element('#submittemplate').scope();
    scope.loadSubmit();
    $("#submittemplate").show();
}

function showuploadsection()
{
    // hide submit section
    $("#submittemplate").hide();

    // show upload section
    var travelRequestId = $('#travelRequestId').text();
    var scope = angular.element('#fileuploadtemplate').scope();
    scope.loadSupportingDocuments(travelRequestId);
    $('#fileuploadtemplate').show();
}

function submitRequest() {


}