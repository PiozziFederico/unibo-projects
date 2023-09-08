// USER

// path
const uriUser = "https://site212234.tw.cs.unibo.it/api/v1/users/"

/**
 * RICERCA CLIENTE
 */

function searchUser(){
    const dataLoc = document.getElementById("user-data");
    const errorLoc = document.getElementById("search-error");
    const messageLoc = document.getElementById("message");
    const pointsLoc = document.getElementById("points");
    const animalsLoc = document.getElementById("animals");
    const username = document.getElementById("usernameSearch").value;

    $('#msgdeleteanimalsuccess').innerHTML = ''
    $('#msgreset').innerHTML = ''


    document.getElementById("message").innerHTML = '';

    $.ajax({
     url: uriUser + username,
     type: "GET",
     dataType: 'json',
     xhrFields: {
        withCredentials: true
     },success: function (data) {
        dataLoc.innerHTML = '';
        errorLoc.innerHTML = '';
        messageLoc.innerHTML = '';
        pointsLoc.innerHTML = '';
        animalsLoc.innerHTML = '';
        if(data != null){
            const name = data.name;
             const surname = data.surname;
             const password = data.password;
            const admin = data.admin;

            UserData(dataLoc, errorLoc, name, surname, username, password, admin);

        } else getMessageError(dataLoc, errorLoc);
     },
     error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
        console.log(xhr.status);
        getMessageError(dataLoc, errorLoc);
     },
  });   
}

function UserData(userData, error, name, surname, username, password, admin){
    userData.innerHTML += `
         <div class="d-sm-flex align-items-center justify-content-between">
         <div class="container w-lg-50 mt-4">
              <form action="">
                   <fieldset>
                         <legend class="text-center">Dati Cliente</legend>
                         <div class="row row-cols-1 row-cols-lg-2 g-3 p-sm-5">
                              <div class="col">
                                   <label for="name" class="form-label">Nome</label>
                                   <input type="text" class="form-control" value="${name}" placeholder="${name}" id="name" disabled read-only>
                              </div>
                              <div class="col">
                                   <label for="surname" class="form-label">Cognome</label>
                                   <input type="text" class="form-control" value="${surname}" placeholder="${surname}" id="surname" disabled read-only>
                              </div>
                         </div>
                         <div class="row row-cols-1 row-cols-lg-2 g-3 p-sm-5">
                              <div class="col">
                                   <label for="usernameInput" class="form-label">Username</label>
                                   <input type="text" class="form-control" value="${username}" placeholder="${username}" id="usernameInput" disabled read-only>
                              </div>
                              <div class="col">
                                   <label for="password" class="form-label">Password</label>
                                   <input type="text" class="form-control" value="${password}" placeholder="${password}" id="password" disabled read-only>
                              </div>
                         </div>
                         <div class="text-center pb-sm-5 pt-2">
                             <input class="form-check-input" type="checkbox" value="${admin}" id="admin1" disabled read-only ${adminCheckedOrNot(admin)}>
                             <label class="form-check-label" for="admin1">Admin</label>
                         </div>
                     </fieldset >
                 </form>
             </div>
             <div class="container text-center w-lg-50">
                 <button type="button" class="btn btn-secondary btn-lg m-3" onclick="showMoreUserData()" style="width: 177.39px">Mostra Altro</button> <br>

                 <button type="button" class="btn btn-primary btn-lg m-3" id="modify-user" onclick="modifyUser()" style="width: 177.39px">Modifica Cliente</button>
                 <button type="button" class="btn btn-success btn-lg m-3" id="confirm-user" onclick="confirmModifiedUser()" style="width: 177.39px" hidden>Conferma</button> <br>

                 <button type="button" class="btn btn-danger btn-lg m-3" onclick="deleteUser()" style="width: 177.39px">Elimina Cliente</button>
             </div>
         </div>
         `;                              
}

function getMessageError(userData, error){
    error.innerHTML = '';
    userData.innerHTML = '';
    error.innerHTML += `<p class="mt-3">Utente non trovato. Riprovare.</p> `;
}

function adminCheckedOrNot(admin){
    if(admin){
        return 'checked';
    } else return ''
}

