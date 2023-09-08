// LOGOUT

// path
const uri = "https://site212234.tw.cs.unibo.it/api/v1/auth"


function logout(){
    $.ajax({ 
        url: uri,
        type: "DELETE",
        xhrFields: {
             withCredentials: true
        },
        success: function (data, stringStatus, xhr) {
           window.location.href = "https://site212234.tw.cs.unibo.it/backoffice/login"
         },
         error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            console.log(xhr.status)
         },
      });
}

