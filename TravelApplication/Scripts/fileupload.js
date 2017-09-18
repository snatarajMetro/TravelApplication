function empty(v) {
    var type = typeof v;
    if (type === 'undefined')
        return true;
    if (type === 'boolean')
        if (v === false)
            return true;
    if (v === null)
        return true;
    if (v == undefined)
        return true;
    if (type === 'array') {
        if (v.length < 1)
            return true;
    }
    else if (type === 'string') {
        if (v.length < 1)
            return true;
        else if (parseInt(v) === 0)
            return true;
    }
    else if (type === 'object') {
        if (Object.keys(v).length < 1)
            return true;
    }
    else if (type === 'number') {
        if (v === 0)
            return true;
    }
    return false;
}


String.prototype.format = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

function GetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}

function get_cookie(cookie_name) {
    var cookie_string = document.cookie;
    if (cookie_string.length != 0) {
        var cookie_value = cookie_string.match('(^|;)[\s]*' + cookie_name + '=([^;]*)');
        return decodeURIComponent(cookie_value[2]);
    }
    return '';
}

var fileData = function () {
    this.uploaded_filename = '';
    this.respository_filename = '';
    this.description = '';

}

function downloadFile(repositoryName) {

    window.location.href = DownloadFrom + repositoryName;
}

function downloadAll() {
    var parentID = GetParameterValues("parentID");
    window.location.href = "../fileUploads/fileUpload_data.aspx?action=downloadall&repo=none&parentID=" + parentID;
}

var description = "";
var listContainer = $("#fileList");
var accept = "";
var allowedmaxFileSize = "0";
var parameters = GetParameterValues("case_no");
var DownloadFrom = "../fileUploads/uploadedFiles/"

// see if security has been set previously or set by a passed parameter


if (typeof allowDelete == "undefined") {
    var allowDelete = 'false';
    var role = GetParameterValues("role");
    if (role != 'ADMIN' && role != 'USER') {
        allowDelete = 'false';
    }
    else {
        allowDelete = 'true'
    }

}


function ShowModal() {
    var filedesc = document.getElementById("hdnDesc");

    var sharedObject = {};
    sharedObject.filedesc = "";//filedesc.value;
    var result = "";

    if (window.showModalDialog) {
        var retValue = showModalDialog("../fileUploads/filePostDescription.html", sharedObject, "dialogWidth:600px; dialogHeight:500px; dialogLeft:600px; dialogTop:350px;");
        if (retValue) {
            $("hdnDesc").val(retValue.filedesc);

            result = retValue.filedesc
        }
    }
    else {
        // we want similar functionality in Opera, but it's not modal!
        var modal = window.open("../fileUploads/filePostDescription.html", null, "width=500,height=200,left=300,modal=yes,alwaysRaised=yes", null);
        modal.dialogArguments = sharedObject;
    }
    return result;
}
// Dialog Box End
// WCF Rest Service call
function getUploadedFiles(parentID,allowDelete) {
   
    //Call Rest WCF Service to get previously uploaded files
   
    $.ajax({
        async: false,
        type: "GET",
        url: "../fileUploads/fileUpload_data.aspx",
        dataType: "json",
        data: { "action": "GetUploadedFilesbyParentID", parentID: parentID },
        processdata: true,
        success: function (data) {
            var fileList = eval(data);
            listContainer.empty();
            allowDelete = getDropZoneRights();
            $(fileList).each(function () {
                var uploadFileID = this.UploadFileID;
                var uploaded_filename = this.FileName;
                var repository_filename = this.RepositoryName;
                var description = this.Filedescription;
                var downloadPath = DownloadFrom + repository_filename;
              
                
                var liObject = '<li class="list-group-item"><input type="hidden" value="{0}" />' +
                    '<span class="label label-default pull-right"><a href=../fileUploads/fileUpload_data.aspx?action=download&filename={1}&repo={0} target="_blank"><i class="fa fa-download btn" title="Download file" /></a>' +
                    '&nbsp;<a target="_blank" href="{2}"><i class="btn fa fa-eye" title="View" /></a>';
                if (allowDelete != false)
                    liObject += '&nbsp;<i class="btn fa fa-minus" title="Remove File" />';
                liObject += '</span><span title="{3}">{1}</span>';
                liObject += '</li>';

                liObject = liObject.format(repository_filename, uploaded_filename, downloadPath, description, uploaded_filename);
                listContainer.append(liObject);


            });

        },
        error: function (xhr) {
            if (xhr.status != 200) {
                alert("Service Error while getting Previously Uploaded Files.");
            }


        }
    });
}

function getFileAttributes() {

    //Call Rest WCF Service to get allowed FileSize and FileType
    $.ajax({
        type: "GET",
        url: "../fileUploads/fileUpload_data.aspx",
        data: { "action": "getFileAttributes" },
        dataType: "xml",
        processdata: true,
        success: function (xml) {
            $(xml).find('GetFileAttributes').each(function () {
                accept = $(this).find('FileType').text();
                allowedmaxFileSize = $(this).find('FileSize').text();
            });
        },
        error: function (xhr) {
            alert("Service Error while getting FileSize & FileType");
        }
    });
}
var getDropZoneRights = function () {
    var case_no = GetParameterValues("case_no")
    var form_name = GetParameterValues("form_name")
    var allowDelete = false;
    $.ajax({
        url: "../fileUploads/fileUpload_data.aspx",
        async:false,
        datatype: "json",
        data: { action: "getDropZoneRights", case_no: case_no, form_name: form_name },
        success: function (data) {
           
            var rights = eval("[" + data + "]")[0];
           
            if (rights.canAdd != "true") {
                $('#dZUpload').hide();
            }
           
            if (rights.canDelete == "true") {
                allowDelete = "true";
            }
             
        },
        error: function (data) {
            alert("Error In DropZoneRights Function - fileUpload.js line 201")
        }
      
    });
    return allowDelete;
}