function showMoreUserData(){
	const username = document.getElementById("usernameInput").value;
	const pointsLoc = document.getElementById("points");
	const animalsLoc = document.getElementById("animals");

    // Ajax Call for Points
	$.ajax({
		url: uriUser + username + "/games",
		type: "GET",
		dataType: 'json',
        async: false,
        processData: false,
        contentType: "application/json; charset=UTF-8",
		xhrFields: {
			withCredentials: true
		},success: function (data) {
			pointsLoc.innerHTML = '';
			pointsLoc.innerHTML += showPoints(data);
		},
		error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
			console.log(xhr.status);
		},
	});

    // Ajax Call for Animals
	$.ajax({
		url: uriUser + username + "/animals",
		type: "GET",
		dataType: 'json',
        async: false,
        processData: false,
        contentType: "application/json; charset=UTF-8",
		xhrFields: {
			withCredentials: true
		},success: function (data) {
            if(!jQuery.isEmptyObject(data)){
                animalsLoc.innerHTML = '';
                animalsLoc.innerHTML += showAnimals(data);
            }
		},
		error: function (xhr, ajaxOptions, thrownError) { 
			console.log(xhr.status);
		},
	});
}

// POINTS

function showPoints(points){

    let pointsTable;

    if(points != null ){
        pointsTable = `
                    <p class="fs-4">Punteggio Giochi</p>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Quiz</th>
                                <th scope="col">Memory</th>
                                <th scope="col">Impiccato</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider table-light">
                            <tr>
                                <th scope="row">Punteggio Migliore</th>
                                <td>${points.quiz?.best ?? 0}</td>
                                <td>${points.memory?.best ?? 0}</td>
                                <td>${points.impiccato?.best ?? 0}</td>
                            </tr>
                            <tr>
                                <th scope="row">Ultimo Punteggio</th>
                                <td>${points.quiz?.last ?? 0}</td>
                                <td>${points.memory?.last ?? 0}</td>
                                <td>${points.impiccato?.last ?? 0}</td>
                            </tr>
                            <tr>
                                <th scope="row">Reset</th>
                                <td>
                                    <button type="button" class="btn btn-danger" onclick="resetPointsQuiz()">
                                        <p hidden>Reset Punti Quiz</p>
                                        <i class="bi bi-arrow-clockwise"></i>
                                    </button>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-danger" onclick="resetPointsMemory()">
                                    <p hidden>Reset Punti Memory</p>
                                        <i class="bi bi-arrow-clockwise"></i>
                                    </button>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-danger" onclick="resetPointsImpiccato()">
                                        <p hidden>Reset Punti Impiccato</p>
                                        <i class="bi bi-arrow-clockwise"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
        `;
    } else pointsTable += ` 
                    <p class="fs-4">Punteggio Giochi</p>
                    <p class="text-warning fs-5">Punteggi non disponibili per questo utente.</p>
    `;
    
    return pointsTable;
}

// reset Points

function resetPointsQuiz(){
    const username = document.getElementById('usernameInput').value;

    $.ajax({
        url: uriUser + username + "/games/quiz",
        type: "DELETE",
        xhrFields: {
            withCredentials: true
        },success: function () {
            document.getElementById('msgreset').innerHTML = 'Punteggio Quiz resettato con successo!';
            showMoreUserData();
        },
        error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            document.getElementById('msgerror').innerHTML = 'Reset Punteggio Quiz fallito!';
            console.log(xhr.status);
        },
    });

    
}

function resetPointsMemory(){
    const username = document.getElementById('usernameInput').value;

    $.ajax({
        url: uriUser + username + "/games/memory",
        type: "DELETE",
        xhrFields: {
            withCredentials: true
        },success: function () {
            document.getElementById('msgreset').innerHTML = 'Punteggio Memory resettato con successo!';
            showMoreUserData();
        },
        error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            document.getElementById('msgerror').innerHTML = 'Reset Punteggio Memory fallito!';
            console.log(xhr.status);
        },
    });
}

function resetPointsImpiccato(){
    const username = document.getElementById('usernameInput').value;
    const pointsLoc = document.getElementById("points");

    $.ajax({
        url: uriUser + username + "/games/impiccato",
        type: "DELETE",
        xhrFields: {
            withCredentials: true
        },success: function () {
            document.getElementById('msgreset').innerHTML = 'Punteggio Impiccato resettato con successo!';
            showMoreUserData();
        },
        error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            document.getElementById('msgerror').innerHTML = 'Reset Punteggio Impiccato fallito!';
            console.log(xhr.status);
        },
    });
}

