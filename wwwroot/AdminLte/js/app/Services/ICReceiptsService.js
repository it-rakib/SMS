var ICReceiptsService = function () {

    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Receipt/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };

    var ItemNocall = function (masterObj, done, fail) {
        var encodedMasterObj = encodeURIComponent(masterObj);
        $.ajax({
            url: '/Receipt/Acc?AccountNo=' + encodedMasterObj,
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };

    var LocationNocall = function (masterObj, done, fail) {
        var encodedMasterObj = encodeURIComponent(masterObj);
        $.ajax({
            url: '/Receipt/Loc?AccountNo=' + encodedMasterObj,
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };
    var VendorNocall = function (masterObj, done, fail) {

        var encodedMasterObj = encodeURIComponent(masterObj);

        $.ajax({
            url: '/Receipt/Ven?AccountNo=' + encodedMasterObj,
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };
    


    var ICRMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Receipt/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var ICRMultiplePush = function (masterObj, done, fail) {

        $.ajax({
            url: '/Receipt/MultiplePush',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var ICRMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Receipt/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };

    

    return {

        save: save,
        ICRMultiplePost: ICRMultiplePost,
        ICRMultiplePush: ICRMultiplePush,
        ItemNocall: ItemNocall,
        LocationNocall: LocationNocall,
        VendorNocall: VendorNocall,
        ICRMultipleUnPost: ICRMultipleUnPost

    }

}();