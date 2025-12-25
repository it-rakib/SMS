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
                url: "/Company/GetGridData",
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
                //fields: {
                //    Id: { type: "number" },
                //    Code: { type: "string" },
                //    VendorName: { type: "string" },
                //    Remarks: { type: "string" },
                //    SubTotal: { type: "number" },
                //    SubtotalVAT: { type: "number" },
                //    Total: { type: "number" },
                //    TransactionDate: { type: "date" }
                //}
            }
        }
    });
    $("#CompanyLists").kendoGrid({
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
            fileName: "Company.xlsx",
            filterable: true
        },
        search: {
            fields: ["companyName", "city"]
        },
        columns: [
            // {
            //     selectable: true, width: 50
            // },
            {
                title: "Action",
                width: 60,
                template: function (dataItem) { 
                    return "<a href='/Company/Edit/" + dataItem.companyID + "' class='btn btn-primary btn-sm mr-2 edit'>" +
                        "<i class='fas fa-pencil-alt'></i>" +
                        "</a>";
                }
            },

            {
                field: "companyID", width: 150, hidden: true, sortable: true
            },
            {
                field: "companyName", title: "Company Name", width: 150, sortable: true
            },
            {
                field: "address", title: "Address", sortable: true, width: 150
            },
            {
                field: "city", title: "City", sortable: true, width: 200
            },
            {
                field: "telephoneNo", title: "Telephone No", sortable: true, width: 200
            }

        ],
        editable: false,
        selectable: "row",
        navigatable: true,
        columnMenu: true
    });
    $(".kTextbox").each(function () {
        $(this).addClass("k-textbox");
        $(this).css("width", "100%");
    });

    $(".kTextArea").kendoTextArea({
        rows: 4,
        maxLength: 200,
        placeholder: "Write Here..."
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


    //Text Box 
    $("#CompanyName").kendoTextBox();
    $("#TelephoneNo").kendoTextBox();
    $("#FaxNo").kendoTextBox();
    $("#Email").kendoTextBox();
    $("#ZipCode").kendoTextBox();
    $("#ContactPerson").kendoTextBox();
    $("#ContactPersonDesignation").kendoTextBox();
    $("#ContactPersonTelephone").kendoTextBox();
    $("#ContactPersonEmail").kendoTextBox();
    $("#CompanyLegalName").kendoTextBox();
});