// ANIMALS
function showAnimals(animals){
    let animalsTable;
    if(animals != null){
        animalsTable = `
                        <p class="fs-4">Animali Cliente</p>
                        <table class="table table-dark" id="animalsTable">
                            <thead>
                                <tr>
                                    <th scope="col">Nome</th>
                                    <th scope="col"> Tipo </th>
                                    <th scope="col">Razza</th>
                                    <th scope="col">Sesso</th>
                                    <th scope="col">Età (anni)</th>
                                    <th scope="col">Modifica</th>
                                    <th scope="col">Elimina</th>
                                </tr>
                            </thead>
                            <tbody class="table-group-divider table-light">
                                ${getAnimals(animals)}
                            </tbody>
                        </table>
        `;
    } else animalsTable += `
                        <p class="fs-4">Animali Cliente</p>
                        <p class="text-warning fs-5">Animali non disponibili per questo utente.</p>
    `;

    return animalsTable;
}

function getAnimals(animals){
    let countAnimal = 1;
    let animalsData = '';

    for(let animal in animals){
        animalsData += `
        <tr id="animal${countAnimal}">
        <td>${animal}</td>
        <td>${animals[animal]?.type ?? 'Non Disponibile'}</td>
        <td>${animals[animal]?.breed ?? 'Non Disponibile'}</td>
        <td>${animals[animal]?.gender ?? 'Non Disponibile'}</td>
        <td>${animals[animal]?.age ?? 'Non Disponibile'}</td>
        <td style="padding: 0px;">
            <button type="button" class="btn btn-primary" onclick="modifyAnimal(${countAnimal})" style="width: 100%; height: 41.5px;" data-bs-toggle="modal" data-bs-target="#modifyAnimal">
                <p hidden>Modifica Animale</p>
                <i class="bi bi-pencil-square"></i>
            </button>
        </td>
        <td style="padding: 0px;">
            <button type="button" class="btn btn-danger" onclick="deleteAnimal(${countAnimal})" style="width: 100%; height: 41.5px;">
                <p hidden>Elimina Animale</p>
                <i class="bi bi-x-circle"></i>
            </button>
        </td>
        </tr>
        `;	
        countAnimal++;
    }
        
    return animalsData;
}

function modifyAnimal(n){
    const name = document.getElementById('animalsTable').rows[n].cells.item(0).innerHTML;
    const type = document.getElementById('animalsTable').rows[n].cells.item(1).innerHTML;
    const breed = document.getElementById('animalsTable').rows[n].cells.item(2).innerHTML;
    const gender = document.getElementById('animalsTable').rows[n].cells.item(3).innerHTML;
    const age = document.getElementById('animalsTable').rows[n].cells.item(4).innerHTML;

    document.getElementById('formModifyAnimal').innerHTML = `
    <div class="text-center fs-4"><legend>Dati Animale</legend></div>
    <div class="row g-3 p-sm-2">
        <div class="col">
            <div class="form-floating">
                <input type="text" value="${name}" placeholder="${name}" class="form-control" id="nameAnimal" disabled read-only>
                <label for="nameAnimal" class="form-label">Nome</label>
            </div>
        </div>
        <div class="col">
            <div class="form-floating">
                <input type="text" value="${type}" placeholder="${type}" class="form-control" id="type">
                <label for="type" class="form-label">Tipo</label>   
            </div>
        </div>
    </div>
    <div class="row g-3 p-sm-2">
        <div class="col">
            <div class="form-floating">
                <input type="text" value="${gender}" placeholder="${gender}" class="form-control" id="gender">
                <label for="gender" class="form-label">Sesso</label>
            </div>
        </div>
        <div class="col">
            <div class="form-floating">
                <input type="text" value="${age}" placeholder="${age}" class="form-control" id="age">
                <label for="age" class="form-label">Anni</label>
            </div>
        </div>
    </div>
    <div class="g-3 p-sm-2">
        <div class="form-floating">
            <input type="text" value="${breed}" placeholder="${breed}" class="form-control" id="breed">
            <label for="breed" class="form-label">Razza</label>   
        </div>
    </div>
    <div class="g-3 p-sm-2">
        <div class="form-floating">
            <textarea placeholder="Inserire descrizione" class="form-control" id="description" style="height: 100px; resize: none;"></textarea>
            <label for="description" class="form-label">Descrizione</label>  
        </div>
    </div>
    `;
}

