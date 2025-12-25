var TransportSelfApproveStatusService = function () {
 

    var TransportMultipleRejectData = function (masterObj, done, fail) {

        $.ajax({
            url: '/TransportAllownaces/MultipleReject',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };


    var TransportMultipleApprovedData = function (masterObj, done, fail) {

        $.ajax({
            url: '/TransportAllownaces/MultipleApproved',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
   






    return {
       
        TransportMultipleRejectData: TransportMultipleRejectData,
        TransportMultipleApprovedData: TransportMultipleApprovedData
     
    
    }
}();