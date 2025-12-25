var ICReceiptsController = function (CommonService, ICReceiptsService) {



    var init = function () {

        var $table = $('#ICRItemLists');

        
        
        var IsPost = $('#IsPost').val();
        if (IsPost === 'Y') {
            Visibility(true);
        }



        var table = initEditTable($table, { searchHandleAfterEdit: false });

        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }


        TotalCalculation();

        $table.on('click', '.remove-row-btn', function () {
            TotalCalculation();
        });

        //postpushCheck


        $('#icrAddRow').on('click', function () {
            addRow($table);
        });


        $('#PostICR').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    SelectData(true);
                }
            });

        });

        $('#PushICR').on('click', function () {
            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {
                    SelectData(false);
                }
            });

        });

        /// for excel button
      

        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });



        $('#ICRItemLists').on('click', "input.txtItemNo", function () {
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

   


        $('#ICRItemLists').on('click', "input.txtLocation", function () {

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
                },itemNo);

        });






        function locationModalDblClick(row, originalRef) {

            var locationCode = row.find("td:first").text();

            $("#locationModal").modal("hide");


            originalRef.closest("td").find("input").data("touched", false);


            originalRef.closest("td").find("input").focus();

        }

        //for vendor
        $('#VendorNumber').change(function () {
            var value = $(this).val();
            
                var originalRow = $(this);


                VendorDescCall(value, originalRow);
           
        });

        $('#VendorNumber').on('keypress', function (event) {
            if (event.key === "Enter") {
                
                var value = $(this).val();
               
                    var originalRow = $(this);


                    VendorDescCall(value, originalRow);
              
               
            }
        });


        function VendorDescCall(value, originalRow) {

            var { error } = table.validateField(originalRow);
            if (error) return;

            ICReceiptsService.VendorNocall(value,
                function (result) {

                    var vendorCode = result.data[0].vendorCode;
                    var vendorName = result.data[0].vendorName;
                    var currencyCode = result.data[0].currencyCode;



                    if (vendorCode == null || vendorCode == "") {
                        $("#VendorName").val("");
                        $("#VendorCode").val("");
                        ShowNotification(3, "Vendor number is not correct , Please select correct vendor number");
                        table.handleAfterEdit(originalRow);

                    } else {

                        $("#VendorName").val(vendorName);
                        $("#VendorCode").val(currencyCode);

                        table.handleAfterEdit(originalRow);
                    }


                },
                VendorNocallFail);
        }


        function VendorNocallFail(result) {
            console.log(result);
            ShowNotification(3, "Something gone wrong");
        }


        //for location

        $('#ICRItemLists').on('keypress', "input.txtLocation", function (event) {

           

            if (event.key === "Enter") {
                var value = $(this).val();
                var originalRow = $(this);


                LocationDescCall(value, originalRow);
            }
        });


        function LocationDescCall(value, originalRow) {

            var { error } = table.validateField(originalRow);
            if (error) return;

            ICReceiptsService.LocationNocall(value,
                function (result) {

                    var locationNo = result.data[0].location;
                    var itemUnformatted = result.data[0].itemUnformatted;


                    if (locationNo == null || locationNo == "") {
                        //originalRow.closest("tr").find("td:eq(1)").text("");
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

        $('#ICRItemLists').on('keypress', "input.txtItemNo", function (event) {
            if (event.key === "Enter") {
                var value = $(this).val();
                var originalRow = $(this);


                ItemDescCall(value, originalRow);
            }

        });



        $('#ICRItemLists').on('blur', ".td-Quantity", function (event) {

            computeSubtotal($(this));


        });



        $('#ICRItemLists').on('blur', ".td-UnitCost", function (event) {


            computeSubtotal($(this));

        });


        function computeSubtotal(row) {
            try {
                var qty = parseFloat(row.closest("tr").find("td:eq(4)").text().replace(',', ''));
                var unitCost = parseFloat(row.closest("tr").find("td:eq(5)").text().replace(',', ''));



                if (!isNaN(qty * unitCost)) {

                    var val = Number(parseFloat(qty * unitCost).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
                    row.closest("tr").find("td:eq(6)").text(val);


                    TotalCalculation();


                }
            } catch (ex) {

            }
        }

        function TotalCalculation() {
            var SubTotal = 0;
            var QuantityTotal = 0;

            SubTotal = getColumnSumAttr('Subtotal', 'ICRItemLists').toFixed(2);
            QuantityTotal = getColumnSumAttr('Quantity', 'ICRItemLists').toFixed(2);


            $("#TotalAmount").val(Number(parseFloat(SubTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
            $("#QuantityAmount").val(Number(parseFloat(QuantityTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));


           
        }



        function ItemDescCall(value, originalRow) {

            var { error } = table.validateField(originalRow);
            if (error) return;

            ICReceiptsService.ItemNocall(value,
                function (result) {

                    var ItemNo = result.data[0].itemNumber;
                    var itemUnformatted = result.data[0].itemUnformatted;


                    if (ItemNo == null || ItemNo == "") {
                        originalRow.closest("tr").find("td:eq(1)").text("");
                        ShowNotification(3, "Item no is not correct");
                    } else {

                        
                        originalRow.closest("tr").find("td:eq(1)").text(result.data[0].description);
                        originalRow.closest("tr").find("td:eq(2)").text(result.data[0].itemUnformatted);

                       


                        table.handleAfterEdit(originalRow);
                    }


                },
                ItemNocallFail);



        }

        //end searching



        $('.btn-vendor').on('click', function () {
            var originalRef = $(this);
            CommonService.vendorNumberModal({}, fail, function (row) { modalVendorSetDblClick(row, originalRef) });

        });


        var indexTable = ICReceiptTable();


        $("#indexSearch").click(function () {
            var branchType = $("#Branchs").val();
            var fromDate = $("#FromDate").val();
            var toDate = $("#ToDate").val();

            if (branchType == "xx") {
                ShowNotification(3, "Please Select Branch Type First");
                return;
            }

            if (!fromDate || !toDate) {
                ShowNotification(3, "Please Select both From Date and To Date");
                return;
            }

            indexTable.draw();
        });


        //$("#indexSearch").click(function () {
        //    var data = $("#Branchs").val();
        //    if (data == "xx") {
        //        ShowNotification(3, "Please Select Branch Type First");
        //        return;
        //    }
        //    indexTable.draw();
        //});

        //$("#download").on("click", function () {


           
        //    var Id = $("#Id").val();

        //    var url = '/Receipt/ReceiptExcel?Id=' + Id;
        //    var win = window.open(url, '_blank');

        //});

        $("#download").on("click", function () {
            var fromDate = $("#FromDate").val();
            var toDate = $("#ToDate").val();
            var branchId = $("#Branchs").val();
            if (branchId ==="null"){
                branchId = null;

            }
            console.log(branchId)

            // Validate the date range and branch ID
            if (fromDate === "" || toDate === "" || branchId === "") {
                alert("Please select both 'from date', 'to date', and 'branch'.");
                return;
            }

            var url = '/Receipt/ReceiptExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId ;

            var Id = $("#Id").val();
            
            url += '&Id=' + (Id !== null ? Id : 'null');
            var win = window.open(url, '_blank');
        });

        $(".btnSave").click(function () {
            save($table);
        });


        $('.btnPost').click('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {


                    var receiptMaster = serializeInputs("frm_Receipt");
                    if (receiptMaster.IsPost == "Y") {
                        ShowNotification(3, "Data has already been Posted.");
                    }
                    else {
                        receiptMaster.IDs = receiptMaster.Id;
                        ICReceiptsService.ICRMultiplePost(receiptMaster, ICRMultiplePost, ICRMultiplePostFail);
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

            var receiptMaster = serializeInputs("frm_Receipt");

            receiptMaster["ReasonOfUnPost"] = ReasonOfUnPost;
            Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
                    ShowNotification(3, "Please Write down Reason Of UnPost");
                    $("#ReasonOfUnPost").focus();
                    return;
                }
                if (result) {
                    if (receiptMaster.IsPush === "Y") {
                        ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                    }
                    else {

                        receiptMaster.IDs = receiptMaster.Id;
                        ICReceiptsService.ICRMultipleUnPost(receiptMaster, ICRMultipleUnPost, ICRMultipleUnPostFail);
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

        //        var receiptMaster = serializeInputs("frm_Receipt");
        //        receiptMaster["ReasonOfUnPost"] = ReasonOfUnPost;
        //        Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
        //            if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
        //                ShowNotification(3, "Please Write down Reason Of UnPost");
        //                $("#ReasonOfUnPost").focus();
        //                return;
        //            }
        //            if (result) {
        //                if (receiptMaster.IsPush === "Y") {
        //                    ShowNotification(3, "Unable to UnPost, Data has already been Pushed!");
        //                }
        //                else {

        //                    receiptMaster.IDs = receiptMaster.Id;
        //                    ICReceiptsService.ICRMultipleUnPost(receiptMaster, ICRMultipleUnPost, ICRMultipleUnPostFail);
        //                }

        //            }
        //        });
        //    }
        //});

        $('.btnPush').click('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {


                    var receiptMaster = serializeInputs("frm_Receipt");

                    receiptMaster.IDs = receiptMaster.Id;

                    if (receiptMaster.IsPost == "N") {
                        ShowNotification(3, "Please Data Post First!");
                    }

                    else {
                        if (receiptMaster.IsPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.");

                        }
                        else {
                            receiptMaster.IDs = receiptMaster.Id;
                            ICReceiptsService.ICRMultiplePush(receiptMaster, ICRMultiplePush, ICRMultiplePushFail);


                        }
                    }
                }
            });

        });

    }

    /*init end*/
    function Visibility(action) {

        $('#frm_ReceiptEntry').find(':input').prop('readonly', action);
        $('#frm_ReceiptEntry').find('table, table *').prop('disabled', action);
        $('#frm_ReceiptEntry').find(':input[type="button"]').prop('disabled', action);

    };


    function ItemNocallFail(result) {
        console.log(result);
        ShowNotification(3, "Something gone wrong");
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

        //getBranchId From Dropdown
        //var branchId = $('#Branchs').val();
        //if (branchId == null) {
        //    var branchId = $('#CurrentBranchId').val();
        //}
        //model.branchId = branchId;
        //endregion

        var dataTable = $('#ReceiptLists').DataTable();

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
                //ShowNotification(2, "Please select 'Invoice Not Posted Yet!'");
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
                //ShowNotification(3, "Data has already been pushed.");
                return;
            }
        }


        if (IsPost) {
            ICReceiptsService.ICRMultiplePost(model, ICRMultiplePost, ICRMultiplePostFail);


        }
        else {
            ICReceiptsService.ICRMultiplePush(model, ICRMultiplePush, ICRMultiplePushFail);

        }

    }


    

    


    function ICRMultiplePost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPost").val('Y');
            $(".btnUnPost").show();
            $(".btnPush").show();
            Visibility(true);

    

            var dataTable = $('#ReceiptLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function ICRMultiplePostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#ReceiptLists').DataTable();
        dataTable.draw();
        
    }


    function ICRMultipleUnPost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('N');
            Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();

            var dataTable = $('#ReceiptLists').DataTable();

            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function ICRMultipleUnPostFail(result) {
        ShowNotification(3, "Something gone wrong");

        indexTable.draw();
    }





    function ICRMultiplePush(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPush").val('Y');
            $("#ReceiptNumber").val(result.data.receiptNumber);

            var dataTable = $('#ReceiptLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }
    function ICRMultiplePushFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#ReceiptLists').DataTable();
        dataTable.draw();
       
    }













    function itemModalDblClick(row, originalRef) {
        var itemCode = row.find("td:first").text();
        originalRef.closest("td").find("input").val(itemCode);

        var itemUnfrmt = row.find("td:eq(1)").text();
        var itemDescription = row.find("td:eq(2)").text();       

        originalRef.closest('td').next().text(itemDescription);
        originalRef.closest('td').next().next().text(itemUnfrmt);
        

        $("#itemModal").modal("hide");
        originalRef.closest("td").find("input").data("touched", false);
        originalRef.closest("td").find("input").focus();

    }



    function modalVendorSetDblClick(row, originalRow) {

        var vendorCode = row.find("td:first").text();
        var vendornName = row.find("td:eq(2)").text();
        var vendornCode = row.find("td:eq(6)").text();

        originalRow.closest("div.input-group").find("input").val(vendorCode);
        originalRow.closest("div.input-group").find("input").focus();


        $("#VendorName").val(vendornName);
        $("#VendorCode").val(vendornCode);

        $("#vendorModal").modal("hide");
    }

    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }


    var ICReceiptTable = function () {

        $('#ReceiptLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#ReceiptLists thead');


        var dataTable = $("#ReceiptLists").DataTable({
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
                url: '/Receipt/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),
                            "code": $("#md-Code").val(),
                            "ponumber": $("#md-PONumber").val(),
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

                        return "<a href=/Receipt/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'>&nbsp;</i></a>  " +
                            "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"
                            ;

                    },
                    "width": "9%",
                    "orderable": false
                },
                {
                    data: "code",
                    name: "code"

                },


                {
                    data: "poNumber",
                    name: "poNumber"

                }
                ,
                {
                    data: "receiptDate",
                    name: "receiptDate"

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
               
                var cell = $('.filters th').eq($(dataTable.column(colIdx).header()).index());

                var title = $(cell).text();

                
                if ($(cell).hasClass('action')) {
                    $(cell).html(''); 

                } else if ($(cell).hasClass('bool')) {

                    $(cell).html('<select class="acc-filters filter-input " style="width:100%"  id="md-' + title.replace(/ /g, "") + '"><option>Select</option><option>Y</option><option>N</option></select>');

                } else {
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');
                }
            });
        }




        $("#ReceiptLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#ReceiptLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    function save($table) {


        var validator = $("#frm_Receipt").validate();
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

        var receptMaster = serializeInputs("frm_Receipt");

        //if (receptMaster.VendorName == "" || receptMaster.VendorName == null) {
        //    ShowNotification(3, "Vendor number is not correct , Please select correct vendor number");
        //    return;
        //}
        if (receptMaster.IsPush == 'Y') {
            ShowNotification(3, "Update cannot be performed because the data has already been pushed.");
            return;
        }

        var receptDetails = serializeTable($table);

        console.log(receptDetails);



        //Required Feild Check

        var requiredFields = ['ItemNo', 'Location', 'Quantity', 'UnitCost'];
        var fieldMappings = {
            'ItemNo': 'Item Number ',
            'Location': 'Location ',
            'Quantity': 'Quantity Received ',
            'UnitCost': 'Unit Cost'
           
        };
        var errorMessage = getRequiredFieldsCheckObj(receptDetails, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;

        }



        receptMaster.ICReceiptDetailsList = receptDetails;

        ICReceiptsService.save(receptMaster, saveDone, saveFail);



    }


    function saveDone(result) {
        debugger
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


}(CommonService, ICReceiptsService);