function confirmModifyAnimal(){
    let username = document.getElementById('usernameInput').value;
    let name = document.getElementById('nameAnimal').value;
    let type = document.getElementById('type').value;
    let gender = document.getElementById('gender').value;
    let age = document.getElementById('age').value;
    let breed = document.getElementById('breed').value;
    let description = document.getElementById('description').value;

    $.ajax({ 
        url: uriUser + username + "/animals/" + name,
        type: "PATCH",
        data: JSON.stringify({
            "type": type,
            "gender": gender,
            "age": Number(age),
            "breed": breed,
            "description": description,
        }),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        xhrFields: {
            withCredentials: true
        },
        success: function (data, stringStatus, xhr) {
            document.getElementById('msgdeleteanimalsuccess').innerHTML = 'Animale modificato con successo.';
            showMoreUserData();
        },
        error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            document.getElementById("modal-error").innerHTML = '<p class="text-danger">Modifica Non riuscita. Errore</p>';
        },
        });
}

function deleteAnimal(n){
    const username = document.getElementById('usernameInput').value;
    const name = document.getElementById('animalsTable').rows[n].cells.item(0).innerHTML;

    $.ajax({
        url: uriUser + username + "/animals/" + name,
        type: "DELETE",
        xhrFields: {
            withCredentials: true
        },success: function () {
            document.getElementById('msgdeleteanimalsuccess').innerHTML = 'Animale eliminato con successo.';
            $.ajax({
                url: uriUser + username + "/animals",
                type: "GET",
                dataType: 'json',
                processData: false,
                contentType: "application/json; charset=UTF-8",
                xhrFields: {
                    withCredentials: true
                },success: function (data) {
                    $('#animals').innerHTML = ''
                    $('#animals').innerHTML += showAnimals(data);
                },
                error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
                    console.log(xhr.status);
                },
            });
        },
        error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            document.getElementById('msgdeleteanimalerror').innerHTML = 'Errore. Animale non eliminato.';
            console.log(xhr.status);
        },
    });
}

function modifyUser(){
    // Remove disabled and readonly attribute
    removeDisabledReadOnly(document.getElementById("password"));
    removeDisabledReadOnly(document.getElementById("name"));
    removeDisabledReadOnly(document.getElementById("surname"));
    removeDisabledReadOnly(document.getElementById("admin1"));
    
    // Change button
    document.getElementById("modify-user").hidden = true;
    document.getElementById("confirm-user").hidden = false;
}

function removeDisabledReadOnly(tag){
    tag.disabled = false;
    tag.removeAttribute('read-only');
}

function confirmModifiedUser(){
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;

    $("#admin1").on('change', function() {
        if ($(this).is(':checked')) {
          $(this).attr('value', 'true');
        } else {
          $(this).attr('value', 'false');
        }
    })

    const admin = (document.getElementById("admin1").value === 'true');
    console.log(admin)
    $.ajax({ 
        url: uriUser + username,
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
            // Add disabled and read-only attribute
            addDisabledReadOnly(document.getElementById("password"));
            addDisabledReadOnly(document.getElementById("name"));
            addDisabledReadOnly(document.getElementById("surname"));
            addDisabledReadOnly(document.getElementById("admin1"));

           // Change button
            document.getElementById("modify-user").hidden = false;
            document.getElementById("confirm-user").hidden = true;

            console.log(admin)

            alert('Utente modificato con successo');
         },
         error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            document.getElementById("search-error").innerHTML = '';
            document.getElementById("search-error").innerHTML = 'Modifica Non riuscita. Errore' + xhr.status;
         },
      });
}


function addDisabledReadOnly(tag){
    tag.disabled = true;
    tag.setAttribute('read-only', true);
}

