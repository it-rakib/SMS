var CircularsController = function (CommonService, CircularsService) {



    var init = function () {



        var indexTable = CircularsTable();
        var indexTableDeshboard = CircularsTableForDeshboard();



        $(".btnsave").click(function () {
            save();
        });

        if ($("#CircularType").length) {
            LoadCombo("CircularType", '/Common/GetCircularType');
        }


        

    }

    /*init end*/
    

    function save() {


        var validator = $("#frm_Circulars").validate();
        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }


        //var circulars = serializeInputs("frm_Circulars");
        var form = $("#frm_Circulars")[0];
        var circulars = new FormData(form);

        var IsPublished = $("#IsPublished").is(":checked");
        circulars.IsPublished = IsPublished;



        

        CircularsService.save(circulars, saveDone, saveFail);



    }


    function addListItem(result) {
        var list = $(".fileGroup");

        result.data.attachmentsList.forEach(function (item) {

            var item = '<li class="list-group-item" id="file-' + item.id + '"> <span>' +
                item.displayName +
                '</span><a target="_blank" href="/Circulars/DownloadFile?filePath=' + item.fileName + '" class=" ml-2 btn btn-primary btn-sm float-right ml-2">Download</a>' +
                '<button onclick="CircularsController.deleteFile(\'' + item.id + '\', \'' + item.fileName + '\')" class=" ml-2 btn btn-danger btn-sm float-right" type="button">Delete</button>' +
                '</li>';

            list.append(item);
        });
    }



    function saveDone(result) {
        debugger
        if (result.status == "200") {
            if (result.data.operation == "add") {


                ShowNotification(1, result.message);
                $(".btnsave").html('Update');

                $(".btnSave").addClass('sslUpdate');

                $("#Id").val(result.data.id);
                $("#Code").val(result.data.code);

                $("#divUpdate").show();

                $("#divSave").hide();

                $("#SavePost").show();

                result.data.operation = "update";
                $("#Operation").val(result.data.operation);

                addListItem(result);



            } else {

                addListItem(result);

                ShowNotification(1, result.message);

                $("#divSave").hide();

                $("#divUpdate").show();


            }
        }
        else if (result.status == "400") {
            ShowNotification(3, result.message || result.error); 
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message || result.error); 
        }
    }


    function saveFail(result) {
        console.log(result);
        ShowNotification(3, "Something gone wrong");
    }





    var CircularsTable = function () {

        $('#CircularsList thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#CircularsList thead');


        var dataTable = $("#CircularsList").DataTable({
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
                url: '/Circulars/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),


                            "code": $("#md-Code").val(),
                            "circulartype": $("#md-CircularType").val(),
                            "circulardate": $("#md-CircularDate").val(),
                            "circulardetails": $("#md-CircularDetails").val(),


                            "description": $("#md-Description").val(),
                            "ispost": $("#md-Post").val(),
                            "ponumber": $("#md-PONumber").val(),
                            //"ispost": $("#md-Post").val(),
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

                        return "<a href=/Circulars/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>" 

                            //"<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"

                            //"<a href='/TeamMembers/Index/" + data + "' class='edit' title='Member'><i class='fas fa-building''></i></a>"

                            ;
                   

                    },
                    "width": "9%",
                    "orderable": false
                },                           
                {
                    data: "code",
                    name: "Code"

                }
                ,
                {
                    data: "name",
                    name: "Name"

                }
                ,
                
                {
                    data: "circularDate",
                    name: "CircularDate"

                },
                {
                    data: "circularDetails",
                    name: "CircularDetails"

                }
                
                
                
                

            ]

        });


        if (dataTable.columns().eq(0)) {
            dataTable.columns().eq(0).each(function (colIdx) {

                var cell = $('.filters th').eq($(dataTable.column(colIdx).header()).index());

                var title = $(cell).text();


                if ($(cell).hasClass('action')) {
                    $(cell).html('');

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




        $("#CircularsList").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#CircularsList").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }




    
    var CircularsTableForDeshboard = function () {

        $('#CircularsListForDeshboard thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#CircularsListForDeshboard thead');


        var dataTable = $("#CircularsListForDeshboard").DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            serverSide: true,
            "processing": true,
            //"bProcessing": true,
            //dom: 'lBfrtip',
            bRetrieve: true,
            searching: false,


            //buttons: [
            //    {
            //        extend: 'pdfHtml5',
            //        customize: function (doc) {
            //            doc.content.splice(0, 0, {
            //                text: ""
            //            });
            //        },
            //        exportOptions: {
            //            columns: [1, 2, 3, 4]
            //        }
            //    },
            //    {
            //        extend: 'copyHtml5',
            //        exportOptions: {
            //            columns: [1, 2, 3, 4]
            //        }
            //    },
            //    {
            //        extend: 'excelHtml5',
            //        exportOptions: {
            //            columns: [1, 2, 3, 4]
            //        }
            //    },
            //    'csvHtml5'
            //],


            ajax: {
                url: '/Circulars/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),


                            "code": $("#md-Code").val(),
                            "circulartype": $("#md-CircularType").val(),


                            "description": $("#md-Description").val(),
                            "ispost": $("#md-Post").val(),
                            "ponumber": $("#md-PONumber").val(),
                            //"ispost": $("#md-Post").val(),
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


                        return "<a href=/Circulars/Edit/" + data + "?isFromDeshBoard='deshboard' class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>"

                           
                            ;


                    },
                    "width": "9%",
                    "orderable": false
                },
                {
                    data: "code",
                    name: "Code"

                }
                ,
                {
                    data: "name",
                    name: "Name"

                }
                ,

                {
                    data: "circularDate",
                    name: "CircularDate"

                },
                {
                    data: "circularDetails",
                    name: "CircularDetails"

                }



            ]

        });


        //if (dataTable.columns().eq(0)) {
        //    dataTable.columns().eq(0).each(function (colIdx) {

        //        var cell = $('.filters th').eq($(dataTable.column(colIdx).header()).index());

        //        var title = $(cell).text();


        //        if ($(cell).hasClass('action')) {
        //            $(cell).html('');

        //        } else if ($(cell).hasClass('bool')) {

        //            $(cell).html('<select class="acc-filters filter-input " style="width:100%"  id="md-' + title.replace(/ /g, "") + '"><option>Select</option><option>Y</option><option>N</option></select>');

        //        } else {
        //            $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
        //                title +
        //                '"  id="md-' +
        //                title.replace(/ /g, "") +
        //                '"/>');
        //        }
        //    });
        //}




        $("#CircularsListForDeshboard").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#CircularsListForDeshboard").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }
    
    var deleteFile = function deleteFile(fileId, filePath) {

        CircularsService.deleteFile({ id: fileId, filePath: filePath }, (result) => {


            if (result.status == "200") {
                $("#file-" + fileId).remove();

                ShowNotification(1, result.message);
            }
            else if (result.status == "400") {
                ShowNotification(3, result.message);
            }



        }, saveFailDelete);

    };



    function saveFailDelete(result) {
        console.log(result);
        ShowNotification(3, "Something gone wrong");
    }




    return {
        init: init,
        deleteFile

    }


}(CommonService, CircularsService);

