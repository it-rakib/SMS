var OragnogramService = function () {


    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/OragnogramEntry/CreateEdit',
            method: 'post',
            data: masterObj,

             processData: false,
            contentType: false,

        })
            .done(done)
            .fail(fail);

    };

    var deleteFile = function (obj, done, fail) {

        $.ajax({
            url: '/OragnogramEntry/DeleteFile',
            type: 'POST',
            data: obj,
        })
            .done(done)
            .fail(fail);

    };

    //var save = function (masterObj, done, fail) {

    //    $.ajax({
    //        url: '/OragnogramEntry/CreateEdit',
    //        method: 'post',
    //        data: masterObj

        

    //    })
    //        .done(done)
    //        .fail(fail);

    //};



    return {
        //save: save
        save, deleteFile


    }
}();