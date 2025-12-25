var TeamsService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Teams/CreateEdit',
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