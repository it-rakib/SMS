$(document).ready(function () {
    TicketSummaryHelper.InitTicketSummary();
});

var TicketSummaryManager = {
    gridDataSource: function (AssigneeUserId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            autoSync: true,
            batch: true,
            pageSize: 10,
            transport: {
                read: {
                    url: "/Ticket/GetAllTicketMData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { AssigneeUserId: AssigneeUserId }

                },
                parameterMap: function (options) {
                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (filter) {
                            if (filter.field === "createDate" || filter.field === "dueDate" ){
                                filter.value = kendo.toString(filter.value, "yyyy-MM-dd HH:mm:ss");
                            }
                            //else if (filter.field === "client") {
                            //    filter.value = "cl.Name"
                            //}
                        });
                    }
                    return options;
                }

            },
            batch: true,
            schema: {
                data: "items",
                total: "totalCount",
                model: {
                    id: "id",
                    fields: {
                        createDate: { type: "date" },
                        dueDate: { type: "date" }
                        
                    }
                }
            }
        });
        return gridDataSource;
    }

}
var TicketSummaryHelper = {
    InitTicketSummary: function () {

        TicketSummaryHelper.GenerateTicketeGrid();
        TicketSummaryHelper.GenerateTicketeStyle();
        TicketSummaryHelper.GenerateKendoComboBox();
        TicketSummaryHelper.GenerateKendoTextBox();
        TicketSummaryHelper.GenerateKendoDatePicker();
        TicketSummaryHelper.GenerateKendoTextArea();
        TicketSummaryHelper.ToogleGenerate();
        TicketSummaryHelper.ClickEvents();

        //Kendo Validator
        $("#UserTktForm").kendoValidator().data("kendoValidator");
        $("#tktInfoOptionForm").kendoValidator().data("kendoValidator");
        
    },
    GenerateTicketeGrid: function () {
        var AssigneeUserId = $("#AssigneeUserId").val();
        $("#kTicketGrid").kendoGrid({
            dataSource: TicketSummaryManager.gridDataSource(AssigneeUserId),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                pageSizes: [10, 20, 50, "all"]
            },
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            scrollable: true,
            filterable: {
                extra: true,
                operators: {
                    string: {
                        startswith: "Starts with",
                        endswith: "Ends with",
                        contains: "Contains",
                        doesnotcontain: "Does not contain",
                        eq: "Is equal to",
                        neq: "Is not equal to",
                        gt: "Is greater then",
                        lt: "Is less then"
                    }
                }
            },
            //detailInit: detailInitProduct,
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,

            toolbar: ["excel", "pdf", "search"],
            excel: {
                fileName: "Ticket Excel.xlsx",
                filterable: true
            },
            search: {
                fields: ["code", "title"]
            },
            columns: [

                {
                    title: "Action",
                    width: 140,
                    template: function (dataItem) {
                        console.log(dataItem);
                        return "<a class='btn btn-primary btn-sm mr-2 edit' title='Modify' href=/Ticket/Edit/" + dataItem.id + ">" + "<i class='fas fa-pencil-alt'></i>" + "</a>" +
                            "<a class='btn btn-success btn-sm mr-2' title='Task List' href='/Task/TaskIndex/" + dataItem.id + "'>" +
                            "<i class='fas fa-th-list'></i>" +
                            "</a>";
                    }
                },


                {
                    field: "id", title: "ID", width: 150, hidden: true, sortable: true
                },
                {
                    field: "code", title: "Code", hidden: true, sortable: true, width: 150
                },
                {
                    field: "title", title: "Title", sortable: true, width: 220
                },
                {
                    field: "description", title: "Description", sortable: true, width: 220
                },
                {
                    field: "client", title: "Client", sortable: true, width: 200
                },
                {
                    field: "stackHolder", title: "Stack Holder", sortable: true, width: 220
                },
                {
                    field: "createdBy", title: "Creator", sortable: true, hidden: true, width: 150
                },
                {
                    field: "product", title: "Product", sortable: true, width: 120
                },
                {
                    field: "createDate", title: "Create Date", sortable: true, width: 200, template: '#= kendo.toString(kendo.parseDate(createDate), "yyyy-MM-dd HH:mm:ss") #', filterable: {
                        ui: "datepicker"
                    }
                },
                {
                    field: "dueDate", title: "Due Date", sortable: true, width: 200, template: '#= kendo.toString(kendo.parseDate(dueDate), "yyyy-MM-dd HH:mm:ss") #', filterable: {
                        ui: "datepicker"
                    }
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });
    },
    GenerateTicketeStyle: function () {
        //Kendo Text-Box
        $(".kTextbox").each(function () {
            $(this).addClass("k-textbox");
            $(this).css("width", "100%");
        });

        //Place-Holder;
        $('.kLabel4').each(function () {
            var label = $(this).text().trim();
            var input = $(this).next('.kInput,.kInput8').find('input, textarea, select');
            input.attr('placeholder', label);
        });

        //Flex generic
        $(".kLabel").each(function () {
            $(this).addClass("col-md-2 col-lg-2 col-sm-2");
        });
        $(".kInput").each(function () {
            $(this).addClass("col-md-4 col-lg-4 col-sm-4");
        });
        $(".kLabel4").each(function () {
            $(this).addClass("col-md-4 col-lg-4 col-sm-4");
        });
        $(".kLabel3").each(function () {
            $(this).addClass("col-md-3 col-lg-3 col-sm-3");
        });
        $(".kLabel2").each(function () {
            $(this).addClass("col-md-2 col-lg-2 col-sm-2");
        });
        $(".kInput8").each(function () {
            $(this).addClass("col-md-8 col-lg-8 col-sm-8");
        });

        //Red Underline for validation
        $('input.required').each(function () {
            $(this).css('border-bottom', '1px solid red');
        });
        $('.required>.k-dropdown-wrap > .k-input').each(function () {
            $(this).css('border-bottom', '1px solid red');
        });

        //Text Area Style
        $(".kTextArea").each(function () {
            $(this).css("width", "100%");
            $(this).css("height", "70px");
            $(this).css("border-color", "#a3d0e4");
            $(this).css("border-radius", "3px");
        });

        //Kendo Numeric TextBox
        $(".KNumericTextBox").kendoMaskedTextBox({
            mask: "000.00"
        });
        $(".KNumericTextBox").each(function () {
            $(this).css("width", "100%");
        });

        //Dropdown Width
        $(".KDropDown").each(function () {
            $(this).css("width", "100%");
        });
    },
    GenerateKendoTextBox: function () {
        $("#Code").kendoTextBox();
        $("#Title").kendoTextBox();
    },
    GenerateKendoComboBox: function () {
        var topic = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Task/GetAllTopicData",
                    dataType: "json"
                }
            }
        });
        $("#cmbTopic").kendoComboBox({
            dataTextField: "name",
            dataValueField: "id",
            dataSource: topic,
            filter: "contains",
            suggest: true
        });

        var rating = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Task/GetAllRatingData",
                    dataType: "json"
                }
            }
        });

        $("#cmbRating").kendoComboBox({
            dataTextField: "name",
            dataValueField: "id",
            dataSource: rating,
            filter: "contains",
            suggest: true
            //index: 0
        });

        var priority = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Task/GetAllPriorityData",
                    dataType: "json"
                }
            }
        });

        $("#cmbPriority").kendoComboBox({
            dataTextField: "name",
            dataValueField: "id",
            dataSource: priority,
            filter: "contains",
            suggest: true
            //index: 0
        });

        var status = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Task/GetAllStatusData",
                    dataType: "json"
                }
            }
        });

        $("#cmbStatus").kendoComboBox({
            dataTextField: "name",
            dataValueField: "id",
            dataSource: status,
            filter: "contains",
            suggest: true
            //index: 0
        });


        var stackHolderDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Ticket/GetAllStackHolder",
                    dataType: "json"
                }
            }
        });

        $("#cmbStackHolder").kendoComboBox({
            dataTextField: "logId",
            dataValueField: "id",
            dataSource: stackHolderDataSource,
            filter: "contains",
            suggest: true,
            change: function (e) {
                var dataItem = this.dataItem(this.select());
                if (dataItem) {
                    $("#CreatorEmail").val(dataItem.email);
                }
            }
        });

        var client = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Ticket/GetAllClient",
                    dataType: "json"
                }
            }
        });

        $("#cmbClient").kendoComboBox({
            dataTextField: "name",
            dataValueField: "id",
            dataSource: client,
            filter: "contains",
            suggest: true
        });

        var ticketSourceData = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Ticket/GetAllticketSourceData",
                    dataType: "json"
                }
            }
        });
        $("#cmbTktSource").kendoComboBox({
            dataTextField: "name",
            dataValueField: "id",
            dataSource: ticketSourceData,
            filter: "contains",
            suggest: true
        });        

        var products = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Ticket/GetAllProductsData",
                    dataType: "json"
                }
            }
        });

        $("#cmbTktProducts").kendoComboBox({
            dataTextField: "name",
            dataValueField: "id",
            dataSource: products,
            filter: "contains",
            suggest: true
            //index: 0
        });      
       
    },
    GenerateKendoDatePicker: function () {
        $("#txtStartDate").kendoDateTimePicker({
            //value: new Date(), // sets the initial value to the current date and time
            //dateInput: true
        });
        $("#txtEndDate").kendoDateTimePicker({
            //value: new Date(), // sets the initial value to the current date and time
           // dateInput: true
        });
    },
    GenerateKendoTextArea: function () {
        var editor = $("#editor").kendoEditor({
            stylesheets: [
                "../content/shared/styles/editor.css",
            ],
            tools: [
                "bold",
                "italic",
                "underline",
                "undo",
                "redo",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "insertUnorderedList",
                "createLink",
                "unlink",
                "insertImage",
                "tableWizard",
                "tableProperties",
                "tableCellProperties",
                "createTable",
                "addRowAbove",
                "addRowBelow",
                "addColumnLeft",
                "addColumnRight",
                "deleteRow",
                "deleteColumn",
                "mergeCellsHorizontally",
                "mergeCellsVertically",
                "splitCellHorizontally",
                "splitCellVertically",
                "tableAlignLeft",
                "tableAlignCenter",
                "tableAlignRight",
                "formatting",
                {
                    name: "fontName",
                    items: [
                        { text: "Andale Mono", value: "\"Andale Mono\"" }, // Font-family names composed of several words should be wrapped in \" \"
                        { text: "Arial", value: "Arial" },
                        { text: "Arial Black", value: "\"Arial Black\"" },
                        { text: "Book Antiqua", value: "\"Book Antiqua\"" },
                        { text: "Comic Sans MS", value: "\"Comic Sans MS\"" },
                        { text: "Courier New", value: "\"Courier New\"" },
                        { text: "Georgia", value: "Georgia" },
                        { text: "Helvetica", value: "Helvetica" },
                        { text: "Impact", value: "Impact" },
                        { text: "Symbol", value: "Symbol" },
                        { text: "Tahoma", value: "Tahoma" },
                        { text: "Terminal", value: "Terminal" },
                        { text: "Times New Roman", value: "\"Times New Roman\"" },
                        { text: "Trebuchet MS", value: "\"Trebuchet MS\"" },
                        { text: "Verdana", value: "Verdana" },
                    ]
                }
            ]
        });
        var editor = $("#collaborationEditor").kendoEditor({
            stylesheets: [
                "../content/shared/styles/editor.css",
            ],
            tools: [
                "bold",
                "italic",
                "underline",
                "undo",
                "redo",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "insertUnorderedList",
                "createLink",
                "unlink",
                "insertImage",
                "tableWizard",
                "tableProperties",
                "tableCellProperties",
                "createTable",
                "addRowAbove",
                "addRowBelow",
                "addColumnLeft",
                "addColumnRight",
                "deleteRow",
                "deleteColumn",
                "mergeCellsHorizontally",
                "mergeCellsVertically",
                "splitCellHorizontally",
                "splitCellVertically",
                "tableAlignLeft",
                "tableAlignCenter",
                "tableAlignRight",
                "formatting",
                {
                    name: "fontName",
                    items: [
                        { text: "Andale Mono", value: "\"Andale Mono\"" }, // Font-family names composed of several words should be wrapped in \" \"
                        { text: "Arial", value: "Arial" },
                        { text: "Arial Black", value: "\"Arial Black\"" },
                        { text: "Book Antiqua", value: "\"Book Antiqua\"" },
                        { text: "Comic Sans MS", value: "\"Comic Sans MS\"" },
                        { text: "Courier New", value: "\"Courier New\"" },
                        { text: "Georgia", value: "Georgia" },
                        { text: "Helvetica", value: "Helvetica" },
                        { text: "Impact", value: "Impact" },
                        { text: "Symbol", value: "Symbol" },
                        { text: "Tahoma", value: "Tahoma" },
                        { text: "Terminal", value: "Terminal" },
                        { text: "Times New Roman", value: "\"Times New Roman\"" },
                        { text: "Trebuchet MS", value: "\"Trebuchet MS\"" },
                        { text: "Verdana", value: "Verdana" },
                    ]
                }
            ]
        });
    },   
    ToogleGenerate: function () {
        $("#usrcollaborationTab").click(function () {
            $("#UserTktForm").toggleClass("hidden");
        });
        $("#infoOptionTab").click(function () {
            $("#tktInfoOptionForm").toggleClass("hidden");
        });
        $("#responseTab").click(function () {
            $("#UserTktResponseForm").toggleClass("hidden");
        });
        $("#collaborationTab").click(function () {
            $("#collaborationForm").toggleClass("hidden");
        });
    },
    ClickEvents: function () {
        $("#btnNew").click(function () {
            $("#divGrid").hide();
            $("#divForm").show();
            $("#btnNew").hide();
            $("#btnIndex").show();
            $("#btnSave").show();
            $("#btnUpdate").hide();

        });
        $("#btnCancle").click(function () {
            window.history.back();
        });
        
    },
    CreateTicketObject: function () {
        var obj = new Object();
        obj.id = $("#hdnTicketId").val();
        obj.ticketCode = $("#tktCode").val();
        obj.ticketTitle = $("#tktTitle").val();
        obj.creatorEmail = $("#tktEmail").val();
        obj.creatorPhone = $("#tktPhone").val();
        obj.ticketStackHolderCC = $("#tktCC").val();
        obj.ticketStackHolder = $("#cmbStackHolder").data("kendoComboBox").value();
        obj.organization = $("#cmbOrganization").data("kendoComboBox").value();
        obj.ticketSource = $("#cmbTktSource").data("kendoComboBox").value();
        obj.ticketTopic = $("#cmbTktTopic").data("kendoComboBox").value();
        obj.departmentId = $("#cmbTktDepartment").data("kendoComboBox").value();
        obj.status = $("#cmbTktStatus").data("kendoComboBox").value();
        obj.productId = $("#cmbTktProducts").data("kendoComboBox").value();
        obj.AssignToList = $("#cmbAssignTo").data("kendoMultiSelect").value();

        var openingDate = $("#txtStartDate").data("kendoDateTimePicker");
        var dateValue = openingDate.value();
        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }
        var year = dateValue.getFullYear();
        var month = pad(dateValue.getMonth() + 1);
        var day = pad(dateValue.getDate());
        var hours = pad(dateValue.getHours());
        var minutes = pad(dateValue.getMinutes());
        var seconds = pad(dateValue.getSeconds());

        var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.000';
        obj.createDate = formattedDate;

        var closingDate = $("#txtEndDate").data("kendoDateTimePicker");
        var closingDateValue = closingDate.value();
        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }
        var year = closingDateValue.getFullYear();
        var month = pad(closingDateValue.getMonth() + 1);
        var day = pad(closingDateValue.getDate());
        var hours = pad(closingDateValue.getHours());
        var minutes = pad(closingDateValue.getMinutes());
        var seconds = pad(closingDateValue.getSeconds());

        var formattedClosingDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.000';
        obj.dueDate = formattedClosingDate;

        //obj.CreateDate = $("#txtStartDate").data("kendoDateTimePicker").value();
        //obj.DueDate = $("#txtEndDate").data("kendoDateTimePicker").value();

        obj.description = $("#editor").data("kendoEditor").value();
        debugger;
        var attachment = TicketSummaryHelper.getSelectedFiles();
        obj.files = attachment[0].name;
        //obj.Remarks = $("#collaborationEditor").data("kendoEditor").value();
        return obj;

    },
    ClickEventForEditButton: function (obj) {        
        TicketSummaryHelper.FillForm(obj);
    },
    GetAssignToByTicketId: function (id, callback) {
        $.ajax({
            url: '/Tools/Support/GetAssignToByTicketId',
            method: 'get',
            data: { id: id },
            success: function (response) {
                // Call the callback function with the response data
                if (callback) callback(response);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching data:', error);
            }
        });
    },
    getSelectedFiles: function () {
        // Get the file input element
        var fileInput = document.getElementById('files');

        // Get the list of selected files
        var files = fileInput.files;

        // Store the files in an array or directly use the FileList
        var selectedFiles = [];

        for (var i = 0; i < files.length; i++) {
            selectedFiles.push(files[i]);
        }

        // Now you have all the selected files in the selectedFiles array
        return selectedFiles;
    }
}