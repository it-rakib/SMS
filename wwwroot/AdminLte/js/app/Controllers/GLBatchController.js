var GLBatchController = function (CommonService, JournalEntryService) {


    

    var init = function () {

        LoadCombo("Branchs", '/Common/Branch');
        var indexTable = GlBatchTable();


        $("#indexSearch").click(function () {

            indexTable.draw();
        });
        
        // var indexConfig = GetIndexTable();
        // var indexTable = $("#GLBatchLists").DataTable(indexConfig);
    
    }

    var GlBatchTable = function () {

        $('#GLBatchLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#GLBatchLists thead');


        var dataTable = $("#GLBatchLists").DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            serverSide: true,
            "processing": true,
            searching: false,



            ajax: {
                url: '/GLJournalEntry/_indexBatch',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                             "batchid": $("#BATCHID").val()


                            ,"description": $("#md-Description").val()
                            ,"sourceledger": $("#md-SourceLedger").val()
                            , "type": $("#md-Type").val()
                            , "status": $("#md-Status").val()
                            , "batchnumber": $("#md-BATCHNumber").val()
                            , "noofentries": $("#md-NoOfEntries").val()
                        });
                }
            },
            columns: [

                {
                    data: "batchid",
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
                    data: "batchid",
                    name: "BATCHID"

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
                    data: "sourceLedger",
                    name: "SourceLedger"

                }
                ,               
                {
                    "width": "20%",
                    data: "type",
                    name: "Type"

                },
                {
                    "width": "20%",
                     data: "status",
                     name: "Status"

                }
                ,
                {
                    "width": "20%",
                    data: "noOfEntries",
                    name: "NoOfEntries"

                }
                
                

            ]

        }
        );


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



        $("#GLBatchLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
       

        return dataTable;

    }


    //var editEntry = function (batchId) {
    //    // Logic for editing the entry with the given batchId
    //    console.log("Edit entry with batchId", batchId);
    //};


     
    return {
        init: init,
    }


}(CommonService, JournalEntryService);
function editEntry(id) {
    //window.location.href = '/GLJournalEntry/Index?Id=' + id;

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/GLJournalEntry/Index");

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