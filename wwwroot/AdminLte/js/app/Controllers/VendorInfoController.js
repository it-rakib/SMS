var VendorInfoController = function (CommonService, VendorInfoService) {



    var init = function () {

        /*var $table = $('#ICRItemLists');*/



        //var table = initEditTable($table, { searchHandleAfterEdit: false });

        //if ($("#Branchs").length) {
        //    LoadCombo("Branchs", '/Common/Branch');

        //}



        //$(".chkAll").click(function () {
        //    $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        //});



        var indexTable = VendorInfoTable();






    }

    /*init end*/

    var VendorInfoTable = function () {

        $('#VendorInfoLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#VendorInfoLists thead');


        var dataTable = $("#VendorInfoLists").DataTable({
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
                url: '/Common/_vendorNumberModal',
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


                            "vendorCode": $("#md-VendorCode").val(),
                            "shortName": $("#md-ShortName").val(),
                            "vendorName": $("#md-VendorName").val(),
                            "idAccSet": $("#md-IdAccSet").val(),
                            "accountSetDescription": $("#md-AccountSetDescription").val(),
                            "termsCode": $("#md-TermsCode").val()


                        });
                }
            },
            columns: [

                //{
                //    data: "id",
                //    render: function (data) {

                //        return "<a href=/Receipt/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'>&nbsp;</i></a>  " +
                //            "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"
                //            ;

                //    },
                //    "width": "9%",
                //    "orderable": false
                //},
                {
                    data: "vendorCode",
                    name: "VendorCode"

                },



                {
                    data: "shortName",
                    name: "ShortName"

                }
                ,

                {
                    data: "vendorName",
                    name: "VendorName"
                    //"width": "20%"
                }
                ,
                {
                    data: "idAccSet",
                    name: "IdAccSet"
                    //"width": "20%"
                }
                ,
                {
                    data: "accountSetDescription",
                    name: "AccountSetDescription"
                    //"width": "20%"
                }
                ,
                {
                    data: "termsCode",
                    name: "TermsCode"
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




        $("#VendorInfoLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#VendorInfoLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }





    return {
        init: init
    }


}(CommonService, VendorInfoService);