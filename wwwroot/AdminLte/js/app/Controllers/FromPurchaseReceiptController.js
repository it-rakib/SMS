var FromPurchaseReceiptController = function (CommonService, ModalService, FromPurchaseReceiptService) {



    var init = function () {
        //LoadCombo("Branchs", '/Common/Branch');
        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }


        //var $table = $('#PurchaseReceiptItemLists');
        //initEditTable($table);
        //var table = initEditTable($table, { searchHandleAfterEdit: false });


        //TotalCalculation();

        //$table.on('click', '.remove-row-btn', function () {
        //    TotalCalculation();
        //});




        //$('#PORAddRow').on('click', function () {
        //    addRow($table);
        //});


        $('.btn-vendor').on('click', function () {
            var originalRef = $(this);
            CommonService.vendorNumberModal({}, fail, function (row) { modalVendorSetDblClick(row, originalRef) });

        });


        //$('.btn-shiptolocation').on('click', function () {
        //    var originalRef = $(this);
        //    ModalService.shipToLocationModal({}, fail, function (row) { modalShipToLocationSetDblClick(row, originalRef) });

        //});
        //$('.btn-billtolocation').on('click', function () {
        //    var originalRef = $(this);
        //    ModalService.shipToLocationModal({}, fail, function (row) { modalBillToLocationSetDblClick(row, originalRef) });

        //});
        //$('.btn-termscode').on('click', function () {
        //    var originalRef = $(this);
        //    ModalService.termsCodeModal({}, fail, function (row) { modalTermsCodeSetDblClick(row, originalRef) });

        //});
        //$('.btn-vendoraccset').on('click', function () {
        //    var originalRef = $(this);
        //    ModalService.vendorAccSetModal({}, fail, function (row) { modalVendorAccSetDblClick(row, originalRef) });

        //});
        //$('.btn-shipvia').on('click', function () {
        //    var originalRef = $(this);
        //    ModalService.shipViaModal({}, fail, function (row) { modalShipViaSetDblClick(row, originalRef) });

        //});

        //$('.btn-template').on('click', function () {
        //    var originalRef = $(this);
        //    ModalService.sageTemplateModal({}, fail, function (row) { modalSgaeTemplateDblClick(row, originalRef) });

        //});
        //$('#PurchaseReceiptItemLists').on('click', ".ItemNo", function () {
        //    var originalRow = $(this);
        //    CommonService.itemNumberModal({}, fail, function (row) { itemModalDblClick(row, originalRow) });

        //});
        //$('#PurchaseReceiptItemLists').on('click', ".Location", function () {

        //    var itemNo = $(this).closest("tr").find("td:eq(0)").text()

        //    var itemNo = itemNo.trim();

          


        //    var originalRow = $(this);
        //    CommonService.locationModal({}, fail, function (row) { locationModalDblClick(row, originalRow) }, itemNo);

        //});


        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });


        //$('#Post').on('click', function () {

        //    SelectData(true);

        //});

        //$('#Push').on('click', function () {

        //    SelectData(false);

        //});


        //for receipt



        $('#SelectReceipt').on('click', function () {

            SelectReceiptData();

        });
        



        //var indexConfig = GetIndexTable();
        //var indexTable = $("#POReceiptsLists").DataTable(indexConfig);


        //enter for location

        //$('#PurchaseReceiptItemLists').on('keypress', "input.txtLocation", function (event) {
        //    //if (event.key !== "Enter") return;
        //    //var originalRow = $(this);
        //    //table.handleAfterEditWithVal(originalRow);

        //    if (event.key === "Enter") {

        //        var value = $(this).val();
        //        var originalRow = $(this);

        //        LocationDescCall(value, originalRow);

        //    }

        //});
        //function LocationDescCall(value, originalRow) {

        //    var { error } = table.validateField(originalRow);
        //    if (error) return;

        //    POReceiptsServices.LocationNocall(value,
        //        function (result) {

        //            var locationNo = result.data[0].location;

        //            if (locationNo == null || locationNo == "") {

        //                ShowNotification(3, "Location is not correct");

        //            } else {

        //                table.handleAfterEdit(originalRow);
        //            }


        //        },
        //        LocationNocallFail);



        //}


        //function LocationNocallFail(result) {
        //    console.log(result);
        //    ShowNotification(3, "Something gone wrong");
        //}



        ////end of location


        ////enter for searching of item

        //$('#PurchaseReceiptItemLists').on('keypress', "input.txtItemNo", function (event) {
        //    if (event.key === "Enter") {
        //        var value = $(this).val();
        //        var originalRow = $(this);


        //        ItemDescCall(value, originalRow);
        //    }

        //});

        //function ItemDescCall(value, originalRow) {

        //    var { error } = table.validateField(originalRow);
        //    if (error) return;

        //    POReceiptsServices.ItemNocall(value,
        //        function (result) {

        //            var ItemNo = result.data[0].itemNumber;
        //            var itemUnformatted = result.data[0].itemUnformatted;


        //            if (ItemNo == null || ItemNo == "") {
        //                originalRow.closest("tr").find("td:eq(1)").text("");
        //                ShowNotification(3, "Item no is not correct");
        //            } else {

        //                //var itemUnfrmt = row.find("td:eq(1)").text();

        //                //originalRow.closest("tr").find("td:eq(1)").find("input").val(result.data[0].description);
        //                originalRow.closest("tr").find("td:eq(1)").text(result.data[0].description);
        //                originalRow.closest("tr").find("td:eq(2)").text(result.data[0].itemUnformatted);

        //                //originalRef.closest('td').next().next().text(itemUnfrmt);


        //                table.handleAfterEdit(originalRow);
        //            }


        //        },
        //        ItemNocallFail);



        //}
        //function ItemNocallFail(result) {
        //    console.log(result);
        //    ShowNotification(3, "Something gone wrong");
        //}

        ////end



        ////subtotal
        //$('#PurchaseReceiptItemLists').on('blur', ".td-Quantity-Receive", function (event) {

        //    computeSubtotal($(this));


        //});

        //$('#PurchaseReceiptItemLists').on('blur', ".td-Unit-Cost", function (event) {


        //    computeSubtotal($(this));

        //});

        //function computeSubtotal(row) {
        //    try {
        //        var qty = parseFloat(row.closest("tr").find("td:eq(5)").text().replace(',', ''));
        //        var unitCost = parseFloat(row.closest("tr").find("td:eq(6)").text().replace(',', ''));



        //        if (!isNaN(qty * unitCost)) {
        //            var val = Number(parseFloat(qty * unitCost).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });

        //            row.closest("tr").find("td:eq(7)").text(val);


        //            TotalCalculation();

        //        }
        //    } catch (ex) {

        //    }
        //}



        //function TotalCalculation() {
        //    var SubTotal = 0;
        //    var QuantityTotal = 0;


        //    SubTotal = getColumnSumAttr('Subtotal', 'PurchaseReceiptItemLists').toFixed(2);
        //    QuantityTotal = getColumnSumAttr('Quantity Receive', 'PurchaseReceiptItemLists').toFixed(2);


        //    $("#TotalAmount").val(Number(parseFloat(SubTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
        //    $("#QuantityAmount").val(Number(parseFloat(QuantityTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
        //    //$("#TotalAmount").val(SubTotal);
        //    //$("#QuantityAmount").val(QuantityTotal);


        //}
        ////end of subtotal


        var indexTable = POPurchaseReceiptTable();



        //$('.btnSave').click(function () {
        //    save($table);
        //});

        //$('.btnPost').click('click', function () {
        //    var preceiptMaster = serializeInputs("frm_PurchaseReceipt");
        //    if (preceiptMaster.IsPost == "Y") {
        //        ShowNotification(3, "Data already Posted!");
        //    }
        //    else {
        //        preceiptMaster.IDs = preceiptMaster.Id;
        //        POReceiptsServices.APMultiplePost(preceiptMaster, APMultiplePost, APMultiplePostFail);

        //    }


        //});

        //$('.btnPush').click('click', function () {
        //    var preceiptMaster = serializeInputs("frm_PurchaseReceipt");

        //    preceiptMaster.IDs = preceiptMaster.Id;
        //    if (preceiptMaster.IsPush == "Y") {
        //        ShowNotification(3, "Data already Pushed!");

        //    }
        //    else {
        //        preceiptMaster.IDs = preceiptMaster.Id;
        //        POReceiptsServices.APMultiplePush(preceiptMaster, APMultiplePush, APMultiplePushFail);


        //    }


        //});



        $("#indexSearch").click(function () {
            var ReceiptDate = $("#ReceiptDate").val();
            var data = $("#Branchs").val();
            if (data == "xx") {
                ShowNotification(3, "Please Select Branch Type First");
                return;
            }
            indexTable.draw();
        });



    }



    //end of init function
    function SelectReceiptData() {
        var IDs = [];



        var $Items = $(".dSelected:input:checkbox:checked");

        if ($Items == null || $Items.length == 0) {
            ShowNotification(3, "You are requested to Select checkbox!");

            return;

        }
        $Items.each(function () {
            var ID = $(this).attr("data-Id");
            IDs.push(ID);
        });



        var model = {
            IDs: IDs,

        }

        var dataTable = $('#POReceiptsLists').DataTable();

        var rowData = dataTable.rows().data().toArray();

        var filteredData = rowData.filter(x => IDs.includes(x.id.toString()));
        //console.log(filteredData)

        var distinctVendorNos = [...new Set(filteredData.map(x => x.vendorNumber))];

        if (distinctVendorNos.length > 1) {
            ShowNotification(2, "Select Same Vendor For Multiple PO!'");

            return;
        }


        var form = $('<form>').attr('method', 'post').attr('action', '/PurchaseInvoice/MultipleReceiptGetData');
        $.each(model, function (key, value) {
            if ($.isArray(value)) {
                // If the value is an array, create a form field for each element
                $.each(value, function (index, element) {
                    var input = $('<input>').attr('type', 'text').attr('name', key).val(element);
                    form.append(input);
                });
            } else {
                // Otherwise, create a form field for the property
                var input = $('<input>').attr('type', 'text').attr('name', key).val(value);
                form.append(input);
            }
        });

        // Submit the form
        $('body').append(form);
        form.submit();

        //var form = $('<form>').attr('method', 'post').attr('action', '/PurchaseReceipt/MultipleReceiptGetData');
        //$.each(model, function (key, value) {
        //    // Create a form field for the property
        //    var input = $('<input>').attr('type', 'text').attr('name', key).val(value);
        //    form.append(input);
        //});

        //// Submit the form
        //$('body').append(form);
        //form.submit();


    }



    //function SelectData(IsPost) {

    //    var IDs = [];
    //    var $Items = $(".dSelected:input:checkbox:checked");

    //    if ($Items == null || $Items.length == 0) {
    //        ShowNotification(3, "You are requested to Select checkbox!");

    //        return;

    //    }
    //    $Items.each(function () {
    //        var ID = $(this).attr("data-Id");
    //        IDs.push(ID);
    //    });

    //    var model = {
    //        IDs: IDs,

    //    }
    //    var dataTable = $('#POReceiptsLists').DataTable();

    //    var rowData = dataTable.rows().data().toArray();
    //    var filteredData = [];
    //    var filteredData1 = [];
    //    if (IsPost) {
    //        filteredData = rowData.filter(x => x.isPost === "Y" && IDs.includes(x.id.toString()));

    //    }
    //    else {
    //        filteredData = rowData.filter(x => x.isPush === "Y" && IDs.includes(x.id.toString()));
    //        filteredData1 = rowData.filter(x => x.isPost === "N" && IDs.includes(x.id.toString()));
    //    }



    //    if (IsPost) {
    //        if (filteredData.length > 0) {

    //            ShowNotification(3, "Data is already posted!");

    //            return;
    //        }

    //    }
    //    else {
    //        if (filteredData.length > 0) {
    //            ShowNotification(2, "Please select 'Invoice Not Pushed Yet!'");

    //            return;
    //        }
    //        if (filteredData1.length > 0) {
    //            ShowNotification(2, "Please select 'Invoice Already Posted!'");

    //            return;
    //        }
    //    }


    //    if (IsPost) {
    //        POReceiptsServices.APMultiplePost(model, APMultiplePost, APMultiplePostFail);


    //    }
    //    else {
    //        POReceiptsServices.APMultiplePush(model, APMultiplePush, APMultiplePushFail);

    //    }





    //}

    //function APMultiplePost(result) {
    //    console.log(result.message);

    //    if (result.status == "200") {
    //        ShowNotification(1, result.message);

    //        $("#IsPost").val('Y');


    //        dataTable = $('#POReceiptsLists').DataTable();
    //        dataTable.draw();


    //    }
    //    else if (result.status == "400") {
    //        ShowNotification(3, result.error);
    //    }
    //    else if (result.status == "199") {
    //        ShowNotification(1, result.message);
    //    }
    //}

    //function APMultiplePostFail(result) {
    //    console.log(result.message);
    //    ShowNotification(3, result.message);
    //    dataTable = $('#POReceiptsLists').DataTable();
    //    dataTable.draw();
    //}





    //function APMultiplePush(result) {
    //    console.log(result.message);

    //    if (result.status == "200") {
    //        ShowNotification(1, result.message);

    //        $("#IsPush").val('Y');


    //        dataTable = $('#POReceiptsLists').DataTable();
    //        dataTable.draw();


    //    }
    //    else if (result.status == "400") {
    //        ShowNotification(3, result.error);
    //    }
    //    else if (result.status == "199") {
    //        ShowNotification(1, result.message);
    //    }
    //}

    //function APMultiplePushFail(result) {
    //    console.log(result.message);
    //    ShowNotification(3, result.message);
    //    dataTable = $('#POReceiptsLists').DataTable();
    //    dataTable.draw();
    //}




    //function itemModalDblClick(row, originalRef) {
    //    var itemCode = row.find("td:first").text();
    //    originalRef.closest("td").find("input").val(itemCode);

    //    var itemDescription = row.find("td:eq(2)").text();
    //    var itemunitofmeasure = row.find("td:eq(5)").text();


    //    originalRef.closest('td').next().text(itemDescription);
    //    originalRef.closest('td').next('td').next('td').next('td').next().text(itemunitofmeasure);

    //    $("#itemModal").modal("hide");
    //    originalRef.closest("td").find("input").focus();
    //}
    //function locationModalDblClick(row, originalRef) {

    //    var locationCode = row.find("td:first").text();
    //    originalRef.closest("td").find("input").val(locationCode);




    //    $("#locationModal").modal("hide");
    //    originalRef.closest("td").find("input").focus();


    //}
    //function modalSgaeTemplateDblClick(row, originalRow) {

    //    var templateCode = row.find("td:first").text();
    //    var templateDescription = row.find("td:eq(1)").text();

    //    originalRow.closest("div.input-group").find("input").val(templateCode);
    //    originalRow.closest("div.input-group").find("input").focus();

    //    $("#TempateDescription").val(templateDescription);

    //    $("#templateModal").modal("hide");
    //}




    function modalVendorSetDblClick(row, originalRow) {

        var vendorCode = row.find("td:first").text();
        var vendornName = row.find("td:eq(2)").text();




        originalRow.closest("div.input-group").find("input").val(vendorCode);
        originalRow.closest("div.input-group").find("input").focus();


        $("#VendorName").val(vendornName);
        $("#VendorNumber").val(vendorCode);



        $("#vendorModal").modal("hide");
    }
    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }


    //function modalShipToLocationSetDblClick(row, originalRow) {

    //    var ship = row.find("td:first").text();
    //    var shipDescription = row.find("td:eq(1)").text();

    //    originalRow.closest("div.input-group").find("input").val(ship);
    //    originalRow.closest("div.input-group").find("input").focus();


    //    $("#ShipDescription").val(shipDescription);

    //    $("#shipModal").modal("hide");
    //}
    //function modalBillToLocationSetDblClick(row, originalRow) {

    //    var billLocation = row.find("td:first").text();
    //    var billDescription = row.find("td:eq(1)").text();

    //    originalRow.closest("div.input-group").find("input").val(billLocation);
    //    originalRow.closest("div.input-group").find("input").focus();


    //    $("#BillDescription").val(billDescription);

    //    $("#shipModal").modal("hide");
    //}
    //function modalTermsCodeSetDblClick(row, originalRow) {

    //    var termsCode = row.find("td:first").text();
    //    var termsDescription = row.find("td:eq(1)").text();

    //    originalRow.closest("div.input-group").find("input").val(termsCode);
    //    originalRow.closest("div.input-group").find("input").focus();


    //    $("#TermsDescrtption").val(termsDescription);

    //    $("#termsModal").modal("hide");
    //}
    //function modalVendorAccSetDblClick(row, originalRow) {

    //    var vendorAccountCode = row.find("td:first").text();
    //    var vendornAccountDescription = row.find("td:eq(1)").text();

    //    originalRow.closest("div.input-group").find("input").val(vendorAccountCode);
    //    originalRow.closest("div.input-group").find("input").focus();


    //    $("#VendorAcctDescrition").val(vendornAccountDescription);

    //    $("#vendorAccSetModal").modal("hide");
    //}
    //function modalShipViaSetDblClick(row, originalRow) {

    //    var shipviaCode = row.find("td:first").text();
    //    var shipvaiName = row.find("td:eq(1)").text();

    //    originalRow.closest("div.input-group").find("input").val(shipviaCode);
    //    originalRow.closest("div.input-group").find("input").focus();


    //    $("#ShipViaDescription").val(shipvaiName);

    //    $("#shipviaModal").modal("hide");
    //}


    //function save($table) {


    //    var validator = $("#frm_PurchaseReceipt").validate();
    //    var result = validator.form();

    //    if (!result) {
    //        validator.focusInvalid();
    //        return;
    //    }
    //    if (hasInputFieldInTableCells($table)) {
    //        ShowNotification(3, "Complete Details Entry");
    //        return;

    //    };
    //    if (!hasLine($table)) {
    //        ShowNotification(3, "Complete Details Entry");
    //        return;

    //    };

    //    var purchaseMaster = serializeInputs("frm_PurchaseReceipt");
    //    var purchaseDetails = serializeTable($table);


    //    if (purchaseMaster.IsPush == 'Y') {
    //        ShowNotification(3, "Update cannot be performed because the data has already been pushed.");
    //        return;
    //    }


        

    //    var requiredFields = ['ItemNo', 'Location', 'QuantityReceive', 'UnitCost'];
    //    var fieldMappings = {
    //        'ItemNo': 'Item Number',
    //        'Location': 'Location',
    //        'QuantityReceive': 'Quantity Receive',
    //        'UnitCost': 'Unit Cost'
    //    };
    //    var errorMessage = getRequiredFieldsCheckObj(purchaseDetails, requiredFields, fieldMappings);
    //    if (errorMessage) {
    //        ShowNotification(3, errorMessage);
    //        return;

    //    }



    //    purchaseMaster.POReceiptDetailsList = purchaseDetails;

    //    POReceiptsServices.save(purchaseMaster, saveDone, saveFail);





    //}

    //function saveDone(result) {
    //    debugger
    //    if (result.status == "200") {
    //        if (result.data.operation == "add") {
    //            ShowNotification(1, result.message);
    //            $(".btnSave").html('Update');
    //            $(".btnSave").addClass('sslUpdate');
    //            $("#Id").val(result.data.id);
    //            $("#Code").val(result.data.code);

    //            $("#BranchId").val(result.data.branchId);


    //            $("#divUpdate").show();

    //            $("#divSave").hide();

    //            $("#SavePost, #SavePush").show();


    //            result.data.operation = "update";
    //            $("#Operation").val(result.data.operation);

    //        } else {
    //            ShowNotification(1, result.message);

    //            $("#divSave").hide();

    //            $("#divUpdate").show();

    //        }
    //    }
    //    else if (result.status == "400") {
    //        ShowNotification(3, result.message || result.error); 
    //    }
    //    else if (result.status == "199") {
    //        ShowNotification(3, result.message || result.error); 
    //    }
    //}

    //function saveFail(result) {
    //    console.log(result);
    //    ShowNotification(3, "Something gone wrong");
    //}


    var POPurchaseReceiptTable = function () {

        $('#POReceiptsLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#POReceiptsLists thead');


        var dataTable = $("#POReceiptsLists").DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            serverSide: true,
            "processing": true,
            "bProcessing": true,
            dom: 'lBfrtip',
            bRetrieve: true,
            searching: false,



            buttons: [
                {
                    extend: 'pdfHtml5',
                    customize: function (doc) {
                        doc.content.splice(0, 0, {
                            text: ""
                        });
                    },
                    exportOptions: {
                        columns: [1, 2, 3, 4]
                    }
                },
                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: [1, 2, 3, 4]
                    }
                },
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [1, 2, 3, 4]
                    }
                },
                'csvHtml5'
            ],






            ajax: {
                url: '/PurchaseReceipt/_toPurchaseReceipt',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),


                            "vendor": $("#VendorNumber").val(),


                            "code": $("#md-Code").val(),
                            "vendornumber": $("#md-VendorNumber").val(),
                            "post": $("#md-Post").val(),
                            "push": $("#md-Push").val()



                        });
                }
            },
            columns: [

                {
                    data: "id",
                    render: function (data) {


                        return "<a href=/PurchaseReceipt/Edit/" + data + " class='edit' ></a>   " +
                            "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"
                            ;
                    },
                    "width": "5%",
                    "orderable": false
                },
                {
                    data: "code",
                    name: "code"
                    //"width": "20%"
                }
                ,
                {
                    data: "vendorName",
                    name: "VendorName"
                    //"width": "20%"
                }
                ,
                {
                    data: "vendorNumber",
                    name: "VendorNumber"
                    //"width": "20%"
                }
                
                ,
                {
                    data: "isPush",
                    name: "push"
                    //"width": "20%"
                }

            ]

        });


        if (dataTable.columns().eq(0)) {

            dataTable.columns().eq(0).each(function (colIdx) {
                // Set the header cell to contain the input element
                var cell = $('.filters th').eq($(dataTable.column(colIdx).header()).index());

                var title = $(cell).text();

                // Check if the current header cell has a class of "action"
                if ($(cell).hasClass('action')) {
                    $(cell).html(''); // Set the content of the header cell to an empty string
                }

                //else if ($(cell).hasClass('bool')) {

                //    $(cell).html('<select class="acc-filters filter-input " style="width:100%"  id="md-' + title.replace(/ /g, "") + '"><option>Select</option><option>Y</option><option>N</option></select>');

                //}


                else {
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');
                }
            });

        }

        $("#POReceiptsLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#POReceiptsLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    return {
        init: init
    }

}(CommonService, ModalService, FromPurchaseReceiptService);