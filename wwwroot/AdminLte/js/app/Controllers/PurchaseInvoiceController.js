var PurchaseInvoiceController = function (ModalService, CommonService, PurchaseInvoiceService) {


    var init = function () {
        //modal
        var $table = $('#PurchaseInvoiceItemLists');
        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }

        var IsPost = $('#IsPost').val();
        if (IsPost === 'Y') {
            Visibility(true);
        }
        //initEditTable($table);
        var table = initEditTable($table, { searchHandleAfterEdit: false });


        TotalCalculation();

        $table.on('click', '.remove-row-btn', function () {
            TotalCalculation();
            calculateGrandTotal();
        });

        $("#download").on("click", function () {
            var fromDate = $("#FromDate").val();
            var toDate = $("#ToDate").val();
            var branchId = $("#Branchs").val();
            if (branchId === "null") {
                branchId = null;

            }
            console.log(branchId)

            // Validate the date range and branch ID
            if (fromDate === "" || toDate === "" || branchId === "") {
                alert("Please select both 'from date', 'to date', and 'branch'.");
                return;
            }

            var url = '/PurchaseInvoice/PurchaseInvoiceExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;

            var Id = $("#Id").val();

            url += '&Id=' + (Id !== null ? Id : 'null');
            var win = window.open(url, '_blank');
        });


        $('#piAddRow').on('click', function () {
            addRow($table);
        });

        $('.btn-rceiptNo').on('click', function () {
            var originalRef = $(this);
            CommonService.rceiptNomodal({}, fail, function (row) { modalrceiptNomodalDblClick(row, originalRef) });

        });
        $('.btn-InvoiceNumber').on('click', function () {
            var originalRef = $(this);
            CommonService.invoiceNumberModal({}, fail, function (row) { modalInvoiceNumberDblClick(row, originalRef) });

        });
        //$('#PurchaseInvoiceItemLists').on('click', ".ItemNo", function () {
        //    var originalRow = $(this);
        //    CommonService.itemNumberModal({}, fail, function (row) { itemModalDblClick(row, originalRow) });

        //});

        $('#PurchaseInvoiceItemLists').on('click', "input.txtItemNo", function () {
            var originalRow = $(this);

            originalRow.closest("td").find("input").data('touched', true);

            CommonService.itemNumberModal({},
                fail,
                function (row) { itemModalDblClick(row, originalRow) },
                function () {
                    originalRow.closest("td").find("input").data('touched', false);
                    originalRow.closest("td").find("input").focus();
                });

        });


        //$('#PurchaseInvoiceItemLists').on('click', ".Location", function () {

        //    var itemNo = $(this).closest("tr").find("td:eq(0)").text()

        //    var itemNo = itemNo.trim();

        //    //if (!itemNo) {
        //    //    alert('Please select a item number first.');
        //    //    return;
        //    //}


        //    var originalRow = $(this);
        //    CommonService.locationModal({}, fail, function (row) { locationModalDblClick(row, originalRow) }, itemNo);

        //});

        $('#PurchaseInvoiceItemLists').on('click', "input.txtLocation", function () {

            var itemNo = $(this).closest("tr").find("td:eq(0)").text()

            var itemNo = itemNo.trim();




            var originalRow = $(this);

            originalRow.closest("td").find("input").data('touched', true);

            CommonService.locationModal({},
                fail,
                function (row) { locationModalDblClick(row, originalRow) },
                function () {
                    originalRow.closest("td").find("input").data('touched', false);
                    originalRow.closest("td").find("input").focus();
                }, itemNo);

        });





        $('.btn-vendor').on('click', function () {
            var originalRef = $(this);
            CommonService.vendorNumberModal({}, fail, function (row) { modalVendorSetDblClick(row, originalRef) });

        });
        $('.btn-billtolocation').on('click', function () {
            var originalRef = $(this);
            ModalService.shipToLocationModal({}, fail, function (row) { modalBillToLocationSetDblClick(row, originalRef) });

        });
        $('.btn-vendoraccset').on('click', function () {
            var originalRef = $(this);
            ModalService.vendorAccSetModal({}, fail, function (row) { modalVendorAccSetDblClick(row, originalRef) });

        });
        $('.btn-APRimitTo').on('click', function () {
            var originalRef = $(this);
            CommonService.apRimitToModal({}, fail, function (row) { modalAPRimitToDblClick(row, originalRef) });

        });
        $('#PostPOI').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {
                    SelectData(true);
                }

            });

        });
        $('#PushPOI').on('click', function () {
            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {
                    SelectData(false);
                }

            });

        });
        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });

        //end init
        //var indexConfig = GetIndexTable();
        //var indexTable = $("#POInvoiceLists").DataTable(indexConfig);




        //enter for location

        $('#PurchaseInvoiceItemLists').on('keypress', "input.txtLocation", function (event) {
            //if (event.key !== "Enter") return;
            //var originalRow = $(this);
            //table.handleAfterEditWithVal(originalRow);
            if (event.key === "Enter") {

                var value = $(this).val();
                var originalRow = $(this);

                LocationDescCall(value, originalRow);

            }

        });
        function LocationDescCall(value, originalRow) {

            var { error } = table.validateField(originalRow);
            if (error) return;

            PurchaseInvoiceService.LocationNocall(value,
                function (result) {

                    var locationNo = result.data[0].location;

                    if (locationNo == null || locationNo == "") {

                        ShowNotification(3, "Location is not correct");

                    } else {

                        table.handleAfterEdit(originalRow);
                    }


                },
                LocationNocallFail);



        }


        function LocationNocallFail(result) {
            console.log(result);
            ShowNotification(3, "Something gone wrong");
        }



        //end of location




        //enter for searching of item

        $('#PurchaseInvoiceItemLists').on('keypress', "input.txtItemNo", function (event) {
            if (event.key === "Enter") {
                var value = $(this).val();
                var originalRow = $(this);


                ItemDescCall(value, originalRow);
            }

        });

        function ItemDescCall(value, originalRow) {

            var { error } = table.validateField(originalRow);
            if (error) return;

            PurchaseInvoiceService.ItemNocall(value,
                function (result) {

                    var ItemNo = result.data[0].itemNumber;
                    var itemUnformatted = result.data[0].itemUnformatted;


                    if (ItemNo == null || ItemNo == "") {
                        originalRow.closest("tr").find("td:eq(1)").text("");
                        ShowNotification(3, "Item no is not correct");
                    } else {

                        //var itemUnfrmt = row.find("td:eq(1)").text();

                        //originalRow.closest("tr").find("td:eq(1)").find("input").val(result.data[0].description);
                        originalRow.closest("tr").find("td:eq(1)").text(result.data[0].description);
                        originalRow.closest("tr").find("td:eq(2)").text(result.data[0].itemUnformatted);

                        //originalRef.closest('td').next().next().text(itemUnfrmt);


                        table.handleAfterEdit(originalRow);
                    }


                },
                ItemNocallFail);



        }
        function ItemNocallFail(result) {
            console.log(result);
            ShowNotification(3, "Something gone wrong");
        }

        //end



        //subtotal
        $('#PurchaseInvoiceItemLists').on('blur', ".td-Quantity-Invoice", function (event) {

            computeSubtotal($(this));
            TotalCalculation();

        });

        $('#PurchaseInvoiceItemLists').on('blur', ".td-Unit-Cost", function (event) {


            computeSubtotal($(this));
            TotalCalculation();
        });


        function computeSubtotal(row) {
            try {
                var qty = parseFloat(row.closest("tr").find("td:eq(5)").text().replace(',', ''));
                var unitCost = parseFloat(row.closest("tr").find("td:eq(6)").text().replace(',', ''));



                if (!isNaN(qty * unitCost)) {
                    var val = Number(parseFloat(qty * unitCost).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });

                    row.closest("tr").find("td:eq(7)").text(val);

                    TotalCalculation();

                }
            } catch (ex) {

            }
        }

        $("#TotalAmount, #VATAmount, #TaxAmount").on("change", function () {
            calculateGrandTotal();
        });
        $('#VATRate').on('blur', function (event) {
            computeVATAmount($(this));
            calculateGrandTotal();


        });
        $('#TaxRate').on('blur', function (event) {
            computeTaxAmount($(this));
            calculateGrandTotal();

        });
        function calculateGrandTotal() {
            var TotalAmount = $("#TotalAmount").val();
            var vatAmount = $("#VATAmount").val();
            var taxAmount = $("#TaxAmount").val();
            var grandTotal = 0;

            if (TotalAmount) {
                TotalAmount = TotalAmount.replace(/\,/g, '');
                grandTotal += parseFloat(TotalAmount);
            }

            if (vatAmount) {
                vatAmount = vatAmount.replace(/\,/g, '');
                grandTotal += parseFloat(vatAmount);
            }

            if (taxAmount) {
                taxAmount = taxAmount.replace(/\,/g, '');
                grandTotal += parseFloat(taxAmount);
            }

            // Display the Grand Total with the appropriate formatting
            $("#GrandTotal").val(grandTotal.toLocaleString('en', { minimumFractionDigits: 2 }));
        }
        function computeTaxAmount() {
            var TaxRate = $('#TaxRate').val();
            var TotalAmount = $('#TotalAmount').val();

            if (TotalAmount) {
                TotalAmount = TotalAmount.replace(/\,/g, '');
            }
            if (TaxRate) {
                TaxRate = TaxRate.replace(/\,/g, '');
            }
            var FormNumeric = FormNumericCheck();
            console.log(TotalAmount)
            if (!isNaN(TaxRate) && !isNaN(TotalAmount)) {
                var TaxAmount = parseFloat(TotalAmount) * parseFloat(TaxRate) / 100;
                $('#TaxAmount').val(TaxAmount.toLocaleString('en', { minimumFractionDigits: FormNumeric }));

            }
        }

        function computeVATAmount() {
            var VATRate = $('#VATRate').val()

            var TotalAmount = $('#TotalAmount').val();
            if (TotalAmount) {
                TotalAmount = TotalAmount.replace(/\,/g, '');
            }
            if (VATRate) {
                VATRate = VATRate.replace(/\,/g, '');
            }
            if (!isNaN(VATRate) && !isNaN(TotalAmount)) {
                var VATAmount = parseFloat(TotalAmount) * parseFloat(VATRate) / 100;

                $('#VATAmount').val(VATAmount.toLocaleString('en', { minimumFractionDigits: 2 }));

            }
        }
        function TotalCalculation() {
            var SubTotal = 0;
            var QuantityTotal = 0;


            SubTotal = getColumnSumAttr('Subtotal', 'PurchaseInvoiceItemLists').toFixed(2);
            QuantityTotal = getColumnSumAttr('Quantity Invoice', 'PurchaseInvoiceItemLists').toFixed(2);



            $("#TotalAmount").val(Number(parseFloat(SubTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
            $("#QuantityAmount").val(Number(parseFloat(QuantityTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
            //$("#TotalAmount").val(SubTotal);
            //$("#QuantityAmount").val(QuantityTotal);
            calculateGrandTotal();
            computeTaxAmount();
            computeVATAmount();
        }

        //end of subtotal
        var indexTable = PInvoiceTable();


        $("#btnAdd").on("click", function () {

            rowAdd(detailTable);

        });

        $('.btnSave').click('click', function () {
            savePO($table);
        });
        $('.btnPost').click('click', function () {


            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    var pinvoiceMaster = serializeInputs("frm_PurchaseInvoice");
                    if (pinvoiceMaster.IsPost == "Y") {
                        ShowNotification(3, "Data has already been Posted.");
                    }
                    else {
                        pinvoiceMaster.IDs = pinvoiceMaster.Id;
                        PurchaseInvoiceService.POIMultiplePost(pinvoiceMaster, POIMultiplePost, POIMultiplePostFail);

                    }

                }

            });


        });



        $('#modelClose').click('click', function () {

            $("#UnPostReason").val("");
            $('#modal-default').modal('hide');


        });
        $('.Submit').click('click', function () {

            ReasonOfUnPost = $("#UnPostReason").val();

            var pinvoiceMaster = serializeInputs("frm_PurchaseInvoice");

            pinvoiceMaster["ReasonOfUnPost"] = ReasonOfUnPost;
            Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
                    ShowNotification(3, "Please Write down Reason Of UnPost");
                    $("#ReasonOfUnPost").focus();
                    return;
                }
                if (result) {
                    if (pinvoiceMaster.IsPush === "Y") {
                        ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                    }
                    else {

                        pinvoiceMaster.IDs = pinvoiceMaster.Id;
                        PurchaseInvoiceService.POIMultipleUnPost(pinvoiceMaster, POIMultipleUnPost, POIMultipleUnPostFail);
                    }

                }
            });

        });


        //$('.btnUnPost').click('click', function () {

        //    var element = document.getElementById("divReasonOfUnPost");
        //    if (element.style.display === "none") {
        //        $("#divReasonOfUnPost").show();
        //        return;
        //    } else {
        //        ReasonOfUnPost = $("#ReasonOfUnPost").val();

        //        var pinvoiceMaster = serializeInputs("frm_PurchaseInvoice");
        //        pinvoiceMaster["ReasonOfUnPost"] = ReasonOfUnPost;
        //        Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
        //            if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
        //                ShowNotification(3, "Please Write down Reason Of UnPost");
        //                $("#ReasonOfUnPost").focus();
        //                return;
        //            }
        //            if (result) {
        //                if (pinvoiceMaster.IsPush === "Y") {
        //                    ShowNotification(3, "Unable to UnPost, Data is already Pushed!");
        //                }
        //                else {

        //                    pinvoiceMaster.IDs = pinvoiceMaster.Id;
        //                    PurchaseInvoiceService.POIMultipleUnPost(pinvoiceMaster, POIMultipleUnPost, POIMultipleUnPostFail);
        //                }

        //            }
        //        });
        //    }
        //});



        $('.btnPush').click('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {



                    var pinvoiceMaster = serializeInputs("frm_PurchaseInvoice");

                    pinvoiceMaster.IDs = pinvoiceMaster.Id;

                    if (pinvoiceMaster.IsPost == "N") {
                        ShowNotification(3, "Please Data Post First!");
                    }
                    else {

                        if (pinvoiceMaster.IsPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.");

                        }
                        else {
                            pinvoiceMaster.IDs = pinvoiceMaster.Id;
                            PurchaseInvoiceService.POIMultiplePush(pinvoiceMaster, POIMultiplePush, POIMultiplePushFail);


                        }
                    }

                }

            });
        });


        $("#PurchaseInvoiceItemLists").on("click", ".js-edit", function () {
            var button = $(this);
            rowEdit(button, detailTable);
        });

        $("#PurchaseInvoiceItemLists").on("click", ".js-delete", function () {
            var button = $(this);
            rowDelete(button, detailTable);
        });

        $("#ModalButtonCloseFooter").click(function () {
            addPrevious(detailTable);
        });


        $("#ModalButtonCloseHeader").click(function () {
            addPrevious(detailTable);
        });
        $("#indexSearch").click(function () {
            var data = $("#Branchs").val();
            var fromDate = $("#FromDate").val();
            var toDate = $("#ToDate").val();
            if (data == "xx") {
                ShowNotification(3, "Please Select Branch Type First");
                return;
            }
            if (!fromDate || !toDate) {
                ShowNotification(3, "Please Select both From Date and To Date");
                return;
            }
            indexTable.draw();
        });







    }

    function Visibility(action) {


        $('#frm_PurchaseInvoiceEntry').find(':input').prop('readonly', action);
        $('#frm_PurchaseInvoiceEntry').find('table, table *').prop('disabled', action);
        $('#frm_PurchaseInvoiceEntry').find(':input[type="button"]').prop('disabled', action);

    };

    //POinvoice
    function SelectData(IsPost) {

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

        //for branchid
        //var branchId = $('#Branchs').val();

        //if (branchId == null || branchId === '') {
        //    var branchId = $('#CurrentBranchId').val();
        //}
        //model.branchId = branchId;



        //ch
        //var dataTable = $('#BankLists').DataTable();
        var dataTable = $('#POInvoiceLists').DataTable();

        var rowData = dataTable.rows().data().toArray();
        var filteredData = [];
        var filteredData1 = [];
        if (IsPost) {
            filteredData = rowData.filter(x => x.isPost === "Y" && IDs.includes(x.id.toString()));

        }
        else {
            filteredData = rowData.filter(x => x.isPush === "Y" && IDs.includes(x.id.toString()));
            filteredData1 = rowData.filter(x => x.isPost === "N" && IDs.includes(x.id.toString()));
        }

        //console.log(IDs)
        //console.log(dataTable)
        //console.log(filteredData)
        //console.log(filteredData.length)


        if (IsPost) {
            if (filteredData.length > 0) {
                //ShowNotification(2, "Please select 'Invoice Not Posted Yet!'");
                ShowNotification(3, "Data has already been posted.");

                return;
            }

        }
        else {
            if (filteredData.length > 0) {
                //ShowNotification(2, "Please select 'Invoice Not Pushed Yet!'");
                ShowNotification(3, "Data has already been pushed.");


                return;
            }
            if (filteredData1.length > 0) {
                ShowNotification(3, "Please Data Post First");
                //ShowNotification(3, "Data has already been pushed.");


                return;
            }
        }


        if (IsPost) {
            PurchaseInvoiceService.POIMultiplePost(model, POIMultiplePost, POIMultiplePostFail);


        }
        else {
            PurchaseInvoiceService.POIMultiplePush(model, POIMultiplePush, POIMultiplePushFail);

        }

    }
    function POIMultiplePost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPost").val('Y');
            $(".btnUnPost").show();

            $(".btnPush").show();

            Visibility(true);



            var dataTable = $('#POInvoiceLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }
    function POIMultiplePostFail(result) {
        console.log(result.message);
        ShowNotification(3, result.message);
        var dataTable = $('#POInvoiceLists').DataTable();
        dataTable.draw();
    }


    function POIMultiplePush(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPush").val('Y');

            var dataTable = $('#POInvoiceLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }
    function POIMultiplePushFail(result) {
        console.log(result.message);
        ShowNotification(3, result.message);
        var dataTable = $('#POInvoiceLists').DataTable();
        dataTable.draw();
    }

    function POIMultipleUnPost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('N');
            Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();

            var dataTable = $('#RequsitionList').DataTable();


            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function POIMultipleUnPostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#RequsitionList').DataTable();

        dataTable.draw();
    }










    function itemModalDblClick(row, originalRef) {
        var itemCode = row.find("td:first").text();
        originalRef.closest("td").find("input").val(itemCode);

        var itemDescription = row.find("td:eq(2)").text();
        var itemunitofmeasure = row.find("td:eq(5)").text();
        var itemUnfrmt = row.find("td:eq(1)").text();



        originalRef.closest('td').next().text(itemDescription);
        originalRef.closest('td').next('td').next('td').next('td').next().text(itemunitofmeasure);
        originalRef.closest('td').next().next().text(itemUnfrmt);


        $("#itemModal").modal("hide");

        originalRef.closest("td").find("input").data("touched", false);

        originalRef.closest("td").find("input").focus();
    }
    function locationModalDblClick(row, originalRef) {

        var locationCode = row.find("td:first").text();
        /*   originalRef.closest("td").find("input").val(locationCode);*/

        //var locationDescription = row.find("td:eq(1)").text();
        //originalRef.closest('td').next().text(locationDescription);


        $("#locationModal").modal("hide");

        originalRef.closest("td").find("input").data("touched", false);

        originalRef.closest("td").find("input").focus();


    }
    function modalrceiptNomodalDblClick(row, originalRef) {
        var rceiptNomodal = row.find("td:first").text();
        var receiptName = row.find("td:eq(1)").text();

        originalRef.closest("div.input-group").find("input").val(rceiptNomodal);
        originalRef.closest("td").find("input").focus();

        $("#ReceiptDescription").val(receiptName);

        $("#rceiptNomodal").modal("hide");

    }
    function modalInvoiceNumberDblClick(row, originalRef) {
        var inNumberModel = row.find("td:first").text();
        originalRef.closest("td").find("input").val(inNumberModel);

        $("#inNumberModel").modal("hide");
        originalRef.closest("td").find("input").focus();
    }

    function modalVendorSetDblClick(row, originalRow) {

        var vendorCode = row.find("td:first").text();
        var vendornName = row.find("td:eq(2)").text();

        var AccSet = row.find("td:eq(4)").text();
        var AccSetDesc = row.find("td:eq(5)").text();

        originalRow.closest("div.input-group").find("input").val(vendorCode);
        originalRow.closest("div.input-group").find("input").focus();


        $("#VendorName").val(vendornName);

        $("#VendorAcctSet").val(AccSet);
        $("#AccSetDescription").val(AccSetDesc);

        $("#vendorModal").modal("hide");
    }
    function modalBillToLocationSetDblClick(row, originalRow) {

        var billLocation = row.find("td:first").text();
        var billDescription = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(billLocation);
        originalRow.closest("div.input-group").find("input").focus();


        $("#BillToLocationDescription").val(billDescription);

        $("#shipModal").modal("hide");
    }
    function modalVendorAccSetDblClick(row, originalRow) {

        var vendorAccountCode = row.find("td:first").text();
        var vendornAccountDescription = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(vendorAccountCode);
        originalRow.closest("div.input-group").find("input").focus();


        $("#AccSetDescription").val(vendornAccountDescription);

        $("#vendorAccSetModal").modal("hide");
    }
    function modalAPRimitToDblClick(row, originalRow) {

        var rimitTo = row.find("td:eq(1)").text();
        var rimitToDescription = row.find("td:eq(2)").text();


        originalRow.closest("div.input-group").find("input").val(rimitTo);
        originalRow.closest("div.input-group").find("input").focus();

        $("#RimitToLocationDescription").val(rimitToDescription);


        $("#apRimitToModal").modal("hide");

    }
    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }






    var PInvoiceTable = function () {

        $('#POInvoiceLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#POInvoiceLists thead');


        var dataTable = $("#POInvoiceLists").DataTable({
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
                url: '/PurchaseInvoice/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "VendorNumberCh": $("#VendorNumber").val(),
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),
                            "Code": $("#md-Code").val(),
                            "receiptno": $("#md-ReceiptNo").val(),
                            "vendornumber": $("#md-VendorNumber").val(),
                            "ispost": $("#md-Post").val(),
                            "ispush": $("#md-Push").val(),
                            "fromDate": $("#FromDate").val(),
                            "toDate": $("#ToDate").val()
                        });
                }
            },
            columns: [

                {
                    data: "id",
                    render: function (data) {

                        return "<a href=/PurchaseInvoice/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  " +

                            "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"
                            ;
                    },
                    "width": "7%",
                    "orderable": false
                },
                {
                    data: "code",
                    name: "code"
                    //"width": "20%"
                }

                ,
                {
                    data: "vendorNumber",
                    name: "vendorNumber"
                    /*"width": "20%"*/
                }
                ,
                {
                    data: "receiptNo",
                    name: "receiptNo"
                    /*"width": "20%"*/
                }
                ,

                {
                    data: "invoiceDate",
                    name: "InvoiceDate"

                },

                {
                    data: "isPost",
                    name: "IsPost"

                },
                {
                    data: "isPush",
                    name: "isPush"

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

                else if ($(cell).hasClass('bool')) {

                    $(cell).html('<select class="acc-filters filter-input " style="width:100%"  id="md-' + title.replace(/ /g, "") + '"><option>Select</option><option>Y</option><option>N</option></select>');

                }

                else {
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');
                }
            });
        }

        $("#POInvoiceLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#POInvoiceLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }




    function savePO($table) {

        var validator = $("#frm_PurchaseInvoice").validate();


        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }
        if (hasInputFieldInTableCells($table)) {
            ShowNotification(3, "Complete Details Entry");
            return;

        };
        if (!hasLine($table)) {
            ShowNotification(3, "Complete Details Entry");
            return;

        };

        var poMaster = serializeInputs("frm_PurchaseInvoice");
        var poDetails = serializeTable($table);


        //Required Feild Check

        var requiredFields = ['ItemNo', 'Location', 'QuantityInvoice', 'UnitCost'];
        var fieldMappings = {
            'ItemNo': 'Item Number',
            'Location': 'Location',
            'QuantityInvoice': 'Quantity Invoice',
            'UnitCost': 'Unit Cost'
        };
        var errorMessage = getRequiredFieldsCheckObj(poDetails, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;

        }



        poMaster.POInvoiceDetailsList = poDetails;

        PurchaseInvoiceService.save(poMaster, saveDone, saveFail);


        console.log(poMaster);
        //APInvoiceService.save(apMaster)

    }

    function saveDone(result) {
        debugger
        if (result.status == "200") {
            if (result.data.operation == "add") {


                var IsPushAllow = ($('#IsPushAllow').val() === "true");



                ShowNotification(1, result.message);
                $(".btnSave").html('Update');
                $(".btnSave").addClass('sslUpdate');
                $("#Id").val(result.data.id);
                $("#Code").val(result.data.code);

                $("#BranchId").val(result.data.branchId);

                $("#divUpdate").show();

                $("#divSave").hide();

                $("#SavePost, #SavePush").show();


                if (!IsPushAllow) {

                    $(".btnPush").hide();
                }

                result.data.operation = "update";
                $("#Operation").val(result.data.operation);

            } else {
                ShowNotification(1, result.message);

                $("#divSave").hide();

                $("#divUpdate").show();

            }
        }
        else if (result.status == "400") {
            ShowNotification(3, result.message || result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message || result.error); // <-- display the error message here
        }
    }

    function saveFail(result) {
        if (result.status == "500") {
            ShowNotification(3, "Update cannot be performed because the data has already been pushed."); // <-- display the error message here
        }
        else {


            console.log(result);
            ShowNotification(3, "Something gone wrong");
        }
    }



    function rowEdit(button, table) {
        debugger
        var data = table.row(button.parents("tr")).data();

        console.log(data);

        $("#Taxes").val(data.Taxes).change();
        $("#FullyInvoiced").val(data.FullyInvoiced);
        $("#ItemNumber").val(data.ItemNumber);
        $("#ItemDescription").val(data.ItemDescription);
        $("#Location").val(data.Location);
        $("#QuantityInvoiced").val(data.QuantityInvoiced);
        $("#UnitOfMeasure").val(data.UnitOfMeasure);
        $("#UnitCost").val(data.UnitCost);
        $("#ExtendedCost").val(data.ExtendedCost);
        $("#Discount").val(data.Discount);
        $("#DiscountAmounth").val(data.DiscountAmounth);
        $("#DiscountedExtenedCost").val(data.DiscountedExtenedCost);
        $("#TaxInclude").val(data.TaxInclude);
        $("#NetOfTex").val(data.NetOfTex);
        $("#AllocatedTax").val(data.AllocatedTax);


        table.row(button.parents('tr')).remove().draw();
        $('#modal-xl').modal('show');
        localStorage.setItem('previousValue', JSON.stringify(data));

    }



    return {
        init: init
    }
}(ModalService, CommonService, PurchaseInvoiceService);