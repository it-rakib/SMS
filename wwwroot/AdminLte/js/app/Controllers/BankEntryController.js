var BankEntryController = function (BankEntryService) {


    var init = function () {
        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }

        var IsPost = $('#IsPost').val();
        if (IsPost === 'Y') {
            Visibility(true);
        }       

        var $table = $('#BankItemLists');

        var table = initEditTable($table, { searchHandleAfterEdit: false });

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




        $('#bkAddRow').on('click', function () {
            addRow($table);
        });
        $('#PostBNK').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {
                    SelectData(true);
                }
            });

        });
        $('#PushBNK').on('click', function () {

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

        //LoadCombo("DocumentType", '/Common/GetAPDocumentType')
        LoadCombo("BankEntryType", '/Common/BankEntryType');
        LoadCombo("DepositType", '/Common/DepositType');

        

       
        var indexTable = BankTable();

        var configs = getTableConfig();
        var detailTable = $("#BankDetailLists").DataTable(configs);


        $('#BankItemLists').on('click', "input.txt" + "AccountNo", function () {
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




        $('.btn-bank').on('click', function () {
            var originalRef = $(this);
            var TransactionType = $('#TransactionType').val();

            CommonService.bankCodeModal({}, fail, function (row) { modalbankSetDblClick(row, originalRef) }, TransactionType);

        });
        $('.btn-entry').on('click', function () {
            var originalRef = $(this);
            CommonService.entryCodeModal({}, fail, function (row) { modalCodeSetDblClick(row, originalRef) });

        });

        $('.btn-currency').on('click', function () {
            var bankCode = $('#BankNo').val();

            if (!bankCode) {
                alert('Please select bank code first.');
                return;
            }
            var originalRef = $(this);
            CommonService.currencyCodeModal({}, fail, function (row) { currencyCodeSetDblClick(row, originalRef) }, bankCode);

        });
        $('.btnsave').click('click', function () {
            save($table);
        });
        $('.btnPost').click('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    var bankMaster = serializeInputs("frm_Bank");
                    if (bankMaster.IsPost == "Y") {
                        ShowNotification(3, "Data has already been Posted.");
                    }
                    else {
                        bankMaster.IDs = bankMaster.Id;
                        BankEntryService.BNKMultiplePost(bankMaster, BNKMultiplePost, BNKMultiplePostFail);

                    }

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

            var url = '/BankEntry/BankEntryExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;

            var Id = $("#Id").val();

            url += '&Id=' + (Id !== null ? Id : 'null');
            var win = window.open(url, '_blank');
        });



        $('#modelClose').click('click', function () {

            $("#UnPostReason").val("");
            $('#modal-default').modal('hide');


        });
        $('.Submit').click('click', function () {

            ReasonOfUnPost = $("#UnPostReason").val();

            var bankMaster = serializeInputs("frm_Bank");

            bankMaster["ReasonOfUnPost"] = ReasonOfUnPost;
            Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
                    ShowNotification(3, "Please Write down Reason Of UnPost");
                    $("#ReasonOfUnPost").focus();
                    return;
                }
                if (result) {
                    if (bankMaster.IsPush === "Y") {
                        ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                    }
                    else {

                            bankMaster.IDs = bankMaster.Id;
                            BankEntryService.BNKMultipleUnPost(bankMaster, BNKMultipleUnPost, BNKMultipleUnPostFail);
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

        //        var bankMaster = serializeInputs("frm_Bank");
        //        bankMaster["ReasonOfUnPost"] = ReasonOfUnPost;
        //        Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
        //            if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
        //                ShowNotification(3, "Please Write down Reason Of UnPost");
        //                $("#ReasonOfUnPost").focus();
        //                return;
        //            }
        //            if (result) {
        //                if (bankMaster.IsPush === "Y") {
        //                    ShowNotification(3, "Unable to UnPost, Data has already been Posted.");
        //                }
        //                else {

        //                    bankMaster.IDs = bankMaster.Id;
        //                    BankEntryService.BNKMultipleUnPost(bankMaster, BNKMultipleUnPost, BNKMultipleUnPostFail);
        //                }

        //            }
        //        });
        //    }




        //});



        $('.btnPush').click('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {


                    var bankMaster = serializeInputs("frm_Bank");

                    bankMaster.IDs = bankMaster.Id;

                    if (bankMaster.IsPost == "N") {
                        ShowNotification(3, "Please Data Post First!");
                    }
                    else {
                        if (bankMaster.IsPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.");

                        }
                        else {
                            bankMaster.IDs = bankMaster.Id;
                            BankEntryService.BNKMultiplePush(bankMaster, BNKMultiplePush, BNKMultiplePushFail);

                        }
                    }
                    

                }
            });

        });


        $('.btnPreview').on('click', function () {


            const form = document.createElement('form');
            form.method = 'post';
            form.action = '/BankEntry/BankVouchersReportPreview';
            form.target = '_blank';
            const BankIdInput = document.createElement('input');
            BankIdInput.type = 'hidden';
            BankIdInput.name = 'Id';
            BankIdInput.value = $('#Id').val();


            form.appendChild(BankIdInput);

            document.body.appendChild(form);

            form.submit();
            form.remove();

        });


        $("#btnAdd").on("click", function () {

            rowAdd(detailTable);

        });





        $('#BankItemLists').on('blur', "td.td-Amount", function () {
            var Value = $(this).text();
            if (Value) {

            }
            var originalRow = $(this);
            if (Value > 0) {

                //originalRow.closest("tr").find("td:eq(3)").find("input").val(0);
                //originalRow.closest("tr").find("td:eq(3)").text(0);
            }
            TotalCalculation();


        });


        $('#BankItemLists').on('keypress', "input.txtAccountNo", function (event) {
            if (event.key === "Enter") {
                var value = $(this).val();
                var originalRow = $(this);


                AccountDescCall(value, originalRow);
            }

        });

        function AccountDescCall(value, originalRow) {
            if (value) {
                BankEntryService.AccountNocall(value, function (result) {


                    var accountNo = result.data[0].accountNumber;

                    if (accountNo == null || accountNo == "") {
                        originalRow.closest("tr").find("td:eq(1)").text("");
                        ShowNotification(3, "Account no is not correct");
                    }
                    else {
                        //originalRow.closest("tr").find("td:eq(1)").find("input").val(result.data[0].description);
                        originalRow.closest("tr").find("td:eq(1)").text(result.data[0].description);
                        table.handleAfterEdit(originalRow);
                    }


                }, AccountNocallFail);

            }
        }


        $("#BankDetailLists").on("click", ".js-edit", function () {
            var button = $(this);
            rowEdit(button, detailTable);
        });

        $("#BankDetailLists").on("click", ".js-delete", function () {
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



        function TotalCalculation() {

            var amountTotal = 0;

            //amountTotal = getColumnSum('Amount', 'BankItemLists').toFixed(2);
            amountTotal = getColumnSumAttr('Amount', 'BankItemLists').toFixed(2);

            $("#TotalAmount").val(Number(parseFloat(amountTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));

            //$("#TotalAmount").val(amountTotal);

        }

        //function Visibility(action) {
        //    $('#frm_BankEntry').find(':input').prop('disabled', action);
        //    $('button').prop('disabled', action);

        //};

    }


    //end init


    function Visibility(action) {

        $('#frm_BankEntry').find(':input').prop('readonly', action);
        $('#frm_BankEntry').find('table, table *').prop('disabled', action);
        $('#frm_BankEntry').find(':input[type="button"]').prop('disabled', action);
       
    };

    function AccountNocallFail(result) {
        console.log(result);
        ShowNotification(3, "Something gone wrong");
    }




    function save($table) {


        /*for bank dropdown*/
        var dropdown = document.getElementById('DepositType');
        var selectedValue = dropdown.getAttribute('data_selected');
        var selectedValue = dropdown.dataset.selected;




        var data = $("#BankEntryType").val();
        if (data == "xx") {
            ShowNotification(3, "Please Select Bank Entry Type First");
            return;
        }
        var deposit = $("#DepositType").val();
        if (deposit == "xx") {
            ShowNotification(3, "Please Select Bank Entry Type First");
            return;
        }

       /* $("#divUpdate").show();*/



        var validator = $("#frm_Bank").validate();
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


        var bkMaster = serializeInputs("frm_Bank");
        bkMaster.DepositType = selectedValue;



        if (bkMaster.IsPush == 'Y') {
            ShowNotification(3, "Push operation is already done, Do not update this entry");
            return;
        }


        var bkDetails = serializeTable($table);

        //Required Feild Check

        //var requiredFields = ['AccountNo', 'Amount'];

        var requiredFields = ['AccountNo','Amount'];
        var fieldMappings = {
            'AccountNo': 'G/L Account ',
            'Amount': 'Amount ',
        };

        var errorMessage = getRequiredFieldsCheckObj(bkDetails, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;

        }



        bkMaster.BankEntryDetailsList = bkDetails;

        BankEntryService.save(bkMaster, saveDone, saveFail);



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

        var dataTable = $('#BankLists').DataTable();

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
                ShowNotification(3, "Please Data Post First!");
                //ShowNotification(3, "Data has already been Posted.");

                return;
            }
        }


        if (IsPost) {
            BankEntryService.BNKMultiplePost(model, BNKMultiplePost, BNKMultiplePostFail);


        }
        else {
            BankEntryService.BNKMultiplePush(model, BNKMultiplePush, BNKMultiplePushFail);

        }

    }
    function BNKMultiplePost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('Y');
            $(".btnUnPost").show();
            $(".btnPush").show();
            

            Visibility(true);


            var dataTable = $('#BankLists').DataTable();

            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }



    function BNKMultiplePostFail(result) {
        console.log(result.message);
        ShowNotification(3, result.message);

        var dataTable = $('#BankLists').DataTable();
        dataTable.draw();
    }
    function BNKMultipleUnPost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('N');
            Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();

            var dataTable = $('#BankLists').DataTable();

            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function BNKMultipleUnPostFail(result) {
        ShowNotification(3, "Something gone wrong");

        var dataTable = $('#BankLists').DataTable();

        dataTable.draw();
    }

    function BNKMultiplePush(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPush").val('Y');
            $("#SageEntryNo").val(result.data.sageEntryNo);
            var dataTable = $('#BankLists').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function BNKMultiplePushFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#BankLists').DataTable();
        dataTable.draw();
    }



    function currencyCodeSetDblClick(row, originalRow) {
        var currencyCode = row.find("td:first").text();
        originalRow.closest("div.input-group").find("input").val(currencyCode);

        $("#CCodeModel").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }
    function modalbankSetDblClick(row, originalRow) {
        var bankCode = row.find("td:first").text();
        var bankdescription = row.find("td:eq(1)").text();
        var bankaccountno = row.find("td:eq(2)").text();
        var bankcurrency = row.find("td:eq(3)").text();

        originalRow.closest("div.input-group").find("input").val(bankCode);
        $("#BankDescription").val(bankdescription);
        $("#BankAccountNo").val(bankaccountno);
        $("#Currency").val(bankcurrency);


        $("#BCodeModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }

    function modalCodeSetDblClick(row, originalRow) {
        var sageEntryNo = row.find("td:first").text();
        var Description = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(sageEntryNo);
        $("#EntryDescription").val(Description);

        $("#ECodeModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }



    function modalDblClick(row, originalRef) {
        var accountCode = row.find("td:first").text();
        var Description = row.find("td:eq(1)").text();
        originalRef.closest("td").find("input").val(accountCode);

        originalRef.closest('td').next().text(Description);




        $("#accountModal").modal("hide");


        originalRef.closest("td").find("input").data("touched", false);



        originalRef.closest("td").find("input").focus();
    }


    var BankTable = function () {

        $('#BankLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#BankLists thead');
        var TransactionType = $('#TransactionType').val()
        console.log(TransactionType)

        var dataTable = $("#BankLists").DataTable({
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
                url: '/BankEntry/_index?TransactionType=' + TransactionType,
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "indexsearch": $("#Branchs").val(),

                            "branchid": $("#CurrentBranchId").val(),
                            "Currency": $('#CurrencyCode').val(),

                            "Code": $("#md-Code").val(),
                            "BankNo": $("#md-BankNo").val(),
                            "DepositType": $("#md-DepositType").val(),
                            "CurrencyCode": $("#md-CurrencyCode").val(),
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

                        return "<a href=/BankEntry/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  " +

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
                    data: "bankNo",
                    name: "bankNo"
                    /*"width": "20%"*/
                }
                ,
                {
                    data: "bankEntryDate",
                    name: "BankEntryDate"
                    /*"width": "20%"*/
                }
                ,
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



        $("#BankLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#BankLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }



    function checkMasterValidation(detailTable) {
        debugger
        var validator = $("#frm_BankEntry").validate();
        /*var result = validator.form();*/
        var result = true;

        if (detailTable.length < 1) {
            ShowNotification(2, "Please Add Material First");
            return false;
        }

        return result;

    }


    function saveDone(result) {
        debugger
        if (result.status == "200") {
            if (result.data.operation == "add") {
                var IsPushAllow = ($('#IsPushAllow').val() === "true");
                console.log(IsPushAllow)
                ShowNotification(1, result.message);
                $(".btnsave").html('Update');
                $(".btnsave").addClass('sslUpdate');
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
            ShowNotification(3, result.message);
        }
    }

    function saveFail(result) {
        console.log(result);
        ShowNotification(3, result.message);
    }




    function addPrevious(table) {
        debugger
        var previousValue = localStorage.getItem('previousValue');
        if (previousValue != "null") {
            table.rows.add([JSON.parse(previousValue)]).draw();
            localStorage.setItem('previousValue', null);
        }
    }

    function rowDelete(button, table) {
        table.row(button.parents('tr')).remove().draw();
    }


    function rowEdit(button, table) {
        debugger
        var data = table.row(button.parents("tr")).data();

        console.log(data);

        $("#DistributionCode").val(data.DistributionCode).change();
        $("#DistributionCodeDescription").val(data.DistributionCodeDescription);
        $("#GLAccount").val(data.GLAccount);
        $("#GLAccountDescription").val(data.GLAccountDescription);
        $("#Amount").val(data.Amount);
        $("#Taxable").val(data.Taxable);
        $("#Referecne").val(data.Referecne);
        $("#Description").val(data.Description);
        $("#Comments").val(data.Comments);
        $("#Description").val(data.Description);


        table.row(button.parents('tr')).remove().draw();
        $('#modal-xl').modal('show');
        localStorage.setItem('previousValue', JSON.stringify(data));




    }

    function rowAdd(detailTable) {
        debugger
        var validator = $("#formModal").validate();
        var result = validator.form();

        var result = parseFormModal("#formModal");

        if ($("#Taxable").is(':checked')) {

            result.Taxable = true;
        }

        if (checkValidation(result, detailTable)) {

            detailTable.rows.add([
                result
            ]).draw();

            $("#DistributionCode").val('');
            $("#DistributionCodeDescription").val('');
            $("#GLAccount").val('');
            $("#GLAccountDescription").val('');
            $("#Amount").val('');
            $("#Taxable").val('');
            $("#Referecne").val('');
            $("#Description").val('');
            $("#Comments").val('');



            $('#formModal')[0].reset();

            localStorage.setItem('previousValue', null);

        }


    }

    function checkValidation(detailItem, detailTable) {


        var details = detailTable.rows().data().toArray();

        if (detailItem.DistributionCode == "" || detailItem.DistributionCode == null || detailItem.DistributionCode == undefined || detailItem.DistributionCode == 'xx') {
            ShowNotification(3, "Please Select DistributionCode");
            $('#DistributionCode').focus();
            return false;
        }
        else if (!detailItem.GLAccount) {
            ShowNotification(3, "Please Select GLAccount");
            $('#GLAccount').focus();
            return false;
        }
        else if (!detailItem.GLAccountDescription) {
            ShowNotification(3, "Please Select GLAccountDescription");
            $('#GLAccountDescription').focus();
            return false;
        }
        else if (detailItem.Amount == "" || detailItem.Amount == null || detailItem.Amount == undefined || detailItem.Amount == 'xx') {
            ShowNotification(3, "Please Select Amount");
            $('#Amount').focus();
            return false;
        }
        else if (!Number.isInteger(Number(detailItem.Amount))) {
            ShowNotification(3, "Please enter integer value to Amount");
            $('#Amount').focus();
            return false;
        }

        return true;
    }

    function getTableConfig() {

        return {
            "searching": false,
            "paging": false,
            "info": false,
            //"scrollX": true,
            columns: [
                //  my_columns

                {
                    data: "DistributionCode",
                    name: "DistributionCode"

                }, {
                    data: "DistributionCodeDescription",
                    name: "DistributionCodeDescription"

                },

                {
                    data: "GLAccount",
                    name: "GLAccount"
                },
                {
                    data: "GLAccountDescription",
                    name: "GLAccountDescription"
                },
                {
                    data: "Amount",
                    name: "Amount"

                },
                {
                    data: "Referecne",
                    name: "Referecne"

                },
                {
                    data: "Taxable",
                    name: "Taxable"

                },

                {
                    data: "Comments",
                    name: "Comments"

                },
                {
                    data: "Description",
                    name: "Description"
                },



                {
                    data: "Id",
                    render: function () {

                        return "<a  class='edit js-edit'  ><i class='material-icons' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  "
                            + " &nbsp;  <a  id='tab1'  name='tab'  class='delete js-delete' title='Delete' data-toggle='tooltip' ><i class='material-icons'>&#xE872;</i></a> ";

                    },
                    "width": "7%",
                    "orderable": false
                }
            ],

        }
    }

    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }

    return {
        init: init
    }


}(BankEntryService);