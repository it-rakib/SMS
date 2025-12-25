var POReceiptsServices = function () {

    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseReceipt/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };
    var APMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseReceipt/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var PORMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseReceipt/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };


    var APMultiplePush = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseReceipt/MultiplePush',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };



    var ItemNocall = function (masterObj, done, fail) {

        //var masterObj = encodeURIComponent(masterObj);


        $.ajax({
            url: '/PurchaseReceipt/Acc?AccountNo=' + encodeURIComponent(masterObj),
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };

    var LocationNocall = function (masterObj, done, fail) {
        var encodedMasterObj = encodeURIComponent(masterObj);
        $.ajax({
            url: '/PurchaseReceipt/Loc?AccountNo=' + encodedMasterObj,
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };


    return {
        save: save,
        APMultiplePost: APMultiplePost,
        APMultiplePush: APMultiplePush,
        ItemNocall: ItemNocall,
        LocationNocall: LocationNocall,
        PORMultipleUnPost: PORMultipleUnPost
    }

    //return {
    //    save: save

    //}

}();