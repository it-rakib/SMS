var ToursService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Tours/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };

    var ToursMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Tours/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
   
    var ToursMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Tours/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };





    return {
        save: save,
        ToursMultipleUnPost: ToursMultipleUnPost,
        ToursMultiplePost: ToursMultiplePost
    
    }
}();