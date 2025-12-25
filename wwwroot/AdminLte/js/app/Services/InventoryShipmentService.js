var InventoryShipmentService = function () {

    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Shipment/CreateEdit',
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