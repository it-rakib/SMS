var UserRollsService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/UserRolls/CreateEdit',
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