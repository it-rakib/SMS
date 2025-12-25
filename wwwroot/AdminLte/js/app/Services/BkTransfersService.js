
﻿var BkTransfersService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/BkTransfers/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };

     var APMultiplePost = function (masterObj, done, fail) {

         $.ajax({
             url: '/BkTransfers/MultiplePost',
             method: 'post',
             data: masterObj

         })
             .done(done)
             .fail(fail);


     };


     var APMultiplePush = function (masterObj, done, fail) {

         $.ajax({
             url: '/BkTransfers/MultiplePush',
             method: 'post',
             data: masterObj

         })
             .done(done)
             .fail(fail);


     };

     var BKMultipleUnPost = function (masterObj, done, fail) {

         $.ajax({
             url: '/BkTransfers/MultipleUnPost',
             method: 'post',
             data: masterObj

         })
             .done(done)
             .fail(fail);


     };




     return {
         save: save,
         APMultiplePost: APMultiplePost,
         APMultiplePush: APMultiplePush,
         BKMultipleUnPost: BKMultipleUnPost
     }
}();