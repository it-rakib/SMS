var APInvoiceController = function (CommonService, APInvoiceService) {
    var init = function () {

        if ($("#DocumentType").length) {
          
            LoadCombo("DocumentType", '/Common/GetAPDocumentType');

        }



        var $table = $('#ApItemLists');


        var IsPost = $('#IsPost').val();
        if (IsPost === 'Y') {
            Visibility(true);
        }


        var table = initEditTable($table, { searchHandleAfterEdit: false });


        TotalCalculation()

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

            var url = '/APInvoice/APInvoiceExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;

            var Id = $("#APInvoiceId").val();

            url += '&Id=' + (Id !== null ? Id : 'null');
            var win = window.open(url, '_blank');
        });


        $('#ApItemLists').on('blur', "td.td-Amount", function () {
            var Value = $(this).text();
            if (Value) {

            }
            var originalRow = $(this);
            if (Value > 0) {

                
            }
            TotalCalculation();


        });


        $('#ApInvo').on('click', function () {


            const form = document.createElement('form');
            form.method = 'post';
            form.action = '/APInvoice/Create';

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


        $('#PostAPI').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                
                if (result) {

                    SelectData(true);
                }

            });

        });
        $('#PushAPI').on('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                
                if (result) {
                    SelectData(false);
                }

            });


        });

        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });



        var indexTable = InvoiceTable();


        $('#apsAddRow').on('click', function () {
            addRow($table);
        });

        $('#ApItemLists').on('click', "input.txt" + "AccountNo", function () {
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

        $('.btn-vendor').on('click', function () {
            var originalRef = $(this);
            CommonService.vendorNumberModal({}, fail, function (row) { modalVendorSetDblClick(row, originalRef) });

        });


        $('.btn-account-set').on('click', function () {
            var originalRef = $(this);
            ModalService.vendorAccSetModal({}, fail, function (row) { modalVendorAccSetDblClick(row, originalRef) });

            


        });
        $('.btn-rimit').on('click', function () {
            var originalRef = $(this);
            CommonService.apRimitToModal({}, fail, function (row) { modalAPRimitToDblClick(row, originalRef) });

        });


        $('.btnSave').click('click', function () {
            saveAP($table);
        });
        $('.btnPost').click('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                
                if (result) {

                    var apinvoiceMaster = serializeInputs("frm_AP");
                    if (apinvoiceMaster.IsPost == "Y") {
                        ShowNotification(3, "Data has already been Posted.");
                    }
                    else {
                        apinvoiceMaster.IDs = apinvoiceMaster.APInvoiceId;
                        APInvoiceService.APIMultiplePost(apinvoiceMaster, ApMultiplePost, ApMultiplePostFail);

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

            var apinvoiceMaster = serializeInputs("frm_AP");

            apinvoiceMaster["ReasonOfUnPost"] = ReasonOfUnPost;
            Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
                    ShowNotification(3, "Please Write down Reason Of UnPost");
                    $("#ReasonOfUnPost").focus();
                    return;
                }
                if (result) {
                    if (apinvoiceMaster.IsPush === "Y") {
                        ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                    }
                    else {

                        apinvoiceMaster.IDs = apinvoiceMaster.APInvoiceId;

                        APInvoiceService.APIMultipleUnPost(apinvoiceMaster, APIMultipleUnPost, APIMultipleUnPostFail);
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

        //        var apinvoiceMaster = serializeInputs("frm_AP");
        //        apinvoiceMaster["ReasonOfUnPost"] = ReasonOfUnPost;
        //        Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
        //            if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
        //                ShowNotification(3, "Please Write down Reason Of UnPost");
        //                $("#ReasonOfUnPost").focus();
        //                return;
        //            }
        //            if (result) {
        //                if (apinvoiceMaster.IsPush === "Y") {
        //                    ShowNotification(3, "Unable to UnPost, Data has already been Pushed.");
        //                }
        //                else {

        //                    apinvoiceMaster.IDs = apinvoiceMaster.APInvoiceId;
        //                    APInvoiceService.APIMultipleUnPost(apinvoiceMaster, APIMultipleUnPost, APIMultipleUnPostFail);
        //                }

        //            }
        //        });
        //    }
        //});

        $('.btnPush').click('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {


                if (result) {


                    var apinvoiceMaster = serializeInputs("frm_AP");

                    apinvoiceMaster.IDs = apinvoiceMaster.APInvoiceId;


                    if (apinvoiceMaster.IsPost == "N") {
                        ShowNotification(3, "Please Data Post First!");
                    }

                    else {

                        if (apinvoiceMaster.IsPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.");

                        }
                        else {
                            apinvoiceMaster.IDs = apinvoiceMaster.APInvoiceId;
                            APInvoiceService.APIMultiplePush(apinvoiceMaster, ApMultiplePush, ApMultiplePushFail);


                        }
                    }
                }

            });

        });












        $('.btn-APBatch').on('click', function () {
            var originalRef = $(this);
            CommonService.apInvoiceModal({}, fail, function (row) { modalAPInvoiceSetDblClick(row, originalRef) });

        });

       
        //key search

        $('#ApItemLists').on('keypress', "input.txtAccountNo", function (event) {
            if (event.key === "Enter") {
                var value = $(this).val();
                var originalRow = $(this);


                AccountDescCall(value, originalRow);
            }

        });

        function AccountDescCall(value, originalRow) {
            if (value) {
                APInvoiceService.AccountNocall(value, function (result) {


                    var accountNo = result.data[0].accountNumber;

                    if (accountNo == null || accountNo == "") {
                        originalRow.closest("tr").find("td:eq(1)").text("");
                        ShowNotification(3, "G\L Account is not correct");
                    }
                    else {
                       
                        originalRow.closest("tr").find("td:eq(1)").text(result.data[0].description);
                        table.handleAfterEdit(originalRow);
                    }


                }, AccountNocallFail);

            }
        }

        //end of key



        function TotalCalculation() {

            var amountTotal = 0;

            amountTotal = getColumnSumAttr('Amount', 'ApItemLists').toFixed(2);
            $("#TotalAmount").val(Number(parseFloat(amountTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));


            

        }



    }
    //end of init

    function Visibility(action) {
        $('#frm_APEntry').find(':input').prop('readonly', action);
        $('#frm_APEntry').find('table, table *').prop('disabled', action);
        $('#frm_APEntry').find(':input[type="button"]').prop('disabled', action);
       
    };


    function modalVendorSetDblClick(row, originalRow) {

        var vendorCode = row.find("td:first").text();
        var VendorName = row.find("td:eq(2)").text();

        var accdes = row.find("td:eq(5)").text();
        var accset = row.find("td:eq(4)").text();



        originalRow.closest("div.input-group").find("input").val(vendorCode);
        originalRow.closest("div.input-group").find("input").focus();



        $("#VendorNumber").val(vendorCode);
        $("#VendorName").val(VendorName);

        $("#AccountSet").val(accset);
        $("#AccountSetDescription").val(accdes);

     

        $("#vendorModal").modal("hide");
    }


    function SelectData(IsPost) {




        var IDs = [];
        var $Items = $(".dSelected:input:checkbox:checked");

        if ($Items == null || $Items.length == 0) {
            ShowNotification(2, "You are requested to Select checkbox!");

            return;

        }
        $Items.each(function () {
            var ID = $(this).attr("data-Id");
            IDs.push(ID);
        });

        var model = {
            IDs: IDs,

        }
        var dataTable = $('#APInvoiceLists').DataTable();

        var rowData = dataTable.rows().data().toArray();
        var filteredData = [];
        var filteredData1 = [];
        if (IsPost) {
            filteredData = rowData.filter(x => x.isPost === "Y" && IDs.includes(x.apInvoiceId.toString()));

        }
        else {
            filteredData = rowData.filter(x => x.isPush === "Y" && IDs.includes(x.apInvoiceId.toString()));
            filteredData1 = rowData.filter(x => x.isPost === "N" && IDs.includes(x.apInvoiceId.toString()));
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
                //ShowNotification(2, "Please select 'Invoice Not Pushed Yet!'");
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
            APInvoiceService.APIMultiplePost(model, ApMultiplePost, ApMultiplePostFail);


        }
        else {
            APInvoiceService.APIMultiplePush(model, ApMultiplePush, ApMultiplePushFail);

        }

    }

    function ApMultiplePost(result) {
        

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPost").val('Y');
            $(".btnUnPost").show();

            $(".btnPush").show();
            Visibility(true);



            var dataTable = $('#APInvoiceLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here

        }
    }

    function ApMultiplePostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#APInvoiceLists').DataTable();
        dataTable.draw();

        }
        function APIMultipleUnPost(result) {



            if (result.status == "200") {
                ShowNotification(1, result.message);
                $("#IsPost").val('N');
                Visibility(false);
                $("#divReasonOfUnPost").hide();
                $(".btnUnPost").hide();


                var dataTable = $('#APInvoiceLists').DataTable();

                dataTable.draw();


            }
            else if (result.status == "400") {
                ShowNotification(3, result.message); // <-- display the error message here
            }
            else if (result.status == "199") {
                ShowNotification(3, result.message); // <-- display the error message here
            }
        }

        function APIMultipleUnPostFail(result) {
            ShowNotification(3, "Something gone wrong");

            dataTable.draw();
        }



    function ApMultiplePush(result) {



        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPush").val('Y');
            $("#SageEntryNo").val(result.data.sageEntryNo);

            var dataTable = $('#APInvoiceLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here

        }
    }

    function ApMultiplePushFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#APInvoiceLists').DataTable();
        dataTable.draw();

    }







    function AccountNocallFail(result) {
        ShowNotification(3, "Something gone wrong");
    }


    var InvoiceTable = function () {

        $('#APInvoiceLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#APInvoiceLists thead');

        var SageBatchNo = $('#SageBatchNo').val();


        var dataTable = $("#APInvoiceLists").DataTable({
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
                url: '/APInvoice/_index?BatchNumber=' + SageBatchNo,
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            SageBatchNo: SageBatchNo,

                            "codech": $("#md-Code").val(),
                            "entryno": $("#md-EntryNo").val(),
                            "accountset": $("#md-AccountSet").val(),
                            "post": $("#md-Post").val(),
                            "push": $("#md-Push").val(),
                            "fromDate": $("#FromDate").val(),
                            "toDate": $("#ToDate").val()



                        });
                }
            },
            columns: [

                {
                    data: "apInvoiceId",
                    render: function (data) {

                        return "<a href=/APInvoice/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'> &nbsp;</i></a>" +
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
                    data: "accountSet",
                    name: "AccountSet"
                    //"width": "20%"
                }
                ,
                {
                    data: "documentDate",
                    name: "DocumentDate"
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


        $("#APInvoiceLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#APInvoiceLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }



    function saveAP($table) {
        var data = $("#DocumentType").val();
        if (data == "xx") {
            ShowNotification(3, "Please Select Document Type First");
            return;
        }

        var DocumentTotal = $("#TotalAmount").val();

        var validator = $("#frm_AP").validate();
        var apMaster = serializeInputs("frm_AP");

        apMaster.DocumentTotal = DocumentTotal;

        var apDetails = serializeTable($table);
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



        //Required Feild Check

        var requiredFields = ['AccountNo', 'Amount'];
        var fieldMappings = {
            'AccountNo': 'G/L Account ',
            'Amount': 'Amount '
        };
        var errorMessage = getRequiredFieldsCheckObj(apDetails, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;

        }



        apMaster.APInvoiceDetailsList = apDetails;
        APInvoiceService.save(apMaster, saveDone, saveFail);
    }

    function saveDone(result) {

        if (result.status == "200") {
            if (result.data.operation == "add") {
                var IsPushAllow = ($('#IsPushAllow').val() === "true");
               
                ShowNotification(1, result.message);
                $(".btnSave").html('Update');
                $(".btnSave").addClass('sslUpdate');
                $("#APInvoiceId").val(result.data.apInvoiceId);
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
            ShowNotification(3, result.message || result.error); // <-- display the error message here
        }
    }

    function saveFail(result) {

        const errorMessage = result.Message || "Something gone wrong";

        

        ShowNotification(3, errorMessage);
    }



    function modalAPInvoiceSetDblClick(row, originalRow) {

        var batchNo = row.find("td:first").text();
        var description = row.find("td:eq(1)").text();
        originalRow.closest("div.input-group").find("input").val(batchNo);
        $("#SageBatchDescription").val(description);
        $("#apInvoiceModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();

    }

    function modalDblClick(row, originalRef) {
        var accountCode = row.find("td:first").text();
        var description = row.find("td:eq(1)").text();

        originalRef.closest("td").find("input").val(accountCode);
        originalRef.closest('td').next().text(description);

        $("#accountModal").modal("hide");

        originalRef.closest("td").find("input").data("touched", false);



        originalRef.closest("td").find("input").focus();
    }




    

    function modalVendorAccSetDblClick(row, originalRow) {

        var vendorAccountCode = row.find("td:first").text();
        var vendornAccountDescription = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(vendorAccountCode);
        originalRow.closest("div.input-group").find("input").focus();


        $("#AccountSetDescription").val(vendornAccountDescription);

        $("#vendorAccSetModal").modal("hide");
    }






    function modalAPRimitToDblClick(row, originalRow) {

        var rimitTo = row.find("td:first").text();
        var description = row.find("td:eq(2)").text();

        originalRow.closest("div.input-group").find("input").val(rimitTo);
        originalRow.closest("div.input-group").find("input").focus();

        $("#RimitToDescription").val(description);


        $("#apRimitToModal").modal("hide");

    }


    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }


    return {
        init: init
    }

}(CommonService, APInvoiceService);