var ModuleService = function () {

    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Module/CreateEdit',
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