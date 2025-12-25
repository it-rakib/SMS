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
                    },
                    Remarks: {
                        required: true
                    }
                },
                messages: {

                    EmailAddress: {
                        required: "Email address is required",
                        email: "Please enter a valid email address"
                    },
                  
                    Remarks: {
                        required: "Remarks is required"
                    }
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
            formData.set('AuditIssueId',$('#IssueId').val())

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

            

            $("#issueUserAudit").on("click",".auditIssueUserEdit", function (e) {


               var id =  $(this).data("id");



                auditIssueUserModal({ AuditId: $("#Id").val(), Edit: $("#Edit").val(), Id: id }, (result) => { onAuditUserAdd(result, auditUserTable) }, null, null, () => { auditUserTable.draw() });

            });



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




            //change for email


            //if ($("#issueUserAudit").length) {
            //    var tableConfigs = getAuditUserTableConfig()
            //    auditUserTable = $("#issueUserAudit").DataTable(tableConfigs);
            //}

            //setEvents(auditUserTable);
         

            //$("#addIssueAuditUser").on("click", function (e) {
            //    auditIssueUserModal({ AuditId: $("#Id").val(), Edit: $("#Edit").val() }, (result) => { onAuditUserAdd(result, auditUserTable) }, null, null, () => { auditUserTable.draw() });

            //})


            //end of change







        }



        //change for email


        //function onAuditUserAdd(result) {
        //    var validator = $("#frm_Audit_Issue_User").validate({ // initialize the plugin on your form
        //        rules: {

        //            EmailAddress: {
        //                required: true,
        //                email: true // ensure the input is email
        //            },
        //            IssuePriority: {
        //                required: true
        //            },
        //            Remarks: {
        //                required: true
        //            }
        //        },
        //        messages: {

        //            EmailAddress: {
        //                required: "Email address is required",
        //                email: "Please enter a valid email address"
        //            },

        //            Remarks: {
        //                required: "Remarks is required"
        //            }
        //        }
        //    });
        //    var result = validator.form();

        //    if (!result) {
        //        ShowNotification(2, "Please complete the form");
        //        return;
        //    }

        //    var form = $("#frm_Audit_Issue_User")[0];
        //    var formData = new FormData(form);


        //    //formData.forEach((value, key) => {
        //    //    console.log(`key: ${key}, value: ${value}`);
        //    //});
        //    formData.set('AuditIssueId', $('#IssueId').val())

        //    IssuesaveEmail(formData, saveDoneEmail, saveFail);

        //}

        //function getAuditUserTableConfig() {

        //    return {

        //        "processing": true,
        //        serverSide: true,
        //        "info": false,
        //        ajax: {
        //            url: '/Audit/_indexAuditIssueUser?id=' + $("#IssueId").val(),
        //            type: 'POST',
        //            data: function (payLoad) {

        //                return $.extend({},
        //                    payLoad,
        //                    {
        //                        //"search2": $("#name").val()
        //                    });
        //            }
        //        },

        //        columns: [
        //            {
        //                data: "userName",
        //                name: "UserName"
        //            },
        //            {
        //                data: "emailAddress",
        //                name: "emailAddress"
        //            },
        //            {
        //                data: "id",
        //                render: function (data) {

        //                    return "<a   data-id='" + data + "' class='edit auditIssueUserEdit' ><i data-id='" + data + "' class='material-icons auditIssueUserEdit' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";;

        //                },
        //                "width": "7%",
        //                "orderable": false
        //            }

        //        ],
        //        order: [1, "asc"],

        //    }
        //}




        //end of change









        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            $("#FeedbackModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#FeedbackModal").modal({ backdrop: 'static', keyboard: false }, "show");
        }


        function setEvents() {

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


           

            //if ($('#BranchFeedbUserTable').length) {
            //    var tableConfigs = getBranFeedbackUserTableConfig()
            //    BrFeadbackUser = $("#BranchFeedbUserTable").DataTable(BranchFeedbUser);
            //}


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

            $(".btnSaveFeedback").on("click", function (e) {


                addCallBack();
                //$("#IssueModal").modal("hide");


            });
        }

        //function getBranFeedbackUserTableConfig() {

        //    return {

        //        "processing": true,
        //        serverSide: true,
        //        "info": false,
        //        ajax: {
        //            url: '/Audit/_indexBranchFeedbackUser?id=' + $("#IssueId").val(),
        //            type: 'POST',
        //            data: function (payLoad) {

        //                return $.extend({},
        //                    payLoad,
        //                    {
        //                        //"search2": $("#name").val()
        //                    });
        //            }
        //        },

        //        columns: [
        //            {
        //                data: "userName",
        //                name: "UserName"
        //            },
        //            {
        //                data: "emailAddress",
        //                name: "emailAddress"
        //            },
        //            {
        //                data: "id",
        //                render: function (data) {

        //                    return "<a   data-id='" + data + "' class='edit auditIssueUserEdit' ><i data-id='" + data + "' class='material-icons auditIssueUserEdit' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";;

        //                },
        //                "width": "7%",
        //                "orderable": false
        //            }

        //        ],
        //        order: [1, "asc"],

        //    }
        //}

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
        , auditFeedbackModal, saveArea, auditUserModal, saveEmail, AuditMultiplePost, AuditMultipleUnPost, auditBranchFeedbackModal
    }


}();