var userName = '';

$(document).ready(function () {
    $("#txtEmail").focus();
});

function closeerror() {
    $("#invaliduser").hide();
    $("#txtEmail").focus();
}

function signIn() {

    // Make api call to authenticate the user
    var user = $("#txtEmail").val();
    var password = $("#txtPassword").val();

    $.ajax({
        type: "POST",
        url: "/api/login",
        data: JSON.stringify({ "UserName":user, "Password":password }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
                    
            var result = JSON.parse(data);

            // set the roles dropdown
            var options = $("#roles");

            options.empty();
            //options.append($("<option />").val(0));
            options.append($("<option />").val(0).text('Please select your role'));

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

            //show role section
            $("#signin").hide();
            $("#action").hide();
            $("#role").show();
            $("#logout").show();
        },
        error: function (xhr, options, error) {
            if (xhr.status == 401) {

                $("#invaliduser").fadeIn("slow");
                $("#invaliduser").fadeOut(6000);

                $("#txtEmail").attr("class", "datainputerror");
                $("#txtPassword").attr("class", "datainputerror");
                $("#txtEmail").focus();
            }
        }
    });
}

function backtosignin() {
    $("#logout").hide();
    $("#role").hide();
    $("#action").hide();
    $("#invaliduser").hide();
    $("#dataentry").hide();
    $("#signin").show();
}

function actionselection() {

    var userRole = $("#roles option:selected").text();

    $("#action").show();
    $("#role").hide();
    $("#signin").hide();

    // set user name
    $("#userName2").text(userName);

    // set role
    $("#roleName").text(userRole);
}

function backtoroleselection() {
    $("#signin").hide();
    $("#action").hide();
    $("#role").show();
}

function backtoactionselection()
{
    $("#datatemplate").hide();
    $("#action").show();
}

function logout()
{
    $("#action").hide();
    $("#role").hide();
    $("#action").hide();
    $("#invaliduser").hide();
    $("#logout").hide();
    $("#datatemplate").hide();
    $("#signin").show();

    $("#txtEmail").focus();
}

function createnewrequest() {
    $("#action").hide();

    //show travel request form section
    $.get('/uitemplates/travelrequestform.html')
        .done(function (data) {
            $('#datatemplate').html($(data).html());
            $('#datatemplate').show();
            $("#txtBadgeNumber").focus();
        });
}

function setUserName() {

    var badgeNumber = $('#txtBadgeNumber').val();

    if (badgeNumber) {
        // make api call to get user info
        // and set other fields
        var result = "Metro";

        $('#txtName').val(result);
    }
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
    $.get('/uitemplates/estimatedexpense.html')
        .done(function (data) {
            $('#datatemplate').html($(data).html());
            $('#datatemplate').show();

            $("#txtAdvLodge").focus();
        });

    //$.ajax({
    //    type: "POST",
    //    url: "/login/savetravelrequest",
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

    //            // Show next section
    //            // window.location.href = "/Login/EstimatedExpense/" + result.valid + "";
    //        }
    //        else {
    //            // Show error message
    //        }
    //    }
    //});
}

function showtravelrequestformsection() {

    //show travel request form section
    $.get('/uitemplates/travelrequestform.html')
        .done(function (data) {
            $('#datatemplate').html($(data).html());
            $('#datatemplate').show();
            $("#txtBadgeNumber").focus();
        });
}

function updateTotal(expense) {

    //if (!isNan(expense)) {
    //    total = $("#txtAdvTotal").val();

    //    if (!isNan(total)) {
    //        $("#txtAdvTotal").val(parseFloat(total) + parseFloat(expense));
    //    }
    //    else {
    //        $("#txtAdvTotal").val(parseFloat(expense));
    //    }
    //}
}

//$.get('/uitemplates/estimatedexpense.html')
//    .done(function (data) {
//        $('#datatemplate').html($(data).html());
//        $('#datatemplate').show();

//        $("#txtAdvLodge").focus();
//    });
    