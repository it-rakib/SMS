
﻿var ICShipmentsService = function () {

    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Shipment/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

     };
     var ICSMultiplePost = function (masterObj, done, fail) {

         $.ajax({
             url: '/Shipment/MultiplePost',
             method: 'post',
             data: masterObj

         })
             .done(done)
             .fail(fail);


     };
     var ICSMultiplePush = function (masterObj, done, fail) {

         $.ajax({
             url: '/Shipment/MultiplePush',
             method: 'post',
             data: masterObj

         })
             .done(done)
             .fail(fail);


     };

     var ItemNocall = function (masterObj, done, fail) {

         //var masterObj = encodeURIComponent(masterObj);


         $.ajax({
             url: '/Shipment/Acc?AccountNo=' + encodeURIComponent(masterObj),
             method: 'get',
         })
             .done(done)
             .fail(fail);


     };

     var ICSMultipleUnPost = function (masterObj, done, fail) {

         $.ajax({
             url: '/Shipment/MultipleUnPost',
             method: 'post',
             data: masterObj

         })
             .done(done)
             .fail(fail);


     };


     return {

        save: save,
        ICSMultiplePost: ICSMultiplePost,
        ICSMultiplePush: ICSMultiplePush,
         ItemNocall: ItemNocall,
         ICSMultipleUnPost: ICSMultipleUnPost

    }

}();