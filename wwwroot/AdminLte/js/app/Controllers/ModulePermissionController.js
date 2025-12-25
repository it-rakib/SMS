var ModulePermissionController = function (CommonService, ModulePermissionService) {



    var init = function () {


        if ($("#UserId").length) {
            LoadCombo("UserId", '/Common/UserId');
        }
        if ($("#ModuleName").length) {
            LoadCombo("ModuleName", '/Common/GetModuleName');
        }

        var indexTable = ModulePermissionTable();


        $(".btnsave").click(function () {
            save();
        });


    }

    /*init end*/




    function save() {


        var validator = $("#frm_ModulePermission").validate();
        var modulePermission = serializeInputs("frm_ModulePermission");

        var result = validator.form();

        var isActive = $("#IsActive").is(":checked");
        modulePermission.IsActive = isActive;

        var selectElement = document.getElementById('ModuleName');
        var selectedOption = selectElement.options[selectElement.selectedIndex];
        var selectedValue = selectedOption.value;
        var selectedText = selectedOption.textContent;

        modulePermission.Modul = selectedText;





        if (!result) {
            validator.focusInvalid();
            return;
        }

        ModulePermissionService.save(modulePermission, saveDone, saveFail);


    }

    function saveDone(result) {
        debugger
        if (result.status == "200") {
            if (result.data.operation == "add") {


                ShowNotification(1, result.message);
                $(".btnsave").html('Update');
                $(".btnSave").addClass('sslUpdate');
                $("#Id").val(result.data.id);
                result.data.operation = "update";
                $("#Operation").val(result.data.operation);







            } else {
                ShowNotification(1, result.message);


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



    var ModulePermissionTable = function () {

        $('#ModulePermissionList thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#ModulePermissionList thead');


        var dataTable = $("#ModulePermissionList").DataTable({
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
                url: '/ModulePermission/_index/',
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

                        return "<a href=/ModulePermission/Edit/" + data + " class='edit btn btn-primary btn-sm' ><i class='fas fa-pencil-alt  ' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>  "


                            //"<input onclick='CheckAll(this)' class='dSelected' type='checkbox' data-Id=" + data + " >"

                            //"<a href='/TeamMembers/Index/" + data + "' class='edit' title='Member'><i class='fas fa-building''></i></a>"

                            ;


                    },
                    "width": "9%",
                    "orderable": false
                },
                {
                    data: "userName",
                    name: "UserName"

                }
                ,
                {
                    data: "modul",
                    name: "Modul"

                },
                {
                    data: "isActive",
                    name: "IsActive"

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




        $("#ModuleList").on("change",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
        $("#ModuleList").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }





    return {
        init: init
    }


}(CommonService, ModulePermissionService);