// LOGIN

// path
const uriLogin = "https://site212234.tw.cs.unibo.it/api/v1/auth"

async function login(){
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value

    $.ajax({ 
        url: uriLogin,
        type: "POST",
        datatype: 'json',
        data: {
            username: username,
            password: password,
        },
        xhrFields: {
             withCredentials: true
        },
        success: function (data, stringStatus, xhr) {
           window.location.href = "https://site212234.tw.cs.unibo.it/backoffice/home"
         },
         error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            document.getElementById("login-error").hidden = false
         }
      });

}



