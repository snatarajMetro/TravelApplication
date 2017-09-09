/*!
 * Common mudule for CRUD operationw with Web API
 * This JavaScript module works for only basic CRUD operation.
 * If you want to create more complicated and customized operation with your Web API,
 * you need to copy this file and create a new JavaScript.
 *
 * This is how to use this file. Make sure that you need to provide a JavaScript block after this file.
 * Example:
 * 
 * <script type="text/javascript" language="javascript" src="/Scripts/lib/metrocrud.module.js"></script>
 * <script type="text/javascript">
 * \/**
 *  * Returns selected items ID, which is primariy key of table, in array
 *  * return {String} rowId
 *  *\/
 * function getIdSelections() {
 *     return $.map($table.bootstrapTable('getSelections'), function (row) {
 *         return row.<%= SourceTable.PrimaryKey.MemberColumns[0].Name %>
 *         });
 * }
 *
 * @Author: Sangjun Oh (ohs@metro.net)
 * @Date: 07/03/2017
 * 
 */
var $table = $('#metrotable').bootstrapTable({  // target <table> must have ID named 'metrotable'
    queryParams: function (params) {
        params.filter = getSearchJSONFilterString();
        return params;
    }
});
var $btnNew = $('#btnNew');
var $btnEdit = $('#btnEdit');
var $btnRemove = $('#btnRemove');
var selections = [];

var $modalForm = $('#modalForm').modal({ show: false });
var $modalEdit = $('#modalEdit').modal({ show: false });
var $modalRemove = $('#modalRemove').modal({ show: false });
var $modalAlert = $('#modalAlert').modal({ show: false });

$(document).ready(function () {
    $('#toolbar').find('select').change(function () {
        $table.bootstrapTable('destroy').bootstrapTable({
            exportDataType: $(this).val()
        });
    });

    //////////////////////////////////////////////////////
    // To save a new data
    $btnNew.click(function () {
        $('#addModalForm')[0].reset();
        showModalForm($(this).text());
    });

    //////////////////////////////////////////////////////
    // To update a existing data
    $btnEdit.click(function () {
        if (selections.length == 0 || selections.length > 1) {
            setAlertHeaderBG('error');
            showAlertModal('Warnig', 'Please select only one item in order to update.');
        } else {
            showModalEdit($(this).text())
        }
    });

    //////////////////////////////////////////////////////
    // To delete item(s)
    $btnRemove.click(function () {
        if (selections.length > 0) {
            $modalRemove.modal('show');
        }
    });

    // To remove item
    $modalRemove.find('.delete').click(function (event) {
        event.preventDefault();

        var ids = getIdSelections();
        var idsList = '';
        for (var i = 0; i < ids.length; i++) {
            idsList += (i == 0) ? ids[i] : ',' + ids[i];
        }

        $.ajax({
            url: $table.attr('data-url') + '/delete/' + idsList,
            async: false,
            type: 'DELETE',
            contentType: 'application/json'
        }).done(function (data) {
            $modalRemove.modal('hide');
            $table.bootstrapTable('refresh');
            setAlertHeaderBG('success');
            showAlertModal('table', 'Item successfully removed');
        }).fail(function (jqXHR, textStatus, errorThrown) {
            setAlertHeaderBG('error');
            showAlertModal('Error', 'System is having an issue to process your request. Please contact system administrator.');
        })
    });

    $modalRemove.find('.delete-cancel').click(function (event) {
        event.preventDefault();
        $table.bootstrapTable('uncheckAll');
    });
    // End of deleting item(s)
    //////////////////////////////////////////////////////

    // check boxes checked
    $table.on('check.bs.table uncheck.bs.table ' +
                'check-all.bs.table uncheck-all.bs.table', function () {
                    $btnEdit.prop('disabled', !$table.bootstrapTable('getSelections').length);
                    $btnRemove.prop('disabled', !$table.bootstrapTable('getSelections').length);

                    // save your data, here just save the current page
                    selections = getIdSelections();
                });

    // To refresh table data when alert modal is closed.
    $modalAlert.find('.alert-ok').click(function () {
        $table.bootstrapTable('uncheckAll');
        $table.bootstrapTable('refresh');
    });

    // To initialize datepicker
    $('.input-group.date').datepicker({
        clearBtn: true,
        multidate: false,
        autoclose: true,
        todayHighlight: true
    });
});

/**
 * To show New modal div
 * param {String} title - text string for header title
 */
function showModalForm(title) {
    $modalForm.find('.modal-title').text(title);
    $modalForm.modal('show');
}

/**
 * To save a new form data
 * param event - event hanlder
 */
