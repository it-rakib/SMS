var JournalEntryController = function (CommonService, JournalEntryService) {

   
    var init = function () {
        var IsPost = $('#IsPost').val();
        if (IsPost==='Y') {
            Visibility(true);
        }
       
        var $table = $('#GLItemLists');
      
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





        $('#glAddRow').on('click', function () {
            addRow($table);
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

            var url = '/GLJournalEntry/GLJournalExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;

            var Id = $("#GLJournalId").val();

            url += '&Id=' + (Id !== null ? Id : 'null');
            var win = window.open(url, '_blank');
        });

        $('#CreateGL').on('click', function () {


            const form = document.createElement('form');
            form.method = 'post';
            form.action = '/GLJournalEntry/Create';

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


        $('#PostGL').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    SelectDataPostOrPush(true);
                }
            });
        });

        $('#PushGL').on('click', function () {


            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {
                    SelectDataPostOrPush(false);
                }
            });

        });
        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });

        var indexTable = JournalTable();





        $('#GLItemLists').on('blur', "td.td-Debit-Amount", function () {
            var Value = $(this).text();
            var originalRow = $(this);
            if (parseFloat(Value) > 0) {

                originalRow.closest("tr").find("td:eq(3)").find("input").val(0);
                originalRow.closest("tr").find("td:eq(3)").text(0);
            }
            if (parseFloat(Value) < 1) {
                var Credit = originalRow.closest("tr").find("td:eq(3)").text();
                if (parseFloat(Credit) < 1) {
                    ShowNotification(3, "Please input Debit Amount");
                    originalRow.closest("td").find("input").focus();
                }

            }
            TotalCalculation();


        });

        $('#GLItemLists').on('blur', "td.td-Credit-Amount", function () {
            var Value = $(this).text();
            var originalRow = $(this);
            if (parseFloat(Value) > 0) {

                originalRow.closest("tr").find("td:eq(2)").find("input").val(0);
                originalRow.closest("tr").find("td:eq(2)").text(0);
            }
            if (parseFloat(Value) < 1) {
                var Debit = originalRow.closest("tr").find("td:eq(2)").text();
                if (parseFloat(Debit) < 1) {
                    ShowNotification(3, "Please input Credit Amount ");
                    originalRow.closest("td").find("input").focus();

                }
            }
            TotalCalculation();


        });
      

        function AccountDescCall(value, originalRow) {
            if (value) {
                JournalEntryService.AccountNocall(value, function (result) {
               

                    var accountNo = result.data[0].accountNumber;
                    var statustype = result.data[0].status;

                    if (accountNo == null || accountNo == "") {
                        originalRow.closest("tr").find("td:eq(1)").text("");
                        ShowNotification(3, "Item no is not correct");
                    }

                    else if (accountNo != "" && statustype.trim() === "Inactive") {

                        ShowNotification(3, "This Account " + accountNo + " is InActive!");
                    }

                    else {
                        originalRow.closest("tr").find("td:eq(1)").find("input").val(result.data[0].description);
                        originalRow.closest("tr").find("td:eq(1)").text(result.data[0].description);

                        originalRow.closest("td").find("input").data('touched', false);
                        originalRow.closest("td").find("input").focus();

                        //table.handleAfterEdit(originalRow);


                    }

           

                }, AccountNocallFail);

            }
        }

        $('#GLItemLists').on('click', "input.txt"+"AccountNo", function () {
            var originalRow = $(this);

            originalRow.closest("td").find("input").data('touched', true);

            CommonService.accountCodeModal({},
                fail,
                function(row) { modalDblClick(row, originalRow) },
                function () {
                    originalRow.closest("td").find("input").data('touched', false);
                    originalRow.closest("td").find("input").focus();
                });

        });


        $('.btn-sageEntry-No').on('click', function () {
            var batchNo = $('#SageBatchNo').val();

            if (!batchNo) {
                alert('Please select a batch number first.');
                return;
            }
            var originalRef = $(this);
            CommonService.sageEntryModal({}, fail, function (row) { modalEntryDblClick(row, originalRef) }, batchNo);

        });
        $('.btn-sageBatch-No').on('click', function () {
            var originalRef = $(this);
            CommonService.sageBatchModal({}, fail, function (row) {
                modalBatchDblClick(row, originalRef)
                var sageBatchNo = row.sageBatchNo; // get the selected sageBatchNo value
                originalRef.closest('tr').find('.edit').attr('sagebatchno', sageBatchNo); // set the sagebatchno attribute of the edit icon
           
            });

        });

        $('.btn-sourceCode-No').on('click', function () {
            var originalRef = $(this);
            CommonService.sourceCodeModal({}, fail, function (row) { modalCodeDblClick(row, originalRef) }, "GL");

        });

        $('.btnSave').click('click', function () {
            saveGL($table);


        });


        $('.btnPost').click('click', function () {
            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {
                    var journalMaster = serializeInputs("frm_GL");
                    if (journalMaster.IsPost == "Y") {
                        ShowNotification(3, "Data has already been Posted.");
                    } else {
                        journalMaster.IDs = journalMaster.GLJournalId;
                        JournalEntryService.GLMultiplePost(journalMaster, GLMultiplePost, GLMultiplePostFail);
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

                var journalMaster = serializeInputs("frm_GL");
                journalMaster["ReasonOfUnPost"] = ReasonOfUnPost;
                Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                    if (ReasonOfUnPost === "" || ReasonOfUnPost===null) {
                        ShowNotification(3, "Please Write down Reason Of UnPost");
                        $("#ReasonOfUnPost").focus();
                        return;
                    }
                    if (result) {
                        if (journalMaster.IsPush === "Y") {
                            ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                        }
                        else {

                            journalMaster.IDs = journalMaster.GLJournalId;
                            JournalEntryService.GLMultipleUnPost(journalMaster, GLMultipleUnPost, GLMultipleUnPostFail);
                        }

                    }
                });
            
        });
        

        $('.btnPush').click('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                if (result) {
                    var journalMaster = serializeInputs("frm_GL");
                   
                    if (journalMaster.IsPost == "N") {
                        ShowNotification(3, "Please Data Post First!");
                    }
                    else {
                        if (journalMaster.IsPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.")
                        }
                        else {
                            journalMaster.IDs = journalMaster.GLJournalId;
                            JournalEntryService.GLMultiplePush(journalMaster, GLMultiplePush, GLMultiplePushFail);
                        }
                    }

                }

            });
        });



        $('.btnPreview').on('click', function () {


            const form = document.createElement('form');
            form.method = 'post';
            form.action = '/GLJournalEntry/GLVouchersReportPreview';
            form.target = '_blank'; 
            const GLJournalIdInput = document.createElement('input');
            GLJournalIdInput.type = 'hidden';
            GLJournalIdInput.name = 'GLJournalId';
            GLJournalIdInput.value = $('#GLJournalId').val();
            console.log(GLJournalIdInput.value);

            form.appendChild(GLJournalIdInput);

            document.body.appendChild(form);

            form.submit();
            form.remove();

        });


        function Visibility(action) {
            $('#frm_GLEntry').find(':input').prop('readonly', action);
            $('#frm_GLEntry').find('table, table *').prop('disabled', action);
            $('#frm_GLEntry').find(':input[type="button"]').prop('disabled', action);
        };

        $("#indexSearch").click(function () {
            
            var fromDate = $("#FromDate").val();
            var toDate = $("#ToDate").val();

            

            if (!fromDate || !toDate) {
                ShowNotification(3, "Please Select both From Date and To Date");
                return;
            }

            indexTable.draw();
        });

        function SelectDataPostOrPush(CheckIsPostOrIsPush) {

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

            var dataTable = $('#JournalLists').DataTable();

            var rowData = dataTable.rows().data().toArray();
            var IsPostOrIsPushfilteredData = [];
            var filteredDataNotPost = [];
            if (CheckIsPostOrIsPush) {
                IsPostOrIsPushfilteredData = rowData.filter(x => x.isPost === "Y" && IDs.includes(x.glJournalId.toString()));

            }
            else {
                IsPostOrIsPushfilteredData = rowData.filter(x => x.isPush === "Y" && IDs.includes(x.glJournalId.toString()));
                filteredDataNotPost = rowData.filter(x => x.isPost === "N" && IDs.includes(x.glJournalId.toString()));
            }




            if (CheckIsPostOrIsPush) {
                if (IsPostOrIsPushfilteredData.length > 0) {
                    ShowNotification(3, "Data has already been Posted.");

                    return;
                }

            }
            else {
                if (IsPostOrIsPushfilteredData.length > 0) {
                    ShowNotification(3, "Data has already been Pushed.");

                    //ShowNotification(3, "Please select 'Invoice Not Pushed Yet!'");

                    return;
                }
                if (filteredDataNotPost.length > 0) {
                    ShowNotification(3, "Please Data Post First!");

                    return;
                }
            }


            if (CheckIsPostOrIsPush) {
                JournalEntryService.GLMultiplePost(model, GLMultiplePost, GLMultiplePostFail);


            }
            else {
                JournalEntryService.GLMultiplePush(model, GLMultiplePush, GLMultiplePushFail);

            }



        }

        function GLMultiplePost(result) {
            console.log(result.message);

            if (result.status == "200") {
                ShowNotification(1, result.message);
                $("#IsPost").val('Y');

                //$(".btnUnPost").show();
                $(".btnUnPost").show();

                //$('.btnUnPost:hidden').show();
                $(".btnPush").show();
                Visibility(true);


                $(".PostedBy").val(result.audit.postedBy);
                $(".PostedOn").val(result.audit.postedOn);


                indexTable.draw();


            }
            else if (result.status == "400") {
                ShowNotification(3, result.message); // <-- display the error message here
            }
            else if (result.status == "199") {
                ShowNotification(1, result.message); // <-- display the error message here
            }
        }

        function GLMultiplePostFail(result) {
            ShowNotification(3, "Something gone wrong");

            indexTable.draw();
        }


        function GLMultipleUnPost(result) {
            console.log(result.message);

            if (result.status == "200") {
                ShowNotification(1, result.message);
                $("#IsPost").val('N');
                Visibility(false);
                $("#divReasonOfUnPost").hide();
                $(".btnUnPost").hide();


                var reason = $('#UnPostReason').val();
                indexTable.draw();
                $("#UnPostReason").val("");
                $('#modal-default').modal('hide');


                //change
                
                $("#ReasonOfUnPost").val(result.data.reasonOfUnPost);

            }
            else if (result.status == "400") {
                ShowNotification(3, result.message); // <-- display the error message here
            }
            else if (result.status == "199") {
                ShowNotification(1, result.message); // <-- display the error message here
            }
        }

        function GLMultipleUnPostFail(result) {
            ShowNotification(3, "Something gone wrong");

            indexTable.draw();
            $('#modal-default').modal('hide');

        }

        function GLMultiplePush(result) {
            console.log(result.message);
            console.log(result.data);

            if (result.status == "200") {
                ShowNotification(1, result.message);
                $("#IsPush").val('Y');
                $("#SageEntryNo").val(result.data.sageEntryNo);


                $(".PushedBy").val(result.audit.pushedBy);
                $(".PushedOn").val(result.audit.pushedOn);


                indexTable.draw();


            }
            else if (result.status == "400") {
                ShowNotification(3, result.message); // <-- display the error message here
            }
            else if (result.status == "199") {
                ShowNotification(1, result.message); // <-- display the error message here
            }
        }

        function GLMultiplePushFail(result) {
            console.log(result);
            ShowNotification(3, result.message);
            indexTable.draw();
        }


        function TotalCalculation() {
            var debitTotal = 0;
            var creditTotal = 0;
            var OutofBalance = 0;

            //debitTotal = getColumnSum('Debit Amount', 'GLItemLists').toFixed(2);
            //creditTotal = getColumnSum('Credit Amount', 'GLItemLists').toFixed(2);
            debitTotal = getColumnSumAttr('Debit Amount', 'GLItemLists').toFixed(2);
            creditTotal = getColumnSumAttr('Credit Amount', 'GLItemLists').toFixed(2);
            OutofBalance = parseFloat(debitTotal) - parseFloat(creditTotal);


            $("#TotalDebitAmount").val(Number(parseFloat(debitTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
            $("#TotalCreditAmount").val(Number(parseFloat(creditTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
            $("#OutofBalance").val(Number(parseFloat(OutofBalance).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
        }



    }

    var JournalTable = function () {

        $('#JournalLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#JournalLists thead');
        var SageBatchNo = $('#SageBatchNo').val()

        var dataTable = $("#JournalLists").DataTable({
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
                url: '/GLJournalEntry/_index?BATCHID=' + SageBatchNo,
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            SageBatchNo: SageBatchNo, //

                            "codech": $("#md-Code").val(),
                            "entryno": $("#md-EntryNo").val(),
                            "post": $("#md-Post").val(),
                            "push": $("#md-Push").val(),
                            "fromDate": $("#FromDate").val(),
                            "toDate": $("#ToDate").val()


                        });
                }
            },
            columns: [

                {
                   
                    data: "glJournalId",
                    render: function (data) {
                     
                        return "<a href=/GLJournalEntry/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>   " +
                            "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"
                            ;
                    },
                   
                
                    "width": "9%",
                    "orderable": false,
                    "ordering": false
                },
                {
                    data: "code",
                    name: "code"
                    //"width": "20%"
                }
                ,
                {
                    data: "sageEntryNo",
                    name: "sageEntryNo"
                    //"width": "20%"
                }
                ,
                {
                    data: "documentDate",
                    name: "DocumentDate"

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

        $("#JournalLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        $("#JournalLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }






    function AccountNocallDone(result) {

        if (result.status == "200") {
            if (result.data.operation == "add") {
                ShowNotification(1, result.message);
                $(".btnSave").html('Update');
                $("#GLJournalId").val(result.data.glJournalId);
                $("#Code").val(result.data.code);
                result.data.operation = "update";
                $("#Operation").val(result.data.operation);

            } else {
                ShowNotification(1, result.message);
            }
        }
        else if (result.status == "400") {
            ShowNotification(3, result.message || result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message || result.error); // <-- display the error message here
        }
    }

    function AccountNocallFail(result) {
        console.log(result);
        ShowNotification(3, "Something gone wrong");
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

    function modalBatchDblClick(row, originalRow) {
        var batchNumber = row.find("td:first").text();
        var description = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(batchNumber);
        $("#SageBatchDescription").val(description);

        $("#sageBatchModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }
    function modalCodeDblClick(row, originalRow) {
        var sourceLedger = row.find("td:first").text();
        var description = row.find("td:eq(2)").text();

        originalRow.closest("div.input-group").find("input").val(sourceLedger);
        $("#SourceCodeDescription").val(description);

        $("#sageCodeModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }

    function modalEntryDblClick(row, originalRow) {
        var entryNumber = row.find("td:eq(1)").text();
        var edescription = row.find("td:eq(2)").text();
        originalRow.closest("div.input-group").find("input").val(entryNumber);
        $("#EntryDescription").val(edescription);
        $("#sageEntryModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();


    }

    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }


    function saveGL($table) {




        var TotalDebitAmount = $('#TotalDebitAmount').val();
        var TotalCreditAmount = $('#TotalCreditAmount').val();

        var validator = $("#frm_GL").validate();
        var journalMaster = serializeInputs("frm_GL");


        if (journalMaster.IsPush == 'Y') {
            ShowNotification(2, "Push operation is already done, Do not update this entry");
            return;
        }


        var journalDetails = serializeTable($table);

        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }

        //Required Feild Check 

        var requiredFields = ['AccountNo'];
        var fieldMappings = {
            'AccountNo': 'Account Number '
        };
        var errorMessage = getRequiredFieldsCheckObj(journalDetails, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;

        }

        //Required Feild Check Same Raw Debit Credit
        var errorMessage = getDebitCreditFieldsCheckObj(journalDetails);
        if (errorMessage) {
            ShowNotification(2, errorMessage);
            return;

        }

        if (parseFloat(TotalDebitAmount) != parseFloat(TotalCreditAmount)) {
            ShowNotification(2, "The current entry is out of balance.");
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


       

        journalMaster.GLDetailsList = journalDetails;
        
        JournalEntryService.save(journalMaster, saveDone, saveFail);
        
    }

    function saveDone(result) {

        if (result.status == "200") {
            if (result.data.operation == "add") {
                // Code for successful save operation
                var IsPushAllow = ($('#IsPushAllow').val() === "true");
                console.log(IsPushAllow)
                ShowNotification(1, result.message);
                $(".btnSave").html('Update');
                $(".btnSave").addClass('sslUpdate');
                $("#GLJournalId").val(result.data.glJournalId);
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

                $(".CreatedBy").val(result.audit.createdBy);
                $(".CreatedOn").val(result.audit.createdOn);

                


                ////// Redirect to edit method
                //setTimeout(function () {
                //    var editUrl = "/GLJournalEntry/Edit/" + result.data.glJournalId;
                //    window.location.href = editUrl;
                    
                //}, 3000);
             
                
                //var editUrl = "/GLJournalEntry/Edit/" + result.data.glJournalId;
                //window.location.href = editUrl;
              
            } else {
                // Code for successful save operation (if operation is not "add")
                ShowNotification(1, result.message);

                //var serializedData = $('#frm_GL').serialize();
                //var searchParams = new URLSearchParams(serializedData);
                //var LastUpdateBy = searchParams.get('Audit.LastUpdateBy');
                //var LastUpdateOn = searchParams.get('Audit.LastUpdateOn');

                $(".LastUpdateBy").val(result.audit.lastUpdateBy);
                $(".LastUpdateOn").val(result.audit.lastUpdateOn);

                

                $("#divSave").hide();

                $("#divUpdate").show();

            }
        }
        else if (result.status == "400") {
            // Code for client error
            ShowNotification(3, result.message || result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            // Code for server error
            ShowNotification(3, result.message || result.error);
        }
    }




    

    function saveFail(result) {
        console.log(result);
        ShowNotification(3, "Something gone wrong");
    }



    return {
        init: init
    }


}(CommonService, JournalEntryService);