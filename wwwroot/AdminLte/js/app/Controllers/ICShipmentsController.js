var ICShipmentsController = function (ModalService, ICShipmentsService) {


    var init = function () {
        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }

        var IsPost = $('#IsPost').val();
        if (IsPost === 'Y') {
            Visibility(true);
        }

        LoadCombo("EntryType", '/Common/EntryTypes');

        var $table = $('#ShipmentItemLists');
        var table = initEditTable($table, { searchHandleAfterEdit: false });


        TotalCalculation();

        $table.on('click', '.remove-row-btn', function () {
            TotalCalculation();
        });

        $('#icsAddRow').on('click', function () {
            addRow($table);
        });


        $('#PostICS').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    SelectData(true);
                }

            });

        });
        $('#PushICS').on('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {
                    SelectData(false);
                }

            });

        });

        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });


        $('.btn-customer').on('click', function () {
            var originalRef = $(this);
            ModalService.customerNumberModal({}, fail, function (row) { modalCustomerSetDblClick(row, originalRef) });

        });
        $('.btn-price').on('click', function () {
            var originalRef = $(this);
            ModalService.priceListModal({}, fail, function (row) { modalPriceSetDblClick(row, originalRef) });

        });

        //$('#ShipmentItemLists').on('click', ".ItemNo", function () {
        //    var originalRow = $(this);
        //    CommonService.itemNumberModal({}, fail, function (row) { itemModalDblClick(row, originalRow) });

        //});


        $('#ShipmentItemLists').on('click', "input.txt" + "ItemNo", function () {
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

        $('#ShipmentItemLists').on('click', "input.txt" + "ActivityTask ", function () {
            var originalRow = $(this);

            originalRow.closest("td").find("input").data('touched', true);

            CommonService.accountCodeModal({},
                fail,
                function (row) { modalDblClick(row, originalRow) },
                function () {
                    originalRow.closest("td").find("input").data('touched', false);
                    originalRow.closest("td").find("input").focus();
                });

        });

        //$('#ShipmentItemLists').on('click', ".Location", function () {
        //    var itemNo = $(this).closest("tr").find("td:eq(0)").text()

        //    var itemNo = itemNo.trim();

        //    //if (!itemNo) {
        //    //    alert('Please select a item number first.');
        //    //    return;
        //    //}
        //    var originalRow = $(this);
        //    CommonService.locationModal({}, fail, function (row) { locationModalDblClick(row, originalRow) }, itemNo);

        //});


        $('#ShipmentItemLists').on('click', "input.txtLocation", function () {

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








        //$('#ShipmentItemLists').on('keypress', "input.txtLocation", function (event) {
        //    if (event.key !== "Enter") return;

        //    var originalRow = $(this);
        //    table.handleAfterEdit(originalRow);

        //});




        //enter for location

        $('#ShipmentItemLists').on('keypress', "input.txtLocation", function (event) {
            if (event.key !== "Enter") return;

            var originalRow = $(this);
            table.handleAfterEditWithVal(originalRow);


        });
        //enter for searching of item

        $('#ShipmentItemLists').on('keypress', "input.txtItemNo", function (event) {
            if (event.key === "Enter") {
                var value = $(this).val();
                var originalRow = $(this);


                ItemDescCall(value, originalRow);
            }

        });

        function ItemDescCall(value, originalRow) {

            var { error } = table.validateField(originalRow);
            if (error) return;

            ICShipmentsService.ItemNocall(value,
                function (result) {

                    var ItemNo = result.data[0].itemNumber;
                    var itemUnformatted = result.data[0].itemUnformatted;


                    if (ItemNo == null || ItemNo == "") {
                        originalRow.closest("tr").find("td:eq(1)").text("");
                        originalRow.closest("tr").find("td:eq(3)").text("");
                        originalRow.closest("tr").find("td:eq(5)").text("");



                        ShowNotification(3, "Item no is not correct");
                    } else {


                        originalRow.closest("tr").find("td:eq(1)").text(result.data[0].description);
                        originalRow.closest("tr").find("td:eq(2)").text(result.data[0].itemUnformatted);


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
        $('#ShipmentItemLists').on('blur', ".td-Quantity", function (event) {

            computeSubtotal($(this));


        });

        $('#ShipmentItemLists').on('blur', ".td-Unit-Cost", function (event) {


            computeSubtotal($(this));

        });

        var prevTotal = 0;


        function computeSubtotal(row) {
            try {
                var qty = parseFloat(row.closest("tr").find("td:eq(7)").text().replace(',', ''));
                var unitCost = parseFloat(row.closest("tr").find("td:eq(8)").text().replace(',', ''));


                //if (!isNaN(qty * unitCost)) {

                //    var val = Number(parseFloat(qty * unitCost).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
                //    row.closest("tr").find("td:eq(8)").text(val);

                //    TotalCalculation();


                //}
                TotalCalculation();

            } catch (ex) {

            }
        }

        function TotalCalculation() {
            var SubTotal = 0;
            var QuantityTotal = 0;


            QuantityTotal = getColumnSumAttr('Quantity', 'ShipmentItemLists').toFixed(2);


            $("#QuantityAmount").val(Number(parseFloat(QuantityTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));

            //$("#TotalAmount").val(SubTotal);
            //$("#QuantityAmount").val(QuantityTotal);


        }




        //end of subtotal





        $('.btnSave').click(function () {
            save($table);
        });
        $('.btnPost').click('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    var shipmentMaster = serializeInputs("frm_Shipment");
                    if (shipmentMaster.IsPost == "Y") {
                        ShowNotification(3, "Data has already been posted.");
                    }
                    else {
                        shipmentMaster.IDs = shipmentMaster.Id;
                        ICShipmentsService.ICSMultiplePost(shipmentMaster, ICSMultiplePost, ICSMultiplePostFail);

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

            var shipmentMaster = serializeInputs("frm_Shipment");

            shipmentMaster["ReasonOfUnPost"] = ReasonOfUnPost;
            Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
                    ShowNotification(3, "Please Write down Reason Of UnPost");
                    $("#ReasonOfUnPost").focus();
                    return;
                }
                if (result) {
                    if (shipmentMaster.IsPush === "Y") {
                        ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                    }
                    else {

                        shipmentMaster.IDs = shipmentMaster.Id;
                        ICShipmentsService.ICSMultipleUnPost(shipmentMaster, ICSMultipleUnPost, ICSMultipleUnPostFail);
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

        //        var shipmentMaster = serializeInputs("frm_Shipment");
        //        shipmentMaster["ReasonOfUnPost"] = ReasonOfUnPost;
        //        Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
        //            if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
        //                ShowNotification(3, "Please Write down Reason Of UnPost");
        //                $("#ReasonOfUnPost").focus();
        //                return;
        //            }
        //            if (result) {
        //                if (shipmentMaster.IsPush === "Y") {
        //                    ShowNotification(3, "Unable to UnPost, Data is already Pushed!");
        //                }
        //                else {

        //                    shipmentMaster.IDs = shipmentMaster.Id;
        //                    ICShipmentsService.ICSMultipleUnPost(shipmentMaster, ICSMultipleUnPost, ICSMultipleUnPostFail);
        //                }

        //            }
        //        });
        //    }




        //});




        $('.btnPush').click('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {

                    var shipmentMaster = serializeInputs("frm_Shipment");

                    shipmentMaster.IDs = shipmentMaster.Id;


                    if (shipmentMaster.IsPost == "N") {
                        ShowNotification(3, "Please Data Post First!");
                    }
                    else {

                        if (shipmentMaster.IsPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.");

                        }
                        else {
                            shipmentMaster.IDs = shipmentMaster.Id;
                            ICShipmentsService.ICSMultiplePush(shipmentMaster, ICSMultiplePush, ICSMultiplePushFail);



                        }
                    }

                }
            });

        });


        var indexTable = ICShipmentTable();


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


        //$('#download').click('click', function () {
        //    console.log("Button clicked!");

        //});

    }

    //DownLoadData();


    //end init

    

    //$("#download").on("click", function () {


    //    var InvoiceNo = $("#InvoiceNo").val();
    //    var Id = $("#Id").val();

    //    var url = '/Shipment/ShipmentExcel?Id=' + Id;
    //    var win = window.open(url, '_blank');

    //});


    $("#download").on("click", function () {
        var fromDate = $("#FromDate").val();
        var toDate = $("#ToDate").val();
        var branchId = $("#Branchs").val();


        // Validate the date range and branch ID
        if (fromDate === "" || toDate === "" || branchId === "") {
            alert("Please select both 'from date', 'to date', and 'branch'.");
            return;
        }

        var url = '/Shipment/ShipmentExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;

        var Id = $("#Id").val();

        url += '&Id=' + (Id !== null ? Id : 'null');
        var win = window.open(url, '_blank');
    });


    //function DownLoadData(sender) {
    //    var InvoiceNo = $("#InvoiceNo").val();
    //    var Id = $("#Id").val();

    //    var url = '/Shipment/PaymentExcel?Id=' + Id;
    //    var win = window.open(url, '_blank');
    //}




    function Visibility(action) {

        $('#frm_ShipmentEntry').find(':input').prop('readonly', action);
        $('#frm_ShipmentEntry').find('table, table *').prop('disabled', action);
        $('#frm_ShipmentEntry').find(':input[type="button"]').prop('disabled', action);
    };



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



        var dataTable = $('#ShipmentLists').DataTable();

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



        if (IsPost) {
            if (filteredData.length > 0) {
                /*ShowNotification(2, "Please select 'Invoice Not Posted Yet!'");*/
                ShowNotification(3, "Data has already been Posted.");

                return;
            }

        }
        else {
            if (filteredData.length > 0) {
                //ShowNotification(3, "Please select 'Invoice Not Pushed Yet!'");
                ShowNotification(3, "Data has already been Pushed.");

                return;
            }
            if (filteredData1.length > 0) {
                ShowNotification(3, "Please Data Post First!");

                return;
            }
        }


        if (IsPost) {
            ICShipmentsService.ICSMultiplePost(model, ICSMultiplePost, ICSMultiplePostFail);


        }
        else {
            ICShipmentsService.ICSMultiplePush(model, ICSMultiplePush, ICSMultiplePushFail);

        }

    }


    function ICSMultiplePost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPost").val('Y');
            $(".btnUnPost").show();
            $(".btnPush").show();
            Visibility(true);


            var dataTable = $('#ShipmentLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }


    function ICSMultiplePostFail(result) {
        console.log(result.message);
        ShowNotification(3, result.message);
        var dataTable = $('#ShipmentLists').DataTable();
        dataTable.draw();
    }


    function ICSMultipleUnPost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('N');
            Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();
            var dataTable = $('#ShipmentLists').DataTable();

            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function ICSMultipleUnPostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#ShipmentLists').DataTable();

        dataTable.draw();
    }




    function ICSMultiplePush(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPush").val('Y');
            $("#SageShipmentNumber").val(result.data.sageShipmentNumber);


            var dataTable = $('#ShipmentLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function ICSMultiplePushFail(result) {
        console.log(result.message);
        ShowNotification(3, result.message);
        var dataTable = $('#ShipmentLists').DataTable();
        dataTable.draw();
    }




    function locationModalDblClick(row, originalRef) {

        var locationCode = row.find("td:first").text();
        /*   originalRef.closest("td").find("input").val(locationCode);*/

        /*var locationDescription = row.find("td:eq(1)").text();*/
        /*originalRef.closest('td').next().text(locationDescription);*/


        $("#locationModal").modal("hide");

        originalRef.closest("td").find("input").data("touched", false);

        originalRef.closest("td").find("input").focus();

    }


    function itemModalDblClick(row, originalRef) {
        var itemCode = row.find("td:first").text();
        originalRef.closest("td").find("input").val(itemCode);

        var itemDescription = row.find("td:eq(2)").text();
        var itemCategory = row.find("td:eq(4)").text();
        var itemunitofmeasure = row.find("td:eq(5)").text();

        var itemUnfrmt = row.find("td:eq(1)").text();



        originalRef.closest('td').next().next().text(itemUnfrmt);
        originalRef.closest('td').next().text(itemDescription);
        originalRef.closest('td').next('td').next('td').next().text(itemCategory);
        originalRef.closest('td').next('td').next('td').next('td').next().text(itemunitofmeasure);


        $("#itemModal").modal("hide");


        originalRef.closest("td").find("input").data("touched", false);


        originalRef.closest("td").find("input").focus();
    }

    function modalDblClick(row, originalRef) {

        var accountCode = row.find("td:first").text();
        var description = row.find("td:eq(1)").text();
        var statustype = row.find("td:eq(3)").text();

        if (statustype.trim() === "Inactive") {

            ShowNotification(3, "This Account " + accountCode + "is InActive!");
        }

        originalRef.closest("td").find("input").val(accountCode);
        originalRef.closest('td').next().text(description);



        $("#accountModal").modal("hide");

        originalRef.closest("td").find("input").data("touched", false);

        originalRef.closest("td").find("input").focus();


        $("#accountModal").html("");
    }


    function modalCustomerSetDblClick(row, originalRow) {
        var customerName = row.find("td:first").text();
        originalRow.closest("div.input-group").find("input").val(customerName);

        var customerDescription = row.find("td:eq(1)").text();
        var customerContract = row.find("td:eq(4)").text();

        $("#CustomerName").val(customerDescription);
        $("#Contact").val(customerContract);

        $("#customerModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }

    function modalPriceSetDblClick(row, originalRow) {
        var priceName = row.find("td:first").text();
        originalRow.closest("div.input-group").find("input").val(priceName);

        var priceDescription = row.find("td:eq(1)").text();
        $("#PriceDescription").val(priceDescription);


        $("#shPriceModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }



    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }


    var ICShipmentTable = function () {

        $('#ShipmentLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#ShipmentLists thead');


        var dataTable = $("#ShipmentLists").DataTable({
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
                url: '/Shipment/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),
                            "code": $("#md-Code").val(),
                            "customerno": $("#md-CustomerNo").val(),
                            "post": $("#md-Post").val(),
                            "push": $("#md-Push").val(),
                            "fromDate": $("#FromDate").val(),
                            "toDate": $("#ToDate").val()

                        });
                }
            },
            columns: [

                {
                    data: "id",
                    render: function (data) {

                        return "<a href=/Shipment/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'>&nbsp;</i></a>  " +
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
                    data: "customerNo",
                    name: "CustomerNo"
                    //"width": "20%"
                }
                ,
                
                {
                    data: "shipmentDate",
                    name: "ShipmentDate"

                }
                ,

                {
                    data: "isPost",
                    name: "post"
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

        $("#ShipmentLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#ShipmentLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }



    function save($table) {

        var data = $("#EntryType").val();
        if (data == "xx") {
            ShowNotification(3, "Please Select Entry Type First");
            return;
        }


        var validator = $("#frm_Shipment").validate();
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

        var receptMaster = serializeInputs("frm_Shipment");
        var receptDetails = serializeTable($table);



        //Required Feild Check

        var requiredFields = ['ItemNo', 'Location', 'ActivityTask', 'Quantity'];
        var fieldMappings = {
            'ItemNo': 'Item Number',
            'Location': 'Location',
            'ActivityTask': 'Activity Task',
            'Quantity': 'Quantity'
        };
        var errorMessage = getRequiredFieldsCheckObj(receptDetails, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;

        }


        receptMaster.ICShipmentDetailsList = receptDetails;

        ICShipmentsService.save(receptMaster, saveDone, saveFail);


    }


    function saveDone(result) {

        if (result.status == "200") {
            if (result.data.operation == "add") {

                var IsPushAllow = ($('#IsPushAllow').val() === "true");
                console.log(IsPushAllow)
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




}(ModalService, ICShipmentsService);