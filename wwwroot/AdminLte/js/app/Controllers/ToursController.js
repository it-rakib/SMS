var ToursController = function (CommonService, ToursService) {



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

        var indexTable = ToursTable();



        $(".btnsave").click(function () {
            save();
        });


        

    }

    /*init end*/


    $('.Submit').click('click', function () {


        ReasonOfUnPost = $("#UnPostReason").val();

        var tours = serializeInputs("frm_Tours");

        tours["ReasonOfUnPost"] = ReasonOfUnPost;

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

                tours.IDs = tours.Id;
                ToursService.ToursMultipleUnPost(tours, ToursMultipleUnPost, ToursMultipleUnPostFail);
                //}

            }
        });
    });

    function ToursMultipleUnPost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('N');
            //Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();
            $(".btnReject").hide();
            $(".btnApproved").hide();

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

    function ToursMultipleUnPostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#ToursList').DataTable();

        dataTable.draw();
    }






    $('.btnPost').click('click', function () {

        Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
            console.log(result);
            if (result) {


                var tours = serializeInputs("frm_Tours");
                if (tours.IsPost == "Y") {
                    ShowNotification(3, "Data has already been Posted.");
                }
                else {
                    tours.IDs = tours.Id;
                    ToursService.ToursMultiplePost(tours, ToursMultiplePosts, ToursMultiplePostFail);
                }
            }
        });

    });





    $('#PostTR').on('click', function () {

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




        var dataTable = $('#ToursList').DataTable();

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
            ToursService.ToursMultiplePost(model, ToursMultiplePosts, ToursMultiplePostFail);
        }

        //else {
        //    ICReceiptsService.ICRMultiplePush(model, ICRMultiplePush, ICRMultiplePushFail);

        //}

    }



    function ToursMultiplePosts(result) {
        console.log(result.message);

        if (result.status == "200") {

            ShowNotification(1, result.message);

            $("#IsPost").val('Y');

            $(".btnUnPost").show();
            $(".btnReject").show();
            $(".btnApproved").show();


            $(".btnPush").show();

            //Visibility(true);



            var dataTable = $('#ToursList').DataTable();
            dataTable.draw();




        }
        else if (result.status == "400") {
            ShowNotification(3, result.message);
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message);
        }
    }

    function ToursMultiplePostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#ToursList').DataTable();
        dataTable.draw();

    }






    function save() {


        var validator = $("#frm_Tours").validate();
        var advances = serializeInputs("frm_Tours");

        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

        ToursService.save(advances, saveDone, saveFail);



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
                //change
                //$("#btnPost").show();
                //end
                $("#divSave").hide();
                $("#SavePost").show();


                result.data.operation = "update";
                $("#Operation").val(result.data.operation);


                //$('#modal-default').modal('hide');


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





    var ToursTable = function () {

        $('#ToursList thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#ToursList thead');


        var dataTable = $("#ToursList").DataTable({
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
                url: '/Tours/_index/',
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
                            "ispost": $("#md-Post").val(),
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

                        return "<a href=/Tours/Edit/" + data + " class='edit btn btn-primary btn-sm' ><i class='fas fa-pencil-alt  ' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  " +


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




        $("#ToursList").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#ToursList").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    


    return {
        init: init
    }


}(CommonService, ToursService);