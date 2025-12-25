var PaymentsBatchController = function (CommonService, APPaymentsService) {


    var init = function () {
        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }

        var indexTable = APBatchTable();


        $("#indexSearch").click(function () {

            indexTable.draw();
        });



    }

    var APBatchTable = function () {

        $('#APBatchLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#APBatchLists thead');


        var dataTable = $("#APBatchLists").DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            serverSide: true,
            "processing": true,
            searching: false,



            ajax: {
                url: '/APPayments/_indexBatch',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {


                            "BatchNo": $("#BatchNumber").val(),
                           

                            "batchNumber": $("#md-BatchNumber").val()
                            , "description": $("#md-Description").val()
                           
                            , "batchStatus": $("#md-BatchStatus").val()
                            , "batchType": $("#md-BatchType").val()
                        });
                }
            },
            columns: [

                {
                    data: "batchNumber",
                    render: function (data) {

                        //return "<a href=/GLJournalEntry/Index?Id=" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";
                        //return "<button type='button' class='edit' onclick=\"window.location.href='/GLJournalEntry/Index?Id=" + data + "'\"><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></button>";
                        //return "<a href='#' class='edit' onclick='editEntry(" + data + ")'><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>";

                        return "<a href='#' class='edit' onclick='editEntry(\"" + data + "\")'><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>";
                    },
                    "width": "7%",
                    "orderable": false
                },
                {
                    "width": "20%",
                    data: "batchNumber",
                    name: "BatchNumber"

                }
                ,
                {
                    "width": "20%",
                    data: "description",
                    name: "Description"

                }
                ,

                {
                    "width": "20%",
                    data: "batchType",
                    name: "BatchType"

                }
                ,

                {
                    "width": "20%",
                    data: "batchStatus",
                    name: "BatchStatus"

                }

            ]

        });



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



        $("#APBatchLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }




     
    return {
        init: init
    }


}(CommonService, APPaymentsService);
function editEntry(id) {
    //window.location.href = '/GLJournalEntry/Index?Id=' + id;

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/APPayments/Index");

    // Create a hidden input field for the batch ID
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "SageBatchNo");
    input.setAttribute("value", id.toString());
    form.appendChild(input);

    // Submit the form
    document.body.appendChild(form);
    form.submit();
    form.remove();
}