var FeedBackApproveStatusController = function (CommonService, FeedBackApproveStatusService) {



    var init = function () {


        //if ($("#TeamId").length) {
        //    LoadCombo("TeamId", '/Common/TeamName');
        //}
        //if ($("#AuditId").length) {
        //    LoadCombo("AuditId", '/Common/AuditName');
        //}
        


        var indexTable = FeedBackTable();




        

    }

    /*init end*/


    $('.RejectSubmit').click('click', function () {


        RejectedComments = $("#RejectedComments").val();

        var auditreject = serializeInputs("frm_Audit");

        auditreject["RejectedComments"] = RejectedComments;

        Confirmation("Are you sure? Do You Want to Reject Data?", function (result) {
            if (RejectedComments === "" || RejectedComments === null) {
                ShowNotification(3, "Please Write down Reason Of Reject");
                $("#RejectedComments").focus();
                return;
            }

            if (result) {


                auditreject.IDs = auditreject.Id;
                AuditApproveStatusService.AuditMultipleRejectData(auditreject, AuditMultipleReject, AuditMultipleUnRejectFail);
                

            }
        });
    });

    function AuditMultipleReject(result) {
        console.log(result.message);

        if (result.status == "200") {
            //ShowNotification(1, result.message);
            ShowNotification(1, "Data Reject Successfully");

            $("#IsPost").val('N');
            //Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();

            //$(".btnReject").hide();
            //$(".btnApproved").hide();

            //change of button
            $(".btnReject").show();
            $(".btnApproved").show();
            //end

            var dataTable = $('#AuditList').DataTable();

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

    function AuditMultipleUnRejectFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#AuditList').DataTable();

        dataTable.draw();
    }




    $('.ApprovedSubmit').click('click', function () {


        CommentsL1 = $("#CommentsL1").val();

        var auditapprove = serializeInputs("frm_Audit");

        auditapprove["CommentsL1"] = CommentsL1;

        Confirmation("Are you sure? Do You Want to Approve Data?", function (result) {
            if (CommentsL1 === "" || CommentsL1 === null) {
                ShowNotification(3, "Please Write down Reason Of Approved");
                $("#CommentsL1").focus();
                return;
            }

            if (result) {

                auditapprove.IDs = auditapprove.Id;
                AuditApproveStatusService.AuditMultipleApprovedData(auditapprove, AuditMultipleApproved, AuditMultipleApprovedFail);


            }
        });
    });

    function AuditMultipleApproved(result) {
        console.log(result.message);

        if (result.status == "200") {
            //ShowNotification(1, result.message);
            ShowNotification(1, "Data Approved Successfully");
            $("#IsPost").val('N');
            //Visibility(false);
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();


            //$(".btnReject").hide();
            //$(".btnApproved").hide();

            //change of button
            $(".btnReject").show();
            $(".btnApproved").show();
            //end


            var dataTable = $('#AuditList').DataTable();

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

    function AuditMultipleApprovedFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#AuditList').DataTable();

        dataTable.draw();
    }





    $('#modelClose').click('click', function () {

        $("#UnPostReason").val("");
        $('#modal-default').modal('hide');


    });





    var FeedBackTable = function () {

        $('#FeedBackApproveStatusList thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#FeedBackApproveStatusList thead');


        var dataTable = $("#FeedBackApproveStatusList").DataTable({
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
                url: '/Audit/_feedBackApproveStatusIndex',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),

                            "code": $("#md-Code").val(),
                            "name": $("#md-Name").val(),
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


                        /*return "<a href=/Audit/Edit/" + data + "?edit=audit class='edit btn btn-primary btn-sm' ><i class='fas fa-pencil-alt  ' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  "*/

                        return "<a href=/Audit/Edit/" + data + "?edit=branchFeedbackApprove class='edit btn btn-primary btn-sm' ><i class='fas fa-check tick-icon' data-toggle='tooltip' title='' data-original-title='Audit'></i></a>  "


                        //return "<a href=/Audit/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>" 
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
                    data: "approveStatus",
                    name: "ApproveStatus"

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




        $("#FeedBackApproveStatusList").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#FeedBackApproveStatusList").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    


    return {
        init: init
        
    }


}(CommonService, FeedBackApproveStatusService);