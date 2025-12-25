var IssueApproveStatusService = function () {

    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };


    var AuditMultipleRejectData = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/MultipleReject',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };


    var AuditMultipleApprovedData = function (masterObj, done, fail) {

        $.ajax({
            url: '/Audit/MultipleApproved',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
   






    return {
        save: save,
        AuditMultipleRejectData: AuditMultipleRejectData,
        AuditMultipleApprovedData: AuditMultipleApprovedData
     
    
    }
}();