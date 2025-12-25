var AdvancesService = function () {


    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Advances/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };

    var AdvancesMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Advances/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    //var ICRMultiplePost = function (masterObj, done, fail) {

    //    $.ajax({
    //        url: '/Receipt/MultiplePost',
    //        method: 'post',
    //        data: masterObj

    //    })
    //        .done(done)
    //        .fail(fail);


    //};
    var AdvancesMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Advances/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };




    return {
        save: save,
        AdvancesMultiplePost : AdvancesMultiplePost,
        AdvancesMultipleUnPost: AdvancesMultipleUnPost

    }
}();