function deleteUser(){
    const username = document.getElementById("usernameInput").value;
    const dataLoc = document.getElementById("user-data");
    const messageLoc = document.getElementById("message");
    const animalsLoc = document.getElementById("animals");
    const pointsLoc = document.getElementById("points");

    $.ajax({
        url: uriUser + username,
        type: "DELETE",
        xhrFields: {
            withCredentials: true
        },success: function () {
            dataLoc.innerHTML = '';
            animalsLoc.innerHTML = '';
            pointsLoc.innerHTML = '';
            messageLoc.innerHTML = '';
            messageLoc.innerHTML = `<p class="my-4">Utente eliminato con successo</p>`;
        },
        error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
           console.log(xhr.status);
        },
    });
}

/**
 * NEW USER
 */

function addFormAnimal(){
    // Switch button
    document.getElementById('AFA').hidden = true;

    // DOM node setup
    let loc = document.getElementById('animalForm');

    // inject HTML
    loc.innerHTML = `
        <div class="p-5" style="border-color: black; border: solid;" id="newFormAnimal">
            <legend class="text-center">Nuovo Animale</legend>
                <div class="row g-3 p-sm-5">
                    <div class="col">
                        <div class="form-floating">
                            <input type="text" placeholder="Inserire nome animale" class="form-control" id="nameAnimal">
                            <label for="nameAnimal" class="form-label">Nome</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating">
                            <input type="text" placeholder="Inserire tipo animale" class="form-control" id="type">
                            <label for="type" class="form-label">Tipo</label>   
                        </div>
                    </div>
                </div>
                <div class="row g-3 p-sm-5">
                    <div class="col">
                        <div class="form-floating">
                            <select id="gender" class="form-select" aria-label="select animal's gender">
                                <option selected>...</option>
                                <option>M</option>
                                <option>F</option>
                            </select>
                            <label for="gender" class="form-label">Sesso</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating">
                            <input type="text" placeholder="Inserire età animale" class="form-control" id="age">
                            <label for="age" class="form-label">Anni</label>
                        </div>
                    </div>
                </div>
                <div class="g-3 p-sm-5">
                    <div class="form-floating">
                        <input type="text" placeholder="Inserire razza animale" class="form-control" id="breed">
                        <label for="breed" class="form-label">Razza</label>   
                    </div>
                </div>
                <div class="g-3 p-sm-5">
                    <div class="form-floating">
                        <textarea placeholder="Inserire descrizione" class="form-control" id="description" style="height: 100px; resize: none;"></textarea>
                        <label for="description" class="form-label">Descrizione</label>  
                    </div>
                </div>
                <div class="g-3 p-sm-5">
                    <form action="/api/v1/images" method="post" enctype='multipart/form-data'>
                        <input type="file" name="image" onchange="uploadImage(this)">
                        <div class="imageUploaderReceiver" id="imgAnimal" hidden></div>
                    </form>
        
                </div>
                <div class="d-flex align-items-center">
                    <button type="button" class="btn btn-success mt-2" onclick="addAnimal()">
                        Conferma
                    </button>
                    <button type="button" class="btn btn-danger mt-2 mx-2" onclick="deleteFormAnimal()">
                        Annulla
                    </button>
                </div>
                <div class="text-danger mt-3" id="nameortypeNotInserted"></div>
            </div>
    `;
}

function deleteFormAnimal(){
    document.getElementById('AFA').hidden = false;
    // set DOM node empty
   document.getElementById('animalForm').innerHTML ='';
}



