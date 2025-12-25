var POPurchaseOrdersController = function (CommonService, ModalService, POPurchaseOrdersService) {




    var init = function () {
        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }


        var IsPost = $('#IsPost').val();
        if (IsPost === 'Y') {
            Visibility(true);
        }

        LoadCombo("POType", '/Common/POType');

        var $table = $('#PurchaseOrderItemLists');

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

            var url = '/PurchaseOrder/PurchaseOrderExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;

            var Id = $("#Id").val();

            url += '&Id=' + (Id !== null ? Id : 'null');
            var win = window.open(url, '_blank');
        });





        $('#POAddRow').on('click', function () {
            addRow($table);
        });

        //for purchase receipt
        $('#PostReceipt').on('click', function () {

            SelectReceiptData();

        });




        $('#PostPO').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    SelectData(true);
                }

            });

        });
        $('#PushPO').on('click', function () {
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





        $('.btn-vendor').on('click', function () {
            var originalRef = $(this);
            CommonService.vendorNumberModal({}, fail, function (row) { modalVendorSetDblClick(row, originalRef) });

        });

        $('.btn-shiptolocation').on('click', function () {
            var originalRef = $(this);
            ModalService.shipToLocationModal({}, fail, function (row) { modalShipToLocationSetDblClick(row, originalRef) });

        });
        $('.btn-billtolocation').on('click', function () {
            var originalRef = $(this);
            ModalService.shipToLocationModal({}, fail, function (row) { modalBillToLocationSetDblClick(row, originalRef) });

        });
        $('.btn-shipvia').on('click', function () {
            var originalRef = $(this);
            ModalService.shipViaModal({}, fail, function (row) { modalShipViaSetDblClick(row, originalRef) });

        });
        $('.btn-termscode').on('click', function () {
            var originalRef = $(this);
            ModalService.termsCodeModal({}, fail, function (row) { modalTermsCodeSetDblClick(row, originalRef) });

        });
        $('.btn-vendoraccset').on('click', function () {
            var originalRef = $(this);
            ModalService.vendorAccSetModal({}, fail, function (row) { modalVendorAccSetDblClick(row, originalRef) });

        });

        //$('#PurchaseOrderItemLists').on('click', ".ItemNo", function () {
        //    var originalRow = $(this);
        //    CommonService.itemNumberModal({}, fail, function (row) { itemModalDblClick(row, originalRow) });

        //});

        $('#PurchaseOrderItemLists').on('click', "input.txtItemNo", function () {
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




        //$('#PurchaseOrderItemLists').on('click', ".Location", function () {

        //    var itemNo = $(this).closest("tr").find("td:eq(0)").text()

        //    var itemNo = itemNo.trim();

        //    //if (!itemNo) {
        //    //    alert('Please select a item number first.');
        //    //    return;
        //    //}


        //    var originalRow = $(this);
        //    CommonService.locationModal({}, fail, function (row) { locationModalDblClick(row, originalRow) }, itemNo);

        //});


        $('#PurchaseOrderItemLists').on('click', "input.txt" + "Location", function () {

            var itemNo = $(this).closest("tr").find("td:eq(0)").text()

            var itemNo = itemNo.trim();

        //    //if (!itemNo) {
        //    //    alert('Please select a item number first.');
        //    //    return;
        //    //}

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






        //subtotal
        $('#PurchaseOrderItemLists').on('blur', ".td-Quantity-Required", function (event) {

            computeSubtotal($(this));



            TotalCalculation($(this));



        });

        $('#PurchaseOrderItemLists').on('blur', ".td-Unit-Cost", function (event) {
            TotalCalculation($(this));

            computeSubtotal($(this));






        });
        $('#VATRate').on('blur', function (event) {
            computeVATAmount($(this));
            calculateGrandTotal();


        });
        $('#TaxRate').on('blur', function (event) {
            computeTaxAmount($(this));
            calculateGrandTotal();

        });

        $("#TotalAmount, #VATAmount, #TaxAmount, #QuantityAmount").on("change", function () {
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
            console.log(grandTotal)
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

        function TotalCalculation() {
            var SubTotal = 0;
            var QuantityTotal = 0;


            SubTotal = getColumnSumAttr('Subtotal', 'PurchaseOrderItemLists').toFixed(2);
            QuantityTotal = getColumnSumAttr('Quantity Required', 'PurchaseOrderItemLists').toFixed(2);


            $("#TotalAmount").val(Number(parseFloat(SubTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
            $("#QuantityAmount").val(Number(parseFloat(QuantityTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));

            //$("#TotalAmount").val(SubTotal);
            //$("#QuantityAmount").val(QuantityTotal);
            computeVATAmount();
            computeTaxAmount();
            calculateGrandTotal();
        }


        //end of subtotal



        $('.btnSave').click(function () {
            save($table);
        });
        $('.btnPost').click('click', function () {


            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    var porderMaster = serializeInputs("frm_PurchaseOrder");
                    if (porderMaster.IsPost == "Y") {
                        ShowNotification(3, "Data has already been Posted.");
                    }
                    else {
                        porderMaster.IDs = porderMaster.Id;
                        POPurchaseOrdersService.POMultiplePost(porderMaster, POMultiplePost, POMultiplePostFail);
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

            var purchaseMaster = serializeInputs("frm_PurchaseOrder");

            purchaseMaster["ReasonOfUnPost"] = ReasonOfUnPost;
            Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
                    ShowNotification(3, "Please Write down Reason Of UnPost");
                    $("#ReasonOfUnPost").focus();
                    return;
                }
                if (result) {
                    if (purchaseMaster.IsPush === "Y") {
                        ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                    }
                    else {

                        purchaseMaster.IDs = purchaseMaster.Id;
                        POPurchaseOrdersService.POrderMultipleUnPost(purchaseMaster, POrderMultipleUnPost, POrderMultipleUnPostFail);
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

        //        var purchaseMaster = serializeInputs("frm_PurchaseOrder");

        //        purchaseMaster["ReasonOfUnPost"] = ReasonOfUnPost;
        //        Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
        //            if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
        //                ShowNotification(3, "Please Write down Reason Of UnPost");
        //                $("#ReasonOfUnPost").focus();
        //                return;
        //            }
        //            if (result) {
        //                if (purchaseMaster.IsPush === "Y") {
        //                    ShowNotification(3, "Unable to UnPost, Data has already been Posted.");
        //                }
        //                else {

        //                    purchaseMaster.IDs = purchaseMaster.Id;
        //                    POPurchaseOrdersService.POrderMultipleUnPost(purchaseMaster, POrderMultipleUnPost, POrderMultipleUnPostFail);
        //                }

        //            }
        //        });
        //    }

        //});






        $('.btnPush').click('click', function () {


            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {


                    var porderMaster = serializeInputs("frm_PurchaseOrder");

                    porderMaster.IDs = porderMaster.Id;


                    if (porderMaster.IsPost == "N") {
                        ShowNotification(3, "Please Data Post First!");
                    }
                    else {
                        if (porderMaster.IsPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.");

                        }
                        else {
                            porderMaster.IDs = porderMaster.Id;
                            POPurchaseOrdersService.POMultiplePush(porderMaster, POMultiplePush, POMultiplePushFail);


                        }
                    }
                    
                }

            });

        });






        var indexTable = POPurchaseOrderTable();


        //enter for location

        $('#PurchaseOrderItemLists').on('keypress', "input.txtLocation", function (event) {
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

            POPurchaseOrdersService.LocationNocall(value,
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

        $('#PurchaseOrderItemLists').on('keypress', "input.txtItemNo", function (event) {
            if (event.key === "Enter") {
                var value = $(this).val();
                var originalRow = $(this);


                ItemDescCall(value, originalRow);
            }

        });

        function ItemDescCall(value, originalRow) {

            var { error } = table.validateField(originalRow);
            if (error) return;

            POPurchaseOrdersService.ItemNocall(value,
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



        //var indexConfig = GetIndexTable();
        //var indexTable = $("#POPurchaseOrdersLists").DataTable(indexConfig);


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

    /*init end*/
    function Visibility(action) {

        $('#frm_PurchaseOrderEntry').find(':input').prop('readonly', action);
        $('#frm_PurchaseOrderEntry').find('table, table *').prop('disabled', action);
        $('#frm_PurchaseOrderEntry').find(':input[type="button"]').prop('disabled', action);

    };



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

        var dataTable = $('#POPurchaseOrdersLists').DataTable();

        var rowData = dataTable.rows().data().toArray();

        var filteredData = rowData.filter(x => IDs.includes(x.id.toString()));
        //console.log(filteredData)

        var distinctVendorNos = [...new Set(filteredData.map(x => x.vendorNumber))];

        if (distinctVendorNos.length > 1) {
            ShowNotification(2, "Select Same Vendor For Multiple PO!'");

            return;
        }


        var form = $('<form>').attr('method', 'post').attr('action', '/PurchaseReceipt/MultipleReceiptGetData');
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



        var dataTable = $('#POPurchaseOrdersLists').DataTable();

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
                ShowNotification(3, "Data has already been Posted.");

                return;
            }

        }
        else {
            if (filteredData.length > 0) {
                //ShowNotification(3, "Please select Invoice Not Poused Yet!");
                ShowNotification(3, "Data has already been Pushed.");

                return;
            }
            if (filteredData1.length > 0) {
                ShowNotification(3, "Please Data Post First!");

                return;
            }
        }


        if (IsPost) {
            POPurchaseOrdersService.POMultiplePost(model, POMultiplePost, POMultiplePostFail);


        }
        else {
            POPurchaseOrdersService.POMultiplePush(model, POMultiplePush, POMultiplePushFail);

        }

    }


    function POMultiplePost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPost").val('Y');

            $(".btnUnPost").show();
            $(".btnPush").show();
            Visibility(true);



            var dataTable = $('#POPurchaseOrdersLists').DataTable();

            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }
    function POMultiplePostFail(result) {
        console.log(result.message);
        ShowNotification(3, result.message);
        var dataTable = $('#POPurchaseOrdersLists').DataTable();
        dataTable.draw();
    }




    function POMultiplePush(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPush").val('Y');


            var dataTable = $('#POPurchaseOrdersLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }


    function POMultiplePushFail(result) {
        console.log(result.message);
        ShowNotification(3, result.message);
        var dataTable = $('#POPurchaseOrdersLists').DataTable();
        dataTable.draw();
    }


    function POrderMultipleUnPost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('N');
            Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();


            var dataTable = $('#POPurchaseOrdersLists').DataTable();

            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function POrderMultipleUnPostFail(result) {
        ShowNotification(3, "Something gone wrong");

        var dataTable = $('#POPurchaseOrdersLists').DataTable();

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
        /*originalRef.closest("td").find("input").val(locationCode);*/

        //var locationDescription = row.find("td:eq(1)").text();
        //originalRef.closest('td').next().text(locationDescription);


        $("#locationModal").modal("hide");

        originalRef.closest("td").find("input").data("touched", false);


        originalRef.closest("td").find("input").focus();


    }


    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }
    function modalVendorSetDblClick(row, originalRow) {

        var vendorCode = row.find("td:first").text();
        var vendornName = row.find("td:eq(1)").text();
        var AccSet = row.find("td:eq(4)").text();
        var AccSetDesc = row.find("td:eq(5)").text();

        var TermsCode = row.find("td:eq(7)").text();
        var TermsCodeDesc = row.find("td:eq(8)").text();

        originalRow.closest("div.input-group").find("input").val(vendorCode);
        originalRow.closest("div.input-group").find("input").focus();


        $("#VendorName").val(vendornName);
        $("#TermsCode").val(TermsCode);
        $("#TermsDescrtption").val(TermsCodeDesc);
        $("#VendorAcctSet").val(AccSet);
        $("#VendorAcctDescrition").val(AccSetDesc);

        $("#vendorModal").modal("hide");
    }
    function modalShipToLocationSetDblClick(row, originalRow) {

        var ship = row.find("td:first").text();
        var shipDescription = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(ship);
        originalRow.closest("div.input-group").find("input").focus();


        $("#ShipDescription").val(shipDescription);

        $("#shipModal").modal("hide");
    }
    function modalBillToLocationSetDblClick(row, originalRow) {

        var billLocation = row.find("td:first").text();
        var billDescription = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(billLocation);
        originalRow.closest("div.input-group").find("input").focus();


        $("#BillDescription").val(billDescription);

        $("#shipModal").modal("hide");
    }
    function modalShipViaSetDblClick(row, originalRow) {

        var shipviaCode = row.find("td:first").text();
        var shipvaiName = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(shipviaCode);
        originalRow.closest("div.input-group").find("input").focus();


        $("#ShipViaDescription").val(shipvaiName);

        $("#shipviaModal").modal("hide");
    }
    function modalTermsCodeSetDblClick(row, originalRow) {

        var termsCode = row.find("td:first").text();
        var termsDescription = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(termsCode);
        originalRow.closest("div.input-group").find("input").focus();


        $("#TermsDescrtption").val(termsDescription);

        $("#termsModal").modal("hide");
    }
    function modalVendorAccSetDblClick(row, originalRow) {

        var vendorAccountCode = row.find("td:first").text();
        var vendornAccountDescription = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(vendorAccountCode);
        originalRow.closest("div.input-group").find("input").focus();


        $("#VendorAcctDescrition").val(vendornAccountDescription);

        $("#vendorAccSetModal").modal("hide");
    }

    var POPurchaseOrderTable = function () {

        $('#POPurchaseOrdersLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#POPurchaseOrdersLists thead');


        var dataTable = $("#POPurchaseOrdersLists").DataTable({
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
                url: '/PurchaseOrder/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "SagePONumber": $("#SagePONumber").val(),
                            "PODateFrom": $("#PODateFrom").val(),
                            "PODateTo": $("#PODateTo").val(),
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),
                            "code": $("#md-Code").val(),
                            "shiptolocation": $("#md-ShipToLocation").val(),
                            "ispost": $("#md-Post").val(),
                            "ispush": $("#md-Push").val(),
                            "vendornumber": $("#md-VendorNumber").val(),
                            "fromDate": $("#FromDate").val(),
                            "toDate": $("#ToDate").val()


                        });
                }
            },
            columns: [

                {
                    data: "id",
                    render: function (data) {

                        return "<a href=/PurchaseOrder/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'>&nbsp;</i></a>  " +
                            "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"
                            ;

                    },
                    "width": "9%",
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
                    name: "VendorNumber"
                    //"width": "20%"
                }
                ,
                {
                    data: "shipToLocation",
                    name: "shipToLocation"
                    //"width": "20%"
                }
                ,
                {
                    data: "poDate",
                    name: "PODate"
                    //"width": "20%"
                }
                ,
                {
                    data: "isPost",
                    name: "IsPost"
                    //"width": "20%"
                }
                ,
                {
                    data: "isPush",
                    name: "IsPush"
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


        $("#POPurchaseOrdersLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        $("#POPurchaseOrdersLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    function save($table) {

        var data = $("#POType").val();
        if (data == "xx") {
            ShowNotification(3, "Please Select PO Type First");
            return;
        }


        var validator = $("#frm_PurchaseOrder").validate();
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

        var purchaseMaster = serializeInputs("frm_PurchaseOrder");
    
        var purchaseDetails = serializeTable($table);


        if (purchaseMaster.IsPush == 'Y') {
            ShowNotification(3, "Update cannot be performed because the data has already been pushed.");
            return;
        }

        //Required Feild Check

        var requiredFields = ['ItemNo', 'Location', 'QuantityRequired', 'UnitCost'];
        var fieldMappings = {
            'ItemNo': 'Item Number',
            'Location': 'Location',
            'QuantityRequired': 'Quantity Ordered',
            'UnitCost': 'Unit Cost'
        };
        var errorMessage = getRequiredFieldsCheckObj(purchaseDetails, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;

        }




        purchaseMaster.POPurchaseOrderDetailsList = purchaseDetails;

        POPurchaseOrdersService.save(purchaseMaster, saveDone, saveFail);



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
        console.log(result);
        ShowNotification(3, "Something gone wrong");
    }




    return {
        init: init
    }
}(CommonService, ModalService, POPurchaseOrdersService);