var ICTransfersController = function (CommonService, ModalService, ICTransfersService) {

    var init = function () {

        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }
        var IsPost = $('#IsPost').val();
        if (IsPost === 'Y') {
            Visibility(true);
        }



        LoadCombo("ProrationMethod", '/Common/ProrationMethod');
        LoadCombo("DocumentType", '/Common/DocumentType');

        var $table = $('#TransfersItemLists');

        

        var table = initEditTable($table, { searchHandleAfterEdit: false });



        //total amaounth calculation

        TotalCalculation();

        $table.on('click', '.remove-row-btn', function () {
            TotalCalculation();
        });

        $table.on('blur', 'input:not(.search)', function (e) {

            var $this = $(this);
            var type = $this.data('type');
            if (type === 'decimal') {
                TotalCalculation();

            }
        });
        $('#TransfersItemLists').on('blur', "td.td-Transfer-Quantity", function () {
            var Value = $(this).text();
            if (Value) {

            }
            var originalRow = $(this);

            if (Value > 0) {


            }

            TotalCalculation();


        });
        function TotalCalculation() {

            var amountTotal = 0;

            amountTotal = getColumnSumAttr('Transfer Quantity', 'TransfersItemLists').toFixed(2);


            $("#TotalAmount").val(Number(parseFloat(amountTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));

            

        }

        //end of amounth calculation



        $('#icrAddRow').on('click', function () {
            addRow($table);
        });




        $('#PostICT').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    SelectData(true);
                }

            });
        });
        $('#PushICT').on('click', function () {

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




        //extra code for pop up
        $('.btn-transfer').on('click', function () {
            var originalRef = $(this);
            ModalService.transferNumberModal({}, fail, function (row) { modalTransferSetDblClick(row, originalRef) });

        });
        //end of extra


        //$('#TransfersItemLists').on('click', ".ItemNo", function () {
        //    var originalRow = $(this);
        //    CommonService.itemNumberModal({}, fail, function (row) { itemModalDblClick(row, originalRow) });

        //});

        $('#TransfersItemLists').on('click', "input.txtItemNo", function () {
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
        $('.btn-toLocation-No').on('click', function () {
           
            var originalRow = $(this);
            CommonService.locationModal({}, fail, function (row) { locationModalDblClick(row, originalRow) });

        });

        //$('#TransfersItemLists').on('click', ".FromLocation", function () {
        //    var itemNo = $(this).closest("tr").find("td:eq(0)").text()

        //    var itemNo = itemNo.trim();

        //    //if (!itemNo) {
        //    //    alert('Please select a item number first.');
        //    //    return;
        //    //}
        //    var originalRow = $(this);
        //    CommonService.locationModal({}, fail, function (row) { locationModalDblClick(row, originalRow) }, itemNo);

        //});



        $('#TransfersItemLists').on('click', "input.txtFromLocation", function () {
       /* $('#TransfersItemLists').on('click', ".td-From-Location", function () {*/

            var itemNo = $(this).closest("tr").find("td:eq(0)").text()

            var itemNo = itemNo.trim();


            //if (!itemNo) {
            //    alert('Please select a item number first.');
            //    return;
            //}

            var originalRow = $(this);

            originalRow.closest("td").find("input").data('touched', true);

            CommonService.locationModal({},
                fail,
                //function (row) { locationModalDblClick(row, originalRow) },
                function (row) { FormlocationModalDblClick(row, originalRow) },
                function () {
                    originalRow.closest("td").find("input").data('touched', false);
                    originalRow.closest("td").find("input").focus();
                }, itemNo);

        });




        //$('#TransfersItemLists').on('click', ".ToLocation", function () {
        //    var itemNo = $(this).closest("tr").find("td:eq(0)").text()

        //    var itemNo = itemNo.trim();

        //    //if (!itemNo) {
        //    //    alert('Please select a item number first.');
        //    //    return;
        //    //}
        //    var originalRow = $(this);
        //    CommonService.locationModal({}, fail, function (row) { locationModalDblClick(row, originalRow) }, itemNo);

        //});



        $('#TransfersItemLists').on('click', "input.txtToLocation", function () {

            var itemNo = $(this).closest("tr").find("td:eq(0)").text()

            var itemNo = itemNo.trim();


            //if (!itemNo) {
            //    alert('Please select a item number first.');
            //    return;
            //}

            var originalRow = $(this);

            originalRow.closest("td").find("input").data('touched', true);

            CommonService.locationModal({},
                fail,
                function (row) { TolocationModalDblClick(row, originalRow) },
                function () {
                    originalRow.closest("td").find("input").data('touched', false);
                    originalRow.closest("td").find("input").focus();
                }, itemNo);

        });







        $('.btnSave').click(function () {
            save($table);
        });

        $('.btnReceiveSave').click(function () {
            Confirmation("Are you sure? Do You Want to Receive Data?", function (result) {
                if (result) {

                    var transferMaster = serializeInputs("frm_Transfers");
                    if (transferMaster.IsReceived == "Y") {
                        ShowNotification(3, "Data already Received!");
                    }
                    else {
                        transferMaster.IDs = transferMaster.Id;
                        ICTransfersService.ICTMultipleReceive(transferMaster, ICTMultipleReceive, ICTMultipleReceiveFail);
                    }
                        


                }

            });
        });
        
        $('.btnPost').click('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    var transferMaster = serializeInputs("frm_Transfers");
                    if (transferMaster.IsPost == "Y") {
                        ShowNotification(3, "Data has already been Posted.");
                    }
                    else {
                        transferMaster.IDs = transferMaster.Id;
                        ICTransfersService.ICTMultiplePost(transferMaster, ICTMultiplePost, ICTMultiplePostFail);

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

            var transferMaster = serializeInputs("frm_Transfers");

            transferMaster["ReasonOfUnPost"] = ReasonOfUnPost;
            Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
                    ShowNotification(3, "Please Write down Reason Of UnPost");
                    $("#ReasonOfUnPost").focus();
                    return;
                }
                if (result) {
                    if (transferMaster.IsPush === "Y") {
                        ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                    }
                    else {

                        transferMaster.IDs = transferMaster.Id;
                        ICTransfersService.ICTMultipleUnPost(transferMaster, ICTMultipleUnPost, ICTMultipleUnPostFail);
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

        //        var transferMaster = serializeInputs("frm_Transfers");
        //        transferMaster["ReasonOfUnPost"] = ReasonOfUnPost;
        //        Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
        //            if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
        //                ShowNotification(3, "Please Write down Reason Of UnPost");
        //                $("#ReasonOfUnPost").focus();
        //                return;
        //            }
        //            if (result) {
        //                if (transferMaster.IsPush === "Y") {
        //                    ShowNotification(3, "Unable to UnPost, Data has already been Pushed");
        //                }
        //                else {

        //                    transferMaster.IDs = transferMaster.Id;
        //                    ICTransfersService.ICTMultipleUnPost(transferMaster, ICTMultipleUnPost, ICTMultipleUnPostFail);
        //                }

        //            }
        //        });
        //    }




        //});



        $('.btnPush').click('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {

                    var transferMaster = serializeInputs("frm_Transfers");

                    transferMaster.IDs = transferMaster.Id;


                    if (transferMaster.IsPost == "N") { 
                        ShowNotification(3, "Please Data Post First!");
                    }
                    else {
                        if (transferMaster.IsPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.");

                        }
                        else {
                            transferMaster.IDs = transferMaster.Id;
                            ICTransfersService.ICTMultiplePush(transferMaster, ICTMultiplePush, ICTMultiplePushFail);


                        }
                    }

                }

            });

        });


        $('.btnReceiveSavePush').click('click', function () {



            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {

                    var transferMaster = serializeInputs("frm_Transfers");

                    transferMaster.IDs = transferMaster.Id;


                    if (transferMaster.IsReceived == "N") {
                        ShowNotification(3, "Please Data Receipt First!");
                    }
                    else {
                        if (transferMaster.IsTransitReceiptPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.");

                        }
                        else {
                            transferMaster.IDs = transferMaster.Id;
                            ICTransfersService.ICTMultiplePush(transferMaster, ICTMultiplePush, ICTMultiplePushFail);


                        }
                    }

                }

            });

        });






        //enter for location

        //$('#TransfersItemLists').on('keypress', "input.txtFromLocation", function (event) {
        //    //if (event.key !== "Enter") return;
        //    //var originalRow = $(this);
        //    //table.handleAfterEditWithVal(originalRow);

        //    if (event.key === "Enter") {

        //        var value = $(this).val();
        //        var originalRow = $(this);

        //        LocationDescCall(value, originalRow);

        //    }


        //});
        ////$('#TransfersItemLists').on('keypress', "input.txtToLocation", function (event) {

        //    //if (event.key !== "Enter") return;
        //    //var originalRow = $(this);
        //    //table.handleAfterEditWithVal(originalRow);

        //    if (event.key === "Enter") {

        //        var value = $(this).val();
        //        var originalRow = $(this);

        //        LocationDescCall(value, originalRow);

        //    }

        //});


        function LocationDescCall(value, originalRow) {

           

            CommonService.locationModal({}, fail, function (row) { locationModalDblClick(row, originalRow) });



        }


        function LocationNocallFail(result) {
            console.log(result);
            ShowNotification(3, "Something gone wrong");
        }






        //end of location

        //enter for searching of item

        $('#TransfersItemLists').on('keypress', "input.txtItemNo", function (event) {
            if (event.key === "Enter") {
                var value = $(this).val();
                var originalRow = $(this);


                ItemDescCall(value, originalRow);
            }

        });

        function ItemDescCall(value, originalRow) {

            var { error } = table.validateField(originalRow);
            if (error) return;

            ICTransfersService.ItemNocall(value,
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



        var indexTable = ICTransferTable();


        //var indexConfig = GetIndexTable();
        //var indexTable = $("#TransfersLists").DataTable(indexConfig);

        $("#indexSearch").click(function () {
            var data = $("#Branchs").val();
            if (data == "xx") {
                ShowNotification(3, "Please Select Branch Type First");
                return;
            }
            indexTable.draw();
        });
        //$("#download").on("click", function () {


      
        //    var Id = $("#Id").val();

        //    var url = '/Transfer/TransferExcel?Id=' + Id;
        //    var win = window.open(url, '_blank');

        //});
        $("#download").on("click", function () {
            var fromDate = $("#FromDate").val();
            var toDate = $("#ToDate").val();
            var branchId = $("#Branchs").val();
            if (branchId === "null") {
                branchId = null;

            }
        

            // Validate the date range and branch ID
            if (fromDate === "" || toDate === "" || branchId === "") {
                alert("Please select both 'from date', 'to date', and 'branch'.");
                return;
            }

            var url = '/Transfer/TransferExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;

            var Id = $("#Id").val();

            url += '&Id=' + (Id !== null ? Id : 'null');
            var win = window.open(url, '_blank');
        });



    }
    
    //end init

    function Visibility(action) {

        $('#frm_TransfersEntry').find(':input').prop('readonly', action);
        $('#frm_TransfersEntry').find('table, table *').prop('disabled', action);
        $('#frm_TransfersEntry').find(':input[type="button"]').prop('disabled', action);
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
        



        var dataTable = $('#TransfersLists').DataTable();

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
                /*ShowNotification(2, "Please select 'Invoice Not Posted Yet!'");*/
                ShowNotification(3, "Data has already been posted.");

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
            ICTransfersService.ICTMultiplePost(model, ICTMultiplePost, ICTMultiplePostFail);


        }
        else {
            ICTransfersService.ICTMultiplePush(model, ICTMultiplePush, ICTMultiplePushFail);

        }

    }


    function ICTMultiplePost(result) {
        console.log(result);

        if (result.status == "200") {
            ShowNotification(1, result.message);


            $("#IsPost").val('Y');
            $(".btnUnPost").show();
            $(".btnPush").show();
            Visibility(true);




            var dataTable = $('#TransfersLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }
    function ICTMultiplePostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#TransfersLists').DataTable();
        dataTable.draw();

    }
    function ICTMultipleUnPost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('N');
            Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();
            var dataTable = $('#TransfersLists').DataTable();
            dataTable.draw();



        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function ICTMultipleUnPostFail(result) {
        ShowNotification(3, "Something gone wrong");

        var dataTable = $('#TransfersLists').DataTable();
        dataTable.draw();

    }



    function ICTMultiplePush(result) {
        console.log(result);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPush").val('Y');

            $("#SageDocumentNumber").val(result.data.sageDocumentNumber);

            var dataTable = $('#TransfersLists').DataTable();
            dataTable.draw();
            

        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }
    function ICTMultiplePushFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#TransfersLists').DataTable();
        dataTable.draw();

    }



    function ICTMultipleReceive(result) {
        console.log(result);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsReceived").val('Y');


            var dataTable = $('#TransfersLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }
    function ICTMultipleReceiveFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#TransfersLists').DataTable();
        dataTable.draw();

    }

    //extra code for pop up
    function modalTransferSetDblClick(row, originalRow) {
        var transferName = row.find("td:first").text();
        originalRow.closest("div.input-group").find("input").val(transferName);

        var transferDescription = row.find("td:eq(1)").text();

        $("#TransferNumberDescription").val(transferDescription);

        $("#customerModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }
    //end 


    function locationModalDblClick(row, originalRef) {

        originalRef.closest("td").find("input").val(locationCode);

        var locationCode = row.find("td:eq(0)").text();


        $("#ToLocation").val(locationCode)

        $("#locationModal").modal("hide");
        SetToLocation();
       


    }

    function TolocationModalDblClick(row, originalRef) {

        //originalRef.closest("td").find("input").val(locationCode);

        //var locationCode = row.find("td:eq(0)").text();


        //$("#ToLocation").val(locationCode)

        $("#locationModal").modal("hide");
        //SetToLocation();



    }
    function FormlocationModalDblClick(row, originalRef) {

        //originalRef.closest("td").find("input").val(locationCode);

       // var locationCode = row.find("td:eq(0)").text();


        //$("#ToLocation").val(locationCode)

        $("#locationModal").modal("hide");
        //SetToLocation();

    } 

    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }
    function itemModalDblClick(row, originalRef) {
        var itemCode = row.find("td:first").text();
        originalRef.closest("td").find("input").val(itemCode);

        var itemDescription = row.find("td:eq(2)").text();
        var itemUnfrmt = row.find("td:eq(1)").text();



        originalRef.closest('td').next().text(itemDescription);
        originalRef.closest('td').next().next().text(itemUnfrmt);



        $("#itemModal").modal("hide");

        originalRef.closest("td").find("input").data("touched", false);


        originalRef.closest("td").find("input").focus();
    }

    function save($table) {

        var data = $("#ProrationMethod").val();
        if (data == "xx") {
            ShowNotification(3, "Please Select Proration Method First");
            return;
        }
        var doc = $("#DocumentType").val();
        if (doc == "xx") {
            ShowNotification(3, "Please Select Document Type First");
            return;
        }

        var FromLocation = $("#FromLocation").val();
        var ToLocation = $("#ToLocation").val();
        if (FromLocation === ToLocation) {
            ShowNotification(3, "Please Select Different Location ");
            return;
        }

        var validator = $("#frm_Transfers").validate();
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

        var trasnferMaster = serializeInputs("frm_Transfers");


        if (trasnferMaster.IsPush == 'Y') {
            ShowNotification(3, "Update cannot be performed because the data has already been pushed.");
            return;
        }

        var trasnferDetails = serializeTable($table);



        //Required Feild Check

        var requiredFields = ['ItemNo', 'TransferQuantity'];
        var fieldMappings = {
            'ItemNo': 'Item Number',
        
            'TransferQuantity': 'Transfer Quantity'
        };
        var errorMessage = getRequiredFieldsCheckObj(trasnferDetails, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;

        }



        trasnferMaster.ICTransferDetailsList = trasnferDetails;

        ICTransfersService.save(trasnferMaster, saveDone, saveFail);



    }

    function saveDone(result) {
        debugger
        //result.status = "200";

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




    var ICTransferTable = function () {

        $('#TransfersLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#TransfersLists thead');
        var type = $('#IsReceived').val()

        var dataTable = $("#TransfersLists").DataTable({
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
                url: '/Transfer/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "SageDocumentNumber": $("#SageDocumentNumber").val(),
                            "DocumentDateFrom": $("#DocumentDateFrom").val(),
                            "DocumentDateTo": $("#DocumentDateTo").val(),
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),

                            "code": $("#md-Code").val(),
                            "transferNumber": $("#md-TransferNumber").val(),
                            "post": $("#md-Post").val(),
                            "push": $("#md-Push").val(),
                            "IsReceived": $('#IsReceived').val(),
                            "fromDate": $("#FromDate").val(),
                            "toDate": $("#ToDate").val()
                            //"isReceived": $('#md-IsReceived').val()


                        });
                }
            },
            columns: [

                {
                    data: "id",
                    render: function (data) {
                        return "<a href=/Transfer/Edit/?id=" + data + "&type=" + type + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'>&nbsp;</i></a>  " +
                            "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >";
                    },
                    //"width": "7%",
                    "orderable": false
                },
                {
                    data: "code",
                    name: "code",
                    width: "2%"
                },
                {
                    data: "transferNumber",
                    name: "TransferNumber"
                    //"width": "7%"
                },
                {
                    data: "branchCode",
                    name: "BranchCode"
                    //"width": "7%"
                },
                {
                    data: "toLocation",
                    name: "ToLocation"
                   // "width": "7%"
                },
                {
                    data: "documentDate",
                    name: "documentDate"
                    //"width": "10%"
                },
                {
                    data: "isReceived",
                    name: "IsReceived",
                    //"width": "7%"
                },
                {
                    data: "transferReceiveDate",
                    name: "TransferReceiveDate"
                    //"width": "7%"
                }
                ,
                {
                    data: "isPost",
                    name: "IsPost"
                    //"width": "7%"
                },
                {
                    data: "isPush",
                    name: "IsPush"
                    //"width": "7%"
                }
                ,
                {
                    data: "isTransitReceiptPush",
                    name: "IsTransitReceiptPush"
                    //"width": "7%"
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

                    $(cell).html('<select class="acc-filters filter-input "       id="md-' + title.replace(/ /g, "") + '"><option>Select</option><option>Y</option><option>N</option></select>');

                }
                //style = "width:100%"

                else {
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');
                }


                  //if ($(cell).hasClass('boolTP')) {

                  //     $(cell).html('<select class="acc-filters filter-input " style="width:100%"  id="md-' + title.replace(/ /g, "") + '"><option>Select</option><option>Received</option><option>Transit</option></select>');

                  //}


            });

        }

        $("#TransfersLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#TransfersLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    return {
        init: init
    }

}(CommonService, ModalService, ICTransfersService);