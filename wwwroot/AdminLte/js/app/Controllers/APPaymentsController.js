var APPaymentsController = function (CommonService, APPaymentsService) {


    var init = function () {

        LoadCombo("ApplyMethod", '/Common/ApplyMethod');
        LoadCombo("DocumentType", '/Common/GetAPDocumentType');
        LoadCombo("OrderBy", '/Common/OrderBy');
        LoadCombo("TransactionType", '/Common/TransactionType');


        var $table = $('#APPaymentItemLists');
        var table = initEditTable($table, { searchHandleAfterEdit: false });


        var indexTable = PaymentTable();


        $('#appaymentAddRow').on('click', function () {
            addRow($table);
        });


        var IsPost = $('#IsPost').val();
        if (IsPost === 'Y') {
            Visibility(true);
        }



        $('#PostAP').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {
                    SelectData(true);
                }
            });

        });
        $('#PushAP').on('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {
                    SelectData(false);
                }
            });
        });
        $('.btn-bank').on('click', function () {
            var originalRef = $(this);
            CommonService.bankCodeModal({}, fail, function (row) { modalbankSetDblClick(row, originalRef) });

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

            var url = '/APPayments/APPaymentExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;

            var Id = $("#APPaymentsId").val();

            url += '&Id=' + (Id !== null ? Id : 'null');
            var win = window.open(url, '_blank');
        });

        $('#APPAYMENT').on('click', function () {


            const form = document.createElement('form');
            form.method = 'post';
            form.action = '/APPayments/Create';

            const batchNoInput = document.createElement('input');
            batchNoInput.type = 'hidden';
            batchNoInput.name = 'SageBatchNo';
            batchNoInput.value = $('#SageBatchNo').val();

            const batchDescriptionInput = document.createElement('input');
            batchDescriptionInput.type = 'hidden';
            batchDescriptionInput.name = 'SageBatchDescription';
            batchDescriptionInput.value = $('#SageBatchDescription').val();

            form.appendChild(batchNoInput);
            form.appendChild(batchDescriptionInput);

            document.body.appendChild(form);

            form.submit();
            form.remove();

        });

        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });


        $('.btn-vendor').on('click', function () {
            var originalRef = $(this);
            CommonService.vendorNumberModal({}, fail, function (row) { modalVendorSetDblClick(row, originalRef) });

        });

        $('.btn-APBatch').on('click', function () {
            var originalRef = $(this);
            CommonService.apBatchModal({}, fail, function (row) { modalAPBatchSetDblClick(row, originalRef) });

        });

        $('.btn-AccountSet').on('click', function () {
            var originalRef = $(this);
            CommonService.accountSetModal({}, fail, function (row) { modalAccountSetDblClick(row, originalRef) });

        });
        $('.btn-APPaymentCode').on('click', function () {
            var originalRef = $(this);
            CommonService.apPaymentModal({}, fail, function (row) { modalAPPaymentCodeDblClick(row, originalRef) });

        });
        $('.btn-APRimitTo').on('click', function () {
            var originalRef = $(this);
            CommonService.apRimitToModal({}, fail, function (row) { modalAPRimitToDblClick(row, originalRef) });

        });



        $("#btnAdd").on("click", function () {

            rowAdd(detailTable);

        });


        $("#ModalButtonCloseFooter").click(function () {
            addPrevious(detailTable);
        });


        $("#ModalButtonCloseHeader").click(function () {
            addPrevious(detailTable);
        });



        $('.btnSave').click('click', function () {
            savePAYMents($table);
        });

        $('.btnPost').click('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {


                    var apaymentMaster = serializeInputs("frm_Payments");
                    if (apaymentMaster.IsPost == "Y") {
                        ShowNotification(3, "Data has already been Posted.");
                    }
                    else {
                        apaymentMaster.IDs = apaymentMaster.APPaymentsId;
                        APPaymentsService.APMultiplePost(apaymentMaster, APMultiplePost, APMultiplePostFail);

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

            var apaymentMaster = serializeInputs("frm_Payments");

            apaymentMaster["ReasonOfUnPost"] = ReasonOfUnPost;
            Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
                    ShowNotification(3, "Please Write down Reason Of UnPost");
                    $("#ReasonOfUnPost").focus();
                    return;
                }
                if (result) {
                    if (apaymentMaster.IsPush === "Y") {
                        ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                    }
                    else {

                        apaymentMaster.IDs = apaymentMaster.APPaymentsId;
                        APPaymentsService.APMultipleUnPost(apaymentMaster, APMultipleUnPost, APMultipleUnPostFail);
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

        //        var apaymentMaster = serializeInputs("frm_Payments");
        //        apaymentMaster["ReasonOfUnPost"] = ReasonOfUnPost;
        //        Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
        //            if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
        //                ShowNotification(3, "Please Write down Reason Of UnPost");
        //                $("#ReasonOfUnPost").focus();
        //                return;
        //            }
        //            if (result) {
        //                if (apaymentMaster.IsPush === "Y") {
        //                    ShowNotification(3, "Unable to UnPost, Data has already been Pushed.");
        //                }
        //                else {

        //                    apaymentMaster.IDs = apaymentMaster.APPaymentsId;
        //                    APPaymentsService.APMultipleUnPost(apaymentMaster, APMultipleUnPost, APMultipleUnPostFail);
        //                }

        //            }
        //        });
        //    }
        //});


        $('.btnPush').click('click', function () {



            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {

                    var apaymentMaster = serializeInputs("frm_Payments");

                    apaymentMaster.IDs = apaymentMaster.APPaymentsId;

                    if (apaymentMaster.IsPost == "N") {
                        ShowNotification(3, "Please Data Post First!");
                    }
                    else {

                        if (apaymentMaster.IsPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.");

                        }
                        else {
                            apaymentMaster.IDs = apaymentMaster.APPaymentsId;
                            APPaymentsService.APMultiplePush(apaymentMaster, APMultiplePush, APMultiplePushFail);


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

    }

    //end of init


    //change


    //$('#myButton').click(function () {
    //    // Code to be executed when the button is clicked
    //    //window.location.href = '/GLJournalEntry/Index?Id=' + id;
    //    var form = document.createElement("form");
    //    form.setAttribute("method", "post");
    //    form.setAttribute("action", "/APPayments/FromApInvoices");

    //    // Create a hidden input field for the batch ID
    //    var input = document.createElement("input");
    //    input.setAttribute("type", "hidden");
    //    input.setAttribute("name", "SageBatchNo");

    //    var id = 1;

    //    input.setAttribute("value", id.toString());
    //    form.appendChild(input);

    //    // Submit the form
    //    document.body.appendChild(form);
    //    form.submit();
    //    form.remove();
    //});



    //function editEntry() {
    //    //window.location.href = '/GLJournalEntry/Index?Id=' + id;
    //    var form = document.createElement("form");
    //    form.setAttribute("method", "post");
    //    form.setAttribute("action", "/APPayments/FromApInvoices");

    //    // Create a hidden input field for the batch ID
    //    var input = document.createElement("input");
    //    input.setAttribute("type", "hidden");
    //    input.setAttribute("name", "SageBatchNo");

    //    input.setAttribute("value", id.toString());
    //    form.appendChild(input);

    //    // Submit the form
    //    document.body.appendChild(form);
    //    form.submit();
    //    form.remove();
    //}



    function Visibility(action) {

        $('#frm_PaymentsEntry').find(':input').prop('readonly', action);
        $('#frm_PaymentsEntry').find('table, table *').prop('disabled', action);

    };


    function modalbankSetDblClick(row, originalRow) {
        var bankCode = row.find("td:first").text();
        var bankdescription = row.find("td:eq(1)").text();


        originalRow.closest("div.input-group").find("input").val(bankCode);


        $("#BankDescription").val(bankdescription);


        $("#BCodeModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
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
        var dataTable = $('#AppaymentsLists').DataTable();

        var rowData = dataTable.rows().data().toArray();
        var filteredData = [];
        var filteredData1 = [];
        if (IsPost) {
            filteredData = rowData.filter(x => x.isPost === "Y" && IDs.includes(x.apPaymentsId.toString()));

        }
        else {
            filteredData = rowData.filter(x => x.isPush === "Y" && IDs.includes(x.apPaymentsId.toString()));
            filteredData1 = rowData.filter(x => x.isPost === "N" && IDs.includes(x.apPaymentsId.toString()));
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
                ShowNotification(3, "Data has already been Pushed.");

                return;
            }
            if (filteredData1.length > 0) {
                //ShowNotification(2, "Please select 'Invoice Already Posted!'");
                ShowNotification(3, "Please Data Post First!");

                return;
            }
        }


        if (IsPost) {
            APPaymentsService.APMultiplePost(model, APMultiplePost, APMultiplePostFail);


        }
        else {
            APPaymentsService.APMultiplePush(model, APMultiplePush, APMultiplePushFail);

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



            var dataTable = $('#AppaymentsLists').DataTable();
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
        var dataTable = $('#AppaymentsLists').DataTable();
        dataTable.draw();
    }

        function APMultipleUnPost(result) {
            console.log(result.message);

            if (result.status == "200") {
                ShowNotification(1, result.message);
                $("#IsPost").val('N');
                Visibility(false);
                $("#divReasonOfUnPost").hide();
                $(".btnUnPost").hide();

                indexTable.draw();


            }
            else if (result.status == "400") {
                ShowNotification(3, result.message); // <-- display the error message here
            }
            else if (result.status == "199") {
                ShowNotification(3, result.message); // <-- display the error message here
            }
        }

        function APMultipleUnPostFail(result) {
            ShowNotification(3, "Something gone wrong");

            indexTable.draw();
        }



    function APMultiplePush(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPush").val('Y');


            var dataTable = $('#AppaymentsLists').DataTable();
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
        console.log(result.message);
        ShowNotification(3, result.message);
        var dataTable = $('#AppaymentsLists').DataTable();
        dataTable.draw();
    }






    function modalVendorSetDblClick(row, originalRow) {

        var vendorCode = row.find("td:first").text();
        var vendornName = row.find("td:eq(2)").text();

        var AccSet = row.find("td:eq(4)").text();
        var AccSetDesc = row.find("td:eq(5)").text();

        originalRow.closest("div.input-group").find("input").val(vendorCode);
        originalRow.closest("div.input-group").find("input").focus();


        $("#VendorDescription").val(vendornName);
        $("#AccountSet").val(AccSet);
        $("#AccountSetDescription").val(AccSetDesc);
        $("#vendorModal").modal("hide");
    }
    function modalAccountSetDblClick(row, originalRow) {

        var accountSet = row.find("td:eq(0)").text();
        var accountSetDescription = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(accountSet);
        originalRow.closest("div.input-group").find("input").focus();

        $("#AccountSetDescription").val(accountSetDescription);


        $("#accountSetModal").modal("hide");


    }

    function modalAPBatchSetDblClick(row, originalRow) {

        var batchNo = row.find("td:first").text();
        var description = row.find("td:eq(1)").text();
        originalRow.closest("div.input-group").find("input").val(batchNo);
        $("#SageBatchDescription").val(description);
        $("#apBatchModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();

    }

    function modalAPRimitToDblClick(row, originalRow) {

        var rimitTo = row.find("td:eq(1)").text();
        var description = row.find("td:eq(2)").text();

        originalRow.closest("div.input-group").find("input").val(rimitTo);
        originalRow.closest("div.input-group").find("input").focus();

        $("#RimitToDescription").val(description);

        $("#apRimitToModal").modal("hide");

    }
    function modalAPPaymentCodeDblClick(row, originalRow) {

        var paymentCode = row.find("td:first").text();
        var description = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(paymentCode);
        originalRow.closest("div.input-group").find("input").focus();

        $("#PaymentCodeDescription").val(description);

        $("#apPaymentModal").modal("hide");

    }

    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }




    var PaymentTable = function () {

        $('#AppaymentsLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#AppaymentsLists thead');



        var SageBatchNo = $('#SageBatchNo').val();


        var dataTable = $("#AppaymentsLists").DataTable({
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
                url: '/APPayments/_index?BatchNumber=' + SageBatchNo,
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            SageBatchNo: SageBatchNo,
                            "Code": $("#Code").val(),
                            "PaymentDateFrom": $("#PaymentDateFrom").val(),
                            "PaymentDateTo": $("#PaymentDateTo").val(),
                            "code": $("#md-Code").val(),
                            "bankno": $("#md-BankNo").val(),
                            "post": $("#md-Post").val(),
                            "push": $("#md-Push").val(),
                            "fromDate": $("#FromDate").val(),
                            "toDate": $("#ToDate").val()

                        });
                }
            },
            columns: [

                {
                    data: "apPaymentsId",
                    render: function (data) {

                        return "<a href=/APPayments/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>   " +
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
                    data: "bankNo",
                    name: "BankNo"
                    //"width": "20%"
                }
                ,
                {
                    data: "paymentDate",
                    name: "paymentDate"
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

        $("#AppaymentsLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#AppaymentsLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    function savePAYMents($table) {

        //var data = $("#OrderBy").val();
        //if (data == "xx") {
        //    ShowNotification(3, "Please Select Order By First");
        //    return;
        //}
        //var data = $("#DocumentType").val();
        //if (data == "xx") {
        //    ShowNotification(3, "Please Select Document Type First");
        //    return;
        //}
        //var data = $("#ApplyMethod").val();
        //if (data == "xx") {
        //    ShowNotification(3, "Please Select Apply Method First");
        //    return;
        //}
        //var data = $("#TransactionType").val();
        //if (data == "xx") {
        //    ShowNotification(3, "Please Select Payment Transaction Type First");
        //    return;
        //}
        // validate the form inputs
        var dropdown = document.getElementById('TransactionType');
        var selectedValue = dropdown.getAttribute('data_selected');
        var selectedValue = dropdown.dataset.selected;



        var validator = $("#frm_Payments").validate();

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

        var paymentsMaster = serializeInputs("frm_Payments");
        paymentsMaster.TransactionType = selectedValue;


        if (paymentsMaster.IsPush == 'Y') {
            ShowNotification(3, "Update cannot be performed because the data has already been pushed.");
            return;
        }

        
        var paymentsDetails = serializeTable($table);

        //Required Feild Check

        var requiredFields = ['DocumentType', 'DocumentNumber', 'PendingAmount', 'AppliedAmount'];
        var fieldMappings = {
            'DocumentType': 'Document Type',
            'DocumentNumber': 'Document Number ',
            'PendingAmount': 'Pending Amount',
            'AppliedAmount': 'Applied Amount'

        };
        var errorMessage = getRequiredFieldsCheckObj(paymentsDetails, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;

        }



        paymentsMaster.APPaymentDetailsList = paymentsDetails;


        // submit the form data to the server
        APPaymentsService.save(paymentsMaster, saveDone, saveFail);
    }





    function saveDone(result) {

        if (result.status == "200") {
            if (result.data.operation == "add") {
                var IsPushAllow = ($('#IsPushAllow').val() === "true");
                console.log(IsPushAllow)
                ShowNotification(1, result.message);
                $(".btnSave").html('Update');
                $(".btnSave").addClass('sslUpdate');
                $("#APPaymentsId").val(result.data.apPaymentsId);
                $("#Code").val(result.data.code);

                $("#BranchId").val(result.data.branchId);

                $("#SavePost, #SavePush").show();
                $("#Code").val(result.data.code);
                $("#SageBatchNo").val(result.data.sageBatchNo);

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
            }
        }
        else if (result.status == "400") {
            ShowNotification(3, result.error || result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
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


}(CommonService, APPaymentsService);



function GetBatchNo(id) {

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/APPayments/FromApInvoices");


    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "SageBatchNo");

    input.setAttribute("value", id.toString());
    form.appendChild(input);


    document.body.appendChild(form);
    form.submit();
    form.remove();
}