var userName = '';
var fadeOutTimeInMilliseconds = 5000; // 5 seconds
var selectedRoleId = 0;

$(document).ready(function () {

    $("#txtEmail").focus();

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