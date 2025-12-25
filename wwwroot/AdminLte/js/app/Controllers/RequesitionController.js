var RequesitionController = function (CommonService, RequesitionService) {

    var init = function () {

        var $table = $('#RequesitionLists');





        var table = initEditTable($table, { searchHandleAfterEdit: false });

        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }

        var IsPost = $('#IsPost').val();
        if (IsPost === 'Y') {
            Visibility(true);
        }


        TotalCalculation();

        $table.on('click', '.remove-row-btn', function () {
            TotalCalculation();
        });

        //postpushCheck


        $('#recAddRow').on('click', function () {
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

            var url = '/Requesition/RequesitionExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;

            var Id = $("#Id").val();

            url += '&Id=' + (Id !== null ? Id : 'null');
            var win = window.open(url, '_blank');
        });




        $('#PostR').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {

                    SelectData(true);
                }
            });

        });
        $('#PushR').on('click', function () {
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


        $('#RequesitionLists').on('click', "input.txt" + "ItemNo", function () {
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

      


        $('#RequesitionLists').on('click', "input.txt" + "Location", function () {
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


        //$('#RequesitionLists').on('click', ".Location", function () {


        //    var itemNo = $(this).closest("tr").find("td:eq(0)").text()

        //    var itemNo = itemNo.trim();


        //    var originalRow = $(this);


        //    CommonService.locationModal({}, fail, function (row) { locationModalDblClick(row, originalRow) }, itemNo);


        //});

        function locationModalDblClick(row, originalRef) {

            var locationCode = row.find("td:first").text();
            /*originalRef.closest("td").find("input").val(locationCode);*/



            $("#locationModal").modal("hide");
            originalRef.closest("td").find("input").data('touched', false);

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

            RequesitionService.VendorNocall(value,
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


        //$('#RequesitionLists').on('keypress', "input.txtLocation", function (event) {
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

            var { error } = table.validateField(originalRow);
            if (error) return;

            RequesitionService.LocationNocall(value,
                function (result) {

                    var locationNo = result.data[0].location;
                    var itemUnformatted = result.data[0].itemUnformatted;


                    if (locationNo == null || locationNo == "") {
                        //originalRow.closest("tr").find("td:eq(1)").text("");
                        ShowNotification(3, "Location is not correct");
                    } else {


                        //originalRow.closest("tr").find("td:eq(1)").text(result.data[0].description);
                        //originalRow.closest("tr").find("td:eq(2)").text(result.data[0].itemUnformatted);




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

      



        $('#RequesitionLists').on('blur', ".td-Quantity", function (event) {

            TotalCalculation($(this));


        });



        //$('#RequesitionLists').on('blur', ".td-UnitCost", function (event) {


        //    computeSubtotal($(this));

        //});


        //function computeSubtotal(row) {
        //    try {
        //        var qty = parseFloat(row.closest("tr").find("td:eq(4)").text().replace(',', ''));
        //        var unitCost = parseFloat(row.closest("tr").find("td:eq(5)").text().replace(',', ''));



        //        if (!isNaN(qty * unitCost)) {

        //            var val = Number(parseFloat(qty * unitCost).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
        //            row.closest("tr").find("td:eq(6)").text(val);


        //            TotalCalculation();


        //        }
        //    } catch (ex) {

        //    }
        //}

        function TotalCalculation() {
           
            var amountTotal = 0;

            amountTotal = getColumnSumAttr('Quantity', 'RequesitionLists').toFixed(2);


            $("#TotalAmount").val(Number(parseFloat(amountTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
            
        }


        function ItemDescCall(value, originalRow) {

            var { error } = table.validateField(originalRow);
            if (error) return;

            RequesitionService.ItemNocall(value,
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

        //end searching



        $('.btn-vendor').on('click', function () {
            var originalRef = $(this);
            CommonService.vendorNumberModal({}, fail, function (row) { modalVendorSetDblClick(row, originalRef) });

        });

        $('.btn-template').on('click', function () {
            var originalRef = $(this);
            ModalService.sageTemplateModal({}, fail, function (row) { modalSgaeTemplateDblClick(row, originalRef) });

        });

        var indexTable = RequesitionTable();

        //var indexConfig = GetIndexTable();
        //var indexTable = $("#ReceiptLists").DataTable(indexConfig);



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




        $(".btnSave").click(function () {

            save($table);

        });


        $('.btnPost').click('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
                console.log(result);
                if (result) {


                    var requesitionMaster = serializeInputs("frm_Requesition");

                    if (requesitionMaster.IsPost == "Y") {
                        ShowNotification(3, "Data has already been Posted.");
                    }
                    else {
                        requesitionMaster.IDs = requesitionMaster.Id;
                        RequesitionService.REQMultiplePost(requesitionMaster, REQMultiplePost, REQMultiplePostFail);
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

            var requisitionMaster = serializeInputs("frm_Requesition");

            requisitionMaster["ReasonOfUnPost"] = ReasonOfUnPost;
            Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
                    ShowNotification(3, "Please Write down Reason Of UnPost");
                    $("#ReasonOfUnPost").focus();
                    return;
                }
                if (result) {
                    if (requisitionMaster.IsPush === "Y") {
                        ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                    }
                    else {

                        requisitionMaster.IDs = requisitionMaster.Id;
                        RequesitionService.RequisitionMultipleUnPost(requisitionMaster, REQMultipleUnPost, REQMultipleUnPostFail);
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

        //        var requisitionMaster = serializeInputs("frm_Requesition");

        //        requisitionMaster["ReasonOfUnPost"] = ReasonOfUnPost;

        //        Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
        //            if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
        //                ShowNotification(3, "Please Write down Reason Of UnPost");
        //                $("#ReasonOfUnPost").focus();
        //                return;
        //            }
        //            if (result) {
        //                if (requisitionMaster.IsPush === "Y") {
        //                    ShowNotification(3, "Unable to UnPost, Data is already Posted!");
        //                }
        //                else {

        //                    requisitionMaster.IDs = requisitionMaster.Id;
        //                    RequesitionService.RequisitionMultipleUnPost(requisitionMaster, REQMultipleUnPost, REQMultipleUnPostFail);
        //                }

        //            }
        //        });
        //    }




        //});





        $('.btnPush').click('click', function () {

            Confirmation("Are you sure? Do You Want to Push Data?", function (result) {
                console.log(result);
                if (result) {


                    var requesitionMaster = serializeInputs("frm_Requesition");

                    requesitionMaster.IDs = requesitionMaster.Id;

                    if (requesitionMaster.IsPost == "N") {
                        ShowNotification(3, "Please Data Post First!");
                    }

                    else {
                        if (requesitionMaster.IsPush == "Y") {
                            ShowNotification(3, "Data has already been Pushed.");

                        }
                        else {
                            requesitionMaster.IDs = requesitionMaster.Id;
                            RequesitionService.REQMultiplePush(requesitionMaster, REQMultiplePush, REQMultiplePushFail);


                        }
                    }
                }
            });

        });





    }


    /*init end*/


    function Visibility(action) {
        $('#frm_RequesitionEntry').find(':input').prop('readonly', action);
        $('#frm_RequesitionEntry').find('table, table *').prop('disabled', action);
        $('#frm_RequesitionEntry').find(':input[type="button"]').prop('disabled', action);

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

        //for branchid
        //var branchId = $('#Branchs').val();

        //if (branchId == null || branchId === '') {
        //    var branchId = $('#CurrentBranchId').val();
        //}
        //model.branchId = branchId;




        var dataTable = $('#RequsitionList').DataTable();

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
            RequesitionService.REQMultiplePost(model, REQMultiplePost, REQMultiplePostFail);


        }
        else {
            RequesitionService.REQMultiplePush(model, REQMultiplePush, REQMultiplePushFail);

        }

    }


    function REQMultiplePost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPost").val('Y');

            $(".btnUnPost").show();
            $(".btnPush").show();
            Visibility(true);

            var dataTable = $('#RequsitionList').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.error);
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message);
        }
    }

    function REQMultiplePostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#RequsitionList').DataTable();
        dataTable.draw();


    }

    function REQMultiplePush(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);

            $("#IsPush").val('Y');


            var dataTable = $('#RequsitionList').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message);
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); 
        }
    }
    function REQMultiplePushFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#RequsitionList').DataTable();
        dataTable.draw();

        
    }



    function REQMultipleUnPost(result) {
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

    function REQMultipleUnPostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#RequsitionList').DataTable();

        dataTable.draw();
    }


    function itemModalDblClick(row, originalRef) {
        var itemCode = row.find("td:first").text();
        originalRef.closest("td").find("input").val(itemCode);

        var itemUnfrmt = row.find("td:eq(1)").text();
        var itemDescription = row.find("td:eq(2)").text();
        /*var itemunitofmeasure = row.find("td:eq(4)").text();*/

        originalRef.closest('td').next().text(itemDescription);
        originalRef.closest('td').next().next().text(itemUnfrmt);
        /* originalRef.closest('td').next('td').next('td').next('td').next('td').next().text(itemunitofmeasure);*/


        $("#itemModal").modal("hide");
        originalRef.closest("td").find("input").data("touched", false);

        originalRef.closest("td").find("input").focus();
    }

    function modalSgaeTemplateDblClick(row, originalRow) {

        var templateCode = row.find("td:first").text();
        var templateDescription = row.find("td:eq(1)").text();

        originalRow.closest("div.input-group").find("input").val(templateCode);
        originalRow.closest("div.input-group").find("input").focus();

        $("#TempateDescription").val(templateDescription);

        $("#templateModal").modal("hide");
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


    var RequesitionTable = function () {

        $('#RequsitionList thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#RequsitionList thead');


        var dataTable = $("#RequsitionList").DataTable({
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
                url: '/Requesition/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {

                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),

                            "code": $("#md-Code").val(),
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

                        return "<a href=/Requesition/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'>&nbsp;</i></a>  " +
                            "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"
                            ;

                    },
                    "width": "9%",
                    "orderable": false
                },
                {
                    data: "code",
                    name: "Code"

                },   

                {
                    data: "vendorNumber",
                    name: "VendorNumber"

                }
                ,
                {
                    data: "requiredDate",
                    name: "RequiredDate"
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




        $("#RequsitionList").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#RequsitionList").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    function save($table) {


        var validator = $("#frm_Requesition").validate();
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

        var requesitionMaster = serializeInputs("frm_Requesition");

        //if (requesitionMaster.VendorNumber == "" || requesitionMaster.VendorNumber == null) {
        //    ShowNotification(3, "Vendor number is not correct , Please select correct vendor number");
        //    return;
        //}
        //if (requesitionMaster.IsPush == 'Y') {
        //    ShowNotification(3, "Update cannot be performed because the data has already been pushed.");
        //    return;
        //}

        var requesitionDetails = serializeTable($table);

        console.log(requesitionDetails);



        //Required Feild Check

        var requiredFields = ['ItemNo', 'Location', 'Quantity'];
        var fieldMappings = {
            'ItemNo': 'Item Number ',
            'Location': 'Location ',
            'Quantity': 'Quantity Ordered '          
        };
        var errorMessage = getRequiredFieldsCheckObj(requesitionDetails, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;

        }



        requesitionMaster.PORequesitionDetailsList = requesitionDetails;

        RequesitionService.save(requesitionMaster, saveDone, saveFail);



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


}(CommonService, RequesitionService);