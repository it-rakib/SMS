var AuditController = function (AuditService, AuditIssueService, AuditFeedbackService) {

    var indexTable;
    var detailTable;
    var detailIssueTable;
    var detailFeedbackTable;
    var auditUserTable;

    //var dataTable = $('#ToursList').DataTable();


    var init = function () {

        showSections();

        //audit
        if ($("#AuditList").length) {
            var indexConfig = GetIndexTable();
            indexTable = $("#AuditList").DataTable();
            //indexTable = $("#AuditList").DataTable(indexConfig);
        }


        if ($("#AuditTypeId").length) {
            LoadCombo("AuditTypeId", '/Common/GetAuditType?isPlanned=' + $('#IsPlaned').prop('checked'));
        }

        if ($("#ReportStatus").length) {
            LoadCombo("ReportStatus", '/Common/GetReportStatus');
        }


        if ($("#AuditStatus").length) {
            LoadCombo("AuditStatus", '/Common/GetAuditStatus');
        }


        if ($("#BranchID").length) {
            LoadCombo("BranchID", '/Common/Branch');
        }


        if ($("#TeamId").length) {
            LoadCombo("TeamId", '/Common/GetTeams');
        }

        $("#IsPlaned").on("change", function () {
            LoadCombo("AuditTypeId", '/Common/GetAuditType?isPlanned=' + $('#IsPlaned').prop('checked'));
        })

        debugger;
        if ($("#Remarks").length) {
            CKEDITOR.replace("Remarks");
            CKEDITOR.instances['Remarks'].setData(decodeBase64($("#Remarks").val()));
        }

        if ($("#AuditAreasDetails").length) {
            var tableConfigs = getTableConfig()
            detailTable = $("#AuditAreasDetails").DataTable(tableConfigs);
        }
        //issue
        if ($("#AuditIssueDetails").length) {
            var tableConfigs = getIssueTableConfig()
            detailIssueTable = $("#AuditIssueDetails").DataTable();
            //detailIssueTable = $("#AuditIssueDetails").DataTable(tableConfigs);
        }

        //feedback
        if ($("#AuditFeedbackDetails").length) {
            var tableConfigs = getFeedbackTableConfig()
            //detailFeedbackTable = $("#AuditFeedbackDetails").DataTable();
            detailFeedbackTable = $("#AuditFeedbackDetails").DataTable(tableConfigs);
        }
        //branchfeedback
        if ($("#AuditBranchFeedbackDetails").length) {
            var tableConfigs = getBranchFeedbackTableConfig()
            //detailIssueTable = $("#AuditBranchFeedbackDetails").DataTable();
            detailFeedbackTable = $("#AuditBranchFeedbackDetails").DataTable(tableConfigs);
        }


        if ($("#AuditUserDetails").length) {
            var tableConfigs = getAuditUserTableConfig()
            auditUserTable = $("#AuditUserDetails").DataTable(tableConfigs);
        }

     

        //if ($("#AuditIssueUserDetails").length) {
        //    var tableConfigs = getAuditUserTableConfig()
        //    auditUserTable = $("#AuditIssueUserDetails").DataTable(tableConfigs);
        //}

        $(".btnAddDetails").on("click", function () {

            rowAdd(detailTable)

        });


        $("#AuditAreasDetails").on("click", ".js-delete", function () {
            var button = $(this);
            rowDelete(button, detailTable);
        });


        $("#AuditAreasDetails").on("click", ".js-edit", function () {

            //if ($("#Edit").val().toLowerCase() != "audit") return;

            rowEdit($(this).data('id'), $("#Edit").val());
        });




        $(".btnSave").on("click", function (e) {
            Save(detailTable);
        })


        $("#addArea").on("click", function (e) {

            AuditService.auditAreaModal({ AuditId: $("#Id").val(), Edit: $("#Edit").val() }, (result) => { onAdd(result, detailTable) }, null, (res) => console.log(res), () => { detailTable.draw() });
        })


        $("#addIssue").on("click", function (e) {
            AuditService.auditIssueModal({ AuditId: $("#Id").val(), Edit: $("#Edit").val() }, (auditUserTable) => { onIssueAdd(auditUserTable, detailIssueTable) }, null, null, () => { detailIssueTable.draw() });
        })


        $("#addFeedback").on("click", function (e) {
            AuditService.auditFeedbackModal({ AuditId: $("#Id").val(), Edit: $("#Edit").val() }, (result) => { onFeedbackAdd(result, detailFeedbackTable) }, null, null, () => { detailFeedbackTable.draw() }, { auditId: $("#Id").val() });
        })

        //$("#addBranchFeedback").on("click", function (e) {
        //    AuditService.auditFeedbackModal({ AuditId: $("#Id").val(), Edit: $("#Edit").val() }, (result) => { onFeedbackAdd(result, detailFeedbackTable) }, null, null, () => { detailFeedbackTable.draw() }, { auditId: $("#Id").val() });
        //})

        //change

        $("#addBranchFeedback").on("click", function (e) {
            AuditService.auditBranchFeedbackModal({ AuditId: $("#Id").val(), Edit: $("#Edit").val() }, (result) => { onBranchFeedbackAdd(result, detailFeedbackTable) }, null, null, () => { detailFeedbackTable.draw() }, { auditId: $("#Id").val() });
        })

        //end


        $("#addAuditUser").on("click", function (e) {
            AuditService.auditUserModal({ AuditId: $("#Id").val(), Edit: $("#Edit").val() }, (result) => { onAuditUserAdd(result, auditUserTable) }, null, null, () => { auditUserTable.draw() }, { auditId: $("#Id").val() });
        })



        $("#addAuditIssueUser").on("click", function (e) {
            AuditService.auditUserModal({ AuditId: $("#Id").val(), Edit: $("#Edit").val() }, (result) => { onAuditUserAdd(result, auditUserTable) }, null, null, () => { auditUserTable.draw() }, { auditId: $("#Id").val() });
        })



        $("#AuditIssueDetails").on("click", ".issueLineEdit", function () {
            //if ($("#Edit").val().toLowerCase() != "issue") return;

            IssueEdit($(this).data('id'), $("#Edit").val());
        });


        $("#AuditFeedbackDetails").on("click", ".feedbackLineEdit", function () {
            //if ($("#Edit").val().toLowerCase() != "feedback") return;

            feedbackEdit($(this).data('id'), $("#Edit").val());
        });

        $("#AuditBranchFeedbackDetails").on("click", ".BranchfeedbackLineEdit", function () {
            //if ($("#Edit").val().toLowerCase() != "feedback") return;

            BranchfeedbackEdit($(this).data('id'), $("#Edit").val());
        });

        $("#AuditUserDetails").on("click", ".auditEdit", function () {
            //if ($("#Edit").val().toLowerCase() != "audit") return;

            auditUserEdit($(this).data('id'), $("#Edit").val());
        });

        $("#AuditIssueUserDetails").on("click", ".auditEdit", function () {
            //if ($("#Edit").val().toLowerCase() != "audit") return;

            auditUserEdit($(this).data('id'), $("#Edit").val());
        });



        //change of Email


        //$("#issueUserAudit").on("click", ".auditEdit", function () {

           // auditUserEdit($(this).data('id'), $("#Edit").val());

       // });


        //end of change


        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });

        var IsPost = $('#IsPost').val();
        if (IsPost === 'Y') {
            //Visibility(true);
        }


    }


    //end of init

    function Visibility(action) {

        //$('#frm_IssueEntry tr').prop('readonly', action);
        //$('#AuditIssueDetails tbody td').prop('contenteditable', !action);
        $('#frm_IssueEntry').find(':tr th').prop('readonly', action);
        //$('#frm_ReceiptEntry').find('table, table *').prop('disabled', action);
        //$('#frm_ReceiptEntry').find(':input[type="button"]').prop('disabled', action);

    };


    $('#PostAU').on('click', function () {

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


        var dataTable = $('#AuditList').DataTable();

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

        if (IsPost) {

            //AuditService.ToursMultiplePost(model, ToursMultiplePosts, ToursMultiplePostFail);
            AuditService.AuditMultiplePost(model, AuditMultiplePosts, AuditMultiplePostFail);

        }

        

    }











    function showSections() {
        if ($("#allSections").is(':hidden') && $("#Id").val() != 0) {
            $("#allSections").show();
           
        }
    }


    function getIssueIndexURL() {
        return '/AuditIssue/_index?id=' + $("#Id").val()
    }


    function getAreaIndexURL() {
        return '/Audit/_indexArea?id=' + $("#Id").val()
    }

    function getIssueFeedIndexURL() {
        return '/AuditFeedback/_index?id=' + $("#Id").val()
    }


    function getIssueBranchFeedIndexURL() {
        return '/AuditBranchFeedback/_index?id=' + $("#Id").val()
    }

    function getUserIndexURL() {
        return '/Audit/_indexAuditUser?id=' + $("#Id").val()
    }
 


    function IssueEdit(id, Edit) {

        AuditService.auditIssueModal({ Id: id, Edit }, (result) => { onIssueAdd(result, detailIssueTable) }, () => { showUserAuditIssue() }, null, () => { detailIssueTable.draw() });

    }


    function feedbackEdit(id, Edit) {
        AuditService.auditFeedbackModal({ Id: id, Edit }, (result) => { onFeedbackAdd(result, detailFeedbackTable) }, null, null, () => { detailFeedbackTable.draw() }, { auditId: $("#Id").val() });
    }

    //function feedbackEdit(id, Edit) {
    //    AuditService.auditFeedbackModal({ Id: id, Edit }, (result) => { onFeedbackAdd(result, detailFeedbackTable) }, null, null, () => { detailFeedbackTable.draw() }, { auditId: $("#Id").val() });
    //}

    function BranchfeedbackEdit(id, Edit) {
        AuditService.auditBranchFeedbackModal({ Id: id, Edit }, (result) => { onBranchFeedbackAdd(result, detailFeedbackTable) }, null, null, () => { detailFeedbackTable.draw() }, { auditId: $("#Id").val() });
    }



    function auditUserEdit(id, Edit) {
        AuditService.auditUserModal({ Id: id, Edit }, (result) => { onAuditUserAdd(result, auditUserTable) }, null, null, () => { auditUserTable.draw() });
    }

    function auditIssueUserEdit(id, Edit) {
        AuditService.auditUserModal({ Id: id, Edit }, (result) => { onAuditUserAdd(result, auditUserTable) }, null, null, () => { auditUserTable.draw() }, { auditId: $("#Id").val() });
    }


    function onIssueAdd(auditUserTable, issueTable) {
        var validator = $("#frm_Audit_Issue").validate({
            rules: {
                IssueName: {
                    required: true
                },
                DateOfSubmission: {
                    required: true
                },
                IssuePriority: {
                    required: true
                },
                IssueDetails: {
                    required: true
                }
            },
            messages: {
                IssueName: {
                    required: "Please enter the issue name."
                },
                DateOfSubmission: {
                    required: "Please select the date of submission."
                },
                IssuePriority: {
                    required: "Please select the issue priority."
                },
                IssueDetails: {
                    required: "Please provide the issue details."
                }
            }
        }
        );
        var result = validator.form();

        if (!result) {
            ShowNotification(2, "Please complete the form");
            return;
        }


        if (!CKEDITOR.instances['IssueDetails'].getData()) {
            ShowNotification(2, "Please Enter Issue Details");
            return;
        }


        var form = $("#frm_Audit_Issue")[0];
        var formData = new FormData(form);


        formData.set("IssueDetails", encodeBase64(CKEDITOR.instances['IssueDetails'].getData()));

        AuditIssueService.save(formData, (result) => { saveDoneIssue(result, auditUserTable) }, saveFail);

        ////issueTable.draw();

        //issueTable.ajax.reload();
    }



    function onFeedbackAdd(result) {
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

        var form = $("#frm_Audit_feedback")[0];
        var formData = new FormData(form);

        formData.set("IssueDetails", encodeBase64(CKEDITOR.instances['IssueDetailsFeedback'].getData()));

        AuditFeedbackService.save(formData, saveDoneFeedback, saveFail);
    }

    //change

    function onBranchFeedbackAdd(result) {

        var validator = $("#frm_Audit_Branch_feedback").validate({
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

        var form = $("#frm_Audit_Branch_feedback")[0];
        var formData = new FormData(form);

        formData.set("IssueDetails", encodeBase64(CKEDITOR.instances['IssueDetailsFeedback'].getData()));

        AuditFeedbackService.FeedbackBranchSave(formData, saveDoneBranchFeedback, saveFail);
    }

    function saveDoneBranchFeedback(result) {
        if (result.status == "200") {
            if (result.data.operation == "add") {

                ShowNotification(1, result.message);
                $(".btnSaveFeedback").html('Update');
                $("#feedbackId").val(result.data.id);

                result.data.operation = "update";

                $("#feedbackOperation").val(result.data.operation);


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
            ShowNotification(3, "Something gone wrong");
        }
    }


    function saveFail(result) {
        console.log(result);
        ShowNotification(3, "Something gone wrong");
    }


    //end of change

    function onAuditUserAdd(result) {
        var validator = $("#frm_Audit_User").validate({ // initialize the plugin on your form
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
                IssuePriority: {
                    required: "Issue Priority is required"
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

        var form = $("#frm_Audit_User")[0];
        var formData = new FormData(form);


        //formData.forEach((value, key) => {
        //    console.log(`key: ${key}, value: ${value}`);
        //});

        AuditService.saveEmail(formData, saveDoneEmail, saveFail);
    }


    //-------------------------------

    function addListItem(result) {
        var list = $(".fileGroup");

        result.data.attachmentsList.forEach(function (item) {

            var item = '<li class="list-group-item" id="file-' + item.id + '"> <span>' +
                item.displayName +
                '</span><a target="_blank" href="/AuditIssue/DownloadFile?filePath=' + item.fileName + '" class=" ml-2 btn btn-primary btn-sm float-right ml-2">Download</a>' +
                '<button onclick="AuditController.deleteIssueFile(\'' + item.id + '\', \'' + item.fileName + '\')" class=" ml-2 btn btn-danger btn-sm float-right" type="button">Delete</button>' +
                '</li>';

            list.append(item);
        });
    }




    //change for file for feedback


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


    //end of change of feedback




    //change for feedback branch


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


    //end of change



    function saveDoneIssue(result, auditIssueUserTable) {
        if (result.status == "200") {
            if (result.data.operation == "add") {

                ShowNotification(1, result.message);
                $(".btnSaveIssue").html('Update');
                $("#IssueId").val(result.data.id);

                result.data.operation = "update";

                $("#IssueOperation").val(result.data.operation);

                addListItem(result);

                auditIssueUserTable.ajax.url('/Audit/_indexAuditIssueUser?id=' + result.data.id);

                showUserAuditIssue();

                console.log(result)

            } else {

                addListItem(result);
                ShowNotification(1, result.message);
            }

            $("#fileToUpload").val('');

        }
        else if (result.status == "400") {
            ShowNotification(3, "Something gone wrong");
        }
    }

    function showUserAuditIssue() {
        if ($("#allSectionsIssueUser").is(':hidden') && $("#Id").val() != 0) {
            $("#allSectionsIssueUser").show();
        }
    }

    function saveDoneArea(result) {
        if (result.status == "200") {
            if (result.data.operation == "add") {

                ShowNotification(1, result.message);
                $(".btnSaveArea").html('Update');
                $("#AreaId").val(result.data.id);

                result.data.operation = "update";

                $("#AreaOperation").val(result.data.operation);



            } else {

                ShowNotification(1, result.message);
            }
        }
        else if (result.status == "400") {
            ShowNotification(3, "Something gone wrong");
        }
    }

    //-------------------------------


    //-------------------------------



    function saveDoneFeedback(result) {
        if (result.status == "200") {
            if (result.data.operation == "add") {

                ShowNotification(1, result.message);
                $(".btnSaveFeedback").html('Update');
                $("#feedbackId").val(result.data.id);

                result.data.operation = "update";

                $("#feedbackOperation").val(result.data.operation);


                //change

                showUserAuditIssue();

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
            ShowNotification(3, "Something gone wrong");
        }
    }

    function saveDoneEmail(result) {
        if (result.status == "200") {
            if (result.data.operation == "add") {

                ShowNotification(1, result.message);
                $(".btnSaveAuditUser").html('Update');
                $("#AuditUserId").val(result.data.id);

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

    //-------------------------------

    function onAdd(result, detailTable) {

        var validator = $("#AuditAreas").validate({
            rules: {
                AuditArea: {
                    required: true
                }
            },
            messages: {
                AuditArea: {
                    required: "Audit Area is required."
                }
            }
        });
        var result = validator.form();

        if (!result) {
            return;
        }

        if (!CKEDITOR.instances['AreaDetails'].getData()) {
            ShowNotification(2, "Please Enter Area Details");
            return;
        }



        var form = $("#AuditAreas")[0];
        var formData = new FormData(form);

        formData.set("AreaDetails", encodeBase64(CKEDITOR.instances['AreaDetails'].getData()));


        AuditService.saveArea(formData, saveDoneArea, saveFail);



    }


    function rowEdit(id, Edit) {
        AuditService.auditAreaModal({ Id: id, Edit }, (result) => { onAdd(result, detailTable) }, null, null, () => { detailTable.draw() });

    }


    function onClose() {
        //var json = localStorage.getItem('previousValue');

        //if (json) {
        //    var result = JSON.parse(json);

        //    detailTable.rows.add([
        //        result
        //    ]).draw();


        //    localStorage.setItem('previousValue', null);
        //}
    }


    function rowAdd(detailTable) {

        var result = parseFormModal("#AuditAreas");
        result.AreaDetails = encodeBase64(CKEDITOR.instances['AreaDetails'].getData());

        if (!result.AuditArea) {
            alert('Enter Audit Area Name');
            return;
        }

        if (!result.AreaDetails) {
            alert('Enter Audit Area Details');
            return;

        }

        console.log(result.AreaDetails)

        detailTable.rows.add([
            result
        ]).draw();


        $("#AuditArea").val('');
        CKEDITOR.instances['AreaDetails'].setData('')
    }



    function rowDelete(button, table) {
        table.row(button.parents('tr')).remove().draw();
    }

    function getTableConfig() {

        return {
            serverSide: true,
            "info": false,
            ajax: {
                url: getAreaIndexURL(),
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
                    data: "auditArea",
                    name: "auditArea"

                },
                {
                    data: "areaDetails",
                    name: "areaDetails",
                    "visible": false
                },


                {
                    data: "id",
                    render: function (data) {

                        return "<a  class='edit js-edit' data-id='" + data + "'  ><i class='material-icons' data-toggle='tooltip' title='' data-id='" + data + "' data-original-title='Edit'></i></a>  "

                    },
                    "width": "7%",
                    "orderable": false
                }
            ],

        }
    }

    //issue
    var getIssueTableConfig = function () {

        $('#AuditIssueDetails thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#AuditIssueDetails thead');


        var dataTable = $("#AuditIssueDetails").DataTable({
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
                url: getIssueIndexURL(),
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {

                            //"indexsearch": $("#Branchs").val(),
                            //"branchid": $("#CurrentBranchId").val(),

                            "issuename": $("#md-IssueName").val(),
                            "issuepriority": $("#md-IssuePriority").val(),
                            "dateofsubmission": $("#md-DateOfSubmission").val(),
                            "enddate": $("#md-EndDate").val(),
                            "ispost": $("#md-Post").val()


                            //"description": $("#md-Description").val(),
                            //"ispost": $("#md-Post").val()



                        });
                }
            },

            columns: [
              
                {
                    data: "issueName",
                    name: "IssueName"
                }
                ,
                {
                    data: "issuePriority",
                    name: "IssuePriority"
                }
                ,
                {
                    data: "dateOfSubmission",
                    name: "DateOfSubmission"
                },

                {
                    data: "id",
                    render: function (data) {

                        return "<a   data-id='" + data + "' class='edit issueLineEdit' ><i data-id='" + data + "' class='material-icons' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";



                    },
                    "width": "9%",
                    "orderable": false
                }



            ],

            order: [1, "asc"],


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




        $("#AuditIssueDetails").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });


        $("#AuditIssueDetails").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });


        return dataTable;

    }


    //issue

    //function getIssueTableConfig() {

    //    return {

    //        "processing": true,
    //        serverSide: true,
    //        "info": false,
    //        ajax: {
    //            url: getIssueIndexURL(),
    //            type: 'POST',
    //            data: function (payLoad) {

    //                return $.extend({},
    //                    payLoad,
    //                    {

    //                    });
    //            }
    //        },

    //        columns: [



    //            {
    //                data: "issueName",
    //                name: "IssueName"
    //            }
    //            ,
    //            {
    //                data: "issuePriority",
    //                name: "IssuePriority"
    //            }
    //            ,
    //            {
    //                data: "dateOfSubmission",
    //                name: "DateOfSubmission"
    //            },

    //            {
    //                data: "id",
    //                render: function (data) {


    //                    return "<a   data-id='" + data + "' class='edit issueLineEdit' ><i data-id='" + data + "' class='material-icons' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";

    //                },
    //                "width": "7%",
    //                "orderable": false
    //            },
    //        ],
    //        order: [1, "asc"],

    //    }
    //}





    //feedback

    //var getFeedbackTableConfig = function () {

    //    $('#AuditFeedbackDetails thead tr')
    //        .clone(true)
    //        .addClass('filters')
    //        .appendTo('#AuditFeedbackDetails thead');


    //    var dataTable = $("#AuditFeedbackDetails").DataTable({
    //        orderCellsTop: true,
    //        fixedHeader: true,
    //        serverSide: true,
    //        "processing": true,
    //        "bProcessing": true,
    //        dom: 'lBfrtip',
    //        bRetrieve: true,
    //        searching: false,


    //        buttons: [
    //            {
    //                extend: 'pdfHtml5',
    //                customize: function (doc) {
    //                    doc.content.splice(0, 0, {
    //                        text: ""
    //                    });
    //                },
    //                exportOptions: {
    //                    columns: [1, 2, 3, 4]
    //                }
    //            },
    //            {
    //                extend: 'copyHtml5',
    //                exportOptions: {
    //                    columns: [1, 2, 3, 4]
    //                }
    //            },
    //            {
    //                extend: 'excelHtml5',
    //                exportOptions: {
    //                    columns: [1, 2, 3, 4]
    //                }
    //            },
    //            'csvHtml5'
    //        ],


    //        ajax: {
    //            url: getIssueFeedIndexURL(),
    //            type: 'POST',
    //            data: function (payLoad) {
    //                return $.extend({},
    //                    payLoad,
    //                    {

                            

    //                        //"issuename": $("#md-IssueName").val(),
    //                        //"issuepriority": $("#md-IssuePriority").val(),
    //                        //"dateofsubmission": $("#md-DateOfSubmission").val(),
    //                        //"enddate": $("#md-EndDate").val(),
    //                        //"ispost": $("#md-Post").val()


                            



    //                    });
    //            }
    //        },

    //        columns: [


    //            //{
    //            //    data: "auditName",
    //            //    name: "AuditName"
    //            //},
    //            {
    //                data: "issueName",
    //                name: "IssueName"
    //            },
    //            {
    //                data: "heading",
    //                name: "Heading"
    //            },
    //            {
    //                data: "id",
    //                render: function (data) {

    //                    //return "<a href=/AuditFeedback/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";
    //                    return "<a   data-id='" + data + "' class='edit feedbackLineEdit' ><i data-id='" + data + "' class='material-icons' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";;

    //                },
    //                "width": "7%",
    //                "orderable": false
    //            }


    //        ],

    //        order: [1, "asc"],


    //    });


    //    if (dataTable.columns().eq(0)) {
    //        dataTable.columns().eq(0).each(function (colIdx) {

    //            var cell = $('.filters th').eq($(dataTable.column(colIdx).header()).index());

    //            var title = $(cell).text();


    //            if ($(cell).hasClass('action')) {
    //                $(cell).html('');

    //            } else if ($(cell).hasClass('bool')) {

    //                $(cell).html('<select class="acc-filters filter-input " style="width:100%"  id="md-' + title.replace(/ /g, "") + '"><option>Select</option><option>Y</option><option>N</option></select>');

    //            } else {
    //                $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
    //                    title +
    //                    '"  id="md-' +
    //                    title.replace(/ /g, "") +
    //                    '"/>');
    //            }
    //        });
    //    }



    //    $("#AuditFeedbackDetails").on("change",
    //        ".acc-filters",
    //        function () {

    //            dataTable.draw();

    //        });


    //    $("#AuditFeedbackDetails").on("keyup",
    //        ".acc-filters",
    //        function () {

    //            dataTable.draw();

    //        });


    //    return dataTable;

    //}





    //feedback

    function getFeedbackTableConfig() {

        return {

            "processing": true,
            serverSide: true,
            "info": false,
            ajax: {
                url: getIssueFeedIndexURL(),
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


                //{
                //    data: "auditName",
                //    name: "AuditName"
                //},
                {
                    data: "issueName",
                    name: "IssueName"
                },
                {
                    data: "heading",
                    name: "Heading"
                },
                {
                    data: "id",
                    render: function (data) {

                        //return "<a href=/AuditFeedback/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";
                        return "<a   data-id='" + data + "' class='edit feedbackLineEdit' ><i data-id='" + data + "' class='material-icons' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";;

                    },
                    "width": "7%",
                    "orderable": false
                }

            ],
            order: [1, "asc"],

        }
    }





    //branch feedback
    //var getBranchFeedbackTableConfig = function () {

    //    $('#AuditBranchFeedbackDetails thead tr')
    //        .clone(true)
    //        .addClass('filters')
    //        .appendTo('#AuditBranchFeedbackDetails thead');


    //    var dataTable = $("#AuditBranchFeedbackDetails").DataTable({
    //        orderCellsTop: true,
    //        fixedHeader: true,
    //        serverSide: true,
    //        "processing": true,
    //        "bProcessing": true,
    //        dom: 'lBfrtip',
    //        bRetrieve: true,
    //        searching: false,


    //        buttons: [
    //            {
    //                extend: 'pdfHtml5',
    //                customize: function (doc) {
    //                    doc.content.splice(0, 0, {
    //                        text: ""
    //                    });
    //                },
    //                exportOptions: {
    //                    columns: [1, 2, 3, 4]
    //                }
    //            },
    //            {
    //                extend: 'copyHtml5',
    //                exportOptions: {
    //                    columns: [1, 2, 3, 4]
    //                }
    //            },
    //            {
    //                extend: 'excelHtml5',
    //                exportOptions: {
    //                    columns: [1, 2, 3, 4]
    //                }
    //            },
    //            'csvHtml5'
    //        ],


    //        ajax: {
    //            url: getIssueBranchFeedIndexURL(),
    //            type: 'POST',
    //            data: function (payLoad) {
    //                return $.extend({},
    //                    payLoad,
    //                    {



    //                        "issuename": $("#md-IssueName").val(),
    //                        "issuepriority": $("#md-IssuePriority").val(),
    //                        "dateofsubmission": $("#md-DateOfSubmission").val(),
    //                        "enddate": $("#md-EndDate").val(),
    //                        "ispost": $("#md-Post").val()






    //                    });
    //            }
    //        },

    //        columns: [


    //            {
    //                data: "issueName",
    //                name: "IssueName"
    //            },
    //            {
    //                data: "heading",
    //                name: "Heading"
    //            },
    //            {
    //                data: "id",
    //                render: function (data) {


    //                    return "<a   data-id='" + data + "' class='edit BranchfeedbackLineEdit' ><i data-id='" + data + "' class='material-icons' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";

    //                },
    //                "width": "7%",
    //                "orderable": false
    //            }



    //        ],

    //        order: [1, "asc"],


    //    });


    //    if (dataTable.columns().eq(0)) {
    //        dataTable.columns().eq(0).each(function (colIdx) {

    //            var cell = $('.filters th').eq($(dataTable.column(colIdx).header()).index());

    //            var title = $(cell).text();


    //            if ($(cell).hasClass('action')) {
    //                $(cell).html('');

    //            } else if ($(cell).hasClass('bool')) {

    //                $(cell).html('<select class="acc-filters filter-input " style="width:100%"  id="md-' + title.replace(/ /g, "") + '"><option>Select</option><option>Y</option><option>N</option></select>');

    //            } else {
    //                $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
    //                    title +
    //                    '"  id="md-' +
    //                    title.replace(/ /g, "") +
    //                    '"/>');
    //            }
    //        });
    //    }




    //    $("#AuditBranchFeedbackDetails").on("change",
    //        ".acc-filters",
    //        function () {

    //            dataTable.draw();

    //        });


    //    $("#AuditBranchFeedbackDetails").on("keyup",
    //        ".acc-filters",
    //        function () {

    //            dataTable.draw();

    //        });


    //    return dataTable;

    //}



    //branch feedback

    function getBranchFeedbackTableConfig() {

        return {

            "processing": true,
            serverSide: true,
            "info": false,
            ajax: {
                url: getIssueBranchFeedIndexURL(),
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


                //{
                //    data: "auditName",
                //    name: "AuditName"
                //},
                {
                    data: "issueName",
                    name: "IssueName"
                },
                {
                    data: "heading",
                    name: "Heading"
                },
                {
                    data: "id",
                    render: function (data) {

                        //return "<a href=/AuditFeedback/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";
                        return "<a   data-id='" + data + "' class='edit BranchfeedbackLineEdit' ><i data-id='" + data + "' class='material-icons' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";;

                    },
                    "width": "7%",
                    "orderable": false
                }

            ],
            order: [1, "asc"],

        }
    }





    function getAuditUserTableConfig() {

        return {

            "processing": true,
            serverSide: true,
            "info": false,
            ajax: {
                url: getUserIndexURL(),
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

                        return "<a   data-id='" + data + "' class='edit auditEdit' ><i data-id='" + data + "' class='material-icons' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";;

                    },
                    "width": "7%",
                    "orderable": false
                }

            ],
            order: [1, "asc"],

        }
    }



    var GetIndexTable = function () {

        $('#AuditList thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#AuditList thead');


        var dataTable = $("#AuditList").DataTable({
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
                url: '/Audit/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {

                            //"indexsearch": $("#Branchs").val(),
                            //"branchid": $("#CurrentBranchId").val(),

                             "code": $("#md-Code").val(),
                             "name": $("#md-Name").val(),
                             "startdate": $("#md-StartDate").val(),
                             "enddate": $("#md-EndDate").val(),
                             "ispost": $("#md-Post").val()


                            //"description": $("#md-Description").val(),
                            //"ispost": $("#md-Post").val()


                          
                        });
                }
            },

            columns: [

                {
                    data: "id",
                    render: function (data) {

                        return "<a href=/Audit/Edit/" + data + "?edit=audit class='edit btn btn-primary btn-sm' ><i class='fas fa-pencil-alt  ' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  "
                            + " <a href=/Audit/Edit/" + data + "?edit=issue class=' btn btn-primary btn-sm' ><i class='fas fa-file-invoice' data-toggle='tooltip' title='' data-original-title='Issue'></i></a>  "
                            + " <a href=/Audit/Edit/" + data + "?edit=feedback class=' btn btn-primary btn-sm' ><i class='fas fa-align-justify' data-toggle='tooltip' title='' data-original-title='Feedback'></i></a>  "


                            + "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"


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
                    data: "startDate",
                    name: "StartDate"
                }
                ,
                {
                    data: "endDate",
                    name: "EndDate"
                }
                ,
                {
                    data: "isPost",
                    name: "IsPost"
                }


            ],

            order: [1, "asc"],


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




        $("#AuditList").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });


        $("#AuditList").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });


        return dataTable;

    }



    //function GetIndexTable() {
    //    return {

    //        "processing": true,
    //        serverSide: true,

    //        ajax: {
    //            url: '/Audit/_index',
    //            type: 'POST',
    //            data: function (payLoad) {

    //                return $.extend({},
    //                    payLoad,
    //                    {

    //                    });
    //            }
    //        },

    //        columns: [
    //            {
    //                data: "id",
    //                render: function (data) {

    //                    return "<a href=/Audit/Edit/" + data + "?edit=audit class='edit btn btn-primary btn-sm' ><i class='fas fa-pencil-alt  ' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  "
    //                        + " <a href=/Audit/Edit/" + data + "?edit=issue class=' btn btn-primary btn-sm' ><i class='fas fa-file-invoice' data-toggle='tooltip' title='' data-original-title='Issue'></i></a>  "
    //                        + " <a href=/Audit/Edit/" + data + "?edit=feedback class=' btn btn-primary btn-sm' ><i class='fas fa-align-justify' data-toggle='tooltip' title='' data-original-title='Feedback'></i></a>  "


    //                        + "<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"


    //                        ;;

    //                },
    //                "width": "10%",
    //                "orderable": false
    //            },
    //            {
    //                data: "code",
    //                name: "Code"
    //            }
    //            ,
    //            {
    //                data: "name",
    //                name: "Name"
    //            }
    //            ,
    //            {
    //                data: "startDate",
    //                name: "StartDate"
    //            }
    //            ,
    //            {
    //                data: "endDate",
    //                name: "EndDate"
    //            }
    //            ,


    //            {
    //                data: "isPost",
    //                name: "IsPost"
    //            }



    //        ],
    //        order: [1, "asc"],

    //    }
    //}




    function Save(table) {
        debugger;
        var masterObj = $("#frm_Audit").serialize();
        //var details = table.rows().data().toArray();
        masterObj = queryStringToObj(masterObj);
        debugger;
        masterObj.Remarks = encodeBase64(CKEDITOR.instances['Remarks'].getData());

        //masterObj.AuditAreas = details;

        masterObj.IsPlaned = $('#IsPlaned').is(":checked");

        var validator = $("#frm_Audit").validate();
        var result = validator.form();

        //if (details.length < 1) {
        //    ShowNotification(2, "Please add line items");
        //    return;
        //}

        if (!result) {
            ShowNotification(2, "Please complete the form");
            return;
        }

        AuditService.save(masterObj, saveDone, saveFail);

    }


    function saveDone(result) {
        if (result.status == "200") {
            if (result.data.operation == "add") {
                console.log(result)


                ShowNotification(1, result.message);
                $(".btnSave").html('Update');
                $("#Id").val(result.data.id);
                $("#Code").val(result.data.code);


                result.data.operation = "update";

                $("#Operation").val(result.data.operation);

                //change

                //$(".btnSave").addClass('sslUpdate');
                $("#divUpdate").show();
                $("#divSave").hide();
                $("#SavePost").show();


                //end



                detailIssueTable.ajax.url(getIssueIndexURL());
                detailFeedbackTable.ajax.url(getIssueFeedIndexURL());
                detailTable.ajax.url(getAreaIndexURL());
                auditUserTable.ajax.url(getUserIndexURL());

                showSections();
                getUserIndexURL();
                



            } else {
                ShowNotification(1, result.message);


                //change
                $("#divSave").hide();
                $("#divUpdate").show();
                //end

            }
        }
        else if (result.status == "400") {
            //ShowNotification(3, "Something gone wrong");
            ShowNotification(3, result.message || result.error);
        }
    }

    function saveFail(result) {
        console.log(result);
        ShowNotification(3, "Something gone wrong");
    }



    //change


    $('.btnPost').click('click', function () {

        Confirmation("Are you sure? Do You Want to Post Data?", function (result) {
            console.log(result);
            if (result) {


                var audit = serializeInputs("frm_Audit");
                if (audit.IsPost == "Y") {
                    ShowNotification(3, "Data has already been Posted.");
                }
                else {
                    audit.IDs = audit.Id;
                    AuditService.AuditMultiplePost(audit, AuditMultiplePosts, AuditMultiplePostFail);
                }
            }
        });

    });

    function AuditMultiplePosts(result) {
        console.log(result.message);

        if (result.status == "200") {

            ShowNotification(1, result.message);

            $("#IsPost").val('Y');

            $(".btnUnPost").show();
            $(".btnReject").show();
            $(".btnApproved").show();


            $(".btnPush").show();




            var dataTable = $('#AuditList').DataTable();
            dataTable.draw();




        }
        else if (result.status == "400") {
            ShowNotification(3, result.message);
        }
        else if (result.status == "199") {
            ShowNotification(3, result.message);
        }
    }

    function AuditMultiplePostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#AuditList').DataTable();
        dataTable.draw();

    }




    $('.Submit').click('click', function () {


        ReasonOfUnPost = $("#UnPostReason").val();

        var audit = serializeInputs("frm_Audit");

        audit["ReasonOfUnPost"] = ReasonOfUnPost;

        Confirmation("Are you sure? Do You Want to UnPost Data?", function (result) {
            if (ReasonOfUnPost === "" || ReasonOfUnPost === null) {
                ShowNotification(3, "Please Write down Reason Of UnPost");
                $("#ReasonOfUnPost").focus();
                return;
            }

            if (result) {


                audit.IDs = audit.Id;
                AuditService.AuditMultipleUnPost(audit, AuditMultipleUnPost, AuditMultipleUnPostFail);


            }
        });
    });

    function AuditMultipleUnPost(result) {
        console.log(result.message);

        if (result.status == "200") {
            ShowNotification(1, result.message);
            $("#IsPost").val('N');
            $("#divReasonOfUnPost").hide();
            $(".btnUnPost").hide();
            $(".btnReject").hide();
            $(".btnApproved").hide();

            var dataTable = $('#AuditList').DataTable();

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

    function AuditMultipleUnPostFail(result) {
        ShowNotification(3, "Something gone wrong");
        var dataTable = $('#AuditList').DataTable();

        dataTable.draw();
    }





    //end








    var deleteIssueFile = function deleteFile(fileId, filePath) {

        AuditIssueService.deleteFile({ id: fileId, filePath: filePath }, (result) => {


            if (result.status == "200") {
                $("#file-" + fileId).remove();

                ShowNotification(1, result.message);
            }
            else if (result.status == "400") {
                ShowNotification(3, result.message);
            }



        }, saveFail);

    };




    var deleteFeedbackFile = function deleteFile(fileId, filePath) {

        AuditFeedbackService.deleteFile({ id: fileId, filePath: filePath }, (result) => {


            if (result.status == "200") {
                $("#file-" + fileId).remove();

                ShowNotification(1, result.message);
            }
            else if (result.status == "400") {
                ShowNotification(3, result.message);
            }



        }, saveFail);

    };


    //change for branch

    var deleteBranchFeedbackFile = function deleteFileBranch(fileId, filePath) {

        AuditFeedbackService.deleteFileBranch({ id: fileId, filePath: filePath }, (result) => {


            if (result.status == "200") {
                $("#file-" + fileId).remove();

                ShowNotification(1, result.message);
            }
            else if (result.status == "400") {
                ShowNotification(3, result.message);
            }



        }, saveFail);

    };



    return {
        init: init, deleteIssueFile, deleteFeedbackFile, deleteBranchFeedbackFile
    }

}(AuditService, AuditIssueService, AuditFeedbackService);