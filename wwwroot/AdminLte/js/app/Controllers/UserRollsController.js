var UserRollsController = function (CommonService, UserRollsService) {



    var init = function () {


        if ($("#UserId").length) {
            LoadCombo("UserId", '/Common/UserId');
        }
        if ($("#AuditId").length) {
            LoadCombo("AuditId", '/Common/AuditName');
        }
        
        //$(".chkAll").click(function () {
        //    $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        //});

        var indexTable = UserRollsTable();



        $(".btnsave").click(function () {
            save();
        });


        

    }

    /*init end*/


    function save() {


        var validator = $("#frm_UserRolls").validate();

        var userRolls = serializeInputs("frm_UserRolls");

        var IsAudit = $("#isAudit").is(":checked");
        var AuditApproval1 = $("#AuditApproval1").is(":checked");
        var AuditApproval2 = $("#AuditApproval2").is(":checked");
        var AuditApproval3 = $("#AuditApproval3").is(":checked");
        var AuditApproval4 = $("#AuditApproval4").is(":checked");


        var IsTour = $("#IsTour").is(":checked");
        var TourApproval1 = $("#TourApproval1").is(":checked");
        var TourApproval2 = $("#TourApproval2").is(":checked");
        var TourApproval3 = $("#TourApproval3").is(":checked");
        var TourApproval4 = $("#TourApproval4").is(":checked");

        var IsAdvance = $("#IsAdvance").is(":checked");
        var AdvanceApproval1 = $("#AdvanceApproval1").is(":checked");
        var AdvanceApproval2 = $("#AdvanceApproval2").is(":checked");
        var AdvanceApproval3 = $("#AdvanceApproval3").is(":checked");
        var AdvanceApproval4 = $("#AdvanceApproval4").is(":checked");

        var IsTa = $("#IsTa").is(":checked");
        var IsTaApproval1 = $("#IsTaApproval1").is(":checked");
        var IsTaApproval2 = $("#IsTaApproval2").is(":checked");
        var IsTaApproval3 = $("#IsTaApproval3").is(":checked");
        var IsTaApproval4 = $("#IsTaApproval4").is(":checked");

        var IsTourCompletionReport = $("#IsTourCompletionReport").is(":checked");
        var TourCompletionReportApproval1 = $("#TourCompletionReportApproval1").is(":checked");
        var TourCompletionReportApproval2 = $("#TourCompletionReportApproval2").is(":checked");
        var TourCompletionReportApproval3 = $("#TourCompletionReportApproval3").is(":checked");
        var TourCompletionReportApproval4 = $("#TourCompletionReportApproval4").is(":checked");


        var IsAuditIssue = $("#IsAuditIssue").is(":checked");
        var AuditIssueApproval1 = $("#AuditIssueApproval1").is(":checked");
        var AuditIssueApproval2 = $("#AuditIssueApproval2").is(":checked");
        var AuditIssueApproval3 = $("#AuditIssueApproval3").is(":checked");
        var AuditIssueApproval4 = $("#AuditIssueApproval4").is(":checked");

        var IsAuditFeedback = $("#IsAuditFeedback").is(":checked");
        var AuditFeedbackApproval1 = $("#AuditFeedbackApproval1").is(":checked");
        var AuditFeedbackApproval2 = $("#AuditFeedbackApproval2").is(":checked");
        var AuditFeedbackApproval3 = $("#AuditFeedbackApproval3").is(":checked");
        var AuditFeedbackApproval4 = $("#AuditFeedbackApproval4").is(":checked");

        userRolls.IsAudit = IsAudit;
        userRolls.AuditApproval1 = AuditApproval1;
        userRolls.AuditApproval2 = AuditApproval2;
        userRolls.AuditApproval3 = AuditApproval3;
        userRolls.AuditApproval4 = AuditApproval4;


        userRolls.IsTour = IsTour;
        userRolls.TourApproval1 = TourApproval1;
        userRolls.TourApproval2 = TourApproval2;
        userRolls.TourApproval3 = TourApproval3;
        userRolls.TourApproval4 = TourApproval4;

        userRolls.IsAdvance = IsAdvance;
        userRolls.AdvanceApproval1 = AdvanceApproval1;
        userRolls.AdvanceApproval2 = AdvanceApproval2;
        userRolls.AdvanceApproval3 = AdvanceApproval3;
        userRolls.AdvanceApproval4 = AdvanceApproval4;

        userRolls.IsTa = IsTa;
        userRolls.IsTaApproval1 = IsTaApproval1;
        userRolls.IsTaApproval2 = IsTaApproval2;
        userRolls.IsTaApproval3 = IsTaApproval3;
        userRolls.IsTaApproval4 = IsTaApproval4;

        userRolls.IsTourCompletionReport = IsTourCompletionReport;
        userRolls.TourCompletionReportApproval1 = TourCompletionReportApproval1;
        userRolls.TourCompletionReportApproval2 = TourCompletionReportApproval2;
        userRolls.TourCompletionReportApproval3 = TourCompletionReportApproval2;
        userRolls.TourCompletionReportApproval4 = TourCompletionReportApproval4;

        userRolls.IsAuditIssue = IsAuditIssue;
        userRolls.AuditIssueApproval1 = AuditIssueApproval1;
        userRolls.AuditIssueApproval2 = AuditIssueApproval2;
        userRolls.AuditIssueApproval3 = AuditIssueApproval3;
        userRolls.AuditIssueApproval4 = AuditIssueApproval4;

        userRolls.IsAuditFeedback = IsAuditFeedback;
        userRolls.AuditFeedbackApproval1 = AuditFeedbackApproval1;
        userRolls.AuditFeedbackApproval2 = AuditFeedbackApproval2;
        userRolls.AuditFeedbackApproval3 = AuditFeedbackApproval3;
        userRolls.AuditFeedbackApproval4 = AuditFeedbackApproval4;



        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

        UserRollsService.save(userRolls, saveDone, saveFail);



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





    var UserRollsTable = function () {

        $('#UserRollsList thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#UserRollsList thead');


        var dataTable = $("#UserRollsList").DataTable({
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
                url: '/UserRolls/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),

                            "isAudit": $("#md-Audit").val(),
                            "isTour": $("#md-Tour").val(),
                            "isAdvance": $("#md-Advance").val(),
                            "isTa": $("#md-Transport").val(),
                            "isTourCompletionReport": $("#md-TourCompletionReport").val(),
                            "userName": $("#md-UserName").val(),


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

                        return "<a href=/UserRolls/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>" 


                           /* "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"*/

                            //"<a href='/TeamMembers/Index/" + data + "' class='edit' title='Member'><i class='fas fa-building''></i></a>"

                            ;
                   

                    },
                    "width": "9%",
                    "orderable": false
                },  
                {
                    data: "userName",
                    name: "UserName"

                },

                {
                    data: "isAudit",
                    name: "IsAudit"

                }
                ,
                {
                    data: "isTour",
                    name: "IsTour"

                }            
                ,
                {
                    data: "isAdvance",
                    name: "IsAdvance"

                }
                ,
                {
                    data: "isTa",
                    name: "IsTa"

                }
                ,
                {
                    data: "isTourCompletionReport",
                    name: "IsTourCompletionReport"

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

                    $(cell).html('<select class="acc-filters filter-input " style="width:100%"  id="md-' + title.replace(/ /g, "") + '"><option>Select</option><option>True</option><option>False</option></select>');

                } else {
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');
                }
            });
        }




        $("#UserRollsList").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#UserRollsList").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    


    return {
        init: init
    }


}(CommonService, UserRollsService);