var TransportAllownacesService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/TransportAllownaces/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };

    var TransportAllownacesMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/TransportAllownaces/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };

    var TransportAllownacesMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/TransportAllownaces/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };




    return {
        save: save,
        TransportAllownacesMultipleUnPost: TransportAllownacesMultipleUnPost,
        TransportAllownacesMultiplePost: TransportAllownacesMultiplePost
    
    }
}();