$(document).ready(function () {
   

    //var params = {}; window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) { params[key] = value; });
    listContainer = $("#fileList");

    $("#linkTransitSafeDocs").on("click", function () {
        waitingDialog.show('Custom message');


        var url = "../classes/gts_grievance_detail_data.ashx"
        var action = "importTransitDocs";
        var parentId = GetParameterValues("parentID");
        var case_no = GetParameterValues("case_no");

        data = { "action": action, "parentId": parentId,"case_no":case_no }
        $.ajax({
            async: false,
            data: data,
            url: url,
            type: "POST",
            dataType: "JSON",
            contentType: "application/x-www-form-urlencoded",
            success: function (data) {
                location.reload();
            },
            error: function (data) {
                waitingDialog.hide();
            }
        })
    });
    
    if (!empty(GetParameterValues("parentID"))) {
        parentID = GetParameterValues("parentID");
    }
    else if (!empty(GetParameterValues("case_no"))) {

        $.ajax({
            type: "POST",
            dataType: "JSON",
            async: false,
            data: { action: 'getGrievance_id', 'case_no': GetParameterValues("case_no") },
            url: '../classes/gts_grievance_detail_data.ashx',
            success: function (data) {
                parentID = data;
            },
            error: function (data) {
                alert("fileUpload error:131 " + data)
            }
        });
    } else {
        //        alert("Need to have case No or gts_grievance_id");
        //       return;

        //   parentID = '1283939';
           parentID = '0';

    }







    $('body')
    .on('click', 'i.fa-minus', function () {

        var repoName = $(this).closest('li').find('input[type=hidden]').val();

        if (confirm("Do you want to delete the File?")) {
            window.location.href = "../fileUploads/fileUpload_data.aspx?action=delete&fid=0&repo=" + repoName + "&parentID=" + parentID;
        }
    })

    //if (allowAdd == "false") {
    //    $('#dZUpload').hide();
    //}

    $.ajaxSetup({ cache: false });


    getUploadedFiles(parentID,allowDelete);
    getFileAttributes();
    // Service call End

    $.ajaxSetup({ cache: true });

    Dropzone.autoDiscover = false;
    //Simple Dropzonejs
    $("#dZUpload").dropzone({
        url: "../fileUploads/filePost.aspx?parent_pk=" + parentID + "&description=" + description,
        init: function () {
            this.on("complete", function () {
                alert("Upload completed");
                location.reload();
            });
            this.on("processing", function () {
                var descript = encodeURI(description);
                this.options.url = "../fileUploads/filePost.aspx?parent_pk=" + parentID + "&description=" + descript;
            });
        },
        addRemoveLinks: true,
        acceptedFiles: accept,
        dictDefaultMessage: "Hello",
        maxFiles: 20,

        maxFilesexceeded: function (file) {
            this.removeFile(file);
        },
        accept: function (file, done) {
            //if (file.size < allowedmaxFileSize) {
            description = ShowModal(); //prompt("Please enter a brief description of this file");
            done();
            //} else {

            //    var getMB = allowedmaxFileSize / 1000000;
            //    alert("File size cannot be more than " + getMB + "mb. Please try again.");
            //    this.removeFile(file);
            //}
        },

        success: function (file, response) {
            if (response == 'error') {
                alert("Line 322 -- /n" + response);
            }
            else {
                var fd = new fileData();
                fd = eval("[" + response + "]")[0];
                alert("test");
                var downloadPath = DownloadFrom + fd.repository_filename;
                var sDescription = description.replace(/"/g, "&quot;");
                var buttonHTML = '<li class="list-group-item">' +
                    '<input type="hidden" value="' + fd.repository_filename + '" />' +
                    '<span class="label label-default pull-right"><a href=fileUpload_data.aspx?action=download&filename=' + fd.uploaded_filename + '&repo=' + fd.repository_filename + ' target="_blank"><i class="fa fa-download btn" title="Download file" /></a>&nbsp;' +
                    '<a target="_blank" href="' + downloadPath + '"><i class="btn fa fa-eye" title="View" /></a>&nbsp;';
           
                if (allowDelete == 'true')
                    buttonHTML += '<i class="btn fa fa-minus" title="Remove File" />';
                buttonHTML += '</span>' +
                    '<span title="' + sDescription + '">' + fd.uploaded_filename + '</span></li>';
                listContainer.append()
                this.removeFile(file);

            }
        },
        error: function (file, response) {
            alert("fileUpload.js line:288 " + response);
            if (!file.accepted) {
                this.removeFile(file);
            };
        }
    });

    $('div.dz-message').append('Drop files here or click here to upload a file.');

});
