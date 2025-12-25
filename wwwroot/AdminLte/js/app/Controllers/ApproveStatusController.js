var ApproveStatusController = function (CommonService, ApproveStatusService) {



    var init = function () {


        if ($("#TeamId").length) {
            LoadCombo("TeamId", '/Common/TeamName');
        }
        if ($("#AuditId").length) {
            LoadCombo("AuditId", '/Common/AuditName');
        }
        
        //$(".chkAll").click(function () {
        //    $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        //});

        var indexTable = ToursTable();



        //$(".btnsave").click(function () {
        //    save();
        //});


        

    }

    /*init end*/


    $('.RejectSubmit').click('click', function () {


        RejectedComments = $("#RejectedComments").val();

        var tours = serializeInputs("frm_Tours");

        tours["RejectedComments"] = RejectedComments;

        Confirmation("Are you sure? Do You Want to Reject Data?", function (result) {
            if (RejectedComments === "" || RejectedComments === null) {
                ShowNotification(3, "Please Write down Reason Of Reject");
                $("#RejectedComments").focus();
                return;
            }

            if (result) {
                //if (receiptMaster.IsPush === "Y") {
                //    ShowNotification(3, "Unable to UnPost, Data is already Posted!");
                //}
                //else {

                tours.IDs = tours.Id;
                ApproveStatusService.ToursMultipleRejectData(tours, ToursMultipleReject, ToursMultipleUnRejectFail);
                //}

            }
        });
    });

    function ToursMultipleReject(result) {
        console.log(result.message);

        if (result.status == "200") {
            //ShowNotification(1, result.message);
            ShowNotification(1, "Data Reject Successfully");

            $("#IsPost").val('N');
            //Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();

            //change of button
            $(".btnReject").show();
            $(".btnApproved").show();
            //end

            //$(".btnReject").hide();
            //$(".btnApproved").hide();

            var dataTable = $('#ToursList').DataTable();

            dataTable.draw();

            $('#modal-defaultReject').modal('hide');

        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function ToursMultipleUnRejectFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#ToursList').DataTable();

        dataTable.draw();
    }




    $('.ApprovedSubmit').click('click', function () {


        CommentsL1 = $("#CommentsL1").val();

        var tours = serializeInputs("frm_Tours");

        tours["CommentsL1"] = CommentsL1;

        Confirmation("Are you sure? Do You Want to Reject Data?", function (result) {
            if (CommentsL1 === "" || CommentsL1 === null) {
                ShowNotification(3, "Please Write down Reason Of Approved");
                $("#CommentsL1").focus();
                return;
            }

            if (result) {

                tours.IDs = tours.Id;
                ApproveStatusService.ToursMultipleApprovedData(tours, ToursMultipleApproved, ToursMultipleApprovedFail);


            }
        });
    });

    function ToursMultipleApproved(result) {
        console.log(result.message);

        if (result.status == "200") {
            //ShowNotification(1, result.message);
            ShowNotification(1, "Data Approved Successfully");
            $("#IsPost").val('N');
            //Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();

            //change of button
            $(".btnReject").show();
            $(".btnApproved").show();
            //end
            //$(".btnReject").hide();
            //$(".btnApproved").hide();

            var dataTable = $('#ToursList').DataTable();

            dataTable.draw();

            $('#modal-defaultApproved').modal('hide');

        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
    }

    function ToursMultipleApprovedFail(result) {
        ShowNotification(3, "Data has already been approved.");
        var dataTable = $('#ToursList').DataTable();

        dataTable.draw();
    }





    $('#modelClose').click('click', function () {

        $("#UnPostReason").val("");
        $('#modal-default').modal('hide');


    });









    //$('.btnPost').click('click', function () {

    //    Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
    //        console.log(result);
    //        if (result) {


    //            var tours = serializeInputs("frm_Tours");
    //            if (tours.IsPost == "Y") {
    //                ShowNotification(3, "Data has already been Posted.");
    //            }
    //            else {
    //                tours.IDs = tours.Id;
    //                ToursService.ToursMultiplePost(tours, ToursMultiplePosts, ToursMultiplePostFail);
    //            }
    //        }
    //    });

    //});


    //$('#PostTR').on('click', function () {

    //    Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
    //        console.log(result);
    //        if (result) {

    //            SelectData(true);
    //        }
    //    });

    //});

    //function SelectData(IsPost) {

    //    var IDs = [];
    //    var $Items = $(".dSelected:input:checkbox:checked");

    //    if ($Items == null || $Items.length == 0) {
    //        ShowNotification(3, "You are requested to Select checkbox!");
    //        return;
    //    }

    //    $Items.each(function () {
    //        var ID = $(this).attr("data-Id");
    //        IDs.push(ID);
    //    });

    //    var model = {
    //        IDs: IDs,

    //    }



    //    //getBranchId From Dropdown
    //    //var branchId = $('#Branchs').val();
    //    //if (branchId == null) {
    //    //    var branchId = $('#CurrentBranchId').val();
    //    //}
    //    //model.branchId = branchId;
    //    //endregion




    //    var dataTable = $('#ToursList').DataTable();

    //    var rowData = dataTable.rows().data().toArray();
    //    var filteredData = [];
    //    var filteredData1 = [];
    //    if (IsPost) {
    //        filteredData = rowData.filter(x => x.isPost === "Y" && IDs.includes(x.id.toString()));

    //    }
    //    else {
    //        filteredData = rowData.filter(x => x.isPush === "Y" && IDs.includes(x.id.toString()));
    //        filteredData1 = rowData.filter(x => x.isPost === "N" && IDs.includes(x.id.toString()));
    //    }

    //    if (IsPost) {
    //        if (filteredData.length > 0) {
    //            ShowNotification(3, "Data has already been Posted.");
    //            return;
    //        }

    //    }

    //    //else {
    //    //    if (filteredData.length > 0) {


    //    //        ShowNotification(3, "Data has already been Pushed.");
    //    //        return;

    //    //    }
    //    //    if (filteredData1.length > 0) {
    //    //        ShowNotification(3, "Please Data Post First!");

    //    //        return;
    //    //    }
    //    //}


    //    if (IsPost) {
    //        ToursService.ToursMultiplePost(model, ToursMultiplePosts, ToursMultiplePostFail);
    //    }

    //    //else {
    //    //    ICReceiptsService.ICRMultiplePush(model, ICRMultiplePush, ICRMultiplePushFail);

    //    //}

    //}

    //function ToursMultiplePosts(result) {
    //    console.log(result.message);

    //    if (result.status == "200") {

    //        ShowNotification(1, result.message);

    //        $("#IsPost").val('Y');

    //        $(".btnUnPost").show();
    //        $(".btnPush").show();

           



    //        var dataTable = $('#ToursList').DataTable();
    //        dataTable.draw();


    //    }
    //    else if (result.status == "400") {
    //        ShowNotification(3, result.message);
    //    }
    //    else if (result.status == "199") {
    //        ShowNotification(3, result.message);
    //    }
    //}

    //function ToursMultiplePostFail(result) {
    //    ShowNotification(3, "Something gone wrong");
    //    var dataTable = $('#ToursList').DataTable();
    //    dataTable.draw();

    //}


    //function save() {


    //    var validator = $("#frm_Tours").validate();
    //    var advances = serializeInputs("frm_Tours");

    //    var result = validator.form();

    //    if (!result) {
    //        validator.focusInvalid();
    //        return;
    //    }

    //    ToursService.save(advances, saveDone, saveFail);



    //}


    //function saveDone(result) {
    //    debugger
    //    if (result.status == "200") {
    //        if (result.data.operation == "add") {


    //            ShowNotification(1, result.message);
    //            $(".btnsave").html('Update');

    //            $(".btnSave").addClass('sslUpdate');

    //            $("#Id").val(result.data.id);
    //            $("#Code").val(result.data.code);

    //            $("#divUpdate").show();
    //            //change
    //            //$("#btnPost").show();
    //            //end
    //            $("#divSave").hide();
    //            $("#SavePost").show();


    //            result.data.operation = "update";
    //            $("#Operation").val(result.data.operation);

    //        } else {
    //            ShowNotification(1, result.message);

    //            $("#divSave").hide();

    //            $("#divUpdate").show();


    //        }
    //    }
    //    else if (result.status == "400") {
    //        ShowNotification(3, result.message || result.error); 
    //    }
    //    else if (result.status == "199") {
    //        ShowNotification(3, result.message || result.error); 
    //    }
    //}


    //function saveFail(result) {
    //    console.log(result);
    //    ShowNotification(3, "Something gone wrong");
    //}





    var ToursTable = function () {

        $('#ApproveStatusist thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#ApproveStatusist thead');

        //var SageBatchNo = 'Y';

        var dataTable = $("#ApproveStatusist").DataTable({
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
                //url: '/Tours/_approveStatusIndex?BATCHID=' + SageBatchNo,
                url: '/Tours/_approveStatusIndex?',
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
                            "approveStatus": $("#md-ApproveStatus").val(),
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

                        return "<a href=/Tours/Edit/" + data + "?edit=approve class='edit btn btn-primary btn-sm' ><i class='fas fa-check tick-icon' data-toggle='tooltip' title='' data-original-title='Tour'></i></a>" 


                        /*return "<a href=/Tours/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>" */





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
                    data: "approveStatus",
                    name: "ApproveStatus"

                }
                
                //,
                //{
                //    data: "isPost",
                //    name: "IsPost"

                //}
                

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

                }

                else if ($(cell).hasClass('status')) {

                    $(cell).html('<select class="acc-filters filter-input " style="width:100%"  id="md-' + title.replace(/ /g, "") + '"><option>Select</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>R</option></select>');

                }

                else {
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');
                }
            });
        }




        $("#ApproveStatusist").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#ApproveStatusist").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    


    return {
        init: init
        
    }


}(CommonService, ApproveStatusService);