var POPurchaseOrdersService = function () {

    var POrderMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseOrder/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };



    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseOrder/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };


  


    var POMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseOrder/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var POMultiplePush = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseOrder/MultiplePush',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var ItemNocall = function (masterObj, done, fail) {

        $.ajax({
            url: '/PurchaseOrder/Acc?AccountNo=' + masterObj,
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };
    var LocationNocall = function (masterObj, done, fail) {
        var encodedMasterObj = encodeURIComponent(masterObj);
        $.ajax({
            url: '/PurchaseOrder/Loc?AccountNo=' + encodedMasterObj,
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };





    return {
        save: save,
        POMultiplePost: POMultiplePost,
        POMultiplePush: POMultiplePush,
        ItemNocall: ItemNocall,
        LocationNocall: LocationNocall,
        POrderMultipleUnPost: POrderMultipleUnPost
       

    }

}();