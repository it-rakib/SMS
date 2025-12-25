var CalenderService = function () {


    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/CalenderEntry/CreateEdit',
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