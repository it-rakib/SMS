var PurchaseInvoiceService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseInvoice/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var POIMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseInvoice/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var POIMultiplePush = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseInvoice/MultiplePush',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };

    var ItemNocall = function (masterObj, done, fail) {

        //var masterObj = encodeURIComponent(masterObj);


        $.ajax({
            url: '/PurchaseInvoice/Acc?AccountNo=' + encodeURIComponent(masterObj),
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };

    var LocationNocall = function (masterObj, done, fail) {
        var encodedMasterObj = encodeURIComponent(masterObj);
        $.ajax({
            url: '/PurchaseInvoice/Loc?AccountNo=' + encodedMasterObj,
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };
    var POIMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseInvoice/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };

    return {
        save: save,
        POIMultiplePost: POIMultiplePost,
        POIMultiplePush: POIMultiplePush,
        ItemNocall: ItemNocall,
        LocationNocall: LocationNocall,
        POIMultipleUnPost: POIMultipleUnPost
    }


}();