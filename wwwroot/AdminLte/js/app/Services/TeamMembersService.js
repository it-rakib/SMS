var TeamMembersService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/TeamMembers/CreateEdit',
            method: 'post',
            //data: masterObj,id
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };
    return {
        save: save,

    }
}();