var ICTransfersService = function () {

    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Transfer/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };

    var ICTMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Transfer/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var ICTMultiplePush = function (masterObj, done, fail) {

        $.ajax({
            url: '/Transfer/MultiplePush',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var ICTMultipleReceive = function (masterObj, done, fail) {

        $.ajax({
            url: '/Transfer/MultipleReceive',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var ItemNocall = function (masterObj, done, fail) {

         //var masterObj = encodeURIComponent(masterObj);


        $.ajax({
            url: '/Transfer/Acc?AccountNo=' + encodeURIComponent(masterObj),
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };

    var LocationNocall = function (masterObj, done, fail) {
        var encodedMasterObj = encodeURIComponent(masterObj);
        $.ajax({
            url: '/Transfer/Loc?AccountNo=' + encodedMasterObj,
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };
    var ICTMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Transfer/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };

    return {

        save: save,
        ICTMultiplePost: ICTMultiplePost,
        ICTMultiplePush: ICTMultiplePush,
        ICTMultipleReceive: ICTMultipleReceive,
        ItemNocall: ItemNocall,
        LocationNocall: LocationNocall,
        ICTMultipleUnPost: ICTMultipleUnPost
   

    }

}();