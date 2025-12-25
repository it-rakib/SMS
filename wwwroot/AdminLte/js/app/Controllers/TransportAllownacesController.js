var TransportAllownacesController = function (CommonService, TransportAllownacesService) {



    var init = function () {


        if ($("#TeamId").length) {
            LoadCombo("TeamId", '/Common/TeamName');
        }
        if ($("#AuditId").length) {
            LoadCombo("AuditId", '/Common/AuditName');
        }
        
        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });

        var indexTable = TransportAllownacesTable();



        $(".btnsave").click(function () {
            save();
        });


        

    }

    /*init end*/

    $('.Submit').click('click', function () {


        ReasonOfUnPost = $("#UnPostReason").val();

        var transportAllo = serializeInputs("frm_TransportAllownaces");

        transportAllo["ReasonOfUnPost"] = ReasonOfUnPost;

        Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
            if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
                ShowNotification(3, "Please Write down Reason Of UnPost");
                $("#ReasonOfUnPost").focus();
                return;
            }

            if (result) {
                //if (receiptMaster.IsPush === "Y") {
                //    ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                //}
                //else {

                transportAllo.IDs = transportAllo.Id;
                TransportAllownacesService.TransportAllownacesMultipleUnPost(transportAllo, transportAlloMultipleUnPost, transportAlloMultipleUnPostFail);
                //}

            }
        });
    });

    function transportAlloMultipleUnPost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('N');
            //Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();

            var dataTable = $('#ToursList').DataTable();

            dataTable.draw();

            $('#modal-default').modal('hide');

        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function transportAlloMultipleUnPostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#TransportAllownacesList').DataTable();

        dataTable.draw();
    }






    $('.btnPost').click('click', function () {

        Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
            console.log(result);
            if (result) {


                var transportallo = serializeInputs("frm_TransportAllownaces");
                if (transportallo.IsPost == "Y") {
                    ShowNotification(3, "Data has already been Posted.");
                }
                else {
                    transportallo.IDs = transportallo.Id;
                    TransportAllownacesService.TransportAllownacesMultiplePost(transportallo, TransportAllownacesMultiplePosts, TransportAllownacesMultiplePostFail);
                }
            }
        });

    });





    $('#PostTA').on('click', function () {

        Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
            console.log(result);
            if (result) {

                SelectData(true);
            }
        });

    });

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



        //getBranchId From Dropdown
        //var branchId = $('#Branchs').val();
        //if (branchId == null) {
        //    var branchId = $('#CurrentBranchId').val();
        //}
        //model.branchId = branchId;
        //endregion




        var dataTable = $('#TransportAllownacesList').DataTable();

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
                ShowNotification(3, "Data has already been Posted.");
                return;
            }

        }

        //else {
        //    if (filteredData.length > 0) {


        //        ShowNotification(3, "Data has already been Pushed.");
        //        return;

        //    }
        //    if (filteredData1.length > 0) {
        //        ShowNotification(3, "Please Data Post First!");

        //        return;
        //    }
        //}


        if (IsPost) {
            TransportAllownacesService.TransportAllownacesMultiplePost(model, TransportAllownacesMultiplePosts, TransportAllownacesMultiplePostFail);
        }

        //else {
        //    ICReceiptsService.ICRMultiplePush(model, ICRMultiplePush, ICRMultiplePushFail);

        //}

    }



    function TransportAllownacesMultiplePosts(result) {
        console.log(result.message);

        if (result.status == "200") {

            ShowNotification(1, result.message);

            $("#IsPost").val('Y');

            $(".btnUnPost").show();
            $(".btnPush").show();

            //Visibility(true);



            var dataTable = $('#TransportAllownacesList').DataTable();
            dataTable.draw();


        }
        else if (result.status == "400") {
            ShowNotification(3, result.message);
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message);
        }
    }

    function TransportAllownacesMultiplePostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#TransportAllownacesList').DataTable();
        dataTable.draw();

    }



    function save() {


        var validator = $("#frm_TransportAllownaces").validate();
        var advances = serializeInputs("frm_TransportAllownaces");

        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

        TransportAllownacesService.save(advances, saveDone, saveFail);



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

            } else {
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





    var TransportAllownacesTable = function () {

        $('#TransportAllownacesList thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#TransportAllownacesList thead');


        var dataTable = $("#TransportAllownacesList").DataTable({
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
                url: '/TransportAllownaces/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),

                            "code": $("#md-Code").val(),
                            "teamname": $("#md-TeamName").val(),
                            "description": $("#md-Description").val(),
                            "ispost": $("#md-Post").val(),


                            "ponumber": $("#md-PONumber").val(),
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

                        return "<a href=/TransportAllownaces/Edit/" + data + " class='edit btn btn-primary btn-sm' ><i class='fas fa-pencil-alt  ' data-toggle='tooltip' title='' data-original-title='Edit'></i></a> " +

                            "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"


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
                    data: "teamName",
                    name: "TeamName"

                }            
                ,
                {
                    data: "description",
                    name: "Description"

                }
                
                ,
                {
                    data: "isPost",
                    name: "IsPost"

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




        $("#TransportAllownacesList").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#TransportAllownacesList").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    


    return {
        init: init
    }


}(CommonService, TransportAllownacesService);