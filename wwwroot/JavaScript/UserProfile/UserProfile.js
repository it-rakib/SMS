$(document).ready(function () {

    var gridDataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        autoSync: true,
        pageSize: 10,
        transport: {
            read: {
                url: "/UserProfile/GetUserProfileGrid", //_index
                type: "POST",
                dataType: "json",
                cache: false
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
                //id: "BranchId",
                fields: {

                }
            }
        }
    });
    $("#userProfileGrid").kendoGrid({
        dataSource: gridDataSource,
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
        sortable: true,
        resizable: true,
        reorderable: true,
        groupable: true,
        toolbar: ["excel", "pdf", "search"],
        excel: {
            fileName: "UserList.xlsx",
            filterable: true
        },
        search: {
            fields: ["userName", "fullName"]
        },
        columns: [
            {
                title: "Action",
                width: 90,
                template: function (dataItem) {
                    console.log(dataItem);
                    return "<a href='/UserProfile/Profile/" + dataItem.userId + "' class='btn btn-primary btn-sm mr-2 edit'>" +
                        "<i class='fas fa-pencil-alt'></i>" +
                        "</a>" +
                        "<a href='/UserProfile/Edit/" + dataItem.userId + "' class='btn btn-secondary btn-sm mr-2 edit'>" +
                        "<i class='fas fa-key'></i>" +
                        "</a>";
                }
            },

            {
                field: "userId", width: 150, hidden: true, sortable: true
            },
            {
                field: "userName", title: "User Name", sortable: true, width: 200
            },
            {
                field: "fullName", title: "Full Name", sortable: true, width: 160
            }


        ],
        editable: false,
        selectable: "row",
        navigatable: true,
        columnMenu: true
    });

    $("#userProfileGrid").on("click", ".k-header .k-checkbox", function () {
        var isChecked = $(this).is(":checked");
        var grid = $("#userProfileGrid").data("kendoGrid");
        if (isChecked) {
            grid.tbody.find(".k-checkbox").prop("checked", true);
        } else {
            grid.tbody.find(".k-checkbox").prop("checked", false);
        }
    });   

});