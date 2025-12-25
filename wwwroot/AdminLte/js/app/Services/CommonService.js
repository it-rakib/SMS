var CommonService = function () {
    var sageUserNameModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/SageUserNameModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#SageUserNameModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#AccountCodeModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#AccountCodeModal thead');


            var dataTable = $("#SageUserNameModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_SageUserNameModal',
                    type: 'POST',
                  
                },
                columns: [

                    {
                        data: "userName",
                        name: "UserName",
                        width: '50%'

                    }
                   
                ],

                columnDefs: [
                    { width: '30%', targets: 0 }
                ],

            });


            return dataTable;

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#sageUserNameModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#sageUserNameModal").modal("show");
        }
    };




    var accountCodeModal = function ( done, fail, dblCallBack, closeCallback) {

        $.ajax({
            url: '/Common/AccountCodeModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#AccountCodeModal").on("dblclick",
                "tr",
                function() {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        //new 
        var modalCloseEvent = function (callBack) {

     
            $('#accountModal').on('hidden.bs.modal', function () {
                //alert("closed")

                if (typeof closeCallback == "function") {
                    closeCallback();
                }
               
            });

        }

        var formatTable = function () {

            //$('#AccountCodeModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#AccountCodeModal thead');


            var dataTable =  $("#AccountCodeModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_AccountCodeModal',
                    type: 'POST',
                    //data: function (payLoad) {
                    //    return $.extend({},
                    //        payLoad,
                    //        {
                    //            "accountCode": $("#md-AccountNumber").val()
                    //            , "description": $("#md-Description").val()
                    //        });
                    //}
                },
                columns: [
             
                    {
                        data: "accountNumber",
                        name: "AccountNumber",
                        width: '50%'
                      
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                    ,
                    {
                        data: "type",
                        name: "Type"
                    }
                    ,
                    {
                        data: "status",
                        name: "Status"
                    }
                 
                ],

                columnDefs: [
                    { width: '30%', targets: 0 }
                ],
          
            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function(colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            //$("#AccountCodeModal").on("keyup",
            //    ".acc-filters",
            //    function () {

                    

            //        dataTable.draw();
            //    });

            return dataTable;

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);


            modalCloseEvent();


            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#accountModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });



            //$("#accountModal").modal({ backdrop: 'static', keyboard: false });
            $("#accountModal").modal("show");
        }
    };



    var apInvoiceModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/APInvoiceModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#APInvoiceBatchModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

           

            let dataTable = $("#APInvoiceBatchModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_APInvoiceModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {

                                "batchNumber": $("#md-BatchNumber").val()
                                , "description": $("#md-Description").val()
                            });
                    }
                },
                columns: [

                    {
                        data: "batchNumber",
                        name: "BatchNumber",
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }



                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            $("#APInvoiceBatchModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#apInvoiceModal").html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#apInvoiceModal").modal("show");
        }
    };


    var sageBatchModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/SageBatchModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        let doublClick = function (callBack) {

            $("#SageBatchModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            $('#SageBatchModal thead tr')
                .clone(true)
                .addClass('filters')
                .appendTo('#SageBatchModal thead');


            var dataTable = $("#SageBatchModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_SageBatchModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {
                                "batchNumber": $("#md-BatchNumber").val()
                                , "description": $("#md-Description").val()
                            });
                    }
                },
                columns: [

                    {
                        data: "batchNo",
                        name: "BatchNumber",
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                    ,
                    {
                        data: "type",
                        name: "Type"
                    }
                    ,
                    {
                        data: "status",
                        name: "Status"
                    }

                ]

            });


            dataTable
                .columns()
                .eq(0)
                .each(function (colIdx) {
                    // Set the header cell to contain the input element
                    var cell = $('.filters th').eq(
                        $(dataTable.column(colIdx).header()).index()
                    );
                    var title = $(cell).text();
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');

                });


            $("#SageBatchModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#sageBatchModal").html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#sageBatchModal").modal("show");
        }
    };

    var vendorNumberModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/vendorNumberModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#VendorNumberModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#VendorNumberModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_vendorNumberModal',
                    type: 'POST'
                },
                columns: [

                    {
                        data: "vendorCode",
                        name: "VendorCode"
                    }
                    ,
                    {
                        data: "shortName",
                        name: "ShortName"
                    }
                    ,
                    {
                        data: "vendorName",
                        name: "VendorName"
                    }
                    ,
                    {
                        data: "status",
                        name: "Status"
                    }
                    ,
                    {
                        data: "idAccSet",
                        name: "IdAccSet"
                    }


                    ,
                    {
                        data: "accountSetDescription",
                        name: "AccountSetDescription"
                    }


                    ,
                    {
                        data: "currencyCode",
                        name: "CurrencyCode"
                    }

                    ,
                    {
                        data: "termsCode",
                        name: "TermsCode"
                    }
                    ,
                    {
                        data: "termsCodeDesc",
                        name: "TermsCodeDesc"
                    }
                   

                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
                    
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            //$("#AccountCodeModal").on("keyup",
            //    ".acc-filters",
            //    function () {



            //        dataTable.draw();
            //    });

            //return dataTable;






        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#vendorModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#vendorModal").modal("show");
        }
    };


    var itemNumberModal = function (done, fail, dblCallBack, closeCallback) {

        $.ajax({
            url: '/Common/itemNumberModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#ItemNumberModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var modalCloseEvent = function (callBack) {


            $('#itemModal').on('hidden.bs.modal', function () {
                //alert("closed")

                if (typeof closeCallback == "function") {
                    closeCallback();
                }

            });

        }



        var formatTable = function () {

            return $("#ItemNumberModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_itemNumberModal',
                    type: 'POST'
                },
                columns: [

                    {
                        data: "itemNumber",
                        name: "ItemNumber"
                    }
                    ,
                    {
                        data: "itemUnformatted",
                        name: "ItemUnformatted"
                    },
                    {
                        data: "description",
                        name: "Description"
                    }
                    ,
                    {
                        data: "status",
                        name: "Status"
                    }
                    ,
                    {
                        data: "category",
                        name: "Category"
                    }
                    ,
                    {
                        data: "unitofMeasure",
                        name: "UnitofMeasure"
                    }

                    


                ]

            });

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#itemModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#itemModal").modal("show");
        }
    };


    var locationModal = function (done, fail, dblCallBack, closeCallback,itemNo="") {

      //  console.log('/Common/locationModal?itemNo=' + encodeURIComponent(itemNo))

        $.ajax({
            url: '/Common/locationModal?itemNo=' + encodeURIComponent(itemNo).replace(/#/g, '%23'),
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#LocationModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var modalCloseEvent = function (callBack) {


            $('#LocationModal').on('hidden.bs.modal', function () {
                //alert("closed")

                if (typeof closeCallback == "function") {
                    closeCallback();
                }

            });

        }
        var formatTable = function () {

            return $("#LocationModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_locationModal',
                    type: 'POST',

                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {
                                
                                "itemNo": $("#md-itemNo").val()

                            });
                    }




                },
                columns: [

                    {
                        data: "location",
                        name: "Location"
                    }
                    ,
                    {
                        data: "name",
                        name: "Name"
                    }
                    ,
                    {
                        data: "quantityOnHand",
                        name: "QuantityOnHand"
                    }
                    ,
                    {
                        data: "quantityOnPO",
                        name: "QuantityOnPO"
                    }
                    
                   

                ]

            });

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#locationModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#locationModal").modal("show");
        }
    };





    var customerNumberModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/customerNumberModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#CustomerNumberModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#CustomerNumberModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_customerNumberModal',
                    type: 'POST'
                },
                columns: [

                    //{
                    //    data: "customerNumber",
                    //    name: "CustomerNumber"
                    //}
                    //,
                    //{
                    //    data: "customerName",
                    //    name: "CustomerNumber"
                    //}
                    //,
                    //{
                    //    data: "contract",
                    //    name: "Contract"
                    //}
                    


                ]

            });

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#itemModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#itemModal").modal("show");
        }
    };


    var sageEntryModal = function (done, fail, dblCallBack, batchNo = "") {

        $.ajax({
            url: '/Common/SageEntryModal?batchNo=' + batchNo,
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#SageEntryModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#SageEntryModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#SageEntryModal thead');


            let dataTable = $("#SageEntryModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_SageEntryModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {
                                "entryNumber": $("#md-EntryNumber").val()
                                , "description": $("#md-Description").val()
                                , "glBatchNo": $("#md-glbatchno").val()
                            });
                    }
                },
                columns: [
                    {
                        data: "batchNo",
                        name: "BatchNumber",
                    },
                    {
                        data: "entryNo",
                        name: "EntryNumber",
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                    ,
                    {
                        data: "sourceLedger",
                        name: "SourceLedger"
                    }


                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            $("#SageEntryModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#sageEntryModal").html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#sageEntryModal").modal("show");
        }
    };


    var sourceCodeModal = function (done, fail, dblCallBack, SourceLedger = "") {

        $.ajax({
            url: '/Common/SourceCodeModal?SourceLedger=' + SourceLedger,
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#SourceCodeModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#SourceCodeModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#SourceCodeModal thead');


            let dataTable = $("#SourceCodeModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_SourceCodeModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {
                                "sourceLedger": $("#md-SourceLedger").val()

                            });
                    }
                },
                columns: [
                    {
                        data: "sourceLedger",
                        name: "SourceLedger",
                    },
                    {
                        data: "sourceType",
                        name: "SourceType",
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }



                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            $("#SourceCodeModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#sageCodeModal").html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#sageCodeModal").modal("show");
        }
    };

    var accountSetModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/AccountSetModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#AccountSetModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#AccountSetModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_AccountSetModal',
                    type: 'POST'
                },
                columns: [

                    {
                        data: "accountSetCode",
                        name: "AccountSetCode"
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                    ,
                    {
                        data: "currencyCode",
                        name: "CurrencyCode"
                    }
                    


                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {

            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            //$("#AccountCodeModal").on("keyup",
            //    ".acc-filters",
            //    function () {



            //        dataTable.draw();
            //    });

            //return dataTable;






        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#accountSetModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#accountSetModal").modal("show");
        }
    };

    var apEntryModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/APEntryModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#APEntryModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#APEntryModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_apEntryModal',
                    type: 'POST'
                },
                columns: [

                    {
                        data: "vendorCode",
                        name: "VendorCode"
                    }
                    ,
                    {
                        data: "shortName",
                        name: "ShortName"
                    }
                    ,
                    {
                        data: "vendorName",
                        name: "VendorName"
                    }
                    ,
                    {
                        data: "status",
                        name: "Status"
                    }


                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {

            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            //$("#AccountCodeModal").on("keyup",
            //    ".acc-filters",
            //    function () {



            //        dataTable.draw();
            //    });

            //return dataTable;






        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#apEntryModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#apEntryModal").modal("show");
        }
    };

    var apBatchModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/SageAPBatchModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#APBatchModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#APBatchModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_SageAPBatchModal',
                    type: 'POST'
                },
                columns: [

                    {
                        data: "batchNumber",
                        name: "BatchNumber"
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                    ,
                    {
                        data: "batchDate",
                        name: "BatchDate"
                    }
                    


                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {

            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            //$("#AccountCodeModal").on("keyup",
            //    ".acc-filters",
            //    function () {



            //        dataTable.draw();
            //    });

            //return dataTable;






        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#apBatchModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#apBatchModal").modal("show");
        }
    };

  

    var apRimitToModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/APRimitToModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#APRimitToModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#APRimitToModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#APRimitToModal thead');

            var dataTable =  $("#APRimitToModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_SageRemiToModal',
                    type: 'POST'
                },
                columns: [
                    {
                        data: "vendorId",
                        name: "VendorId"
                    }
                    ,
                    {
                        data: "remitToLocation",
                        name: "RemitToLocation"
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                    ,
                    {
                        data: "addressLine1",
                        name: "AddressLine1"
                    }
                    ,
                    
                    {
                        data: "addressLine2",
                        name: "AddressLine2"
                    }
                    ,
                    {
                        data: "addressLine3",
                        name: "AddressLine3"
                    }
                    , 
                    {
                        data: "city",
                        name: "City"
                    }
                    


                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {

            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            //$("#AccountCodeModal").on("keyup",
            //    ".acc-filters",
            //    function () {



            //        dataTable.draw();
            //    });

            //return dataTable;






        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#apRimitToModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#apRimitToModal").modal("show");
        }
    };

    var apPaymentModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/paymentCodeModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#APPaymentCode").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#APPaymentCode").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_PaymentCodeModal',
                    type: 'POST'
                },
                columns: [

                    {
                        data: "paymentCode",
                        name: "PaymentCode"
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                    


                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {

            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            //$("#AccountCodeModal").on("keyup",
            //    ".acc-filters",
            //    function () {



            //        dataTable.draw();
            //    });

            //return dataTable;






        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#apPaymentModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#apPaymentModal").modal("show");
        }
    };

    var bankToModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/BankToModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#ToBankCode").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#ToBankCode").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_bankToModal',
                    type: 'POST'
                },
                columns: [

                    {
                        data: "paymentCode",
                        name: "PaymentCode"
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }



                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {

            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            //$("#AccountCodeModal").on("keyup",
            //    ".acc-filters",
            //    function () {



            //        dataTable.draw();
            //    });

            //return dataTable;






        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#bankToModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#bankToModal").modal("show");
        }
    };

    var bankFromModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/BankFromModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#FromBankCode").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#FromBankCode").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_BankFromModal',
                    type: 'POST'
                },
                columns: [

                    {
                        data: "paymentCode",
                        name: "PaymentCode"
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }



                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {

            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            //$("#AccountCodeModal").on("keyup",
            //    ".acc-filters",
            //    function () {



            //        dataTable.draw();
            //    });

            //return dataTable;

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#bankFromModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#bankFromModal").modal("show");
        }
    };

    //bankCodeModal
    var bankCodeModal = function (done, fail, dblCallBack, TransectionType = "") {

        $.ajax({
            url: '/Common/BankCodeModal?TransectionType=' + TransectionType,
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#BankCodeModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#BankCodeModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_BankCodeModal?',
                    type: 'POST',


                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {

                                "transectionType": $("#md-transectionType").val()

                            });
                    }



                },
                columns: [

                    {
                        data: "bankCode",
                        name: "BankCode"
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                    ,
                    {
                        data: "bankEntryNo",
                        name: "BankEntryNo"
                    }
                    ,
                    {
                        data: "currency",
                        name: "Currency"
                    }



                ]

            });

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#BCodeModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#BCodeModal").modal("show");
        }
    };
    //end
    //EntryCodeModal
    var entryCodeModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/EntryCodeModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#EntryCodeModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#EntryCodeModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_EntryCodeModal',
                    type: 'POST'
                },
                columns: [

                    {
                        data: "bankEntryNumber",
                        name: "BankEntryNumber"
                    }
                    ,
                    {
                        data: "entryDescription",
                        name: "EntryDescription"
                    }


                ]

            });

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#ECodeModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#ECodeModal").modal("show");
        }
    };
    //end
    //CurrencyCodeModal
    var currencyCodeModal = function (done, fail, dblCallBack, bankCode = "") {

        $.ajax({
            url: '/Common/CurrencyCodeModal?bankCode=' + bankCode,
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#CurrencyCodeModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#CurrencyCodeModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_CurrencyCodeModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {
                                //"entryNumber": $("#md-EntryNumber").val()
                                //, "description": $("#md-Description").val()
                                "bankNo": $("#md-bankNo").val()
                            });
                    }
                },
                columns: [

                    {
                        data: "currencyCode",
                        name: "CurrencyCode"
                    }
                    ,
                    {
                        data: "currencyDescription",
                        name: "CurrencyDescription"
                    }


                ]

            });

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#CCodeModel").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#CCodeModel").modal("show");
        }
    };
    //end
    //invoiceNumberModel
    var invoiceNumberModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/InvoiceNumberModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#InvoiceNumModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#InvoiceNumModal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_InvoiceNumberModal',
                    type: 'POST'
                },
                columns: [

                    {
                        data: "code",
                        name: "Code"
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }



                ]

            });

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#inNumberModel").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#inNumberModel").modal("show");
        }
    };
    //end
    //ReiptNomodal
    var rceiptNomodal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/ReiptNomodal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#ReiptNomodal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            return $("#ReiptNomodal").DataTable({

                serverSide: true,
                "processing": true,
                serverSide: true,
                "bProcessing": true,
                ajax: {
                    url: '/Common/_reiptNomodal',
                    type: 'POST'
                },
                columns: [

                    {
                        data: "number",
                        name: "Number"
                    },
                    {
                        data: "name",
                        name: "Name"
                    }
                    
                    ,
                    {
                        data: "vendor",
                        name: "Vendor"
                    }



                ]

            });

        }


        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#rceiptNomodal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#rceiptNomodal").modal("show");
        }
    };
    //end

    return {
        sageUserNameModal:sageUserNameModal
        ,apInvoiceModal: apInvoiceModal
        ,accountCodeModal: accountCodeModal
        ,vendorNumberModal: vendorNumberModal
        , itemNumberModal: itemNumberModal
        , locationModal: locationModal
        , customerNumberModal: customerNumberModal
        , sageBatchModal: sageBatchModal
        , sageEntryModal: sageEntryModal
        , sourceCodeModal: sourceCodeModal
        , accountSetModal: accountSetModal
        , apEntryModal: apEntryModal
        , apBatchModal: apBatchModal
      
        , apRimitToModal: apRimitToModal
        , apPaymentModal: apPaymentModal
        , bankToModal: bankToModal
        , bankFromModal: bankFromModal
        , bankCodeModal: bankCodeModal,
        entryCodeModal: entryCodeModal,
        currencyCodeModal: currencyCodeModal,
        rceiptNomodal: rceiptNomodal,
        invoiceNumberModal: invoiceNumberModal
        
    }

}();