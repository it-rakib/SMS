var InventoryTransfersService = function () {

    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Transfer/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };


    return {
        save: save

    }

}();