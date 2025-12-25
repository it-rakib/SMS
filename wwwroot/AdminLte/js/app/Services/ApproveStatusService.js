var ApproveStatusService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Tours/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };

    var ToursMultipleRejectData = function (masterObj, done, fail) {

        $.ajax({
            url: '/Tours/MultipleReject',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };


    var ToursMultipleApprovedData = function (masterObj, done, fail) {

        $.ajax({
            url: '/Tours/MultipleApproved',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
   






    return {
        save: save,
        ToursMultipleRejectData: ToursMultipleRejectData,
        ToursMultipleApprovedData: ToursMultipleApprovedData
     
    
    }
}();