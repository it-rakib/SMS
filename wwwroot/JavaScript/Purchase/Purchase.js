$(document).ready(function () {

    //Kendo Switch for Is Active
    $("#chkIsStatus").kendoSwitch({
        messages: {
            checked: "YES",
            unchecked: "NO"
        }
    });

    //Purchase Index/Grid
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
                url: "/Purchase/GetAllPurchaseData",
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
                id: "Id",
                fields: {
                    Id: { type: "number" },
                    Code: { type: "string" },
                    VendorName: { type: "string" },
                    Remarks: { type: "string" },
                    SubTotal: { type: "number" },
                    SubtotalVAT: { type: "number" },
                    Total: { type: "number" },
                    TransactionDate: { type: "date" }
                }
            }
        },
        aggregate: [
            { field: "subTotal", aggregate: "sum" },
            { field: "subtotalVAT", aggregate: "sum" },
            { field: "total", aggregate: "sum" }
        ]
    });

    $("#kPurchaseGrid").kendoGrid({
        dataSource: [],
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
        detailInit: detailInitProduct,
        sortable: true,
        resizable: true,
        reorderable: true,
        groupable: true,
        toolbar: ["excel", "pdf", "search"],
        excel: {
            fileName: "Purchase Excel.xlsx",
            filterable: true
        },
        search: {
            fields: ["code", "vendorName"]
        },
        columns: [
            {
                selectable: true, width: 50
            },
            {
                command: [{
                    name: "edit", text: "", iconClass: "k-icon k-i-edit", className: "md-btn md-btn-flat md-btn-flat-primary", click: ClickEventForEditButton
                }], title: "&nbsp;", width: 80
            },
            {
                field: "purchaseId", title: "ID", width: 150, hidden: true, sortable: true
            },
            {
                field: "code", title: "Code", sortable: true, width: 150
            },
            {
                field: "transactionDate", title: "Transaction Date", sortable: true, width: 200, template: '#= kendo.toString(kendo.parseDate(transactionDate), "dd-MMM-yyyy") #', filterable: {
                    ui: "datepicker"
                }
            },
            {
                field: "vendorName", title: "Vendor", sortable: true, width: 200
            },
            {
                field: "remarks", title: "Remarks", sortable: true, width: 150, footerTemplate: "Total:",
                template: function (dataItem) {
                    return dataItem.remarks !== null ? dataItem.remarks : "N/A";
                }
            },
            {
                field: "subTotal", title: "Sub-Total", sortable: true, width: 150, attributes: { style: "text-align: right" }, "footerTemplate": "#: data.subTotal ? sum: 0 #"
            },
            {
                field: "subtotalVAT", title: "Subtotal VAT", sortable: true, width: 150, attributes: { style: "text-align: right" }, "footerTemplate": "#: data.subtotalVAT ? sum: 0 #"
            },
            {
                field: "total", title: "Total", sortable: true, width: 150, attributes: { style: "text-align: right" }, "footerTemplate": "#: data.total ? sum: 0 #"
            }

        ],
        editable: false,
        selectable: "row",
        navigatable: true,
        columnMenu: true
    });

    //Purchase Grid Select all checkbox
    $("#kPurchaseGrid").on("click", ".k-header .k-checkbox", function () {
        var isChecked = $(this).is(":checked");
        var grid = $("#kPurchaseGrid").data("kendoGrid");
        if (isChecked) {
            grid.tbody.find(".k-checkbox").prop("checked", true);
        } else {
            grid.tbody.find(".k-checkbox").prop("checked", false);
        }
    });

    // Post Data Example
    $("#btnPost").on("click", function () {
        var checkedPurchaseIds = getCheckedPurchaseIds();
        console.log("Checked purchase IDs:", checkedPurchaseIds);
        // Here you work with those IDs
    });

    //Export Data
    $("#btnExport").on("click", function () {

        var checkedPurchaseIds = [];
        checkedPurchaseIds = getCheckedPurchaseIds();
        if (checkedPurchaseIds.length <= 0) {
            alert("You are requested to Select before Export!");
            return;
        }
        else {
            GetPurchaseById(checkedPurchaseIds, function (purchaseObjs) {
                exportToExcel(purchaseObjs);
            });
        }

    });

    //Product Details Grid    
    var detailsDataSource = new kendo.data.DataSource({
        data: [],
        schema: {
            model: {
                id: "Id",
                fields: {
                    //ProductName: { type: "string" },
                    id: { type: "number" },
                    aPurchaseHeaderId: { type: "number" },
                    productId: { type: "number" },
                    productName: { type: "string" },
                    code: { type: "string" },
                    uom: { type: "string" },
                    uoMn: { type: "string" },
                    uoMc: { type: "number" },
                    packSize: { type: "string" },
                    quantity: { type: "number" },
                    unitPrice: { type: "number" },
                    subTotal: { type: "number" },
                    vatRate: { type: "number" },
                    vatAmount: { type: "number" },
                    total: { type: "number" },

                }
            }
        }
    });
    $("#detailsGrid").kendoGrid({
        dataSource: detailsDataSource,
        toolbar: [
            { name: "create", text: "Add Products" }
        ],
        columns: [
            { field: "aPurchaseDetailId", hidden: true },
            { field: "aPurchaseHeaderId", hidden: true },
            { field: "productName", title: "Product", attributes: { style: "text-align: center" }, editor: productNameDropDownEditor, template: "#=productName#", width: 230 },
            { field: "ProductID", title: "ProductID", hidden: true },
            {
                field: "uom", title: "UOM", width: 120, attributes: { style: "text-align: center", class: "cUOM" }, editor: function (container, options) {
                    $('<input class="k-textbox" readonly="readonly" />').appendTo(container).val(options.model.uom);
                }
            },
            { field: "uoMn", title: "Pack Size", width: 200, editor: packSizeDropDownEditor, template: "#=uoMn#", attributes: { "class": "packSizeColumn" } },
            {
                field: "uoMc", title: "UOM Con.", width: 120, attributes: { style: "text-align: right" }, editor: function (container, options) {
                    $('<input class="k-textbox" readonly="readonly" />').appendTo(container).val(options.model.uoMc);
                }
            },
            {
                field: "quantity",
                title: "Quantity",
                width: 160,
                attributes: { style: "text-align: right" }
                //editor: function (container, options) {
                //    $('<input name="quantity" class="k-textbox" data-role="maskedtextbox" data-mask="0,000,000" />').appendTo(container).val(options.model.quantity);
                //}
            },
            {
                field: "unitPrice", title: "Unit Price", width: 160, format: "{0:N2} ৳", attributes: { style: "text-align: right" }
                //editor: function (container, options) {
                //    $('<input name="unitPrice" class="k-textbox" data-role="maskedtextbox" data-mask="0,000,000.00" />').appendTo(container).val(options.model.unitPrice);
                //}
            },
            {
                field: "subTotal", title: "Sub-Total", width: 140, format: "{0:N2} ৳", attributes: { style: "text-align: right" }, editor: function (container, options) {
                    $('<input class="k-textbox" readonly="readonly" />').appendTo(container).val(options.model.subTotal);
                }
            },
            {
                field: "vatRate", title: "VAT Rate", width: 120, format: "{0:N2} %", attributes: { style: "text-align: right" }, editor: function (container, options) {
                    $('<input class="k-textbox" readonly="readonly" />').appendTo(container).val(options.model.vatRate);
                }
            },
            {
                field: "vatAmount", title: "VAT Amount", width: 140, format: "{0:N2} ৳", attributes: { style: "text-align: right" }, editor: function (container, options) {
                    $('<input class="k-textbox" readonly="readonly" />').appendTo(container).val(options.model.vatAmount);
                }
            },
            {
                field: "total", title: "Total", width: 140, format: "{0:N2} ৳", attributes: { style: "text-align: right" }, editor: function (container, options) {
                    $('<input class="k-textbox" readonly="readonly" />').appendTo(container).val(options.model.total);
                }
            },
            {
                command: [
                    { name: "destroy", text: "", title: "&nbsp;", width: 130 }
                ]
            }
        ],
        editable: true,
        edit: function (e) {
            var model = e.model;
            e.container.find("input[name='unitPrice'],input[name='quantity']").on("input", function () {
                var quantity = parseFloat(model.quantity);
                var vatRate = parseFloat(model.vatRate);
                var unitPrice = parseFloat($(this).val());
                if (!isNaN(quantity) && !isNaN(unitPrice)) {
                    var subTotal = parseFloat((quantity * unitPrice).toFixed(2));
                    model.set("subTotal", subTotal);
                    var vatAmount = parseFloat(((vatRate / 100) * subTotal).toFixed(2));
                    model.set("vatAmount", vatAmount);
                    var total = e.model.subTotal + e.model.vatAmount;
                    model.set("total", total);
                }
                CalculateAndSetSubTotalSum();
            });
        }

    });

    var productDetailObjs = new kendo.data.DataSource({

        transport: {
            read: {
                url: "/Purchase/GetAllProductData",
                dataType: "json"
            }
        }
        ,
        schema: {
            model: {
                id: "productId",
                fields: {
                    productName: { type: "string" },
                    productId: { type: "number" },
                    code: { type: "string" },
                    quantity: { type: "number" },
                    unitPrice: { type: "number" },
                    subTotal: { type: "number" },
                    vatRate: { type: "number" },
                    vatAmount: { type: "number" },
                    total: { type: "number" },
                    uom: { type: "string" }
                }
            }
        }

    });
    productDetailObjs.read();

    //Kendo Validator
    $("#purchaseForm").kendoValidator().data("kendoValidator");

    //PackSize Change Event
    $("#detailsGrid").on("click", ".packSizeColumn", function (e) {
        e.preventDefault();
        var row = $(this).closest("tr");
        var grid = $("#detailsGrid").data("kendoGrid");
        var model = grid.dataItem(row);
        var vuom = model.uom;

        $.ajax({
            url: '/Sample/Purchase/GetUomByUOM',
            method: 'get',
            data: { vuom: vuom },
            success: function (response) {
                var dropdownInput = row.find("input[name='uoMn']");
                if (dropdownInput.length > 0) {
                    var dropdown = dropdownInput.data("kendoMultiColumnComboBox");
                    if (dropdown) {
                        dropdown.setDataSource(new kendo.data.DataSource({
                            data: response
                        }));
                    } else {
                        console.error("Kendo MultiColumnComboBox widget not initialized on the input element.");
                    }
                } else {
                    console.error("Input element with name='uom' not found in the table row.");
                }
            },
            error: function (xhr, status, error) {
                console.error('Error fetching UOM:', error);
            }
        });
    });

    GenerateDateTime();

    //Vendor MultiColumn ComboBox
    $("#AVendorId").kendoMultiColumnComboBox
        ({
            placeholder: "--Select Vendor--",
            dataTextField: "vendorName",
            dataValueField: "vendorId",
            //height: 400,
            columns: [
                { field: "vendorName", title: "Name", width: 200 },
                { field: "vendorAddress", title: "Address", width: 200 },
                { field: "vendorEmail", title: "Email", width: 200 }
            ],
            filter: "contains",
            filterFields: ["vendorName", "vendorAddress", "vendorEmail"],
            suggest: true,
            dataSource: {
                transport: {
                    read: "/Purchase/GetVendor"
                },
                group: { field: "vendorAddress" }
            },
            change: function (e) {
                e.preventDefault();
                var selectedItem = this.dataItem();
                if (selectedItem) {
                    $("#VendorAddress").val(selectedItem.vendorAddress);
                } else {
                    $("#VendorAddress").val("");
                }
            }
        }).data("kendoMultiColumnComboBox");

    //Kendo Text-Editor
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

    //kendo Modal
    $("#divModal").kendoWindow({
        visible: false, // Initially hidden
        modal: true, // Make it modal
        width: "50%", // Adjust width as needed
        title: "Add New Vendor"
    });
    $("#divVendorSearchModal").kendoWindow({
        visible: false, // Initially hidden
        modal: true, // Make it modal
        width: "50%", // Adjust width as needed
        title: "Search Vendor"
    });

    //Kendo Validator
    $("#vendorForm").kendoValidator().data("kendoValidator");

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

    //Style
    $(".kRow").each(function () {
        $(this).css("margin-bottom", "5px");
        $(this).css("margin-top", "5px");
    });
    $(".body").each(function () {
        $(this).css("margin-bottom", "5px");
        $(this).css("margin-top", "5px");
    });
    $('body').css({
        'font-size': '1.25em ! important'
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

    //Click Event
    $("#btnNew").click(function () {
        $("#divGrid").hide();
        ClearForm();
        $("#divForm").show();
        $("#btnNew").hide();
        $("#btnPost").hide();
        $("#btnUpdate").hide();
        $("#btnExport").hide();
        $("#btnSave").show();
        $("#btnIndex").show();
    });
    $("#btnIndex").click(function () {
        $("#divGrid").show();
        $("#divForm").hide();
        $("#btnSave").hide();
        $("#btnNew").show();
        $("#btnPost").show();
        $("#btnExport").show();
        $("#btnIndex").hide();
        $("#btnUpdate").hide();

    });
    $("#btnSave").click(function () {
        SavePurchase(event);

    });
    $("#btnUpdate").click(function () {
        $("#divGrid").show();
        $("#divForm").hide();
        UpdatePurchase(event);
        $("#btnIndex").hide();
        $("#btnSave").hide();
        $("#btnPost").show();
        $("#btnExport").show();
        $("#btnUpdate").hide();
    });

    // Modal button
    $("#btnVendor").click(function (e) {
        e.preventDefault();

        $("#divModal").data("kendoWindow").center().open();

        $("#btnSave").removeClass("displayNone");
        ClearVendorForm();
    });

    //Files Input
    $("#BINCertificate").kendoUpload({
        //success: function (jsonData) {
        //    var obj = new Object();
        //    obj.FileName = jsonData.files[0].name;
        //    obj.FileExtension = jsonData.files[0].extension;
        //    obj.FileSize = jsonData.files[0].size;
        //    obj.FileUniqueName = jsonData.response.FileNameUniuqe;
        //    obj.ModuleMasterId = $('#hdnFileMasterId').val();
        //    obj.ModuleName = "Legal";
        //    obj.ActionType = jsonData.response.ActionType;
        //    jsonData.files[0].fileUniq = jsonData.response.FileNameUniuqe;

        //    $(".k-file-progress .file-wrapper .view-test").html('<a href="../DocumentFile/' + obj.FileUniqueName + '" type="button" class="k-button "  target="_blank"><span class="k-button-icon k-icon k-i-eye" title="View"></span></a>');

        //    if (obj.ModuleMasterId != "0") {

        //        DocumentHelper.SaveDocumentDetails(obj);
        //    } else {
        //        files.push(obj);
        //    }
        //},
        //remove: function (e) {
        //    if (e.files !== undefined) {
        //        e.files[0].name = e.files[0].fileUniq;
        //        console.log(e);
        //    }
        //},
        //async: {
        //    chunkSize: 11000, // bytes
        //    saveUrl: "/Upload/chunksave",
        //    removeUrl: "/Upload/remove",
        //    autoUpload: true
        //},
        //template: kendo.template($('#fileTemplate').html()),
        //files: files,
        dropZone: ".dropZoneElement"
    }).data("kendoUpload");
    $("#btnSrcVendor").click(function (e) {
        e.preventDefault();
        GenerateVendorGrid();
        $("#divVendorSearchModal").data("kendoWindow").center().open();
    });

    //Vendor Event handler for row double-click
    $("#vendorGrid").on("dblclick", "tbody tr", function () {
        var grid = $("#vendorGrid").data("kendoGrid");
        var dataItem = grid.dataItem(this);
        var vendorID = dataItem.vendorId;
        var vendorData = GetVendorById(vendorID, function (vendorData) {
            $("#divVendorSearchModal").data("kendoWindow").close();

            var vendorCombo = $("#AVendorId").data("kendoMultiColumnComboBox");
            vendorCombo.value(vendorData[0].vendorId);
            $("#VendorAddress").val("");
            $("#VendorAddress").val(vendorData[0].vendorAddress);

        });

    });
    // Click event handler for the Cancel button
    $("#cancelButton").click(function () {
        // Close the modal without saving
        $("#divModal").data("kendoWindow").close();
    });
    $("#cancelVendorButton").click(function () {
        $("#divVendorSearchModal").data("kendoWindow").close();
    });
    // Click event handler for the Save button
    $("#btnSaveVendor").click(function (event) {
        SaveVendor(event);
        $("#divModal").data("kendoWindow").close();

        var data_Url = "/Purchase/GetVendor";

        // Step 1: Initialize the Kendo DataSource
        var vendorData = new kendo.data.DataSource({
            transport: {
                read: {
                    url: data_Url,
                    dataType: "json"
                }
            },
            // Optional: Specify schema if needed
            schema: {
                // Specify the schema if the response format requires it
            }
        });

        // Step 2: Fetch data from the URL
        vendorData.read().then(function () {
            // Step 3: Set the new data source for the MultiColumnComboBox

            var multiColumnComboBox = $("#AVendorId").data("kendoMultiColumnComboBox");
            multiColumnComboBox.setDataSource(vendorData);
        }).fail(function () {
            console.error("Failed to fetch data from URL:", data_Url);
        });

    });
})

