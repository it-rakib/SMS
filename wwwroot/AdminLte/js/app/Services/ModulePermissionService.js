var ModulePermissionService = function () {

    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/ModulePermission/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };



    return {
        save: save
 
    }
}();