
﻿var APPaymentsService = function () {


    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/APPayments/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

     };
     var saveBatch = function (masterObj, done, fail) {

         $.ajax({
             url: '/APPaymentBatchList/CreateEdit',
             method: 'post',
             data: masterObj

         })
             .done(done)
             .fail(fail);


     };

     var APMultiplePost  = function (masterObj, done, fail) {

         $.ajax({
             url: '/APPayments/MultiplePost',
             method: 'post',
             data: masterObj

         })
             .done(done)
             .fail(fail);


     };


     var APMultiplePush = function (masterObj, done, fail) {

         $.ajax({
             url: '/APPayments/MultiplePush',
             method: 'post',
             data: masterObj

         })
             .done(done)
             .fail(fail);


     };

     var APMultipleUnPost = function (masterObj, done, fail) {

         $.ajax({
             url: '/APPayments/MultipleUnPost',
             method: 'post',
             data: masterObj

         })
             .done(done)
             .fail(fail);


     };

  

    return {
        save: save,
        saveBatch: saveBatch,
        APMultiplePost: APMultiplePost,
        APMultiplePush: APMultiplePush,
        APMultipleUnPost: APMultipleUnPost
    }

}();