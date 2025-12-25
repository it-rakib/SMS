var AuditIssueController = function (AuditIssueService) {
    var init = function (param) {

        //if ($("#AuditId").length) {
        //    LoadCombo("AuditId", '/Common/GetAuditName');
        //}

        if ($("#IssuePriority").length) {
            LoadCombo("IssuePriority", '/Common/GetIssuePriority');
        }

        $(".btnSave").on("click", function () {

            Save();

        });



        if ($("#AuditIssueList").length) {
            var tableConfigs = GetIndexTable(param)
            detailTable = $("#AuditIssueList").DataTable(tableConfigs);
        }

    }


    function GetIndexTable(param) {
        return {

            "processing": true,
            serverSide: true,

            ajax: {
                url: '/AuditIssue/_index?id=' + param.auditId,
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
                    data: "id",
                    render: function (data) {

                        return "<a href=/AuditIssue/Edit/" + data + " class='edit' ><i class='editIcon' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  ";

                    },
                    "width": "7%",
                    "orderable": false
                },
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
                }
            ],
            order: [1, "asc"],

        }
    }



    function Save() {

        var validator = $("#frm_Audit").validate();
        var result = validator.form();

        if (!result) {
            ShowNotification(2, "Please complete the form");
            return;
        }

        var form = $("#frm_Audit")[0];
        var formData = new FormData(form);

        AuditIssueService.save(formData, saveDone, saveFail);

    }

    function addListItem(result) {
        var list = $(".fileGroup");

        result.data.attachmentsList.forEach(function (item) {

            var item = '<li class="list-group-item" id="file-' + item.id + '"> <span>' +
                item.displayName +
                '</span><a target="_blank" href="/AuditIssue/DownloadFile?filePath=' + item.fileName + '" class=" ml-2 btn btn-primary btn-sm float-right ml-2">Download</a>' +
                '<button onclick="AuditIssueController.deleteFile(\'' + item.id + '\', \'' + item.fileName + '\')" class=" ml-2 btn btn-danger btn-sm float-right" type="button">Delete</button>' +
                '</li>';

            list.append(item);
        });
    }


    function saveDone(result) {
        if (result.status == "200") {
            if (result.data.operation == "add") {

                ShowNotification(1, result.message);
                $(".btnSave").html('Update');
                $("#Id").val(result.data.id);
       
                result.data.operation = "update";

                $("#Operation").val(result.data.operation);

                addListItem(result);


            } else {

                addListItem(result);
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



    var deleteFile = function deleteFile (fileId, filePath) {

        AuditIssueService.deleteFile({ id: fileId, filePath: filePath }, (result) => {


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

}(AuditIssueService);