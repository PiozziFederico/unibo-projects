// PROFILE

// path
const uriProfile = "https://site212234.tw.cs.unibo.it/api/v1/users/"

function patchUserCredentials(){
    let username = document.getElementById('username').innerHTML
    let password = document.getElementById('password').value
    let name = document.getElementById('name').value
    let surname = document.getElementById('surname').value

    $("#admin").on('change', function() {
        if ($(this).is(':checked')) {
          $(this).attr('value', 'true');
        } else {
          $(this).attr('value', 'false');
        }
    })

    let admin = (document.getElementById('admin').value === 'true')

    $.ajax({ 
        url: uriProfile + username,
        type: "PATCH",
        data: JSON.stringify({
            "password": password,
            "name": name,
            "surname": surname,
            "admin": admin,
        }),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        xhrFields: {
             withCredentials: true
        },
        success: function (data, stringStatus, xhr) {
            alert('Profilo modificato con successo');
         },
         error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status)
         },
      });
}


function getUserCredentials(username){

    console.log(username.id)

    $.ajax({
        url: uriProfile + username,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            // password
            document.getElementById('password').value = data.password
            document.getElementById('password').placeholder = data.password

            // name
            document.getElementById('name').value = data.name
            document.getElementById('name').placeholder = data.name

            // surname
            document.getElementById('surname').value = data.surname
            document.getElementById('surname').placeholder = data.surname

            //admin
            document.getElementById('admin').value = data.admin
            document.getElementById('admin').checked = data.admin

        },
        error: function (xhr, ajaxOptions, thrownError) {
           console.log(xhr.status);
        },
    });   
}