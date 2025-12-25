var AuditService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };

    
    var ExvelSave = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/ExcelCreateEdit',
            method: 'post',
            data: masterObj,

            processData: false,
            contentType: false,

        })
            .done(done)
            .fail(fail);

    };



    var ReportStatus = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/ReportCreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };

    var AuditStatus = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/AuditStatusCreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };


    //change

    var AuditMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };

    var AuditMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };


    //end



    var saveArea = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/AreaCreateEdit',
            method: 'post',
            data: masterObj,
            processData: false,
            contentType: false

        })
            .done(done)
            .fail(fail);

    };



    var saveEmail = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/AuditUserCreateEdit',
            method: 'post',
            data: masterObj,
            processData: false,
            contentType: false

        })
            .done(done)
            .fail(fail);

    };
    var deleteEmail = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/Delete',
            method: 'post',
            data: masterObj,
            processData: false,
            contentType: false

        })
            .done(done)
            .fail(fail);

    };

    var deleteIssueEmail = function (masterObj, done, fail) {

        $.ajax({
            url: '/AuditIssue/Delete',
            method: 'post',
            data: masterObj,
            processData: false,
            contentType: false

        })
            .done(done)
            .fail(fail);

    };
 
    

    var IssuesaveEmail = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/AuditIssueUserCreateEdit',
            method: 'post',
            data: masterObj,
            processData: false,
            contentType: false

        })
            .done(done)
            .fail(fail);

    };
    function saveDoneEmail(result) {
        if (result.status == "200") {
            if (result.data.operation == "add") {

                ShowNotification(1, result.message);
                $(".btnSaveAuditIssueUser").html('Update');

                $("#AuditUserId").val(result.data.id);
                //$("#AuditUserId").val(result.data.auditIssueId);

                result.data.operation = "update";

                $("#AuditUserOperation").val(result.data.operation);


            } else {


                ShowNotification(1, result.message);
            }



        }
        else if (result.status == "400") {
            ShowNotification(3, "Something gone wrong");
        }
    }

    function saveFail(result) {
        console.log(result);
        ShowNotification(3, "Something gone wrong");
    }





    var auditAreaModal = function (masterObj, addCallBack, done, fail, closeCallback) {

        $.ajax({
            url: '/Audit/AuditAreaModal',
            method: 'post',
            data: masterObj

        })
            .done(onSuccess)
            .fail(onFail);



        var modalCloseEvent = function (callBack) {


            $('#areaModal').on('hidden.bs.modal', function () {
                //alert("closed")

                if (typeof closeCallback == "function") {
                    closeCallback();
                }

            });

        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            modalCloseEvent();


            if ($("#AreaDetails").length) {
                CKEDITOR.replace("AreaDetails");
                CKEDITOR.instances['AreaDetails'].setData(decodeBase64($("#AreaDetails").val()));
            }


            setEvents();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#areaModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#areaModal").modal({ backdrop: 'static', keyboard: false }, "show");


            //$("#AuditAreas").validate();
        }


        function setEvents() {

            $(".btnSaveArea").on("click", function (e) {

                addCallBack(e);

            });
        }
    };

    
    //var auditStatusModal = function (masterObj, addCallBack, done, fail, closeCallback) {

    //    $.ajax({
    //        url: '/Audit/AuditStatusModal',
    //        method: 'post',
    //        data: masterObj

    //    })
    //        .done(onSuccess)
    //        .fail(onFail);



    //    var modalCloseEvent = function (callBack) {


    //        $('#areaModal').on('hidden.bs.modal', function () {
    //            //alert("closed")

    //            if (typeof closeCallback == "function") {
    //                closeCallback();
    //            }

    //        });

    //    }

    //    function onSuccess(result) {
    //        showModal(result);

    //        if (typeof done == "function") {
    //            done(result);

    //        }

    //        modalCloseEvent();


    //        //if ($("#AreaDetails").length) {
    //        //    CKEDITOR.replace("AreaDetails");
    //        //    CKEDITOR.instances['AreaDetails'].setData(decodeBase64($("#AreaDetails").val()));
    //        //}


    //        setEvents();
    //    }


    //    function onFail(result) {
    //        fail(result);
    //    }


    //    function showModal(html) {
    //        $("#areaModal").html(html);

    //        $('.draggable').draggable({
    //            handle: ".modal-header"
    //        });

    //        $("#areaModal").modal({ backdrop: 'static', keyboard: false }, "show");


    //        //$("#AuditAreas").validate();
    //    }


    //    function setEvents() {

    //        $(".btnSaveAudit").on("click", function (e) {

    //            addCallBack(e);

    //        });
    //    }
    //};

    var auditIssueModal = function (masterObj, addCallBack, done, fail, closeCallback) {

        $.ajax({
            url: '/Audit/AuditIssueModal',
            method: 'post',
            data: masterObj

        })
            .done(onSuccess)
            .fail(onFail);



        var modalCloseEvent = function (callBack) {


            $('#IssueModal').on('hidden.bs.modal', function () {
                //alert("closed")

                if (typeof closeCallback == "function") {
                    closeCallback();
                }

            });

        }

        function onSuccess(result) {
            var auditUserTable;
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            modalCloseEvent();



            // 
            InitDateRange();


            if ($("#IssuePriority").length) {
                LoadCombo("IssuePriority", '/Common/GetIssuePriority');
            }

            if ($("#IssueStatus").length) {
                LoadCombo("IssueStatus", '/Common/GetIssueStatus');
            }
            if ($("#AuditType").length) {
                LoadCombo("AuditType", '/Common/GetAuditTypes');
            }
            


            if ($("#IssueDetails").length) {
                CKEDITOR.replace("IssueDetails");
                CKEDITOR.instances['IssueDetails'].setData(decodeBase64($("#IssueDetails").val()));
            }

            if ($("#issueUserAudit").length) {
                var tableConfigs = getAuditUserTableConfig()
                auditUserTable = $("#issueUserAudit").DataTable(tableConfigs);
            }

            setEvents(auditUserTable);
            ///-----

            $("#addIssueAuditUser").on("click", function (e) {
                auditIssueUserModal({ AuditId: $("#Id").val(), Edit: $("#Edit").val() }, (result) => { onAuditUserAdd(result, auditUserTable) }, null, null, () => { auditUserTable.draw() });

            })



            //change for audit issue

            //$('.btnPost').click('click', function () {
            $('.AuditIssuePost').click('click', function () {

                Confirmation("Are you sure? Do You Want to Post Data For Audit Issue?", function (result) {
                    console.log(result);
                    if (result) {


                        var issue = serializeInputs("frm_Audit_Issue");
                        if (issue.IsPost == "Y") {
                            ShowNotification(3, "Data has already been Posted.");
                        }
                        else {
                            issue.IDs = issue.Id;
                            AuditIssueService.AuditIssueMultiplePost(issue, AuditIssueMultiplePosts, AuditIssueMultiplePostFail);
                        }
                    }
                });

            });


            function AuditIssueMultiplePosts(result) {
                console.log(result.message);

                if (result.status == "200") {

                    ShowNotification(1, result.message);

                    $("#IsPost").val('Y');

                    $(".btnUnPost").show();
                    //$(".btnReject").show();
                    //$(".btnApproved").show();


                    //$(".btnPush").show();

                    //Visibility(true);



                    var dataTable = $('#AuditIssueDetails').DataTable();
                    dataTable.draw();




                }
                else if (result.status == "400") {
                    ShowNotification(3, result.message);
                }
                else if (result.status == "199") {
                    ShowNotification(3, result.message);
                }
            }

            function AuditIssueMultiplePostFail(result) {
                ShowNotification(3, "Something gone wrong");
                var dataTable = $('#AuditIssueDetails').DataTable();
                dataTable.draw();

            }


            $('.IssueSubmit').click('click', function () {

                UnPostReasonOfIssue = $("#UnPostReasonOfIssue").val();

                var issue = serializeInputs("frm_Audit_Issue");

                issue["UnPostReasonOfIssue"] = UnPostReasonOfIssue;

                Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                    if (UnPostReasonOfIssue === "" || UnPostReasonOfIssue === null) {
                        ShowNotification(3, "Please Write down Reason Of UnPost");
                        $("#UnPostReasonOfIssue").focus();
                        return;
                    }

                    if (result) {


                        issue.IDs = issue.Id;
                        AuditIssueService.AuditIssueMultipleUnPost(issue, AuditIssueMultipleUnPost, AuditIssueMultipleUnPostFail);


                    }
                });
            });
            function AuditIssueMultipleUnPost(result) {
                console.log(result.message);

                if (result.status == "200") {
                    ShowNotification(1, result.message);
                    $("#IsPost").val('N');
                    //Visibility(false);
                    $("#divReasonOfUnPost").hide();
                    $(".btnUnPost").hide();
                    // $(".btnReject").hide();
                    //$(".btnApproved").hide();

                    var dataTable = $('#AuditIssueDetails').DataTable();

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

            function AuditIssueMultipleUnPostFail(result) {
                ShowNotification(3, "Something gone wrong");
                var dataTable = $('#AuditIssueDetails').DataTable();

                dataTable.draw();
            }



            //end







        }

        function onAuditUserAdd(result) {
            var validator = $("#frm_Audit_Issue_User").validate({ // initialize the plugin on your form
                rules: {

                    EmailAddress: {
                        required: true,
                        email: true // ensure the input is email
                    },
                    IssuePriority: {
                        required: true
                    }
                    //Remarks: {
                    //    required: true
                    //}
                },
                messages: {

                    EmailAddress: {
                        required: "Email address is required",
                        email: "Please enter a valid email address"
                    }

                    //Remarks: {
                    //    required: "Remarks is required"
                    //}
                }
            });
            var result = validator.form();

            if (!result) {
                ShowNotification(2, "Please complete the form");
                return;
            }

            var form = $("#frm_Audit_Issue_User")[0];
            var formData = new FormData(form);


            //formData.forEach((value, key) => {
            //    console.log(`key: ${key}, value: ${value}`);
            //});
            formData.set('AuditIssueId', $('#IssueId').val())

            IssuesaveEmail(formData, saveDoneEmail, saveFail);

        }



        function getAuditUserTableConfig() {

            return {

                "processing": true,
                serverSide: true,
                "info": false,
                ajax: {
                    url: '/Audit/_indexAuditIssueUser?id=' + $("#IssueId").val(),
                    type: 'POST',
                    data: function (payLoad) {

                        return $.extend({},
                            payLoad,
                            {
                                //"search2": $("#name").val()
                            });
                    }
                },

                columns: [
                    {
                        data: "userName",
                        name: "UserName"
                    },
                    {
                        data: "emailAddress",
                        name: "emailAddress"
                    },
                    {
                        data: "id",
                        render: function (data) {

                            return "<a   data-id='" + data + "' class='edit auditIssueUserEdit' ><i data-id='" + data + "' class='material-icons auditIssueUserEdit' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";;

                        },
                        "width": "7%",
                        "orderable": false
                    }

                ],
                order: [1, "asc"],

            }
        }

        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#IssueModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#IssueModal").modal({ backdrop: 'static', keyboard: false }, "show");
        }


        function setEvents(auditUserTable) {

            $(".btnSaveIssue").on("click", function (e) {


                addCallBack(auditUserTable);
                //$("#IssueModal").modal("hide");


            });


            $("#newButton").on("click", function (e) {




            });



            $("#issueUserAudit").on("click", ".auditIssueUserEdit", function (e) {


                var id = $(this).data("id");



                auditIssueUserModal({ AuditId: $("#Id").val(), Edit: $("#Edit").val(), Id: id }, (result) => { onAuditUserAdd(result, auditUserTable) }, null, null, () => { auditUserTable.draw() });

            });



        }

    };


    var auditReportStatusEditModal = function (masterObj, addCallBack, done, fail, closeCallback) {

        $.ajax({
            url: '/Audit/AuditReportStatusModal',
            method: 'post',
            data: masterObj

        })
            .done(onSuccess)
            .fail(onFail);



        var modalCloseEvent = function (callBack) {


            $('#auditReportStatusModal').on('hidden.bs.modal', function () {
                //alert("closed")

                if (typeof closeCallback == "function") {
                    closeCallback();
                }

            });

        }

        function onSuccess(result) {
            var auditUserTable;
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            modalCloseEvent();


            setEvents();

            if ($("#ReportStatusModal").length) {
                LoadCombo("ReportStatusModal", '/Common/GetReportStatus');
            }

            if ($("#IssuePriorityUpdate").length) {
                LoadCombo("IssuePriorityUpdate", '/Common/GetIssuePriority');
            }

            // 
            InitDateRange();



        }

       
        function setEvents() {

            //$(".btnSaveFeedback").on("click", function (e) {
            $(".btnSaveReport").on("click", function (e) {


                addCallBack();
                //$("#IssueModal").modal("hide");


            });
        }



        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#auditReportStatusModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#auditReportStatusModal").modal({ backdrop: 'static', keyboard: false }, "show");
        }


       

    };


    var auditStatusModal = function (masterObj, addCallBack, done, fail, closeCallback) {

        $.ajax({
            url: '/Audit/AuditStatusModal',
            method: 'post',
            data: masterObj

        })
            .done(onSuccess)
            .fail(onFail);



        var modalCloseEvent = function (callBack) {


            $('#forauditstatusModal').on('hidden.bs.modal', function () {
                //alert("closed")

                if (typeof closeCallback == "function") {
                    closeCallback();
                }

            });

        }

        function onSuccess(result) {
            var auditUserTable;
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            modalCloseEvent();


            setEvents();

            if ($("#AuditStatus").length) {
                LoadCombo("AuditStatus", '/Common/GetAuditStatus');
            }


            if ($("#BranchIDStatus").length) {
                LoadCombo("BranchIDStatus", '/Common/Branch');
            }

            // 
            InitDateRange();



        }


        function setEvents() {

            //$(".btnSaveFeedback").on("click", function (e) {
            $(".btnSaveStatus").on("click", function (e) {


                addCallBack();
                //$("#IssueModal").modal("hide");


            });
        }



        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#forauditstatusModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#forauditstatusModal").modal({ backdrop: 'static', keyboard: false }, "show");
        }




    };



    var auditIssueUserModal = function (masterObj, addCallBack, done, fail, closeCallback) {

        $.ajax({
            url: '/Audit/AuditIssueUserModal',
            method: 'post',
            data: masterObj

        })
            .done(onSuccess)
            .fail(onFail);





        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            modalCloseEvent();

            setEvents();


            if ($("#IssuePriority").length) {
                LoadCombo("IssuePriority", '/Common/GetIssuePriority');
            }


            if ($("#UserId").length) {
                LoadCombo("UserId", '/Common/GetAllUserName');
            }




            //change for Audit Issue Email for delete

            $('.btnDeleteAuditIssueUser').click('click', function () {

                Confirmation("Are you sure? Do You Want to Delete Data?", function (result) {
                    console.log(result);

                    if (result) {


                        var form = $("#frm_Audit_Issue_User")[0];
                        var formData = new FormData(form);

                        AuditService.deleteIssueEmail(formData, deleteIssueDoneEmail, deleteIssueFail);
                    
                    }
                });

            });

            function deleteIssueDoneEmail(result) {
                if (result.status == "200") {

                    ShowNotification(1, result.message);
                    $('#AuditUser').modal('hide');


                }
                else if (result.status == "400") {
                    ShowNotification(3, "Something gone wrong");
                }
            }

            function deleteIssueFail(result) {
                console.log(result);
                ShowNotification(3, "Something gone wrong");
            }


            //end








        }
        var modalCloseEvent = function (callBack) {


            $('#AuditIssueUser').on('hidden.bs.modal', function () {
                //alert("closed")

                if (typeof closeCallback == "function") {
                    closeCallback();
                }

            });

        }


        function onFail(result) {
            if (typeof fail == "function") {
                fail(result);
            }

        }


        function showModal(html) {
            $("#AuditIssueUser").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#AuditIssueUser").modal({ backdrop: 'static', keyboard: false }, "show");
        }


        function setEvents() {

            $(".btnSaveAuditIssueUser").on("click", function (e) {


                addCallBack();
                //$("#IssueModal").modal("hide");


            });


            $("#UserId").on("change", function (e) {

                $.ajax({
                    url: '/Audit/GetUserInfo?userId=' + $(this).val(),

                })
                    .done((result) => {

                        $("#EmailAddress").val(result.email)

                    })
                    .fail();


            });
        }

    };



    var auditFeedbackModal = function (masterObj, addCallBack, done, fail, closeCallback, { auditId }) {

        $.ajax({
            url: '/Audit/AuditFeedbackModal',
            method: 'post',
            data: masterObj

        })
            .done(onSuccess)
            .fail(onFail);


        var modalCloseEvent = function (callBack) {

            $('#FeedbackModal').on('hidden.bs.modal', function () {

                if (typeof closeCallback == "function") {
                    closeCallback();
                }

            });

        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            modalCloseEvent();

            setEvents();







            //InitDateRange();


            if ($("#AuditIssueId").length) {

                if (auditId) {
                    LoadCombo("AuditIssueId", '/Common/GetIssues?auditid=' + auditId);

                }
                else {
                    LoadCombo("AuditIssueId", '/Common/GetIssues?auditid=' + auditId);

                }
            }




            if ($("#IssueDetailsFeedback").length) {
                CKEDITOR.replace("IssueDetailsFeedback");
                CKEDITOR.instances['IssueDetailsFeedback'].setData(decodeBase64($("#IssueDetailsFeedback").val()));
            }




            //change for feedback


            $('.btnFeedback').click('click', function () {

                var validator = $("#frm_Audit_feedback").validate({
                    rules: {
                        AuditIssueId: {
                            required: true
                        },
                        Heading: {
                            required: true
                        },
                        IssueDetails: {
                            required: true
                        }
                    },
                    messages: {
                        AuditIssueId: {
                            required: "Please select the audit issue."
                        },
                        Heading: {
                            required: "Please enter the feedback heading."
                        },
                        IssueDetails: {
                            required: "Please provide the feedback details."
                        }
                    }
                }
                );
                var result = validator.form();

                if (!result) {
                    ShowNotification(2, "Please complete the form");
                    return;
                }

                if (!CKEDITOR.instances['IssueDetailsFeedback'].getData()) {
                    ShowNotification(2, "Please Enter Issue Details");
                    return;
                }


                //var masterObj = serializeInputs("frm_Audit_feedback");
                //masterObj.Operation = "add";
                //var masterObj = $("#frm_Audit").serialize();





                var form = $("#frm_Audit_feedback")[0];
                var formData = new FormData(form);

                formData.set("IssueDetails", encodeBase64(CKEDITOR.instances['IssueDetailsFeedback'].getData()));

                //formData.append("feedbackOperation", "add");
                formData.set("Operation", "add");

                AuditFeedbackService.save(formData, saveDoneFeedback, saveFail);

                //AuditFeedbackService.saveFeed(masterObj, saveDoneFeedback, saveFail);


            });


            function saveDoneFeedback(result) {
                if (result.status == "200") {
                    if (result.data.operation == "add") {

                        ShowNotification(1, result.message);
                        $(".btnSaveFeedback").html('Update');
                        $("#feedbackId").val(result.data.id);

                        result.data.operation = "update";

                        $("#feedbackOperation").val(result.data.operation);


                        //change

                        //showUserAuditIssue();

                        addListItemFeedBack(result);

                        //end


                        //addListItem(result);


                    } else {

                        //addListItem(result);

                        //change
                        addListItemFeedBack(result);
                        //end

                        ShowNotification(1, result.message);
                    }

                    $("#fileToUpload").val('');

                }
                else if (result.status == "400") {
                    //ShowNotification(3, "Something gone wrong");
                    ShowNotification(3, result.message);
                }
            }

            function saveFail(result) {
                console.log(result);
                ShowNotification(3, "Something gone wrong");
            }

            function addListItemFeedBack(result) {
                var list = $(".fileGroup");

                result.data.attachmentsList.forEach(function (item) {

                    var item = '<li class="list-group-item" id="file-' + item.id + '"> <span>' +
                        item.displayName +
                        '</span><a target="_blank" href="/AuditFeedback/DownloadFile?filePath=' + item.fileName + '" class=" ml-2 btn btn-primary btn-sm float-right ml-2">Download</a>' +
                        '<button onclick="AuditController.deleteFeedbackFile(\'' + item.id + '\', \'' + item.fileName + '\')" class=" ml-2 btn btn-danger btn-sm float-right" type="button">Delete</button>' +
                        '</li>';

                    list.append(item);
                });
            }


        }


        function onFail(result) {

            //function onFail(result) {
            //    fail(result);


            //    console.log(result);


            // }

            if (typeof fail == "function") {
                fail(result);

            }

            console.log(result)

        }


        function showModal(html) {
            $("#FeedbackModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#FeedbackModal").modal({ backdrop: 'static', keyboard: false }, "show");
        }


        function setEvents() {

            //$(".btnSaveFeedback").on("click", function (e) {
            $(".btnSaveFeedback").on("click", function (e) {


                addCallBack();
                //$("#IssueModal").modal("hide");


            });
        }







    };

    var auditBranchFeedbackModal = function (masterObj, addCallBack, done, fail, closeCallback, { auditId }) {

        $.ajax({
            url: '/Audit/AuditBranchFeedbackModal',
            method: 'post',
            data: masterObj

        })
            .done(onSuccess)
            .fail(onFail);


        var modalCloseEvent = function (callBack) {

            $('#BranchFeedbackModal').on('hidden.bs.modal', function () {

                if (typeof closeCallback == "function") {
                    closeCallback();
                }

            });

        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            modalCloseEvent();

            setEvents();







            //InitDateRange();


            //if ($("#AuditIssueId").length) {
            if ($("#AuditBranchIssueId").length) {

                if (auditId) {
                    //LoadCombo("AuditIssueId", '/Common/GetIssues?auditid=' + auditId);
                    //LoadCombo("AuditBranchIssueId", '/Common/GetIssues?auditid=' + auditId);
                    LoadCombo("AuditBranchIssueId", '/Common/GetBranchFeedbackIssues?auditid=' + auditId);

                }
                else {
                    //LoadCombo("AuditIssueId", '/Common/GetIssues?auditid=' + auditId);
                    //LoadCombo("AuditBranchIssueId", '/Common/GetIssues?auditid=' + auditId);
                    LoadCombo("AuditBranchIssueId", '/Common/GetBranchFeedbackIssues?auditid=' + auditId);

                }
            }
            if ($("#Status").length) {
                LoadCombo("Status", '/Common/GetIssueStatus');
            }




            if ($("#IssueBranchDetailsFeedback").length) {
                CKEDITOR.replace("IssueBranchDetailsFeedback");
                CKEDITOR.instances['IssueBranchDetailsFeedback'].setData(decodeBase64($("#IssueBranchDetailsFeedback").val()));
            }


            //for post change


            //$('.btnPost').click('click', function () {
            $('.AuditBranchFeedback').click('click', function () {

                Confirmation("Are you sure? Do You Want to Post Data for BranchFeedback?", function (result) {
                    console.log(result);
                    if (result) {


                        var branchfeedback = serializeInputs("frm_Audit_Branch_feedback");
                        if (branchfeedback.IsPost == "Y") {
                            ShowNotification(3, "Data has already been Posted.");
                        }
                        else {
                            branchfeedback.IDs = branchfeedback.Id;
                            AuditFeedbackService.AuditBranchFeedbackPost(branchfeedback, BranchFeedbackMultiplePost, BranchFeedbackMultiplePostFail);
                        }
                    }
                });

            });


            function BranchFeedbackMultiplePost(result) {
                console.log(result.message);

                if (result.status == "200") {

                    ShowNotification(1, result.message);

                    $("#IsPost").val('Y');

                    $(".btnUnPost").show();
                    //$(".btnReject").show();
                    //$(".btnApproved").show();


                    //$(".btnPush").show();

                    //Visibility(true);



                    var dataTable = $('#AuditBranchFeedbackDetails').DataTable();
                    dataTable.draw();




                }
                else if (result.status == "400") {
                    ShowNotification(3, result.message);
                }
                else if (result.status == "199") {
                    ShowNotification(3, result.message);
                }
            }

            function BranchFeedbackMultiplePostFail(result) {
                ShowNotification(3, "Something gone wrong");
                var dataTable = $('#AuditBranchFeedbackDetails').DataTable();
                dataTable.draw();

            }


            //end of post


            //submit of barnch feedback

            $('.BranchFeedbackSubmit').click('click', function () {

                UnPostReasonOfBranchFeedback = $("#UnPostReasonOfBranchFeedback").val();

                var branchfeedback = serializeInputs("frm_Audit_Branch_feedback");

                branchfeedback["UnPostReasonOfBranchFeedback"] = UnPostReasonOfBranchFeedback;

                Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
                    if (UnPostReasonOfBranchFeedback === "" || UnPostReasonOfBranchFeedback === null) {
                        ShowNotification(3, "Please Write down Reason Of UnPost");
                        $("#UnPostReasonOfBranchFeedback").focus();
                        return;
                    }

                    if (result) {


                        branchfeedback.IDs = branchfeedback.Id;
                        AuditFeedbackService.AuditBranchBranchFeedbackUnPost(branchfeedback, BranchFeedbackMultipleUnPost, BranchFeedbackMultipleUnPostFail);


                    }
                });
            });
            function BranchFeedbackMultipleUnPost(result) {
                console.log(result.message);

                if (result.status == "200") {
                    ShowNotification(1, result.message);
                    $("#IsPost").val('N');
                    //Visibility(false);
                    $("#divReasonOfUnPost").hide();
                    $(".btnUnPost").hide();
                    // $(".btnReject").hide();
                    //$(".btnApproved").hide();

                    var dataTable = $('#AuditBranchFeedbackDetails').DataTable();

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

            function BranchFeedbackMultipleUnPostFail(result) {
                ShowNotification(3, result.message);
                var dataTable = $('#AuditBranchFeedbackDetails').DataTable();

                dataTable.draw();
            }


            //end of submit


            //change for branch feedback




            //function onBranchFeedbackAdd(result) {

            $('.btnBranchFeedback').click('click', function () {

                var validator = $("#frm_Audit_Branch_feedback").validate({
                    rules: {

                        //AuditIssueId: {
                        //    required: true
                        //},
                        AuditBranchIssueId: {
                            required: true
                        },

                        Heading: {
                            required: true
                        },
                        IssueDetails: {
                            required: true
                        }
                    },
                    messages: {

                        //AuditIssueId: {
                        //    required: "Please select the audit issue."
                        //},
                        AuditBranchIssueId: {
                            required: "Please select the audit issue."
                        },

                        Heading: {
                            required: "Please enter the feedback heading."
                        },
                        IssueDetails: {
                            required: "Please provide the feedback details."
                        }
                    }
                }
                );
                var result = validator.form();

                if (!result) {
                    ShowNotification(2, "Please complete the form");
                    return;
                }

                //if (!CKEDITOR.instances['IssueDetailsFeedback'].getData()) {
                if (!CKEDITOR.instances['IssueBranchDetailsFeedback'].getData()) {
                    ShowNotification(2, "Please Enter Issue Details");
                    return;
                }

                var form = $("#frm_Audit_Branch_feedback")[0];
                var formData = new FormData(form);

                //formData.set("IssueDetails", encodeBase64(CKEDITOR.instances['IssueDetailsFeedback'].getData()));
                formData.set("IssueDetails", encodeBase64(CKEDITOR.instances['IssueBranchDetailsFeedback'].getData()));

                formData.set("Operation", "add");

                AuditFeedbackService.FeedbackBranchSave(formData, saveDoneBranchFeedback, saveFail);

                //}
            });

            function saveDoneBranchFeedback(result) {
                if (result.status == "200") {
                    if (result.data.operation == "add") {

                        ShowNotification(1, result.message);
                        //$(".btnSaveFeedback").html('Update');
                        $(".btnBranchSaveFeedback").html('Update');
                        $("#BranchfeedbackId").val(result.data.id);

                        //change
                        $("#Id").val(result.data.auditId);

                        $("#divFeedback").show();

                        //end

                        result.data.operation = "update";

                        $("#feedbackBranchOperation").val(result.data.operation);
                        //$("#feedbackOperation").val(result.data.operation);


                        //addListItem(result);

                        addListItemBranchFeedBack(result);


                    } else {

                        //addListItem(result);

                        addListItemBranchFeedBack(result);

                        ShowNotification(1, result.message);
                    }

                    $("#fileToUpload").val('');

                }
                else if (result.status == "400") {
                    //ShowNotification(3, "Something gone wrong");
                    ShowNotification(3, result.message);
                }
            }


            function saveFail(result) {
                console.log(result);
                ShowNotification(3, "Something gone wrong");
            }



            function addListItemBranchFeedBack(result) {
                var list = $(".fileGroup");

                result.data.attachmentsList.forEach(function (item) {

                    var item = '<li class="list-group-item" id="file-' + item.id + '"> <span>' +
                        item.displayName +
                        '</span><a target="_blank" href="/AuditBranchFeedback/DownloadFile?filePath=' + item.fileName + '" class=" ml-2 btn btn-primary btn-sm float-right ml-2">Download</a>' +
                        '<button onclick="AuditController.deleteBranchFeedbackFile(\'' + item.id + '\', \'' + item.fileName + '\')" class=" ml-2 btn btn-danger btn-sm float-right" type="button">Delete</button>' +
                        '</li>';

                    list.append(item);
                });
            }





            //end


        }


        function onFail(result) {

            //function onFail(result) {
            //    fail(result);


            //    console.log(result);


            // }

            if (typeof fail == "function") {
                fail(result);

            }

            console.log(result)

        }


        function showModal(html) {
            $("#BranchFeedbackModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#BranchFeedbackModal").modal({ backdrop: 'static', keyboard: false }, "show");
        }


        function setEvents() {

            //$(".btnSaveFeedback").on("click", function (e) {
            $(".btnBranchSaveFeedback").on("click", function (e) {


                addCallBack();
                //$("#IssueModal").modal("hide");


            });
        }



    };


    var auditUserModal = function (masterObj, addCallBack, done, fail, closeCallback) {

        $.ajax({
            url: '/Audit/AuditUserModal',
            method: 'post',
            data: masterObj

        })
            .done(onSuccess)
            .fail(onFail);



        var modalCloseEvent = function (callBack) {


            $('#AuditUser').on('hidden.bs.modal', function () {
                //alert("closed")

                if (typeof closeCallback == "function") {
                    closeCallback();
                }

            });

        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            modalCloseEvent();

            setEvents();


            if ($("#IssuePriority").length) {
                LoadCombo("IssuePriority", '/Common/GetIssuePriority');
            }


            if ($("#UserId").length) {
                LoadCombo("UserId", '/Common/GetAllUserName');
            }





            //change for email for delete


            $('.btnDeleteAuditUser').click('click', function () {

                Confirmation("Are you sure? Do You Want to Delete Data?", function (result) {
                    console.log(result);

                    if (result) {


                        var form = $("#frm_Audit_User")[0];
                        var formData = new FormData(form);

                        AuditService.deleteEmail(formData, deleteDoneEmail, deleteFail);


                        //var issue = serializeInputs("frm_Audit_Issue");
                        //if (tours.IsPost == "Y") {
                        //    ShowNotification(3, "Data has already been Posted.");
                        //}
                        //else {
                        //    issue.IDs = issue.Id;
                        //    ToursMultiplePost.ToursMultiplePost(issue, ToursMultiplePosts, ToursMultiplePostFail);
                        //}

                    }
                });

            });

            function deleteDoneEmail(result) {
                if (result.status == "200") {
                    

                        ShowNotification(1, result.message);

                        //$("#userModal").modal('hide'); 
                        $('#AuditUser').modal('hide');


                 
                }
                else if (result.status == "400") {
                    ShowNotification(3, "Something gone wrong");
                }
            }
            function deleteFail(result) {
                console.log(result);
                ShowNotification(3, "Something gone wrong");
            }


            //end



        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#AuditUser").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#AuditUser").modal({ backdrop: 'static', keyboard: false }, "show");
        }


        function setEvents() {

            $(".btnSaveAuditUser").on("click", function (e) {


                addCallBack();
                //$("#IssueModal").modal("hide");


            });


            $("#UserId").on("change", function (e) {

                $.ajax({
                    url: '/Audit/GetUserInfo?userId=' + $(this).val(),

                })
                    .done((result) => {

                        $("#EmailAddress").val(result.email)

                    })
                    .fail();


            });
        }

    };

    return {
        save, auditAreaModal, auditIssueModal
        , auditFeedbackModal, saveArea, auditUserModal, saveEmail, AuditMultiplePost, AuditMultipleUnPost, auditBranchFeedbackModal, deleteEmail, auditStatusModal, auditReportStatusEditModal, ReportStatus, AuditStatus, deleteIssueEmail, ExvelSave
    }


}();