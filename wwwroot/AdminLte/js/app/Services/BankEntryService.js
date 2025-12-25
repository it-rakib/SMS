var BankEntryService = function () {
    var save = function (masterObj,done, fail) {

        $.ajax({
            url: '/BankEntry/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };

    var AccountNocall = function (masterObj, done, fail) {

        $.ajax({
            url: '/BankEntry/Acc?AccountNo=' + masterObj,
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };
    var  BNKMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/BankEntry/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };


    var BNKMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/BankEntry/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var BNKMultiplePush = function (masterObj, done, fail) {

        $.ajax({
            url: '/BankEntry/MultiplePush',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };



    return {
        save: save,
        BNKMultiplePost: BNKMultiplePost,
        BNKMultiplePush: BNKMultiplePush,
        AccountNocall: AccountNocall,
        BNKMultipleUnPost: BNKMultipleUnPost,

    }


}();