function saveNewData(event) {
    event.preventDefault(); // to prevent "submit" action

    var jsonDataSave = {}
    $("input[save-field='true']").each(function (i) {  // add Input elements fields to the json object to be saved
        eval("jsonDataSave." + $(this).attr('name').match("(.*)")[1] + "= '" + this.value + "'")
    });
    $("textarea[save-field='true']").each(function (i) {  // add Textarea elements fields to the json object to be saved
        eval("jsonDataSave." + $(this).attr('name').match("(.*)")[1] + "= '" + this.value + "'")
    });
    $("select[save-field='true']").each(function (i) {  // add Select elements fields to the json object to be saved
        eval("jsonDataSave." + $(this).attr('name').match("(.*)")[1] + "= '" + this.value + "'")
    });

    $.ajax({
        url: $table.attr('data-url'),
        async: false,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(jsonDataSave),
    }).done(function (data) {
        $modalForm.modal('hide');
        $('.has-success').removeClass('has-success');   // remove 'has-success' class after success

        $table.bootstrapTable('refresh');
        setAlertHeaderBG('success');
        showAlertModal('<i class="glyphicon glyphicon-check"></i> Add', 'Item successfully created.');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        //showAlertModal('Error', $.parseJSON(jqXHR.responseText).ExceptionMessage);
        setAlertHeaderBG('error');
        showAlertModal('Error', 'System is having an issue to process your request. Please contact system administrator.');
    });
}

/**
 * To show Edit modal div
 * param {String} title - text string for header title
 */
function showModalEdit(title) {
    var selectedId = getIdSelections()[0];
    $.ajax({
        url: $table.attr("data-url") + '/' + selectedId,
        async: false,
        type: 'GET',
        contentType: 'application/json'
    }).done(function (editData) {
        $("input[edit-field='true']").each(function (i) {
            var dateId = $(this).attr('id');
            if (dateId.indexOf("DATE") >= 0) {
                this.value = getValidDate(eval("editData." + $(this).attr('name').match("(.*)")[1]));
                $("#" + dateId).datepicker('update');
            } else {
                eval("this.value = editData." + $(this).attr('name').match("(.*)")[1]);
            }
        });
        // fill in Textarea elements
        $("textarea[edit-field='true']").each(function (i) {
            if (eval("editData." + $(this).attr('id')) !== undefined) {
                eval("this.value = editData." + $(this).attr('id').match("(.*)")[1]);
            }
        });
        // fill in Select elements
        $("select[edit-field='true']").each(function (i) {
            if (eval("editData." + $(this).attr('id')) !== undefined) {
                eval("this.value = editData." + $(this).attr('id').match("(.*)")[1]);
            }
        });

        $modalEdit.find('.modal-title').text(title);
        $modalEdit.modal('show');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        setAlertHeaderBG('error');
        showAlertModal('Error', 'System is having an issue to process your request. Please contact system administrator.');
    });
}

/**
 * To update form data
 * param event - event hanlder
 */
function updateData(event) {
    event.preventDefault();

    var selectedId = getIdSelections()[0];
    var jsonDataSave = {}
    $("input[edit-field='true']").each(function (i) {  // add Input elements fields to the json object to be updated
        eval("jsonDataSave." + $(this).attr('name').match("(.*)")[1] + "= '" + this.value + "'")
    });
    $("textarea[edit-field='true']").each(function (i) {  // add Textarea elements fields to the json object to be updated
        eval("jsonDataSave." + $(this).attr('name').match("(.*)")[1] + "= '" + this.value + "'")
    });
    $("select[edit-field='true']").each(function (i) {  // add Select elements fields to the json object to be updated
        eval("jsonDataSave." + $(this).attr('name').match("(.*)")[1] + "= '" + this.value + "'")
    });

    $.ajax({
        url: $table.attr('data-url') + '/' + selectedId,
        async: false,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(jsonDataSave),
    }).done(function (data) {
        $modalEdit.modal('hide');
        $('.has-success').removeClass('has-success');   // remove 'has-success' class after success

        $table.bootstrapTable('refresh');
        setAlertHeaderBG('success');
        showAlertModal('<i class="glyphicon glyphicon-check"></i> Edit', 'Selected item is successfully updated.');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        setAlertHeaderBG('error');
        showAlertModal('Error', 'System is having an issue to process your request. Please contact system administrator.');
    });
}

/**
 * To set background color for header of alert modal
 * param {String} arg - alert type text
 */
function setAlertHeaderBG(arg) {
    $modalAlert.find('.modal-header').removeClass(function (index, className) {
        return (className.match(/(^|\s)bg-\S+/g) || []).join(' ');
    });
    switch (arg) {
        case 'error':
            $modalAlert.find('.modal-header').addClass('bg-danger');
            break;
        default:
            $modalAlert.find('.modal-header').addClass('bg-primary');
    }
}