//File Upload to device
function uploadFile() {
    var fileInput = document.getElementById('BINCertificate');
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('file', file);
    debugger;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/Vendor/UploadFile', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            document.getElementById('message').textContent = xhr.responseText;
        } else {
            document.getElementById('message').textContent = 'Failed to upload file.';
        }
    };
    xhr.send(formData);
}
function exportToExcel(data) {
    var columnsToKeep = ["Purchase Code", "Transaction Date", "Vendor", "Remarks", "Subtotal", "Subtotal VAT", "Total"];

    var modifiedData = data.map(function (item) {
        return {
            "Purchase Code": item.code,
            "Transaction Date": moment(item.TransactionDate).format("DD-MM-YYYY"),
            "Vendor": item.vendorName,
            "Remarks": item.remarks,
            "Subtotal": item.subTotal,
            "Subtotal VAT": item.subtotalVAT,
            "Total": item.total
        };
    });

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(modifiedData, { header: columnsToKeep });
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    // Create a download link
    var downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.style = "display: none";
    var url = window.URL.createObjectURL(new Blob([s2ab(wbout)], { type: "application/octet-stream" }));
    downloadLink.href = url;
    downloadLink.download = "Purchase Excel.xlsx";

    // Simulate click on the download link
    downloadLink.click();

    // Clean up
    window.URL.revokeObjectURL(url);
}
function getCheckedPurchaseIds() {
    var grid = $("#kPurchaseGrid").data("kendoGrid");
    var checkedPurchaseIds = [];
    grid.tbody.find(".k-checkbox:checked").each(function () {
        var row = $(this).closest("tr");
        var dataItem = grid.dataItem(row);
        checkedPurchaseIds.push(dataItem.purchaseId);
    });
    return checkedPurchaseIds;
}
function GetVendorById(vendorID, callback) {
    $.ajax({
        url: '/Sample/Purchase/GetVendorByVendorId',
        method: 'get',
        data: { vendorID: vendorID },
        success: function (response) {

            callback(response);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching Vendor:', error);
        }

    });
}
function GenerateVendorGrid() {
    var vendorGridDataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        autoSync: true,
        pageSize: 10,
        transport: {
            read: {
                url: "/Purchase/GetAllVendorData",
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
                id: "Id",
                fields: {
                }
            }
        }
    });

    $("#vendorGrid").kendoGrid({
        dataSource: vendorGridDataSource,
        pageable: false,
        noRecords: true,
        messages: {
            noRecords: "No Record Found!"
        },
        scrollable: true,
        filterable: false,
        sortable: true,
        resizable: true,
        reorderable: true,
        groupable: true,
        toolbar: ["search"],
        search: {
            fields: ["vendorCode", "vendorName"]
        },
        columns: [
            {
                field: "vendorId", title: "ID", width: 150, hidden: true, sortable: true
            },
            {
                field: "vendorCode", title: "Code", sortable: true, width: 150
            },
            {
                field: "vendorName", title: "Vendor", sortable: true, width: 200
            },
            {
                field: "vendorAddress", title: "Address", sortable: true, width: 200
            },
            {
                field: "vendorEmail", title: "Email", sortable: true, width: 150,
                template: function (dataItem) {
                    return dataItem.vendorEmail !== null ? dataItem.vendorEmail : "N/A";
                }
            },
            {
                field: "binCertificate", title: "Bin Certificate", sortable: true, width: 150
            }

        ],
        editable: false,
        selectable: "row",
        navigatable: true,
        columnMenu: true
    });

}
function GenerateDateTime() {
    // Initialize DateTimePicker
    $("#TransactionDate").kendoDateTimePicker({
        format: "dd.MM.yyyy hh:mm tt",
        dateInput: true
    });
}
function GridDataSourceProductByPurchaseId(purchaseId) {
    var detailsGridDataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: "/Purchase/GetAllPurchaseDetailData",
                type: "POST",
                dataType: "json",
                cache: false,
                data: { purchaseId: purchaseId }
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
                    subTotal: { type: "number" },
                    total: { type: "number" }
                }
            }
        },
        // schema: {
        //     model: {

        //     },
        //     data: "Items", total: "TotalCount"
        // },
        aggregate: [
            { field: "subTotal", aggregate: "sum" },
            { field: "total", aggregate: "sum" }
        ]
    });
    return detailsGridDataSource;
}
function detailInitProduct(e) {
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: GridDataSourceProductByPurchaseId(e.data.purchaseId),
        scrollable: false,
        sortable: true,
        pageable: false,
        noRecords: true,
        messages: {
            noRecords: "No Record Found!"
        },
        columns: [
            { field: "purchaseDetailId", hidden: true },
            { field: "aProductId", hidden: true },
            { field: "productName", title: "Name", sortable: true, attributes: { style: "text-align: center" } },
            { field: "quantity", title: "Quantity", sortable: true, attributes: { style: "text-align: right" } },
            { field: "unitPrice", title: "Unit Price", sortable: true, attributes: { style: "text-align: right" }, footerTemplate: "<div style='text-align:right'>Total:</div>" },
            { field: "subTotal", title: "SubTotal", sortable: true, attributes: { style: "text-align: right" }, "footerTemplate": "<div style='text-align:right'>#: data.subTotal ? sum: 0 #</div>" },
            {
                field: "vatRate", title: "VAT Rate", sortable: true, attributes: { style: "text-align: right" }
            },
            {
                field: "vatAmount", title: "VAT Amount", sortable: true, attributes: { style: "text-align: right" }
            },
            {
                field: "total", title: "Total", sortable: true, attributes: { style: "text-align: right" }, "footerTemplate": "<div style='text-align:right'>#: data.total ? sum: 0 #</div>",
                template: function (dataItem) {
                    return dataItem.total !== null ? dataItem.total : 0;
                }
            }
        ]
    });
}
function productNameDropDownEditor(container, options) {
    $('<input placeholder="--Product--" name="' + options.field + '"/>')
        .appendTo(container)
        .kendoMultiColumnComboBox({
            autoBind: false,
            dataTextField: "productName",
            dataValueField: "productName",
            columns: [
                { field: "productName", title: "Product", width: 200 },
                { field: "openingDate", title: "Opening Date", width: 200, template: '#= kendo.toString(kendo.parseDate(openingDate), "dd-MMM-yyyy") #' },
                { field: "vatRate", title: "VAT Rate", width: 200 },
                { field: "uom", title: "UOM", width: 200 }
            ],
            filter: "contains",
            filterFields: ["productName", "openingDate", "vatRate", "uom"],
            suggest: true,
            change: function (e) {
                var selectedItem = this.dataItem();
                options.model.set(options.field, selectedItem.productName);
                if (selectedItem) {
                    var vuom = selectedItem.uom;
                    var vproductId = selectedItem.productId;
                    var vvatRate = selectedItem.vatRate;

                    var grid = $("#detailsGrid").data("kendoGrid");
                    if (grid) {
                        var row = $(this.wrapper).closest("tr");
                        var model = grid.dataItem(row);
                        if (model) {
                            model.set("vatRate", vvatRate);
                            model.set("uom", vuom);
                            model.set("uoMn", vuom);
                            model.set("uoMc", 1);
                            model.set("quantity", "");
                            model.set("unitPrice", "");
                            model.set("ProductID", vproductId);
                        }
                    }
                }
                CalculateAndSetSubTotalSum();
            },
            dataSource: {
                type: "json",
                transport: {
                    read: "/Purchase/GetAllProductData",
                    dataType: "json"
                },
                group: { field: "uom" }
            }
        });
}
function packSizeDropDownEditor(container, options) {

    $('<input placeholder="--Select--" name="' + options.field + '"/>')
        .appendTo(container)
        .kendoMultiColumnComboBox({
            autoBind: false,
            dataTextField: "uomTo",
            dataValueField: "uomTo",
            columns: [

                { field: "uomFrom", title: "UOM From", width: 200 },
                { field: "uomTo", title: "UOM To", width: 200 },
                { field: "uoMc", title: "UOMc", width: 200 }
            ],
            filter: "contains",
            filterFields: ["uomFrom", "uomTo", "uoMc"],
            suggest: true,
            change: function (e) {
                e.preventDefault();
                var selectedItem = this.dataItem();
                if (selectedItem) {
                    var uomc = selectedItem.uoMc;

                    var grid = $("#detailsGrid").data("kendoGrid");

                    if (grid) {
                        var row = $(this.wrapper).closest("tr");
                        var model = grid.dataItem(row);
                        if (model) {
                            model.set("uoMc", uomc);
                        }
                    }
                }
            },
            dataSource: {

            }
        });
}
function CalculateAndSetSubTotalSum() {

    var grid = $("#detailsGrid").data("kendoGrid");
    var dataSource = grid.dataSource;
    var data = dataSource.data();
    var subtotalSum = 0;
    var vatTotalSum = 0;
    var totalSum = 0;

    for (var i = 0; i < data.length; i++) {
        subtotalSum += parseFloat(data[i].subTotal);
        vatTotalSum += parseFloat(data[i].vatAmount);
        totalSum += parseFloat(data[i].total);
    }

    $('#SubTotal').val(subtotalSum.toFixed(2));
    //$('#SubTotal').data("kendoNumericTextBox").value(subtotalSum.toFixed(2)); // Update Kendo NumericTextBox value
    $('#SubtotalVAT').val(vatTotalSum.toFixed(2));
    //$('#SubtotalVAT').data("kendoNumericTextBox").value(vatTotalSum.toFixed(2));
    $('#Total').val(totalSum.toFixed(2));
    //$('#Total').data("kendoNumericTextBox").value(totalSum.toFixed(2));
}
function GetUomByUOM(vuom, callback) {
    $.ajax({
        url: '/Sample/Purchase/GetUomByUOM',
        method: 'get',
        data: { vuom: vuom },
        success: function (response) {

            callback(response);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching UOM:', error);
        }

    });
}
function ClearForm() {
    $("#hdnPurchaseHeaderId").val(0);
    $("#Code").val("");
    $("#VendorAddress").val("");
    $("#TransactionDate").data("kendoDateTimePicker").value("");
    $("#AVendorId").data("kendoMultiColumnComboBox").value("");
    $("#editor").data("kendoEditor").value("");
    /*$("#Remarks").val("");*/
    $("#SubTotal").data("kendoMaskedTextBox").value("");
    $("#SubtotalVAT").data("kendoMaskedTextBox").value("");
    $("#Total").data("kendoMaskedTextBox").value("");

    var grid = $("#detailsGrid").data("kendoGrid");

    // Clear the dataSource
    grid.dataSource.data([]);
    // Remove validation messages
    var validator = $("#purchaseForm").kendoValidator().data("kendoValidator");
    validator.hideMessages();

    // Remove error indicators from form fields
    $("#purchaseForm").find(".k-invalid").removeClass("k-invalid"); // Remove 'k-invalid' class
    $("#purchaseForm").find(".k-invalid-msg").hide();
};
function CreatePurchaseObject() {
    var obj = new Object();
    obj.PurchaseId = $("#hdnPurchaseHeaderId").val();
    obj.Code = $("#Code").val();

    var openingDate = $("#TransactionDate").data("kendoDateTimePicker");
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
    obj.TransactionDate = formattedDate;
    obj.AVendorId = $("#AVendorId").data("kendoMultiColumnComboBox").value();
    obj.Remarks = $("#editor").data("kendoEditor").value();
    obj.SubTotal = $("#SubTotal").data("kendoMaskedTextBox").value();
    obj.SubTotalVAT = $("#SubtotalVAT").data("kendoMaskedTextBox").value();
    obj.Total = $("#Total").data("kendoMaskedTextBox").value();
    obj.PurchaseHeaderDetails = CreateProductDetailsObject();

    return obj;
}
function ClickEventForEditButton(e) {
    $("#btnSave").hide();
    $("#btnPost").hide();
    $("#btnUpdate").show();
    $("#btnIndex").show();
    $("#btnExport").hide();
    e.preventDefault();
    var grid = $("#kPurchaseGrid").data("kendoGrid");
    var tr = $(e.currentTarget).closest("tr");
    var selectedItem = this.dataItem(tr);
    grid.select(tr);
    if (selectedItem != null) {
        $("#divGrid").hide();
        $("#divForm").show();
    }
    FillPurchaseForm(selectedItem);
}
//function ClickEventForDeleteButton(e) {
//    e.preventDefault();
//    var grid = $("#kPurchaseGrid").data("kendoGrid");
//    var tr = $(e.currentTarget).closest("tr");
//    var selectedItem = this.dataItem(tr);
//    grid.select(tr);

