var BranchProfileController = function ( BranchProfileService) {

    var init = function () {

        //var indexConfig = GetIndexTable();
        //var indexTable = $("#BkTransfersLists").DataTable(indexConfig);

        var indexTable = BpTable();


        $("#btnAdd").on("click", function () {

            rowAdd(detailTable);

        });

        $('#Post').on('click', function () {

            SelectData(true);

        });

    

        $("#ModalButtonCloseFooter").click(function () {
            addPrevious(detailTable);
        });


        $("#ModalButtonCloseHeader").click(function () {
            addPrevious(detailTable);
        });


        $('.btn-cogscode').on('click', function () {
            var originalRef = $(this);
            CommonService.accountCodeModal({}, fail, function (row) { cogsModalDblClick(row, originalRef) });

        });
        $('.btn-taxcode').on('click', function () {
            var originalRef = $(this);
            CommonService.accountCodeModal({}, fail, function (row) { taxModalDblClick(row, originalRef) });

        });
        $('.btn-vatcode').on('click', function () {
            var originalRef = $(this);
            CommonService.accountCodeModal({}, fail, function (row) { vatModalDblClick(row, originalRef) });

        });



        $('.btnsave').click('click', function () {
            save();
        });

        $("#indexSearch").click(function () {
            indexTable.draw();
        });

       

        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });


    }

    function cogsModalDblClick(row, originalRow) {

        var accountCode = row.find("td:first").text();
        originalRow.closest("div.input-group").find("input").val(accountCode);

        var accountDescription = row.find("td:eq(1)").text();
        /*var customerContract = row.find("td:eq(4)").text();*/

        $("#CogsCodeDescription").val(accountDescription);
        /*$("#Contact").val(customerContract);*/

        $("#accountModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }
    
    function taxModalDblClick(row, originalRow) {

        var accountCode = row.find("td:first").text();
        originalRow.closest("div.input-group").find("input").val(accountCode);

        var accountDescription = row.find("td:eq(1)").text();
        /*var customerContract = row.find("td:eq(4)").text();*/

        $("#TaxCodeDescription").val(accountDescription);
        /*$("#Contact").val(customerContract);*/

        $("#accountModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }
    
    function vatModalDblClick(row, originalRow) {

        var accountCode = row.find("td:first").text();
        originalRow.closest("div.input-group").find("input").val(accountCode);

        var accountDescription = row.find("td:eq(1)").text();
        /*var customerContract = row.find("td:eq(4)").text();*/

        $("#VatCodeDescription").val(accountDescription);
        /*$("#Contact").val(customerContract);*/

        $("#accountModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }

    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }


    var BpTable = function () {

        $('#BranchLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#BranchLists thead');


        var dataTable = $("#BranchLists").DataTable({
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
                url: '/BranchProfile/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "BranchCode": $("#md-BranchCode").val(),

                           
                            "branchName": $("#md-BranchName").val(),
                            
                            "Address": $("#md-Address").val(),
                            "TelephoneNo": $("#md-TelephoneNo").val()


                        });
                }
            },
            columns: [

                {
                    data: "branchID",
                    render: function (data) {

                        return "<a href=/BranchProfile/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>   "
                            
                            ;
                    },
                    "width": "7%",
                    "orderable": false
                }
                ,
                {
                    data: "branchCode",
                    name: "BranchCode"
                    //"width": "20%"
                }
                ,
                {
                    data: "branchName",
                    name: "BranchName"
                    //"width": "20%"
                }
                ,
                {
                    data: "address",
                    name: "Address"
                    //"width": "20%"
                }
                ,
                {
                    data: "telephoneNo",
                    name: "TelephoneNo"
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
                } else {
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');
                }
            });

        }

        $("#BranchLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    function save() {

        var validator = $("#frm_Branch").validate();
        var branchProfile = serializeInputs("frm_Branch");

        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }

        BranchProfileService.save(branchProfile, saveDone, saveFail);
    }
    function saveDone(result) {

        if (result.status == "200") {
            if (result.data.operation == "add") {
                ShowNotification(1, result.message);
                $(".btnsave").html('Update');
                $(".btnsave").addClass('sslUpdate');
                $("#BranchID").val(result.data.branchID);
                $("#Code").val(result.data.code);
                result.data.operation = "update";
                $("#Operation").val(result.data.operation);

            } else {
                ShowNotification(1, result.message);
            }
        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(2, result.message); // <-- display the error message here
        }
    }

    function saveFail(result) {
        console.log(result);
        ShowNotification(3, "This Branch Code  already exists");
    }









    return {
        init: init
    }


}( BranchProfileService);