var CircularsService = function () {


    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Circulars/CreateEdit',
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
            url: '/Circulars/DeleteFile',
            type: 'POST',
            data: obj,
        })
            .done(done)
            .fail(fail);

    };




    return {
        save, deleteFile
       

    }
}();