//    if (selectedItem != null) {
//        var itemNo = selectedItem.itemNo;
//        $.ajax({

//            url: '/Sample/Product/DeleteProduct' + "?itemNo=" + itemNo, // Adjust the URL according to your routing

//            method: 'post',
//            data: itemNo,

//            success: function (response) {
//                console.log(response);
//                var grid = $("#kPurchaseGrid").data("kendoGrid");
//                grid.dataSource.read();
//                alert("Deleted Succesfully!")
//            },
//            error: function (xhr, status, error) {
//                alert("Deleted Unsuccesfully!")
//            }
//        })
//    }
//}
function FillPurchaseForm(obj) {
    $("#hdnPurchaseHeaderId").val(obj.purchaseId);
    $("#Code").val(obj.code);
    var openingDate = $("#TransactionDate").data("kendoDateTimePicker");
    openingDate.value(obj.transactionDate);
    $("#AVendorId").data("kendoMultiColumnComboBox").value(obj.aVendorId);
    $("#VendorAddress").val(obj.vendorAddress);
    $("#editor").data("kendoEditor").value(obj.remarks);
    //$("#Remarks").val(obj.remarks);
    $("#SubTotal").val(obj.subTotal);
    $("#SubtotalVAT").val(obj.subtotalVAT);
    $("#Total").val(obj.total);
    FillDetailsGrid(obj.purchaseId);
}
function CreateProductDetailsObject() {
    var productList = [];
    var productGrid = $("#detailsGrid").data("kendoGrid");
    var gridData = productGrid.dataSource.data();
    for (var i = 0; i < gridData.length; i++) {
        var detailsData = gridData[i];
        var obj = new Object();
        obj.Id = detailsData.id;
        obj.APurchaseHeaderId = $("#hdnPurchaseHeaderId").val();
        obj.AProductId = detailsData.ProductID === 0 || detailsData.ProductID === undefined ? detailsData.aProductId : detailsData.ProductID;
        obj.Quantity = detailsData.quantity;
        obj.UnitPrice = detailsData.unitPrice;
        obj.SubTotal = detailsData.subTotal;
        obj.VATRate = detailsData.vatRate;
        obj.VATAmount = detailsData.vatAmount;
        obj.Total = detailsData.total;
        obj.UOM = detailsData.uom;
        obj.UOMn = detailsData.uoMn;
        obj.UOMc = detailsData.uoMc;
        productList.push(obj);
    }
    return productList;
}
function GetAllProductByMasterId(purchaseMasterId, callback) {
    $.ajax({
        url: "/Purchase/GetAllPurchaseByMasterId/",
        method: 'get',
        data: { purchaseMasterId: purchaseMasterId },
        success: function (response) {
            callback(response);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching Data:', error);
            callback(null);
        }
    });
}
function FillDetailsGrid(purchaseMasterId) {
    var productDetailObjs = GetAllProductByMasterId(purchaseMasterId, function (productDetailObjs) {
        var productDetailSummary = $("#detailsGrid").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: productDetailObjs,
            schema: {
                model: {
                    //id: "Id",
                    fields: {
                        id: { type: "number" },
                        aPurchaseHeaderId: { type: "number" },
                        productId: { type: "number" },
                        productName: { type: "string" },
                        code: { type: "string" },
                        quantity: { type: "number" },
                        unitPrice: { type: "number" },
                        subTotal: { type: "number" },
                        vatRate: { type: "number" },
                        vatAmount: { type: "number" },
                        total: { type: "number" },
                        uom: { type: "string" },
                        uoMn: { type: "string" },
                        uoMc: { type: "number" }
                    }
                }
            }
        });
        productDetailSummary.setDataSource(gridDataSource);

    });
}
function productDropDownEditor(container, options) {

    var input = $('<input placeholder="--Select Product--" data-bind="value:' + options.field + '"/>')
        .appendTo(container);

    var comboBox = input.kendoMultiColumnComboBox({
        autoBind: true,
        dataSource: options.data,
        dataTextField: options.data.productName,
        dataValueField: options.data.productId,
        filter: "contains",
        columns: [
            { field: "productName", title: "Product", width: 200 },
            { field: "openingDate", title: "Opening Date", width: 200, template: '#= kendo.toString(kendo.parseDate(openingDate), "dd-MMM-yyyy") #' },
            { field: "vatRate", title: "VAT Rate", width: 200 },
            { field: "uom", title: "UOM", width: 200 }
        ],
        change: function (e) {
            var selectedItem = this.dataItem();
            if (selectedItem) {
                options.model.set(options.field, selectedItem.productName);

                var vuom = selectedItem.uom;
                var vproductId = selectedItem.productId;
                var vvatRate = selectedItem.vatRate;

                // Update VAT rate in the grid
                var grid = $("#detailsGrid").data("kendoGrid");
                if (grid) {
                    var row = $(this.wrapper).closest("tr");
                    var model = grid.dataItem(row);
                    if (model) {
                        model.set("vatRate", vvatRate);
                        model.set("UOM", vuom);
                        model.set("quantity", 0);
                        model.set("unitPrice", 0);
                        model.set("ProductID", vproductId);
                    }
                }
            }
        }
    }).data("kendoMultiColumnComboBox");
}
function ClearVendorForm() {
    $("#hdnVendorID").val(0);
    $("#txtVendorCode").val("");
    $("#txtVendorName").val("");
    $("#txtVendorAddress").val("");
    $("#txtEmailAddress").val("");
    $("#BINCertificate").data("kendoUpload").clearAllFiles(); // Clear the file input field
    document.getElementById('message').textContent = '';

    // Remove validation messages
    var validator = $("#vendorForm").kendoValidator().data("kendoValidator");
    validator.hideMessages();

    // Remove error indicators from form fields
    $("#vendorForm").find(".k-invalid").removeClass("k-invalid"); // Remove 'k-invalid' class
    $("#vendorForm").find(".k-invalid-msg").hide();
}
function SavePurchase(event) {
    var validator = $("#purchaseForm").kendoValidator().data("kendoValidator");
    var validationSummary = $("#validation-summary");
    event.preventDefault();
    if (validator.validate()) {
        var objPurchase = CreatePurchaseObject();

        $.ajax({
            url: '/Sample/Purchase/SavePurchase',
            method: 'post',
            data: objPurchase,
            success: function () {
                $("#divGrid").show();
                $("#btnIndex").hide();
                $("#divForm").hide();
                $("#btnSave").hide();
                $("#btnNew").show();
                $("#btnPost").show();
                $("#btnExport").show();
                var grid = $("#kPurchaseGrid").data("kendoGrid");
                grid.dataSource.read();
                alert("Save Succesfully!")
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                alert("Error: " + error);
            }
        });

    }
    else {
        validationSummary.html("<div class='k-messagebox k-messagebox-error'> Please!Give all Required Data.</div>");
    }

}
function UpdatePurchase(event) {
    var validator = $("#purchaseForm").kendoValidator().data("kendoValidator");
    var validationSummary = $("#validation-summary");
    event.preventDefault();
    if (validator.validate()) {
        var objPurchase = CreatePurchaseObject();

        $.ajax({
            url: '/Purchase/UpdatePurchase', // Adjust the URL according to your routing
            method: 'post',
            data: objPurchase,
            success: function (e) {
                var grid = $("#kPurchaseGrid").data("kendoGrid");
                grid.dataSource.read();
                alert("Update Succesfully!")
            },
            error: function (xhr, status, error) {
                console.log("Error Response:", xhr.responseText);
                alert("Error: " + error);
            }

        });
    }
    else {
        validationSummary.html("<div class='k-messagebox k-messagebox-error'> Please!Give all Required Data.</div>");
    }

}
function SaveVendor(event) {
    var objVendor = CreateVendorObject();
    event.preventDefault();
    $.ajax({
        url: '/Sample/Sample/SaveVendor',
        method: 'post',
        data: objVendor,
        success: function () {
            alert("Save Successfully!");
        },
        error: function (xhr, status, error) {
            alert("Save Unsuccessfully!");
        }
    });
}
function CreateVendorObject() {
    var obj = new Object();
    obj.Id = $("#hdnVendorID").val();
    //obj.BranchId = $("#hdnBranchId").val();
    obj.VendorCode = $("#txtVendorCode").val();
    obj.VendorName = $("#txtVendorName").val();
    obj.VendorAddress = $("#txtVendorAddress").val();
    obj.VendorEmail = $("#txtEmailAddress").val();
    obj.BINCertificate = $("#BINCertificate").val();
    //var activeSts = $("#chkIsStatus").data("kendoSwitch").value();
    // if (activeSts == false) {
    //     obj.ActiveStatus = "N";
    // }
    // else {
    //     obj.ActiveStatus = "Y";
    // }

    return obj;
}
function GetPurchaseById(checkedPurchaseIds, callback) {
    $.ajax({
        url: '/Sample/Purchase/GetPurchaseById?checkedPurchaseIds=' + checkedPurchaseIds,
        method: 'get',
        data: { checkedPurchaseIds: checkedPurchaseIds },
        success: function (response) {

            callback(response);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching Purchase:', error);
        }

    });
}