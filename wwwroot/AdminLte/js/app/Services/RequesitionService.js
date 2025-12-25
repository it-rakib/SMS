var RequesitionService = function () {


    var RequisitionMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Requesition/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };


    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Requesition/CreateEdit',
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



    var REQMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/Requesition/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };



    var REQMultiplePush = function (masterObj, done, fail) {

        $.ajax({
            url: '/Requesition/MultiplePush',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };



    return {

        save: save,
        REQMultiplePost: REQMultiplePost,
        REQMultiplePush: REQMultiplePush,
        ItemNocall: ItemNocall,
        LocationNocall: LocationNocall,
        VendorNocall: VendorNocall,
        RequisitionMultipleUnPost: RequisitionMultipleUnPost

    }

}();