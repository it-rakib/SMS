var TestController = function (CommonService) {
    var init = function () {


        var indexConfig = GetIndexTable();
        var indexTable = $("#testTable").DataTable(indexConfig);

        $("#tblSearch").on("click", () => handleCustomSearch(indexTable));

    }


    function handleCustomSearch(indexTable) {
        indexTable.draw();
    }

    function GetIndexTable() {
        return {

            "processing": true,
            serverSide: true,
            "bProcessing": true,
            dom: 'lBfrtip',
            bRetrieve: true,
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
                url: '/Test/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "IsActive": $("#IsActive").val()
                        });
                }
        
            },
            columns: [
                {
                    data: "id",
                    render: function (data) {

                        return "<a href=/Test/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";

                    },
                    "width": "7%",
                    "orderable": false
                },
                {
                    data: "code", // same as model with camel case
                    name: "Code"  // same as th without space
                }
                ,
                {
                    data: "transDate",
                    name: "TransactionDate"
                }
                ,
                {
                    data: "glAccount",
                    name: "GLAccount"
                }
               
            ],
            order: [2, "asc"]
        
        }
    }

    return {
        init: init
    }

}(CommonService);