let animalsCount = 0;
let animalsObj = {};
function addAnimal(){
    // get animal name
    let name = document.getElementById('nameAnimal').value;
    let type = document.getElementById('type').value;

    if(name.length != 0 && type.length != 0){
        // remove message error
        document.getElementById('nameortypeNotInserted').innerHTML = '';

        // hide animal form
        document.getElementById('AFA').hidden = false;
        document.getElementById('newFormAnimal').hidden = true;


        // show table
        document.getElementById('newUserAnimals').hidden = false;

        // DOM node
        let table = document.getElementById('newUserAnimals');

        // get animals data
        let gender = document.getElementById('gender').value;
        let age = document.getElementById('age').value;
        let breed = document.getElementById('breed').value;
        let description = document.getElementById('description').value;
        let img = $('#imgAnimal').html()
        
        const remove = `
            <button type="button" value="Delete" class="btn btn-danger" onclick="deleteRow(this)" style="width: 100%; height: 41.5px;">
                <p hidden>Rimuovi Animale</p>
                <i class="bi bi-x-circle"></i>
            </button>`;

        $()

        // save animal obj
        animalsObj[name] = {
            type: type,
            gender: gender,
            age: Number(age),
            breed: breed,
            description: description,
            image: img,
        }

        removeNullOrEmpty(animalsObj[name]);
       
        if(description.length != 0){
            description = 'Descrizione caricata';
        }

        // add row
        let newRow = table.insertRow(-1);
        let newCell0 = newRow.insertCell(0);
        let newText0 = document.createTextNode(animalsCount++);
        newCell0.appendChild(newText0);
        let newCell1 = newRow.insertCell(1);
        let newText1 = document.createTextNode(name);
        newCell1.appendChild(newText1);
        let newCell2 = newRow.insertCell(2);
        let newText2 = document.createTextNode(type);
        newCell2.appendChild(newText2);
        let newCell3 = newRow.insertCell(3);
        let newText3 = document.createTextNode(gender);
        newCell3.appendChild(newText3);
        let newCell4 = newRow.insertCell(4);
        let newText4 = document.createTextNode(age);
        newCell4.appendChild(newText4);
        let newCell5 = newRow.insertCell(5);
        let newText5 = document.createTextNode(breed);
        newCell5.appendChild(newText5);
        let newCell6 = newRow.insertCell(6);
        let newText6 = document.createTextNode(description);
        newCell6.appendChild(newText6);
        let newCell7 = newRow.insertCell(7);
        newCell7.innerHTML = remove;
    } else {
        document.getElementById('nameortypeNotInserted').innerHTML='Inserire nome animale e/o tipo e Riprovare.'
    }  
}

function removeNullOrEmpty(obj) {
    // https://stackoverflow.com/a/38340730
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v !== ""));
}

function deleteRow(row){
    let i = row.parentNode.parentNode.rowIndex;

    // remove the animal from the array
    let animalremoved = document.getElementById('newUserAnimals').rows[i].cells[1];
    delete animalsObj.animalremoved;

    document.getElementById('newUserAnimals').deleteRow(i);
    animalsCount--;
    if(animalsCount == 0){
        document.getElementById('newUserAnimals').hidden = true;
    }
}

function AddNewUser(){
    //user data
    let name = document.getElementById('name').value;
    let surname = document.getElementById('surname').value;
    let username = document.getElementById('usernameInput').value;
    let password = document.getElementById('password').value;

    let admin = ($('#admin').val() === 'true')

    $.ajax({ 
        url: uriUser + username,
        type: "PUT",
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
            alert('Utente aggiunto con successo');
            window.location.href = "https://site212234.tw.cs.unibo.it/backoffice/users";
         },
         error: function (xhr, ajaxOptions, thrownError) { 
            console.log(xhr.status);
         },
      });
}

/**
 * TABELLA CLIENTI
 */

function populateTable(data){

    let table = document.getElementById('userTable');

    table.hidden = false;

    table.innerHTML = `
    <thead>
        <tr>
            <th scope="col">Nome</th>
            <th scope="col">Cognome</th>
            <th scope="col">Username</th>
            <th scope="col">Password</th>
            <th scope="col">Admin</th>
            <th scope="col">Modifica</th>
            <th scope="col">Elimina</th>
        </tr>
    </thead>
    <tbody class="table-group-divider">
    `;

    let count= data.length ;
    let countUsers = 1;

    for( let utente of data ){
                $.ajax({
                    url: uriUser + utente,
                    type: "GET",
                    async: false,
                    dataType: 'json',
                    xhrFields: {
                          withCredentials: true
                    },success: function (data) {
                        count--;
                        if(data?.username !== '[DELETED]'){
                        table.innerHTML += `
                            <tr class="table-light">
                            <td>${data?.name ?? 'NULL'}</td>
                            <td>${data?.surname ?? 'NULL'}</td>
                            <td>${data?.username ?? 'NULL'}</td>
                            <td>${data?.password ?? 'NULL'}</td>
                            <td>${data?.admin ?? 'NULL'}</td>
                            <td style="padding: 0px;">
                                <button type="button" class="btn btn-primary" style="width: 100%; height: 41.5px;" onclick="modifyUserFromTable(${countUsers})" data-bs-toggle="modal" data-bs-target="#modifyUser">
                                    <p hidden>Modifica Utente</p>
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                            </td>
                            <td style="padding: 0px;">
                                <button type="button" class="btn btn-danger" style="width: 100%; height: 41.5px;" onclick="deleteUserFromTable(${countUsers})">
                                    <p hidden>Elimina Utente</p>
                                    <i class="bi bi-x-circle"></i>
                                </button>
                            </td>
                            </tr>
                        `;
                        countUsers++;
                        }
                        if( count == 0 ){
                            table.innerHTML += '</tbody>';
                        } 
                    },
                    error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
                        count--;
                        document.getElementById("tableError").innerHTML = 'Tabella non disponibile. Errore' + xhr.status;
                        if( count == 0 ){
                            table.innerHTML += '</tbody>';
                        } 
                    },
                });
    } 
}

