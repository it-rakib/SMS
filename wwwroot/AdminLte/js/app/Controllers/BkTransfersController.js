var BkTransfersController = function (CommonService, BkTransfersService) {

    var init = function () {
        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }

        var IsPost = $('#IsPost').val();
        if (IsPost === 'Y') {
            Visibility(true);
        }

        //var indexConfig = GetIndexTable();
        //var indexTable = $("#BkTransfersLists").DataTable(indexConfig);
        var indexTable = BKTable();


        $("#btnAdd").on("click", function () {

            rowAdd(detailTable);

        });

        $('#Post').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    SelectData(true);

                }
            });
        });

        $('#Push').on('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {
                    SelectData(false);
                }
            });

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

            var url = '/BkTransfers/BkTransfersExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;

            var Id = $("#BkTransfersId").val();

            url += '&Id=' + (Id !== null ? Id : 'null');
            var win = window.open(url, '_blank');
        });


        $("#ModalButtonCloseFooter").click(function () {
            addPrevious(detailTable);
        });


        $("#ModalButtonCloseHeader").click(function () {
            addPrevious(detailTable);
        });

        $('.btn-Currency').on('click', function () {
            var originalRef = $(this);
            CommonService.currencyCodeModal({}, fail, function (row) { currencyCodeSetDblClick(row, originalRef) });

        });

        $('.btn-gltransfer').on('click', function () {
            var originalRef = $(this);
            CommonService.accountCodeModal({}, fail, function (row) { modalDblClick(row, originalRef) });

        });


        //for TransferAmount
        $('#TransferAmount').change(function () {

            var transferamount = $("#TransferAmount").val();

            $("#DepositAmount").val(transferamount);
            $("#TransferAmount").val(transferamount);

            //$("#DepositAmount").val(Number(parseFloat(transferamount).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
            //$("#TransferAmount").val(Number(parseFloat(transferamount).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));


        });



        //for DepositAmount
        //$('#DepositAmount').change(function () {

        //    var depositAmount = $("#DepositAmount").val();
        //    $("#TransferAmount").val(depositAmount);
        //    //$("#TransferAmount").val(Number(parseFloat(depositAmount).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
        //    //$("#DepositAmount").val(Number(parseFloat(depositAmount).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));

        //});



        //check transfer charhge

       

        //$('#GLAccountCodeForTransferCharge').change(function () {

        //    var transgercharge = $("#TransferCharge").val();
        //    var glaccount = $("#GLAccountCodeForTransferCharge").val();

        //    if (transgercharge == 0) {
        //        ShowNotification(3, "Please insert Transger Amount first");
        //        return;
        //    }

        //});
        





        $('.btnSave').click('click', function () {
            saveTransfers();
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
                        transferMaster.IDs = transferMaster.BkTransfersId;
                        BkTransfersService.APMultiplePost(transferMaster, APMultiplePost, APMultiplePostFail);


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

                        transferMaster.IDs = transferMaster.BkTransfersId;
                        BkTransfersService.BKMultipleUnPost(transferMaster, BKMultipleUnPost, BKMultipleUnPostFail);
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

        //                    transferMaster.IDs = transferMaster.BkTransfersId;
        //                    BkTransfersService.BKMultipleUnPost(transferMaster, BKMultipleUnPost, BKMultipleUnPostFail);
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

                    transferMaster.IDs = transferMaster.BkTransfersId;

                    if (transferMaster.IsPost == "N") {
                        ShowNotification(3, "Please Data Post First!");
                    }

                    else {
                        if (transferMaster.IsPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.");

                        }
                        else {
                            transferMaster.IDs = transferMaster.BkTransfersId;
                            BkTransfersService.APMultiplePush(transferMaster, APMultiplePush, APMultiplePushFail);

                        }
                    }

                   
                }
            });
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

        $('.btn-toBank').on('click', function () {
            var originalRef = $(this);
            CommonService.bankCodeModal({}, fail, function (row) { modalTobankSetDblClick(row, originalRef) });

        });


        $('.btn-fromBank').on('click', function () {
            var originalRef = $(this);
            CommonService.bankCodeModal({}, fail, function (row) { modalFrombankSetDblClick(row, originalRef) });

        });



        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });


    }

    //end of init



    function Visibility(action) {
        
        $('#frm_TransfersEntry').find(':input').prop('readonly', action);
        $('#frm_TransfersEntry').find('table, table *').prop('disabled', action);

    };



    function modalDblClick(row, originalRef) {
        var accountCode = row.find("td:first").text();
        var description = row.find("td:eq(1)").text();

        originalRef.closest("div.input-group").find("input").val(accountCode);
        $("#GLAccountCodeForTransferChargeDescription").val(description);


        $("#accountModal").modal("hide");
        originalRef.closest("td").find("input").focus();

        $("#accountModal").html("");
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
        //var branchId = $('#Branchs').val();
        //if (branchId == null) {
        //    var branchId = $('#CurrentBranchId').val();
        //}
        //model.branchId = branchId;


        var dataTable = $('#BkTransfersLists').DataTable();

        var rowData = dataTable.rows().data().toArray();
        var filteredData = [];
        var filteredData1 = [];
        if (IsPost) {
            filteredData = rowData.filter(x => x.isPost === "Y" && IDs.includes(x.bkTransfersId.toString()));

        }
        else {
            filteredData = rowData.filter(x => x.isPush === "Y" && IDs.includes(x.bkTransfersId.toString()));
            filteredData1 = rowData.filter(x => x.isPost === "N" && IDs.includes(x.bkTransfersId.toString()));
        }

        //console.log(IDs)
        //console.log(dataTable)
        //console.log(filteredData)
        //console.log(filteredData.length)


        if (IsPost) {
            if (filteredData.length > 0) {
                /* ShowNotification(2, "Please select 'Invoice Not Posted Yet!'");*/
                ShowNotification(3, "Data has already been Posted.");


                return;
            }

        }
        else {
            if (filteredData.length > 0) {
                /* ShowNotification(2, "Please select 'Invoice Not Pushed Yet!'");*/
                ShowNotification(3, "Data has already been Pushed.");


                return;
            }
            if (filteredData1.length > 0) {
                //ShowNotification(2, "Please select 'Invoice Already Pushed!'");
                ShowNotification(3, "Please Data Post First!");

                return;
            }
        }


        if (IsPost) {
            BkTransfersService.APMultiplePost(model, APMultiplePost, APMultiplePostFail);


        }
        else {
            BkTransfersService.APMultiplePush(model, APMultiplePush, APMultiplePushFail);

        }





    }

    function APMultiplePost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('Y');
            $(".btnUnPost").show();
            $(".btnPush").show();
            Visibility(true);



            dataTable = $('#BkTransfersLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function APMultiplePostFail(result) {
        console.log(result.message);
        ShowNotification(3, result.message);
        dataTable = $('#BkTransfersLists').DataTable();
        dataTable.draw();
    }

    BKMultipleUnPost

    function BKMultipleUnPost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('N');
            Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();


            dataTable = $('#BkTransfersLists').DataTable();

            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function BKMultipleUnPostFail(result) {
        ShowNotification(3, "Something gone wrong");
        dataTable = $('#BkTransfersLists').DataTable();

        dataTable.draw();
    }







    function APMultiplePush(result) {
        console.log(result.message);

        console.log(result.data);
        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPush").val('Y');
            $("#SageTransferNo").val(result.data.sageTransferNo);

            
            dataTable = $('#BkTransfersLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function APMultiplePushFail(result) {
        ShowNotification(3, "Something gone wrong");
        dataTable = $('#BkTransfersLists').DataTable();
        dataTable.draw();
    }








    function currencyCodeSetDblClick(row, originalRow) {
        var currencyCode = row.find("td:first").text();
        originalRow.closest("div.input-group").find("input").val(currencyCode);

        $("#CCodeModel").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }
    function modalTobankSetDblClick(row, originalRow) {
        var bankCode = row.find("td:first").text();
        var description = row.find("td:eq(1)").text();
        var bankaccountno = row.find("td:eq(2)").text();
        var bankcurrency = row.find("td:eq(3)").text();


        originalRow.closest("div.input-group").find("input").val(bankCode);
        $("#ToBankDescription").val(description);
        $("#ToBankAccountNo").val(bankaccountno);
        $("#ToCurrencyCode").val(bankcurrency);


        $("#BCodeModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }




    function modalFrombankSetDblClick(row, originalRow) {
        var bankCode = row.find("td:first").text();
        var description = row.find("td:eq(1)").text();

        var bankaccountno = row.find("td:eq(2)").text();
        var bankcurrency = row.find("td:eq(3)").text();




        originalRow.closest("div.input-group").find("input").val(bankCode);
        $("#FromBankDescription").val(description);
        $("#FromBankAccountNo").val(bankaccountno);
        $("#FromCurrencyCode").val(bankcurrency);



        $("#BCodeModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }

    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }


    var BKTable = function () {

        $('#BkTransfersLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#BkTransfersLists thead');


        var dataTable = $("#BkTransfersLists").DataTable({
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
                url: '/BkTransfers/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "Code": $("#Code").val(),

                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),

                            "fromDate": $("#FromDate").val(),
                            "toDate": $("#ToDate").val(),

                            "code": $("#md-Code").val(),
                            "transferAmount": $("#md-TransferAmount").val(),
                            "post": $("#md-Post").val(),
                            "push": $("#md-Push").val()


                        });
                }
            },
            columns: [

                {
                    data: "bkTransfersId",
                    render: function (data) {

                        return "<a href=/BkTransfers/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>   " +
                            "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"
                            ;
                    },
                    "width": "7%",
                    "orderable": false
                }
                ,
                {
                    data: "code",
                    name: "code"
                    //"width": "20%"
                }
                ,
                {
                    data: "transferAmount",
                    name: "transferAmount"
                    //"width": "20%"
                }
                ,
                {
                    data: "transferPostingDate",
                    name: "TransferPostingDate"
                    //"width": "20%"
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

        $("#BkTransfersLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#BkTransfersLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    function saveTransfers() {


       

            var transgercharge = $("#TransferCharge").val();
            var glaccount = $("#GLAccountCodeForTransferCharge").val();


           if (transgercharge < 0) {
            ShowNotification(3, "Please insert a number more than zero");
            return;
           }
            if (transgercharge > 0 && glaccount == "") {
                ShowNotification(3, "Please insert G/L Account first");
                $("#GLAccountCodeForTransferChargeDescription").val("");
                return;
            }

           if (transgercharge == 0 && glaccount != "") {
                ShowNotification(3, "Please insert Transger Amount first");
                return;
          }
           if (transgercharge == 0 && glaccount == "") {
            $("#GLAccountCodeForTransferChargeDescription").val("");
          }
          


        var validator = $("#frm_Transfers").validate();
        var bktansfersMaster = serializeInputs("frm_Transfers");

        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }

        BkTransfersService.save(bktansfersMaster, saveDone, saveFail);
    }
    function saveDone(result) {

        if (result.status == "200") {
            if (result.data.operation == "add") {
                var IsPushAllow = ($('#IsPushAllow').val() === "true");
                console.log(IsPushAllow)
                ShowNotification(1, result.message);
                $(".btnSave").html('Update');
                $(".btnSave").addClass('sslUpdate');
                $("#BkTransfersId").val(result.data.bkTransfersId);
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
            ShowNotification(3, result.error || result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(1, result.message); // <-- display the error message here
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









    return {
        init: init
    }


}(CommonService, BkTransfersService);