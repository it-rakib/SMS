var UserProfileController = function (CommonService,UserProfileService) {

    var init = function () {

       
    
        var indexTable = BpTable();


        $("#btnAdd").on("click", function () {

            rowAdd(detailTable);

        });

        $('#Post').on('click', function () {

            SelectData(true);

        });

    

        $("#ModalButtonCloseFooter").click(function () {
            addPrevious(detailTable);
        });


        $("#ModalButtonCloseHeader").click(function () {
            addPrevious(detailTable);
        });

        $('.btn-SageUserName').on('click', function () {
            var originalRef = $(this);
            CommonService.sageUserNameModal({}, fail, function (row) { modalUserIdDblClick(row, originalRef) });

        });
       



        $('.btnsave').click('click', function () {
            save();
        });

        $("#indexSearch").click(function () {
            indexTable.draw();
        });

       

        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });


    }


    var BpTable = function () {

        $('#userProfileLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#userProfileLists thead');


        var dataTable = $("#userProfileLists").DataTable({
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
                url: '/UserProfile/_index',
                type: 'POST',

                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "UserName": $("#md-UserName").val(),



                        });
                }
            },
            columns: [

                {
                    data: "id",
                    render: function (data) {
                       
                        return "<a href='/UserProfile/Profile/" + data + "' class='edit' title='Edit'><i class='fas fa-pencil-alt'></i></a>&nbsp;&nbsp;&nbsp;" +

                            "<a href='/UserProfile/Edit/" + data + "' class='edit' title='Change Password'><i class='fas fa-key'></i></a>&nbsp;&nbsp;&nbsp;" +

                            "<a href='/UserBranch/Index/" + data + "' class='edit' title='Branch'><i class='fas fa-building''></i></a>";

                               /* "<a href='/BranchProfile/Profile/" + data + "' class='edit' title='Branch Profile'><i class='fas fa-building'></i></a>";*/
                          },
                    "width": "8%",
                    "orderable": false
                }
                ,
                {
                    data: "userName",
                    name: "UserName"
                    //"width": "20%"
                }
               
                //,
                //{
                //    data: "branchName",
                //    name: "BranchName"
                //    //"width": "20%"
                //}
                


            ]

        });



        if (dataTable.columns().eq(0)) {
            dataTable.columns().eq(0).each(function (colIdx) {
                // Set the header cell to contain the input element
                var cell = $('.filters th').eq($(dataTable.column(colIdx).header()).index());

                var title = $(cell).text();

                // Check if the current header cell has a class of "action"
                if ($(cell).hasClass('action')) {
                    $(cell).html(''); // Set the content of the header cell to an empty string
                } else {
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');
                }
            });

        }

        $("#userProfileLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }

    function modalUserIdDblClick(row, originalRow) {

        var userId = row.find("td:first").text();
        

        originalRow.closest("div.input-group").find("input").val(userId);
        originalRow.closest("div.input-group").find("input").focus();

        $("#sageUserNameModal").modal("hide");

    }


    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }


    function save() {

        var validator = $("#frm_user").validate();
        var companyInfo = serializeInputs("frm_user");

        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }
        
        UserProfileService.save(companyInfo, saveDone, saveFail);
    }
    function saveDone(result) {

        if (result.status == "200") {
            if (result.data.operation == "add") {
                ShowNotification(1, result.message);
                $(".btnsave").html('Update');
                $(".btnsave").addClass('sslUpdate');
                $("#Id").val(result.data.id);
                $("#Code").val(result.data.code);
                result.data.operation = "update";
                $("#Operation").val(result.data.operation);

                setTimeout(function () {
                    window.location.href = "/UserProfile/Index";
                }, 3000);
             
            } else {
                ShowNotification(1, result.message);
            }
        }
        else if (result.status == "400") {
            ShowNotification(3, result.error); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(2, result.message); // <-- display the error message here
        }
        else if (result.status == "0") {
            ShowNotification(2, result.message); // <-- display the error message here
        }

    }

   



    function saveFail(result) {
        console.log(result);
        ShowNotification(3, "Something Gone Wrong");
    }









    return {
        init: init
    }


}(CommonService, UserProfileService);
   