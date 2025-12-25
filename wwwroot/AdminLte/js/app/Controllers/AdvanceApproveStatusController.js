var AdvanceApproveStatusController = function (CommonService, AdvancesService, AdvanceApproveStatusService) {



    var init = function () {


        //if ($("#TeamId").length) {
        //    LoadCombo("TeamId", '/Common/TeamName');
        //}
        //if ($("#AuditId").length) {
        //    LoadCombo("AuditId", '/Common/AuditName');
        //}


        
        //$(".chkAll").click(function () {
        //    $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        //});

        var indexTable = AdvanceApproveStatusTable();



        //$(".btnsave").click(function () {
        //    save();
        //});


        

    }

    /*init end*/


    $('.RejectSubmit').click('click', function () {


        RejectedComments = $("#RejectedComments").val();

        var advaces = serializeInputs("frm_Advances");

        advaces["RejectedComments"] = RejectedComments;

        Confirmation("Are you sure? Do You Want to Reject Data?", function (result) {
            if (RejectedComments === "" || RejectedComments === null) {
                ShowNotification(3, "Please Write down Reason Of Reject");
                $("#RejectedComments").focus();
                return;
            }

            if (result) {
             

                advaces.IDs = advaces.Id;
                AdvanceApproveStatusService.AdvanceMultipleRejectData(advaces, AdvanceMultipleReject, AdvanceMultipleUnRejectFail);
                

            }
        });
    });

    function AdvanceMultipleReject(result) {
        console.log(result.message);

        if (result.status == "200") {
            //ShowNotification(1, result.message);
            ShowNotification(1, "Data Reject Successfully");

            $("#IsPost").val('N');
            //Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();

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

    function AdvanceMultipleUnRejectFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#ToursList').DataTable();

        dataTable.draw();
    }




    $('.ApprovedSubmit').click('click', function () {


        CommentsL1 = $("#CommentsL1").val();

        var advaces = serializeInputs("frm_Advances");

        advaces["CommentsL1"] = CommentsL1;

        Confirmation("Are you sure? Do You Want to Approved Data?", function (result) {
            if (CommentsL1 === "" || CommentsL1 === null) {
                ShowNotification(3, "Please Write down Reason Of Approved");
                $("#CommentsL1").focus();
                return;
            }

            if (result) {

                advaces.IDs = advaces.Id;
                AdvanceApproveStatusService.AdvancesMultipleApprovedData(advaces, AdvancesMultipleApproved, AdvancesMultipleApprovedFail);


            }
        });
    });

    function AdvancesMultipleApproved(result) {
        console.log(result.message);

        if (result.status == "200") {
            //ShowNotification(1, result.message);
            ShowNotification(1, "Data Approved Successfully");
            $("#IsPost").val('N');
            //Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();

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

    function AdvancesMultipleApprovedFail(result) {
        ShowNotification(3, "Data has already been Approved.");
        var dataTable = $('#ToursList').DataTable();

        dataTable.draw();
    }





    $('#modelClose').click('click', function () {

        $("#UnPostReason").val("");
        $('#modal-default').modal('hide');


    });




    var AdvanceApproveStatusTable = function () {

        $('#ApproveStatusist thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#ApproveStatusist thead');


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
                url: '/Advances/_approveStatusIndex',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),

                            "code": $("#md-Code").val(),
                            "advanceAmount": $("#md-AdvanceAmount").val(),
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

                        return "<a href=/Advances/Edit/" + data + "?edit=approve class='edit btn btn-primary btn-sm' ><i class='fas fa-check tick-icon' data-toggle='tooltip' title='' data-original-title='Approve'></i></a>" 
                        //return "<a href=/Advances/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>" 


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
                    data: "advanceAmount",
                    name: "AdvanceAmount"

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


}(CommonService, AdvancesService, AdvanceApproveStatusService);