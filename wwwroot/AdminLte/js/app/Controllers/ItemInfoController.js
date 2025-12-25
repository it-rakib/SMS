var ItemInfoController = function (CommonService, ItemInfoService) {



    var init = function () {

        /*var $table = $('#ICRItemLists');*/

       

        //var table = initEditTable($table, { searchHandleAfterEdit: false });

        //if ($("#Branchs").length) {
        //    LoadCombo("Branchs", '/Common/Branch');

        //}
   
        

        //$(".chkAll").click(function () {
        //    $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        //});


     
        var indexTable = ItemInfoTable();

        




    }

    /*init end*/
    
    var ItemInfoTable = function () {

        $('#ItemInfoLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#ItemInfoLists thead');


        var dataTable = $("#ItemInfoLists").DataTable({
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
                url: '/Common/_itemNumberModal',
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


                            "itemNumber": $("#md-ItemNumber").val(),
                            "itemUnformatted": $("#md-ItemUnformatted").val(),
                            "description": $("#md-Description").val(),
                            "status": $("#md-Status").val(),
                            "category": $("#md-Category").val(),
                            "unitofMeasure": $("#md-UnitofMeasure").val()


                        });
                }
            },
            columns: [

                {
                    data: "itemNumber",
                    //render: function (data) {

                    //    return "<a href=/Receipt/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'>&nbsp;</i></a>  " +
                    //        "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"
                    //        ;

                    //},
                    render: function (data) {
                        //var editLink = "<a href='/Receipt/Edit/" + data + "' class='edit'><i class='editIcon' data-toggle='tooltip' title='Edit'></i></a>";
                        //var checkbox = "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id='" + data + "'>";
                        var button = "<button class='btn btn-primary my-button' data-id='" + data + "'>Location</button>";

                        return  button;
                    },

                    "width": "9%",
                    "orderable": false
                },
                {
                    data: "itemNumber",
                    name: "ItemNumber"

                },

               

                {
                    data: "itemUnformatted",
                    name: "ItemUnformatted"

                }
                ,

                {
                    data: "description",
                    name: "Description"
                    //"width": "20%"
                }
                ,
                {
                    data: "status",
                    name: "Status"
                    //"width": "20%"
                }
                ,
                {
                    data: "category",
                    name: "Category"
                    //"width": "20%"
                }
                ,
                {
                    data: "unitofMeasure",
                    name: "UnitofMeasure"
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




        $("#ItemInfoLists").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#ItemInfoLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }




    $(document).on('click', '.my-button', function () {


        var itemNo = $(this).data('id');

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


    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }


    return {
        init: init
    }


}(CommonService, ItemInfoService);