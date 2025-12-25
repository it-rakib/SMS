var AdvanceApproveStatusService = function () {
 

    var AdvanceMultipleRejectData = function (masterObj, done, fail) {

        $.ajax({
            url: '/Advances/MultipleReject',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };


    var AdvancesMultipleApprovedData = function (masterObj, done, fail) {

        $.ajax({
            url: '/Advances/MultipleApproved',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
   






    return {
       
        AdvanceMultipleRejectData: AdvanceMultipleRejectData,
        AdvancesMultipleApprovedData: AdvancesMultipleApprovedData
     
    
    }
}();