function modifyUserFromTable(n){
    const name = document.getElementById('userTable').rows[n].cells.item(0).innerHTML;
    const surname = document.getElementById('userTable').rows[n].cells.item(1).innerHTML;
    const username = document.getElementById('userTable').rows[n].cells.item(2).innerHTML;
    const password = document.getElementById('userTable').rows[n].cells.item(3).innerHTML;
    const admin = (document.getElementById('userTable').rows[n].cells.item(4).innerHTML === 'true');

    console.log(admin)

    document.getElementById('formModifyUser').innerHTML = `
    <div class="text-center fs-4"><legend>Dati Utente</legend></div>
        <div class="row g-3 p-sm-2">
            <div class="col">
                <div class="form-floating">
                    <input type="text" value="${name}" placeholder="${name}" class="form-control" id="name">
                    <label for="name" class="form-label">Nome</label>
                </div>
            </div>
            <div class="col">
                <div class="form-floating">
                    <input type="text" value="${surname}" placeholder="${surname}" class="form-control" id="surname">
                    <label for="surname" class="form-label">Cognome</label>   
                </div>
            </div>
        </div>
        <div class="row g-3 p-sm-2">
            <div class="col">
                <div class="form-floating">
                    <input type="text" value="${username}" placeholder="${username}" class="form-control" id="usernameInput" disabled read-only>
                    <label for="usernameInput" class="form-label">Nome Utente</label>
                </div>
            </div>
            <div class="col">
                <div class="form-floating">
                    <input type="text" value="${password}" placeholder="${password}" class="form-control" id="password">
                    <label for="password" class="form-label">Password</label>
                </div>
            </div>
        </div>
        <div class="g-3 p-sm-2">
                <input class="form-check-input" type="checkbox" value="${admin}" id="admin1" ${adminCheckedOrNot(admin)}>
                <label class="form-check-label" for="admin">Admin</label>   
        </div>
    `;
}

function confirmModifyUser(){
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;

    let admin = document.getElementById("admin1").checked;

    console.log(admin)

    $.ajax({ 
        url: uriUser + username,
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
            showUsers();
         },
         error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            document.getElementById('tableError').innerHTML = 'Errore. Modifica utente non riuscita.'
         },
      });
}

function deleteUserFromTable(n){
    const username = document.getElementById('userTable').rows[n].cells.item(2).innerHTML;

    $.ajax({
        url: uriUser + username,
        type: "DELETE",
        xhrFields: {
            withCredentials: true
        },success: function () {
            showUsers();
            alert('Utente eliminato con successo!')

        },
        error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            document.getElementById("tableError").innerHTML = 'Utente non eliminato con successo. Riprovare.'; 
            console.log(xhr.status);
        },
    });
}

function showUsers(){
    let b_show = document.getElementById('show').hidden = true;
    let b_hide = document.getElementById('hide').hidden = false;
    document.getElementById("tableError").innerHTML = '';

    $.ajax({
       url: uriUser,
       type: "GET",
       dataType: 'json',
       xhrFields: {
             withCredentials: true
       },success: function (data) {
            populateTable(data);
       },
       error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
          document.getElementById("tableError").innerHTML = 'Tabella non disponibile. Errore' + xhr.status;
       },
    });   
 }

 function hideUsers(){
    document.getElementById('show').hidden = false;
    document.getElementById('hide').hidden = true;
    document.getElementById("tableError").innerHTML = '';
    document.getElementById('userTable').hidden = true;
}

