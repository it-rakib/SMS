

//function ProductTypes(controlId, isDefaultRecordRequired) {
//    var url = '/Common/ProductTypes';
//    LoadCombo(controlId, url, isDefaultRecordRequired);
//}

//function LoadCombo(controlId, url, identityCode, isDefaultRecordRequired) {
//function LoadCombo(controlId, url, isDefaultRecordRequired=true) {

//    $.ajax({
//        url: url,
//        data:{},
//        type: 'get',
//        async: false,
//        cache:false,
//        success: function (res) {
//            var data = res;           
//            $("#" + controlId).empty();
//            $("#" + controlId).get(0).options.length = 0;

//            if (isDefaultRecordRequired) {
//                $("#" + controlId).get(0).options[0] = new Option("----- Select -----", "xx");
//            }
//            if (data != null) {                
//                $.each(data, function (index, item) {
//                    $("#" + controlId).get(0).options[$("#" + controlId).get(0).options.length] = new Option(item.value,item.name);
//                });
//            }
//            // data-selected

//            var value = $("#" + controlId).attr("data-selected");
//            //!= '0' ? value : "xx"

//            $("#" + controlId).select2({ dropdownCssClass: "select2Font" });
//            if (value > 0) {
              
//                $("#" + controlId).val(value).change();
//            } else {
//                $("#" + controlId).val(value);
//            }
                
                      
//        },
//        error: function () {
//            ShowNotification('Error');
//        }
//    });
//}


function LoadCombo(controlId, url, isDefaultRecordRequired = false) {

    $.ajax({
        url: url,
        data: {},
        type: 'get',
        async: false,
        cache: false,
        success: function (res) {
            var data = res;
            $("#" + controlId).empty();
            $("#" + controlId).get(0).options.length = 0;

            if (isDefaultRecordRequired) {
                $("#" + controlId).get(0).options[0] = new Option("----- Select -----", "xx");
            }
            if (data != null) {
                $.each(data, function (index, item) {
                    $("#" + controlId).get(0).options[$("#" + controlId).get(0).options.length] = new Option(item.name,item.value);
                });
            }

            // Add some responsive design styles
            //$("#" + controlId).addClass("form-control");
            //$("#" + controlId).addClass("select2Font");
            //$("#" + controlId).css({ "width": "100%" });
            //$("#" + controlId).css({ "width": "100%", "height": "calc(1.5em + 0.5rem + 2px)" });
            // data-selected
            var value = $("#" + controlId).attr("data-selected");
            var readonly = $("#" + controlId).attr("data-readonly");
            //$("#" + controlId).select2();
            if (value > 0) {
                $("#" + controlId).val(value).change();
            } else {
                $("#" + controlId).val(value);
            }

            if (readonly) {
                $("#" + controlId).attr('disabled', true);

            }


        },
        error: function () {
            ShowNotification('Error');
        }
    });
}


// auto complete


function getBloodHound(url) {   
    return new Bloodhound({
        datumTokenizer: datum => Bloodhound.tokenizers.whitespace(datum.value),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: url +'?Prefix=%QUERY',
            // Map the remote source JSON array to a JavaScript object array
            filter: movies => $.map(movies, movie => ({
                value: movie.name,
            })),
            wildcard: '%QUERY',
        }
    });
}

function getTypeAheadConfig(url) {
    return {
        displayKey: 'value',
        source: getBloodHound(url).ttAdapter()
    }
}

// end auto complete

// start drop down list set 0


//function setAttributeValue(controlId,text) {
//    debugger
//    if (text == "xx") {
//        $("#" + controlId).attr("data-selected", 0);

//        var preview = document.getElementById("#" + controlId); //getElementById instead of querySelectorAll
//        //preview.setAttribute("data", link);
//        preview.setAttribute("aria - describedby", controlId + "-error");
      
//    } 
//}


// end drop down list set 0
