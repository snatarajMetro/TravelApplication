var userName = '';

$(document).ready(function () {

    $("#txtEmail").focus();

    //load estimated expense section
    var scope = angular.element('#estimatedexpensetemplate').scope();
    scope.loadEstimatedExpense();

    //load fis section
    scope = angular.element('#datatemplate').scope();
    scope.loadFIS();
    scope.loadCostCenters();

});

function closeinvaliduser() {
    $("#invaliduser").hide();
    $("#txtEmail").focus();
}

function closeinvalidrole() {
    $("#invalidrole").hide();
    $("#roles").focus();
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
                $("#invaliduser").fadeOut(5000);

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
        $("#invalidrole").fadeOut(5000);
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
        });
}

function setUserName() {

    var badgeNumber = $('#txtBadgeNumber').val();

    $.ajax({
        type: "POST",
        url: "/api/travelrequest/BadgeInfo",
        data: JSON.stringify({ "UserName": user, "Password": password }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            var result = JSON.parse(data);
            $('#txtName').val(result);
            $("#userName").text(result.UserName);
        },
        error: function (xhr, options, error) {
            if (xhr.status == 401) {

                $("#invaliduser").fadeIn("slow");
                // fade out in 5 seconds
                $("#invaliduser").fadeOut(5000);

                $("#txtEmail").attr("class", "datainputerror");
                $("#txtPassword").attr("class", "datainputerror");
                $("#txtEmail").focus();
            }
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

    //show estimated expense section
    $('#travelrequesttemplate').hide();
    $('#estimatedexpensetemplate').show();
    $("#txtAdvLodge").focus();

    //$.ajax({
    //    type: "POST",
    //    url: "/api/travelrequest/save",
    //    contentType: "application/json; charset=utf-8",
    //    data: JSON.stringify({
    //        'BadgeNumber': badgeNumber,
    //        'Name': name,
    //        'Division': division,
    //        'Section': section,
    //        'organization': organization,
    //        'MeetingLocation': meetingLocation,
    //        'MeetingBeginDateTime': meetingBeginDate,
    //        'DepartureDateTime': departureDate,
    //        'MeetingEndDateTime': meetingEndDate,
    //        'ReturnDateTime': returnDate,
    //        'UserId': userId
    //    }),
    //    dataType: "json",
    //    success: function (result) {
    //        if (result.valid != 0) {
}

function showtravelrequestformsection() {

    $("#estimatedexpensetemplate").hide();
    $("#datatemplate").hide();
    $("#travelrequesttemplate").show();
    $("#txtBadgeNumber").focus();
}

function saveestimatedexpense() {

    // save estimated data expense section

    //show fis section
    $('#travelrequesttemplate').hide();
    $('#estimatedexpensetemplate').hide();
    $('#datatemplate').show();
    $("#ddlCostCenter1").focus();
}

function showestimatedexpensesection() {

    $("#datatemplate").hide();
    $("#estimatedexpensetemplate").show();
}