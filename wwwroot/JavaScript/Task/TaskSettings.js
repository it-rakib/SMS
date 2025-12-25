$(document).ready(function () {
    TaskSummaryHelper.InitTaskSummary();
});
var selectedId = [];
var TaskSummaryManager = {
    gridDataSource: function () {
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
                    url: "/Task/GetAllTaskMData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (filter) {
                            if (filter.field === "startDate") {
                                filter.value = kendo.toString(filter.value, "yyyy-MM-dd");
                            }
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
                        startDate: { type: "date" }
                    }
                }
            }
        });
        return gridDataSource;
    },
    gridNoteDataSource: function (Id) {
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
                    url: "/Task/GetAllEnternalNoteData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { Id: Id }
                },
                parameterMap: function (options) {
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
                        
                    }
                }
            }
        });
        return gridDataSource;
    },
    gridCollaborationDataSource: function (Id) {
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
                    url: "/Task/GetAllCollaborationData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { Id: Id }
                },
                parameterMap: function (options) {
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

                    }
                }
            }
        });
        return gridDataSource;
    },
    gridAssigneDataSource: function (Id) {
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
                    url: "/Task/GetAllAssigneeData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { Id: Id }
                },
                parameterMap: function (options) {
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

                    }
                }
            }
        });
        return gridDataSource;
    },
    gridTimeDataSource: function (Id) {
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
                    url: "/Task/GetAllTaskTimeData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { Id: Id }
                },
                parameterMap: function (options) {

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (filter) {
                            if (filter.field === "startTime" || filter.field === "stopTime") {
                                filter.value = kendo.toString(filter.value, "dd-MM-yyyy");
                            }
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
                        //id: { type: "number" },
                        startTime: { type: "date" },
                        stopTime: { type: "date" }
                    }

                }
            }
        });
        return gridDataSource;
    },
    SaveEnterNalNotes: function (event) {
        event.preventDefault();
        var objNote = TaskSummaryHelper.CreateNoteObject();
        $.ajax({
            url: '/Task/SaveEnternalNotes', // Adjust the URL according to your routing
            method: 'post',
            data: objNote,
            success: function () {
                var grid = $("#kENotesGrid").data("kendoGrid");
                grid.dataSource.read();
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.success("Save Successfully!");
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.warning("Error: " + error);
            }
        });
    },
    SaveEnterNalActive: function (event) {
        event.preventDefault();
        var objActNote = TaskSummaryHelper.CreateNoteActiveObject();
        $.ajax({
            url: '/Task/SaveEnternalActiveNotes',
            method: 'post',
            data: objActNote,
            success: function () {
                var grid = $("#kENotesGrid").data("kendoGrid");
                grid.dataSource.read();
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.success("Save Successfully!");
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.warning("Error: " + error);
            }
        });
    },
    SaveCollaborationActive: function (event) {
        event.preventDefault();
        var objActCol = TaskSummaryHelper.CreateCollabActiveObject();
        $.ajax({
            url: '/Task/SaveCollabActiveNotes',
            method: 'post',
            data: objActCol,
            success: function () {
                var grid = $("#kCollabGrid").data("kendoGrid");
                grid.dataSource.read();
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.success("Save Successfully!");
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.warning("Error: " + error);
            }
        });
    },
    SaveAssigneInActive: function (event) {
        event.preventDefault();
        var objActAssign = TaskSummaryHelper.CreateAssigneActiveObject();
        $.ajax({
            url: '/Task/SaveAssigneActiveNotes',
            method: 'post',
            data: objActAssign,
            success: function () {
                var grid = $("#kAssignGrid").data("kendoGrid");
                grid.dataSource.read();
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.success("Save Successfully!");
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.warning("Error: " + error);
            }
        });
    },
    GenerateEnternalNoteByTaskId: function (taskId) {        
        var noteDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: "/Task/GetInternalNoteByTaskId",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { taskId: taskId }
                },
                parameterMap: function (options) {
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "items",
                total: "totalCount",
                model: {
                    //id: "id",
                    fields: {
                        //subTotal: { type: "number" },
                        //total: { type: "number" }
                    }
                }
            }
        });
        return noteDataSource;

    },
    GetCollaborationByTaskId: function (taskId) {
        var collabDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: "/Task/GetCollaborationByTaskId",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { taskId: taskId }
                },
                parameterMap: function (options) {
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "items",
                total: "totalCount",
                model: {
                    //id: "id",
                    fields: {
                        //subTotal: { type: "number" },
                        //total: { type: "number" }
                    }
                }
            }
        });
        return collabDataSource;

    },
    SaveCollaboration: function (event) {
        event.preventDefault();
        var objCLB = TaskSummaryHelper.CreateCollaborationObject();
        $.ajax({
            url: '/Task/SaveCollaboration', 
            method: 'post',
            data: objCLB,
            success: function () {
                var grid = $("#kCollabGrid").data("kendoGrid");
                grid.dataSource.read();
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.success("Save Successfully!");
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.warning("Error: " + error);
            }
        });
    },
    SaveAssigne: function (event) {
        event.preventDefault();
        var objAssigne = TaskSummaryHelper.CreateAssigneObject();
        $.ajax({
            url: '/Task/SaveAssigne',
            method: 'post',
            data: objAssigne,
            success: function () {
                var grid = $("#kAssignGrid").data("kendoGrid");
                grid.dataSource.read();
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.success("Save Successfully!");
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.warning("Error: " + error);
            }
        });
    },
    SaveStartTime: function () {
        var objStart = TaskSummaryHelper.CreateStartTimeObject();
        $.ajax({
            url: '/Task/SaveStartTime',
            method: 'post',
            data: objStart,
            success: function () {
                var grid = $("#kTimeGrid").data("kendoGrid");
                grid.dataSource.read();
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.success("Save Successfully!");
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.warning("Error: " + error);
            }
        });
    },
    SaveStopTime: function (selectedId) {
        debugger;
        var objStop = TaskSummaryHelper.CreateStopTimeObject(selectedId);
        $.ajax({
            url: '/Task/SaveStopTime',
            method: 'post',
            data: objStop,
            success: function () {
                var grid = $("#kTimeGrid").data("kendoGrid");
                grid.dataSource.read();
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.success("Save Successfully!");
                $("#divTimeModal").data("kendoWindow").close();
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.warning("Error: " + error);
            }
        });
    },
    SavePauseTime: function (selectedId) {
        var objStop = TaskSummaryHelper.CreatePauseTimeObject(selectedId);
        $.ajax({
            url: '/Task/SaveStopTime',
            method: 'post',
            data: objStop,
            success: function () {
                var grid = $("#kTimeGrid").data("kendoGrid");
                grid.dataSource.read();
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.success("Save Successfully!");
                $("#divTimeModal").data("kendoWindow").close();
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.warning("Error: " + error);
            }
        });
    },
    SaveCmpltTime: function (e) {
        var objPause = TaskSummaryHelper.CreateCmpltTimeObject(e);
        $.ajax({
            url: '/Task/SaveStopTime',
            method: 'post',
            data: objPause,
            success: function () {
                var grid = $("#kTimeGrid").data("kendoGrid");
                grid.dataSource.read();
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.success("Save Successfully!");
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                toastr.options = {
                    positionClass: 'toast-center', // Custom position class to center the toast
                    toastClass: 'toastr-center'
                };
                toastr.warning("Error: " + error);
            }
        });
    },
    GetAssigneById: function (id,callback) {
        $.ajax({
            url: '/Task/GetAssigneById',
            method: 'get',
            data: { id: id },
            success: function (response) {

                callback(response);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching Vendor:', error);
            }

        });
    },
    GetCollabById: function (id, callback) {
        $.ajax({
            url: '/Task/GetCollaborationById',
            method: 'get',
            data: { id: id },
            success: function (response) {

                callback(response);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching Vendor:', error);
            }

        });
    },
    GetinternalDataById: function (id, callback) {
        $.ajax({
            url: '/Task/GetInternalById',
            method: 'get',
            data: { id: id },
            success: function (response) {

                callback(response);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching Vendor:', error);
            }

        });
    },
    GetTimeByTask: function (taskId, callback) {
        $.ajax({
            url: '/Task/GetTimeByTask',
            method: 'get',
            data: { taskId: taskId },
            success: function (response) {

                callback(response);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching Time:', error);
            }

        });
    }
}
var TaskSummaryHelper = {
    InitTaskSummary: function () {

        TaskSummaryHelper.GenerateTaskGrid();
        TaskSummaryHelper.GenerateEnternalNotesGrid();
        TaskSummaryHelper.GenerateCollaborationGrid();
        TaskSummaryHelper.GenerateAssigneGrid();
        TaskSummaryHelper.GenerateTimeGrid();
        TaskSummaryHelper.GenerateTaskStyle();
        TaskSummaryHelper.GenerateKendoComboBox();
        TaskSummaryHelper.GenerateKendoTextBox();
        TaskSummaryHelper.GenerateKendoDatePicker();
        TaskSummaryHelper.GenerateKendoTextArea();
        TaskSummaryHelper.ToogleGenerate();
        TaskSummaryHelper.ClickEvents();
        TaskSummaryHelper.GenerateModal();
        TaskSummaryHelper.GenerateFiles();
        
        //Kendo Validator
        $("#UserTktForm").kendoValidator().data("kendoValidator");
        $("#tktInfoOptionForm").kendoValidator().data("kendoValidator");
    },
    GenerateTaskGrid: function () {
        $("#kTaskGrid").kendoGrid({
            dataSource: TaskSummaryManager.gridDataSource(),
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
                fileName: "Task Excel.xlsx",
                filterable: true
            },
            search: {
                fields: ["code", "title", "t_TicketId", "t_SourceId"]
            },
            columns: [

                {
                    title: "Action",
                    width: 80,
                    template: function (dataItem) {
                        console.log(dataItem.t_TicketId);
                        return "<a class='btn btn-primary btn-sm mr-2 edit' title='Modify' href=/Task/Edit/" + dataItem.id + "/" + dataItem.t_TicketId + ">" + "<i class='fas fa-pencil-alt'></i>" + "</a>";

                    }
                },

                {
                    field: "id", title: "ID", width: 150, hidden: true, sortable: true
                },
                {
                    field: "companyId", title: "CompanyId", width: 150, hidden: true, sortable: true
                },
                
                {
                    field: "title", title: "Title", sortable: true, width: 220
                },
                {
                    field: "description", title: "Description", sortable: true, width: 220
                },
                {
                    field: "t_TicketId", title: "T_Ticket Id", hidden:true, sortable: true, width: 200
                },
                {
                    field: "ticketCode", title: "Code", sortable: true, width: 150
                },
                {
                    field: "sourceName", title: "Source", sortable: true, width: 150
                },
                {
                    field: "topicName", title: "Topic", sortable: true, width: 150
                },
                
                {
                    field: "priority", title: "Priority", sortable: true, width: 150
                },
                {
                    field: "status", title: "Status", sortable: true, width: 150
                },

                {
                    field: "progressInPercent", title: "ProgressIn Percent", sortable: true, width: 150
                },                
                {
                    field: "startDate", title: "Start Date", sortable: true, width: 200, template: '#= kendo.toString(kendo.parseDate(startDate), "yyyy-MM-dd") #', filterable: {
                        ui: "datepicker"
                    }
                },
                {
                    field: "startTime", title: "Start Time", sortable: true, width: 200
                },
                {
                    field: "requiredTime", title: "Required Time", sortable: true, width: 150
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });
    },
    GenerateEnternalNotesGrid: function () {
        var taskId = $("#Id").val();
        $("#kENotesGrid").kendoGrid({
            dataSource: TaskSummaryManager.gridNoteDataSource(taskId),
            pageable: false,
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
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: false,

            toolbar: ["search"],            
            search: {
                fields: ["shortNote"]
            },
            columns: [
                {
                    title: "Action",
                    width: 80,
                    template: function (dataItem) {
                        return "<a class='btn btn-primary btn-sm mr-2 edit' title='Modify' onclick='TaskSummaryHelper.ClickEventForEnternal(" + dataItem.id + ")'>" +
                            "<i class='fas fa-pencil-alt'></i>" +
                            "</a>";
                    }
                },                
                {
                    field: "id", title: "ID",  hidden: true, sortable: true
                },
                {
                    field: "t_TaskId", title: "T_TaskId",   hidden: true
                },
                {
                    field: "shortNote", title: "ShortNote",   sortable: true
                },                
                 
                {
                    field: "assigneeUserId", title: "User", width: 250, sortable: true
                },
                {
                    field: "isActive", title: "Active", width: 100, sortable: true
                }
                
                

            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });
    },
    GenerateCollaborationGrid: function () {
        var taskId = $("#Id").val();
        $("#kCollabGrid").kendoGrid({
            dataSource: TaskSummaryManager.gridCollaborationDataSource(taskId),
            pageable: false,
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
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: false,
            toolbar: ["search"],
            search: {
                fields: ["shortNote"]
            },
            columns: [
                {
                    title: "Action",
                    width: 80,
                    template: function (dataItem) {
                        return "<a class='btn btn-primary btn-sm mr-2 edit' title='Modify' onclick='TaskSummaryHelper.ClickEventForCollaboration(" + dataItem.id + ")'>" +
                            "<i class='fas fa-pencil-alt'></i>" +
                            "</a>";
                    }
                },
                {
                    field: "id", title: "ID", hidden: true, sortable: true
                },
                {
                    field: "t_TaskId", title: "T_TaskId", hidden: true
                },
                {
                    field: "shortNote", title: "Short Note", sortable: true
                },
                {
                    field: "description", title: "Description", hidden: true, sortable: true
                },
                {
                    field: "userId", title: "User", width: 250, sortable: true
                },
                {
                    field: "isActive", title: "Active", width: 100, sortable: true
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });
    },
    GenerateAssigneGrid: function () {
        var taskId = $("#Id").val();
        $("#kAssignGrid").kendoGrid({
            dataSource: TaskSummaryManager.gridAssigneDataSource(taskId),
            pageable: false,
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
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: false,

            toolbar: ["search"],
            search: {
                fields: ["assigneeUserId"]
            },
            columns: [
                
                {
                    title: "Action",
                    width: 80,
                    template: function (dataItem) {
                        return "<a class='btn btn-primary btn-sm mr-2 edit' title='Modify' onclick='TaskSummaryHelper.ClickEventForAssignee(" + dataItem.id + ")'>" +
                            "<i class='fas fa-pencil-alt'></i>" +
                            "</a>";
                    }
                },
                {
                    field: "id", title: "ID", hidden: true, sortable: true
                },
                {
                    field: "t_TaskId", title: "Task Id", hidden: true
                },
                {
                    field: "t_TicketId", title: "Ticket Id", hidden: true
                },
                {
                    field: "assigneeUserId", title: "User", width: 250, sortable: true
                },
                {
                    field: "isActive", title: "Active", width: 100, sortable: true
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });
    },
    GenerateTimeGrid: function () {
        var taskId = $("#Id").val();
        
        $("#kTimeGrid").kendoGrid({
            dataSource: TaskSummaryManager.gridTimeDataSource(taskId),
            pageable: false,
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
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: false,

            toolbar: ["search"],
            search: {
                fields: ["startStatus"]
            },
            columns: [
                {
                    field: "command",
                    title: "&nbsp;Action",
                    width:120,
                    template: function (dataItem) {
                        var pauseButton = "";
                        var completeButton = "";
                        if (dataItem.startStatus !== 'C' && dataItem.startStatus !== 'P') {
                            pauseButton = "<a style='background-color: royalblue;' href='#' class='btn btn-success btn-sm mr-2 edit ' title='Pause' onclick='TaskSummaryHelper.pauseTask(" + JSON.stringify(dataItem) + ")'><i class='fas fa-pause-circle'></i></a>";
                            completeButton = "<a style='background-color: darkgreen;' href='#' class='btn btn-success btn-sm mr-2 edit ' title='Complete' onclick='TaskSummaryHelper.completeTask(" + JSON.stringify(dataItem) + ")'><i class='fa fa-check-circle'></i></a>";
                        } else {
                            pauseButton = "<a style='background-color: royalblue; cursor: not-allowed;' href='#' class='btn btn-success btn-sm mr-2 edit disabled' title='Pause' onclick='return false;'><i class='fas fa-pause-circle'></i></a>";
                            completeButton = "<a style='background-color: darkgreen; cursor: not-allowed;' href='#' class='btn btn-success btn-sm mr-2 edit disabled' title='Complete' onclick='return false;'><i class='fa fa-check-circle'></i></a>";
                        }

                        return pauseButton + completeButton;
                    }
                },
                {
                    field: "id", title: "ID", hidden: true, sortable: true,width: 120
                },
                {
                    field: "t_TaskId", title: "T_TaskId", hidden: true, width: 120
                },
                {
                    field: "comments", title: "Comments", hidden: true, width: 120
                },
                {
                    field: "startTime",
                    title: "Start",
                    sortable: true,
                    template: '#= kendo.toString(kendo.parseDate(startTime), "dd-MMM-yyyy HH:mm") #',
                    filterable: {
                        ui: "datepicker"
                    },
                    width: 160
                },
                {
                    field: "stopTime", title: "Stop", sortable: true, template: '#= kendo.toString(kendo.parseDate(stopTime), "dd-MMM-yyyy HH:mm") #', filterable: {
                        ui: "datepicker"
                    }, width: 160
                },
                {
                    field: "duration", title: "Duration(minute)", sortable: true,width: 160
                },
                {
                    field: "startedBy", title: "Started By", sortable: true, width: 120
                },
                {
                    field: "startStatus", title: "Status", sortable: true, width: 90
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true,
            dataBound: function (e) {
                var grid = this;
                var data = grid.dataSource.view();

                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    if (dataItem.startStatus === 'C' || dataItem.startStatus === 'P') {
                        $(".btnComplete").prop("disabled", true);
                        break;
                    } else {
                        $(".btnComplete").prop("disabled", false);
                    }
                }
            }
        });
    },
    GenerateTaskStyle: function () {
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
        $("#txtPercent").kendoTextBox();
        $("#txtRequiredTime").kendoTextBox();
    },
    GenerateKendoComboBox: function () {
        var ticket = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Task/GetAllTicket",
                    dataType: "json"
                }
            }
        });

        $("#cmbTicket").kendoComboBox({
            dataTextField: "code",
            dataValueField: "id",
            dataSource: ticket,
            filter: "contains",
            suggest: true
        });

        var source = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Ticket/GetAllticketSourceData",
                    dataType: "json"
                }
            }
        });
        $("#cmbSource").kendoComboBox({
            dataTextField: "name",
            dataValueField: "id",
            dataSource: source,
            filter: "contains",
            suggest: true
        });

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



        var multiComboBox = $("#cmbAssignUsr").kendoMultiColumnComboBox({
            dataTextField: "logId",
            dataValueField: "logId",
            height: 400,
            columns: [                
                { field: "logId", title: "logId", width: 200 },
                { field: "profileName", title: "Profile", width: 200 }
            ],
            
            filter: "contains",
            filterFields: ["logId"],
            dataSource: {
                transport: {
                    read: "/Ticket/GetAllStackHolder"
                }
            }
        }).data("kendoMultiColumnComboBox");


        //var assigne = new kendo.data.DataSource({
        //    transport: {
        //        read: {
        //            url: "/Ticket/GetAllStackHolder",
        //            dataType: "json"
        //        }
        //    }
        //});

        //$("#cmbAssignUsr").kendoComboBox({
        //    dataTextField: "logId",
        //    dataValueField: "logId",
        //    dataSource: assigne,
        //    filter: "contains",
        //    suggest: true
        //    //index: 0
        //});
       
    },
    GenerateKendoDatePicker: function () {
        $("#txtStartDate").kendoDatePicker({
            //value: new Date(), // sets the initial value to the current date and time
            //dateInput: true
        });
        $("#txtStartTime").kendoTimePicker({
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
        //var editorColl = $("#collaborationEditor").kendoEditor({
        //    stylesheets: [
        //        "../content/shared/styles/editor.css",
        //    ],
        //    tools: [
        //        "bold",
        //        "italic",
        //        "underline",
        //        "undo",
        //        "redo",
        //        "justifyLeft",
        //        "justifyCenter",
        //        "justifyRight",
        //        "insertUnorderedList",
        //        "createLink",
        //        "unlink",
        //        "insertImage",
        //        "tableWizard",
        //        "tableProperties",
        //        "tableCellProperties",
        //        "createTable",
        //        "addRowAbove",
        //        "addRowBelow",
        //        "addColumnLeft",
        //        "addColumnRight",
        //        "deleteRow",
        //        "deleteColumn",
        //        "mergeCellsHorizontally",
        //        "mergeCellsVertically",
        //        "splitCellHorizontally",
        //        "splitCellVertically",
        //        "tableAlignLeft",
        //        "tableAlignCenter",
        //        "tableAlignRight",
        //        "formatting",
        //        {
        //            name: "fontName",
        //            items: [
        //                { text: "Andale Mono", value: "\"Andale Mono\"" }, // Font-family names composed of several words should be wrapped in \" \"
        //                { text: "Arial", value: "Arial" },
        //                { text: "Arial Black", value: "\"Arial Black\"" },
        //                { text: "Book Antiqua", value: "\"Book Antiqua\"" },
        //                { text: "Comic Sans MS", value: "\"Comic Sans MS\"" },
        //                { text: "Courier New", value: "\"Courier New\"" },
        //                { text: "Georgia", value: "Georgia" },
        //                { text: "Helvetica", value: "Helvetica" },
        //                { text: "Impact", value: "Impact" },
        //                { text: "Symbol", value: "Symbol" },
        //                { text: "Tahoma", value: "Tahoma" },
        //                { text: "Terminal", value: "Terminal" },
        //                { text: "Times New Roman", value: "\"Times New Roman\"" },
        //                { text: "Trebuchet MS", value: "\"Trebuchet MS\"" },
        //                { text: "Verdana", value: "Verdana" },
        //            ]
        //        }
        //    ]
        //});
        var editorEnternal = $("#editorShortNote").kendoEditor({
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
        var editorColl = $("#editorCollab").kendoEditor({
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
        var timeColl = $("#timeEditor").kendoEditor({
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
        $("#responseTab").click(function () {
            $("#UserTktResponseForm").toggleClass("hidden");
        });        
        $("#enternalTab").click(function () {
            $("#enternlaNotes").toggleClass("hidden");
        });
        $("#collaborationTab").click(function () {
            $("#collaborations").toggleClass("hidden");
        });
        $("#assigneeTab").click(function () {
            $("#assignee").toggleClass("hidden");
        });
        $("#timeTab").click(function () {
            $("#taskTime").toggleClass("hidden");
        });
        $("#filesTab").click(function () {
            $("#fileForm").toggleClass("hidden");
        });
    },
    GenerateModal: function () {
        $("#divEnternalModal").kendoWindow({
            visible: false,
            modal: true,
            width: "50%",
            title: "Enternal Notes"
        });
        $("#divCollaborationModal").kendoWindow({
            visible: false,
            modal: true,
            width: "50%",
            title: "Collaborations"
        });
        $("#divAssigneModal").kendoWindow({
            visible: false,
            modal: true,
            width: "50%",
            title: "Assign Users"
        });
        $("#divTimeModal").kendoWindow({
            visible: false,
            modal: true,
            width: "50%",
            title: "Add Comments"
        });
    },
    GenerateFiles: function () {

        $(".photos").kendoUpload({
            //async: {
            //    saveUrl: "/Task/UploadFile",
            //    autoUpload: true
            //},
            //save: function (e) {
            //    // Access the form data object
            //    var formData = e.data;

            //    // Add additional data to the form data object
            //    formData.append("CustomField1", "CustomValue1");
            //    formData.append("CustomField2", "CustomValue2");

            //    // If you need to access the selected files
            //    var files = e.files;
            //    for (var i = 0; i < files.length; i++) {
            //        formData.append("file" + i, files[i].rawFile);
            //    }
            //}
        });





        //$("#photos").kendoUpload({
        //    async: {
        //        saveUrl: "/Task/UploadFile",
        //        autoUpload: true
        //    },
        //    /*select: value*/
        //});

        //function onSelect(e) {
        //    $.each(e.files, function (index, value) {  
        //        debugger;

        //        //console.log("Name: " + value.name);
        //        //console.log("Size: " + value.size + " bytes");
        //        //console.log("Extension: " + value.extension);
        //    });
        //};
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
        $("#btnNewEnt").click(function () {
            TaskSummaryHelper.ClearEnternalForm();
            $("#divEnternalModal").data("kendoWindow").center().open();
            $('#txtShortNote').prop('disabled', false);
            //var editor = $("#editorShortNote").data("kendoEditor");

            $($('#editorShortNote').data().kendoEditor.body).attr('contenteditable', true)           
            $("#btnSaveEnternal").show();
            $("#btnEntIsAct").hide();
        });
        $("#cancelEntButton").click(function () {            
            $("#divEnternalModal").data("kendoWindow").close();
        });
        $("#btnSaveEnternal").click(function () {
            TaskSummaryManager.SaveEnterNalNotes(event);
            $("#divEnternalModal").data("kendoWindow").close();
        });
        $("#btnNewColla").click(function () {
            TaskSummaryHelper.ClearCollaborationForm();
            $("#divCollaborationModal").data("kendoWindow").center().open();
            $('#txtClbShortNote').prop('disabled', false);
            $($('#editorCollab').data().kendoEditor.body).attr('contenteditable', true)
            $("#btnSaveCollab").show();
            $("#btnCollbIsAct").hide();
        });
        $("#cancelClbButton").click(function () {
            $("#divCollaborationModal").data("kendoWindow").close();
        });
        $("#btnSaveCollab").click(function () {
            TaskSummaryManager.SaveCollaboration(event);
            $("#divCollaborationModal").data("kendoWindow").close();
        });

        $("#btnNewAssign").click(function () {
            $("#divAssigneModal").data("kendoWindow").center().open();
            $("#cmbAssignUsr").data("kendoMultiColumnComboBox").enable(true); 
            $("#cmbAssignUsr").data("kendoMultiColumnComboBox").value("");  
            $("#btnSaveAssigne").show();
            $("#btnAssigneIsAct").hide();
        });
        $("#cancelAssigneButton").click(function () {
            $("#divAssigneModal").data("kendoWindow").close();
        });
        $("#btnSaveAssigne").click(function () {
            TaskSummaryManager.SaveAssigne(event);
            $("#divAssigneModal").data("kendoWindow").close();
        });
        $("#btnEntIsAct").click(function () {
            TaskSummaryManager.SaveEnterNalActive(event);
            $("#divEnternalModal").data("kendoWindow").close();
        });
        $("#btnCollbIsAct").click(function () {
            TaskSummaryManager.SaveCollaborationActive(event);
            $("#divCollaborationModal").data("kendoWindow").close();
        });
        $("#btnAssigneIsAct").click(function () {
            TaskSummaryManager.SaveAssigneInActive(event);
            $("#divAssigneModal").data("kendoWindow").close();
        });
        $("#btnStart").click(function () {
            
            var taskId = $("#Id").val();

            var status = TaskSummaryManager.GetTimeByTask(taskId, function (status) {
                var taskAlreadyStarted = false;

                status.forEach(function (item) {
                    if (item.startStatus == 'S') {
                        taskAlreadyStarted = true;
                    }
                });

                if (taskAlreadyStarted) {
                    toastr.options = {
                        positionClass: 'toast-center', // Custom position class to center the toast
                        toastClass: 'toastr-center'
                    };
                    toastr.warning("Task Already Started!");
                } else {
                    TaskSummaryManager.SaveStartTime();
                    toastr.options = {
                        positionClass: 'toast-center', // Custom position class to center the toast
                        toastClass: 'toastr-center'
                    };
                    toastr.success("Task Started Successfully!");
                }
            });
        });
        $("#btnStop").click(function () {
            TaskSummaryManager.SaveStopTime();
        });
        $("#cancelTimeButton").click(function () {
            $("#divTimeModal").data("kendoWindow").close();
        });  
        $("#btnPause").click(function () {
            debugger;
            TaskSummaryManager.SavePauseTime(selectedId);
        });
        $("#btnTimeStart").click(function () {
            debugger;
            TaskSummaryManager.SaveStopTime(selectedId);
        });
        $("#btnCancle").click(function () {
           
            window.history.back();
        });
        
    },
    ClearEnternalForm: function () {
        $("#txtShortNote").val("");
        var editor = $("#editorShortNote").data("kendoEditor");
        editor.value("");
               
    },
    ClearCollaborationForm: function () {
        $("#txtClbShortNote").val("");
        var editor = $("#editorCollab").data("kendoEditor");
        editor.value("");       
    },
    CreateNoteObject: function () {
        var obj = new Object();
        obj.id = $("#hdnEnternalNId").val();
        obj.t_TaskId = $("#Id").val();
        obj.shortNote = $("#txtShortNote").val();
        obj.description = $("#editorShortNote").data("kendoEditor").value();
        return obj;
    },
    CreateNoteActiveObject: function () {
        var obj = new Object();
        obj.id = $("#hdnEnternalNId").val();
        obj.IsActive = 0;
        return obj;
    },
    CreateCollabActiveObject: function () {
        var obj = new Object();
        obj.id = $("#hdnCollaborationId").val();
        obj.IsActive = 0;
        return obj;
    },
    CreateAssigneActiveObject: function () {
        var obj = new Object();
        obj.id = $("#hdnTAssignId").val();
        obj.isActive = 0;
        return obj;
    },
    CreateCollaborationObject: function () {
        var obj = new Object();
        obj.id = $("#hdnCollaborationId").val();
        obj.t_TaskId = $("#Id").val();
        obj.shortNote = $("#txtClbShortNote").val();
        obj.description = $("#editorCollab").data("kendoEditor").value();
        return obj;
    },
    CreateAssigneObject: function () {
        var obj = new Object();
        obj.id = $("#hdnTAssignId").val();
        obj.t_TaskId = $("#Id").val();
        obj.t_TicketId = $("#T_TicketId").val();
        obj.assigneeUserId = $("#cmbAssignUsr").data("kendoMultiColumnComboBox").value();        
        return obj;
    },
    CreateStartTimeObject: function () {
        var obj = new Object();
        obj.id = $("#hdnTaskTimeId").val();
        obj.t_TaskId = $("#Id").val();
        obj.startStatus = "S";
        obj.t_TicketId = $("#T_TicketId").val();
        return obj;
    },
    CreateStopTimeObject: function (e) {
        var obj = new Object();
        obj.id = e.id;
        obj.t_TaskId = $("#Id").val();
        obj.startStatus = "C";
        obj.description = $("#timeEditor").data("kendoEditor").value();
        return obj;
    },
    CreatePauseTimeObject: function (selectedId) {
        var obj = new Object();
        obj.id = selectedId.id;
        obj.t_TaskId = $("#Id").val();
        obj.startStatus = "P";
        obj.description = $("#timeEditor").data("kendoEditor").value();
        return obj;
    },
    CreateCmpltTimeObject: function (selectedId) {
        var obj = new Object();
        obj.id = selectedId.id;
        obj.startStatus = "C";
        return obj;
    },
    ClickEventForEnternal: function (id) {
        $("#divEnternalModal").data("kendoWindow").center().open();
        $('#txtShortNote').prop('disabled', true);
        $($('#editorShortNote').data().kendoEditor.body).attr('contenteditable', false)
        $("#btnSaveEnternal").hide();
        $("#btnEntIsAct").show();
        var internalData = TaskSummaryManager.GetinternalDataById(id, function (internalData) {
            $("#hdnEnternalNId").val(internalData[0].id);
            $("#Id").val(internalData[0].t_TaskId);
            $("#txtShortNote").val(internalData[0].shortNote);
            $("#editorShortNote").data("kendoEditor").value(internalData[0].description);
        });
        TaskSummaryHelper.FillInternalForm(selectedItem);
    },
    ClickEventForCollaboration: function (id) {
        $("#divCollaborationModal").data("kendoWindow").center().open();
        $('#txtClbShortNote').prop('disabled', true);
        $($('#editorCollab').data().kendoEditor.body).attr('contenteditable', false)
        $("#btnSaveCollab").hide();
        $("#btnCollbIsAct").show();
        var collabData = TaskSummaryManager.GetCollabById(id, function (collabData) {
            $("#hdnCollaborationId").val(collabData[0].id);
            $("#Id").val(collabData[0].t_TaskId);
            $("#txtClbShortNote").val(collabData[0].shortNote);
            $("#editorCollab").data("kendoEditor").value(collabData[0].description);         

        });
    },
    ClickEventForAssignee: function (id) {
        $("#divAssigneModal").data("kendoWindow").center().open();
        $("#cmbAssignUsr").data("kendoMultiColumnComboBox").enable(false);             
        $("#btnSaveAssigne").hide();
        $("#btnAssigneIsAct").show();  
        var assigneData = TaskSummaryManager.GetAssigneById(id, function (assigneData) {
            $("#hdnTAssignId").val(assigneData[0].id);
            $("#Id").val(assigneData[0].t_TaskId);
            $("#cmbAssignUsr").data("kendoMultiColumnComboBox").value(assigneData[0].assigneeUserId);           

        });        
    },    
    pauseTask: function (e) {
        $("#divTimeModal").data("kendoWindow").center().open();
        $("#btnPause").show();
        $("#btnTimeStart").hide();
        selectedId = e;
        
    },
    completeTask: function (e) {
        $("#divTimeModal").data("kendoWindow").center().open();
        $("#btnTimeStart").show();
        $("#btnPause").hide();
        selectedId = e;
        
    }
}