/**
 * To show alert modal
 * param {String} title - HTML string for header title
 * param {String} message - text message to be displayed
 */
function showAlertModal(title, message) {
    $modalAlert.find('.modal-title').html(title);
    $modalAlert.find('.modal-body').text(message);
    $modalAlert.modal('show');
}

// get a Valid date, if dateValue is not valid then returns empty
function getValidDate(dateValue) {
    if (dateValue != "0001-01-01T00:00:00") {
        return moment(dateValue).format("MM/DD/YYYY");
    } else {
        return "";
    }
}

// format Date columns in the table
function dateFormatter(value) {
    return getValidDate(value);
}



/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
////////             Search Box related functions               /////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

var $btnSearch = $('#btnSearch');
var $btnSearchClear = $('#btnSearchClear');

$(document).ready(function () {

    ////////////////////////////////
    // Search  box
    $('#btnAdvSearch').click(toggleSearchBox);

    $btnSearch.click(function (event) {
        event.preventDefault();
        var jsonFilter = getSearchJSONFilterString();

        // obtain the current table options (order, paging, etc) to be re-sent to the controller together with the search/filter fields
        var options = $table.bootstrapTable('getOptions');
        var sendData = {
            offset: (options.pageNumber - 1) * options.pageSize,
            limit: options.pageSize,
            sort: options.sortName,
            order: options.sortOrder,
            search: options.searchText,  // global search by bootstrap table (it's currently disabled)
            filter: jsonFilter  // search filters by customer search box
        };

        $.ajax({
            url: $table.attr('data-url'),
            async: false,
            type: 'GET',
            data: sendData,
            contentType: 'application/json'
        }).done(function (data) {
            $table.bootstrapTable('load', data);
            toggleSearchBox();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            setAlertHeaderBG('error');
            showAlertModal('Error', 'System is having an issue to process your request. Please contact system administrator.');
        })
    });
    // end of Search Box
    ////////////////////////////////////

    ////////////////////////////////////
    // to clear search values and refresh table again.
    $btnSearchClear.click(function () {
        $('#searchForm')[0].reset();
        toggleSearchBox();
        $table.bootstrapTable('refresh', {
            pageNumber: 1
        });
    });
});


/**
 * To toggle custom search box
 */
function toggleSearchBox() {
    $('#filter-panel').toggle(200);
}

/**
 * To get custom search string in JSON format
 */
function getSearchJSONFilterString() {

    var jsonFilter = '';
    $('*[data-lacmta-searchable="true"]').each(function (i) {
        if ($(this).attr('data-lacmta-search-isrange') == 'true') {  // searches by range (date/numbers)
            if ($('#' + $(this).attr('id') + '_FROM').val() != '' || $('#' + $(this).attr('id') + '_TO').val() != '') {
                if (jsonFilter != "") {
                    jsonFilter += ", ";
                }
                switch ($(this).attr('data-lacmta-searchtype')) {
                    case 'date':
                        jsonFilter += $(this).attr('id').match('S_(.*)')[1] + ": {TYPE: 'date', FROM: '" + $('#' + $(this).attr('id') + '_FROM').val() + "', TO: '" + $('#' + $(this).attr('id') + '_TO').val() + "'}";
                        break;
                    case 'number':
                        jsonFilter += $(this).attr('id').match('S_(.*)')[1] + ": {TYPE: 'number', FROM: '" + $('#' + $(this).attr('id') + '_FROM').val() + "', TO: '" + $('#' + $(this).attr('id') + '_TO').val() + "'}";
                        break;
                }
            }
        } else {  //searches by value
            if (!(this.value.trim() == "")) {
                if (jsonFilter != "") {
                    jsonFilter += ", ";
                }
                switch ($(this).attr('data-lacmta-searchtype')) {
                    case 'date':
                        jsonFilter += $(this).attr('id').match("S_(.*)")[1] + ": {TYPE: 'date', FROM: '" + this.value + "', TO: '" + this.value + "'}";
                        break;
                    case 'number':
                        jsonFilter += $(this).attr('id').match("S_(.*)")[1] + ": {TYPE: 'number', FROM: '" + this.value + "', TO: '" + this.value + "'}";
                        break;
                    case 'string':
                        if ($(this).attr('multiple') === 'multiple') {
                            jsonFilter += $(this).attr('id').match("S_(.*)")[1] + ": '~~" + $(this).attr('data-lacmta-search-range-value') + "'";
                        } else {
                            jsonFilter += $(this).attr('id').match("S_(.*)")[1] + ": '" + this.value + "'";
                        }
                        break;
                }
            }
        }
    });  // Loops through all the search fields
    if (jsonFilter != "") {
        jsonFilter = "{" + jsonFilter + "}";
    }

    return jsonFilter;
}
