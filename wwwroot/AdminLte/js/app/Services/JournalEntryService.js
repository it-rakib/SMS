var JournalEntryService = function () {
    var save = function (masterObj,done, fail) {

        $.ajax({
            url: '/GLJournalEntry/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var saveBatch = function (masterObj, done, fail) {

        $.ajax({
            url: '/GLBatchList/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };


    var AccountNocall = function (masterObj, done, fail) {

        $.ajax({
            url: '/GLJournalEntry/Acc?AccountNo=' + masterObj,
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };

    var GLMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/GLJournalEntry/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };


    var GLMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/GLJournalEntry/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };




    var GLMultiplePush = function (masterObj, done, fail) {

        $.ajax({
            url: '/GLJournalEntry/MultiplePush',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };



    return {
        save: save,
        saveBatch: saveBatch,

        AccountNocall: AccountNocall,
        GLMultiplePost: GLMultiplePost,
        GLMultipleUnPost: GLMultipleUnPost,
        GLMultiplePush: GLMultiplePush
    }


}();