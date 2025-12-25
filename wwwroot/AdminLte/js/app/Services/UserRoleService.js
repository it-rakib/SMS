var UserRoleService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/UserRole/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };
    return {
        save: save,

    }
}();