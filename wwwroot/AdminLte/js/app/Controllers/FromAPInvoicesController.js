var FromAPInvoicesController = function (CommonService, ModalService, FromAPInvoicesService) {


    var init = function () {


        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }


        $('#ApInvoicesData').on('click', function () {

            SelectApInvoicesData();

        });


        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });


        $('.btn-vendor').on('click', function () {
            var originalRef = $(this);
            CommonService.vendorNumberModal({}, fail, function (row) { modalVendorSetDblClick(row, originalRef) });

        });
    

        var indexTable = FromApInvoicesTable();


        $("#indexSearch").click(function () {
            var data = $("#Branchs").val();
            var vendornumber = $("#VendorNumber").val();
            if (data == "xx") {
                ShowNotification(3, "Please Select Branch Type First");
                return;
            }
            indexTable.draw();
        });




    }

    /*init end*/


    function SelectApInvoicesData() {
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

        var dataTable = $('#FromApInvoicesLists').DataTable();

        var rowData = dataTable.rows().data().toArray();

        var filteredData = rowData.filter(x => IDs.includes(x.apInvoiceId.toString()));
        //console.log(filteredData)

        var distinctVendorNos = [...new Set(filteredData.map(x => x.vendorNumber))];

        if (distinctVendorNos.length > 1) {
            ShowNotification(2, "Select Same Vendor For Multiple ApInvoices!");

            return;
        }

        var data = $("#SageBatchNo").val();
        model.SageBatchNo = data;


        var form = $('<form>').attr('method', 'post').attr('action', '/APPayments/MultipleInvoicesGetData');
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

    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }

    function modalVendorSetDblClick(row, originalRow) {

        var vendorCode = row.find("td:first").text();
        var vendornName = row.find("td:eq(2)").text();

        originalRow.closest("div.input-group").find("input").val(vendorCode);
        originalRow.closest("div.input-group").find("input").focus();


        $("#VendorName").val(vendornName);
        $("#VendorNumber").val(vendorCode);


        $("#vendorModal").modal("hide");
    }


    var FromApInvoicesTable = function () {

        $('#FromApInvoicesLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#FromApInvoicesLists thead');


        var dataTable = $("#FromApInvoicesLists").DataTable({
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
                url: '/APInvoice/_fromApInvoices',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "SagePONumber": $("#SagePONumber").val(),
                            "PODateFrom": $("#PODateFrom").val(),
                            "PODateTo": $("#PODateTo").val(),
                            "indexsearch": $("#Branchs").val(),

                            "vendor": $("#VendorNumber").val(),


                            "branchid": $("#CurrentBranchId").val(),
                            "code": $("#md-Code").val(),
                            "shiptolocation": $("#md-ShipToLocation").val(),
                            "ispost": $("#md-Post").val(),
                            "ispush": $("#md-Push").val(),
                            "vendornumber": $("#md-VendorNumber").val(),
                            "vendorname": $("#md-VendorName").val()


                        });
                }
            },
            columns: [

                {
                    data: "apInvoiceId",
                    render: function (data) {
                       
                        return "<a href=/PurchaseOrder/Edit/" + data + " class='edit' ></a>  " +
                            "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"
                            ;

                    },
                    "width": "5%",
                    "orderable": false
                },
                {
                    data: "code",
                    name: "code"
                    //"width": "20%"
                },
                
                {
                    data: "vendorName",
                    name: "VendorName"
                    //"width": "20%"
                }, 
                {
                    data: "vendorNumber",
                    name: "VendorNumber"
                    //"width": "20%"
                }, 
                {
                    data: "accountSet",
                    name: "AccountSet"
                    //"width": "20%"
                },           
                               
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

                //else if ($(cell).hasClass('bool')) {

                //    $(cell).html('<select class="acc-filters filter-input " style="width:100%"  id="md-' + title.replace(/ /g, "") + '"><option>Select</option><option>Y</option><option>N</option></select>');

                //}

                else {
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');
                }
            });

        }


        $("#FromApInvoicesLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        $("#FromApInvoicesLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    



    return {
        init: init
    }
}(CommonService, ModalService, FromAPInvoicesService);