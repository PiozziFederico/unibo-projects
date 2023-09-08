// SERVICES

// path
const uriServices = "https://site212234.tw.cs.unibo.it/api/v1/services"


// SEDE

// put
function putOffice(){

    let name = $('#name').val()
    let city = $('#city').val()
    let address = $('#address').val()

    $.ajax({ 
        url: uriServices + "/" + city + "/" + address,
        type: "PUT",
        data: JSON.stringify({
           "name": name,
        }),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        xhrFields: {
             withCredentials: true
        },
        success: function (data, stringStatus, xhr) {
            alert('Sede aggiunta con successo!');
            window.location.href = "https://site212234.tw.cs.unibo.it/backoffice/services";
     
         },
         error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            alert('Errore, sede non aggiunta correttamente. Riprovare.');
         },
      })
}


// SERVIZIO

// on load

function getServiceNames(){
    let select = $('#selectServiceName')

    $.ajax({
        url: uriServices + '?type=' + serviceName,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            for(city of data){
                select.html( select.html() + `<option value="${city}">${city}</option>`)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}


function getCities(serviceName){
    let select = $('#selectCity')

    $.ajax({
        url: uriServices + '?type=' + serviceName,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            for(city of data){
                console.log(city)
                select.html( select.html() + `<option value="${city}">${city}</option>`)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}


// onchange 
function serviceNameChange(){
    let serviceName = $('#selectServiceName').val()
    $('#selectCity').html('<option value="null" selected>Seleziona Città</option>')
    getCities(serviceName)
}

function cityChange(serviceName) {
    let selectCity = $('#selectCity')
    let selectAddress = $('#selectAddress')
    selectAddress.html('<option value="null" selected>Seleziona Via</option>')
    let selectService = $('#selectService')
    selectService.html(`<option value="null" selected>Seleziona ${serviceName}</option>`)
    if(selectCity.val() != null){
        getAddress(selectCity.val(), serviceName)
    }
}

function addressChange(serviceName) {
    let selectCity = $('#selectCity')
    let selectAddress = $('#selectAddress')
    let selectService = $('#selectService')
    selectService.html(`<option value="null" selected>Seleziona ${serviceName}</option>`)
    if(selectAddress.val() != null){
        getService(selectCity.val(), selectAddress.val(), serviceName)
    }
}


// array of objects { day: ... , hour: ...}
let dayAndHour = []

function serviceChange(){

    let selectCity = $('#selectCity').val()
    let selectAddress = $('#selectAddress').val()
    let selectService = $('#selectService').val()

    let days = []

    $.ajax({
        url: uriServices + '/' + selectCity + '/' + selectAddress + '/services/' + selectService,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            let available = data.available

            available = available.sort()

            // days with duplications
            for(date of available){
                let day = new Date(date)
                days.push(day)

                let hour = new Date(date).toLocaleTimeString('it-IT', { hour: "2-digit" })
                dayAndHour.push({day, hour})
            }

            let daysWithoutDuplications = unique(days)

            let selectDay = $('#selectDay')

            selectDay.html('<option value="null" selected>Seleziona Data</option>')

            for( day of daysWithoutDuplications ){
                selectDay.html(selectDay.html() + `<option value="${day}">${day.toLocaleDateString('it-IT')}</option>`)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}

// remove duplications 
function unique(origArr){
    var newArr = [],
        origLen = origArr.length,
        found, x, y;

    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
            if (origArr[x] === newArr[y]) {
                found = true;
                break;
            }
        }
        if (!found) {
            newArr.push(origArr[x]);
        }
    }

    return newArr.sort();
}


function dayChange(){
    let selectDay = $('#selectDay').val()
    let selectHour = $('#selectHour')

    selectHour.html('<option value="null" selected>Seleziona Ora</option>')

    for( date of dayAndHour ){
        if( selectDay == date.day ){
            selectHour.html( selectHour.html() + `<option value="${date.hour}">${date.hour}:00</option>` )
        }
    }
}


// get
function getAddress(city, serviceName){
    let select = $('#selectAddress')

    $.ajax({
        url: uriServices + '/' + city + '?type=' + serviceName,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            for(address of data){
                select.html( select.html() + `<option value="${address}">${address}</option>`)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}

function getService(city, address, serviceName){
    let select = $('#selectService')

    $.ajax({
        url: uriServices + '/' + city + '/' + address + '/services?type=' + serviceName,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            for(service in data){
                console.log(service)
                select.html( select.html() + `<option value="${service}">${service}</option>`)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}





// filter a specific service based on city, address and name
function searchReservation(){

    $('.wait-for-search').html('')

    // search data
    let city = $('#selectCity').val()
    let address = $('#selectAddress').val()
    let service = $('#selectService').val()

    let active = $('#activeReservations')
    active.html('')
    let available = $('#availableReservations')
    available.html('')

    $.ajax({
        url: uriServices + '/' + city + '/' + address + '/services/' + service,
        type: "GET",
        dataType: 'json',
        async: false,
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            // ACTIVE PRENOTATION
            let booked = data.booked

            // add filter
            $('#filterReservation').html( `<p class="fs-6 fw-light">Filtra prenotazioni</p>
            <div class="input-group w-25 mb-5 mt-2 mx-auto">
              <input type="text" class="form-control" placeholder="Nome Utente" id="searchBoardByUsername" aria-label="Username" aria-describedby="searchBoardByUsername">
              <button class="btn btn-outline-secondary btn-sm" type="button" onclick="usernameFilter('${escapeJSON(JSON.stringify(booked))}', '${escapeHTML(city)}', '${escapeHTML(address)}', '${escapeHTML(service)}')">
                  <p hidden>Cerca per Nome Utente</p>
                  <i class="bi bi-search"></i>
              </button>
            </div>` )

            let countActive = 0

            for(date in booked){
                let d = new Date(`${date}`)
                let day = d.toLocaleDateString('it-IT')
                let hour = d.toLocaleTimeString('it-IT', { hour: "2-digit" }) + ':00'

                active.html( active.html() + ` 
                <div class="col">
                <div class="card text-center mb-2">
                <div class="card-body">
                  <h5 class="card-title">${booked[date]}</h5>
                  <p class="card-text fs-6"><span class="mx-3">${day}</span><span class="mx-3">${hour}</span></p>
                  <hr>
                  <div class="d-flex justify-content-center gap-3">
                    <button class="btn btn-danger" onclick="deleteReservation('${escapeHTML(city)}', '${escapeHTML(address)}', '${escapeHTML(service)}', '${d.toISOString()}')">Elimina</button>
                  </div>
                </div>
              </div>`)

                countActive++
            }

            // AVAILABLE PRENOTATION
            let availableRes = data.available

            let countAvailable = 0

            for(date of availableRes){
                let d = new Date( `${date}`)
                let day = d.toLocaleDateString('it-IT')
                let hour = d.toLocaleTimeString('it-IT', { hour: "2-digit" }) + ':00'

                available.html(available.html() + `
                <div class="col">
                <div class="card mb-2 text-center mb-2">
                <div class="card-body">
                  <h5 class="card-title">${address}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${city}</h6>
                  <p class="card-text fs-6"><span class="mx-3">${day}</span><span class="mx-3">${hour}</span></p>
                  <hr>
                  <p>Seleziona Nome Utente:</p>
                  <select class="form-select mb-3" id="selectUsername${countAvailable}" aria-label="selectUsername${countAvailable}">
                  <option value="null" selected>Seleziona Nome Utente</option>
                 </select>
                 <hr>
                  <button class="btn btn-success" onclick="bookServiceFromAvailablePrenotation( '${escapeHTML(city)}', '${escapeHTML(address)}', '${d.toISOString()}', ${countAvailable}, '${escapeHTML(service)}')">Prenota</button>
                </div>
              </div>
              </div>
                `)

                getUsernamesCard( `${city}`, `${address}`, `${d}`, `${countAvailable}` ) 

                countAvailable++
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}

function escapeHTML(str) {
    return str.replaceAll('&', '\\&').replaceAll('<', '\\<').replaceAll('>', '\\>').replaceAll('"', '\\"').replaceAll("'", "\\'");
}

function escapeJSON(str) {
    return str.replaceAll('&', '&amp').replaceAll('<', '&lt').replaceAll('>', '&gt;').replaceAll("'", '&#39;').replaceAll('"', '&quot;');
}

// book
function bookServiceFromAvailablePrenotation(city, address, d, count, name){
    let arrDate = []
    arrDate.push(d)

    let username = $('#selectUsername' + count).val()

    $.ajax({ 
        url: uriServices + "/" + city + "/" + address + "/services/" + name,
        type: "POST",
        async: false,
        data: JSON.stringify({
            "username": username,
            "booking": arrDate
        }),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        xhrFields: {
             withCredentials: true
        },
        success: function () {
           alert('Prenotazione avvenuta con successo!')
           searchReservation() 

         },
         error: function (xhr, ajaxOptions, thrownError) { 
            console.log(xhr.status)
            alert('Qualcosa è andato storto :(')
         }
      });
}

 // get usernames card
function getUsernamesCard(city, address, date, count){

    let selectUsername = $(`#selectUsername${count}`) 

    selectUsername.html('<option value="null" selected>Seleziona Nome Utente</option>')

    $.ajax({
        url: uriUsers,
        type: "GET",
        dataType: 'json',
        async: false,
        xhrFields: {
           withCredentials: true 
        },success: function (data) {
            for(username of data){
                if(username != '[DELETED]'){
                    selectUsername.html( selectUsername.html() + `<option value="${username}">${username}</option>`)
                } 
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
           console.log(xhr.status)
        },
     }) 
} 

// username filter active prenotation
function usernameFilter(booked, city, address, service){
    booked = JSON.parse(booked);
    console.log(booked)

    let username = $('#searchBoardByUsername').val()

    let available = $('#availableReservations')

    let active = $('#activeReservations')
    active.html('')
    let countActive = 0
    for(date in booked){
        if(username == booked[date]){
                let d = new Date(`${date}`)
                let day = d.toLocaleDateString('it-IT')
                let hour = d.toLocaleTimeString('it-IT', { hour: "2-digit" }) + ':00'

                active.html( active.html() + ` 
                <div class="col">
                <div class="card text-center mb-2">
                <div class="card-body">
                  <h5 class="card-title">${booked[date]}</h5>
                  <p class="card-text fs-6"><span class="mx-3">${day}</span><span class="mx-3">${hour}</span></p>
                  <hr>
                  <div class="d-flex justify-content-center gap-3">
                    <button class="btn btn-danger" onclick="deleteReservation('${escapeHTML(city)}', '${escapeHTML(address)}', '${escapeHTML(service)}', '${d.toISOString()}')">Elimina</button>
                  </div>
                </div>
              </div>`)
        countActive++
        }
    }

    if( countActive == 0 ){
        active.html(`
        <div class="container text-center">
            <p class="text-danger text-center">Nessuna prenotazione per questo nome utente!</p>
        </div>
        `)
    }


}

// delete
function deleteReservation(city, address, service, date){

    let arr = []
    arr.push(date)
    $.ajax({ 
        url: uriServices + '/' + city + '/' + address + '/services/' + service + '/booked',
        type: "DELETE",
        async: false,
        xhrFields: {
             withCredentials: true
        },
        processData: false,
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({
            booking: arr,
        }),
        success: function () {
           alert('Prenotazione rimossa con successo')
           searchReservation()
         },
         error: function (xhr, ajaxOptions, thrownError) { 
            console.log(xhr.status)
            alert('Qualcosa è andato storto :(')
         },
      });
}

// book
function bookService(){

    let username = $('#selectUsername').val()
    let city = $('#selectCity').val()
    let address = $('#selectAddress').val()
    let name = $('#selectService').val() 
    let day = $('#selectDay').val()
    let hour = $('#selectHour').val()

    let date = new Date(day)
    date.setHours(hour)

    let arrDate = []
    arrDate.push(date.toISOString())

    $.ajax({ 
        url: uriServices + "/" + city + "/" + address + "/services/" + name,
        type: "POST",
        data: JSON.stringify({
            username: username,
            booking: arrDate
        }),
        contentType: "application/json; charset=UTF-8",
        processData: false,
        xhrFields: {
             withCredentials: true
        },
        success: function () {
           alert('Prenotazione avvenuta con successo!')
           $('#selectDay').html(`<option value="null" selected>Seleziona Data</option>`)
           $('#selectHour').html(`<option value="null" selected>Seleziona Ora</option>`)

         },
         error: function (xhr, ajaxOptions, thrownError) { 
            console.log(xhr.status)
            alert('Qualcosa è andato storto :(')
         }
      });

}

// get users username
const uriUsers = 'https://site212234.tw.cs.unibo.it/api/v1/users'

function getUsernames(){

    let selectUsername = $('#selectUsername')

    selectUsername.html('<option value="null" selected>Seleziona Nome Utente</option>')

    $.ajax({
        url: uriUsers,
        type: "GET",
        dataType: 'json',
        async: false,
        xhrFields: {
           withCredentials: true 
        },success: function (data) {
            for(username of data){
                if(username != '[DELETED]'){
                    selectUsername.html( selectUsername.html() + `<option value="${username}">${username}</option>`)
                } 
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
           console.log(xhr.status)
        },
     }) 
}

/**
 * MODIFY SERVICE
 */
function searchForModifyOffice(){

    let serviceName = $('#selectServiceName').val()
    let city = $('#selectCity').val()
    let address = $('#selectAddress').val()

    let expertsName = $('#expertsName')

    // get office name
    let officeName
    $.ajax({
        url: uriServices + '/' + city + '/' + address,
        type: "GET",
        dataType: 'json',
        async: false,
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            const standardName = 'AnimalHouse ' + address
            officeName = data?.name ?? standardName
            $('#addServiceLink').html(`
            <div class="container-fluid p-3 bg-primary mt-5">
                <div class="text-center">
                    <span class="fs-4 px-3">
                        <a type="button" role="button" href="/backoffice/services/modifyservice/service/${city}/${address}/${officeName}/addService" class="link-light text-decoration-none text-dark"> Aggiungi Servizio <i class="bi bi-chevron-double-right"></i></a>
                    </span>                    
                </div>
            </div>
            `)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('getOffice function error' + xhr.status);
        },
     })



    $.ajax({
        url: uriServices + '/' + city + '/' + address + '/services?type=' + serviceName,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            $('#officeNameAndService').html(officeName + '-' + serviceName)
            
            expertsName.html('')
            for(service in data){
                expertsName.html( expertsName.html() + `
                    <div class="col">
                        <div class="card mb-2 text-center home-card h-100 mb-2">
                            <div class="card-body">
                                <h5 class="card-title mb-2">${service}</h5>
                                <hr>
                                <div class="d-flex justify-content-center align-items-center">
                                    <a type="button" href="/backoffice/services/modifyservice/service/${city}/${address}/doc/${service}" class="btn btn-secondary">
                                        Modifica <i class="bi bi-pencil-square"></i> 
                                    </a>
                                    <button class="btn btn-danger mx-3" onclick="deleteService('${escapeHTML(city)}', '${escapeHTML(address)}', '${escapeHTML(service)}')">
                                        Elimina <i class="bi bi-trash"></i> 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}

function deleteService(city, address, service){
    $.ajax({ 
        url: uriServices + '/' + city + '/' + address + '/services/' + service,
        type: "DELETE",
        async: false,
        xhrFields: {
             withCredentials: true
        },
        success: function () {
           alert('Servizio rimosso con successo')
           searchForModifyOffice()
         },
         error: function (xhr, ajaxOptions, thrownError) { 
            console.log(xhr.status)
            alert('Qualcosa è andato storto :(')
         },
      });
}

function getMonthDays(){
    // get info about today
    const timeElapsed = Date.now()
    const today = new Date(timeElapsed)
    let year = today.getFullYear()
    let month = today.getMonth()
    // get next day
    let day = today.getDate() + 1

    let countDays
    // set counter
    if((month+1) == 2){
        countDays = 28
    } else if((month + 1) == 11 || (month + 1) == 4 || (month + 1) == 6 || (month + 1) == 9){
        countDays = 30
    } else countDays = 31

    $('#selectDay').html('<option value="null" selected>Seleziona Data</option>')
    let date = new Date()
    date.setFullYear(year)
    date.setMonth(month)
    for(day; day <= countDays; day++){
        date.setDate(day)
        $('#selectDay').html($('#selectDay').html() + `<option value="${date.toISOString()}">${date.toLocaleDateString('it-IT')}</option>`)
    }
}


let available
function getAvailable(city, address, service){
    $.ajax({
        url: uriServices + '/' + city + '/' + address + '/services/' + service,
        type: "GET",
        dataType: 'json',
        async:false,
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            available = data.available
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}


function getHours(name, city, address){
    let date = $('#selectDay').val()
    let hours = $('#hours')
    hours.html('')
    hours.html(`
    <p class="fs-5">Seleziona Ore:</p>
    <div class="row row-cols-6 row-cols-lg-12" id="hoursSelection">
    </div>
    `)
    let count = 0
    for(let h = 1; h <= 24; h++){
        $('#hoursSelection').html($('#hoursSelection').html() + `
        <div class="col">
            <input class="form-check-input" type="checkbox" id="hour${count}" value="${h}">
            <label class="form-check-label" for="hour${count}">${h}:00</label>
        </div>
        `)
        count++
    }
    $('#addBtn').html('')
    $('#addBtn').html(`<button class="btn btn-success btn-lg mb-3" onclick="addDate('${name}', '${date}', '${escapeHTML(city)}', '${escapeHTML(address)}')">Aggiungi</button>`)
}

function addDate(service, d, city, address){
    let date = new Date(d)
    let flag = false
    // add date to available
    for(let i = 0; i < 24; i++){
        if($('#hour'+i).is(':checked')){
            flag = true
            let hour = $('#hour'+i).val()
            date.setHours(hour, 0, 0, 0)
            available.push(date.toISOString())
        }
    }

    if(flag){
        // available without duplication
        let arr = [...new Set(available)]

        $.ajax({ 
            url: uriServices + '/' + city + '/' + address + '/services/' + service,
            type: "PATCH",
            data: JSON.stringify({
            available: arr,
            }),
            processData: false,
            contentType: "application/json; charset=UTF-8",
            xhrFields: {
                withCredentials: true
            },
            success: function (data, stringStatus, xhr) {
            alert('Data aggiunta con successo!')
            $('#addBtn').html('')
            $('#msgerror').html('')
            $('#hours').html('')
            },
            error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status)
            alert('Errore: le date che si vuole aggiungere potrebbero essere già prenotate!')
            },
            }) 
    } else {
        $('#msgerror').html(`Si prega di selezionare almeno un'orario!`)
    }  
}

/**
 * ADD SERVICE
 */
function addService(city, address){
    let name = $('#name').val()
    let type = $('#selectServiceType').val()

    if(type != null){

        $.ajax({ 
            url: uriServices + "/" + city + "/" + address + "/services/" + name,
            type: "PUT",
            data: JSON.stringify({
            type: type 
            }),
            processData: false,
            contentType: "application/json; charset=UTF-8",
            xhrFields: {
                withCredentials: true
            },
            success: function (data, stringStatus, xhr) {
                alert('Servizio aggiunto con successo!');
                window.location.href = "https://site212234.tw.cs.unibo.it/backoffice/services";
        
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                alert('Errore, sede non aggiunta correttamente. Riprovare.');
            },
        })

    } else {
        $('#msgerror').html('Selezionare il tipo di servizio che si vuole aggiungere.')
    }
}

/**
 * ADD SERVICE
 */
function searchOffice(){

    let city = $('#selectCity').val()
    let address = $('#selectAddress').val()

    let title = $('#officename')

    $('#addservice').html('')    

    $.ajax({
        url: uriServices + '/' + city + '/' + address,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            title.html(`${data?.name ?? 'AnimalHouse - ' + address} | Aggiungi Servizio`)
            $('#addservice').html(`
            <div class="container text-center">
            <form>
                <fieldset>
                    <div class="form-floating mb-2">
                        <input type="text" class="form-control" id="name" placeholder="Nome Dottore" required>
                        <label for="name">Nome</label>
                    </div>
                    <select class="form-select mb-3" id="selectServiceType" aria-label="selectServiceType">
                        <option value="null" selected>Tipologia di servizio</option>
                        <option value="Veterinario">Veterinario</option>
                        <option value="Dog Sitter">Dog Sitter</option>
                        <option value="Toelettatura">Toelettatura</option>
                        <option value="Psicologo">Psicologo</option>
                        <option value="Visita a domicilio per animali soli">Visita a domicilio per animali soli</option>
                    </select>
                </fieldset>
            </form>
            <p class="text-warning fw-light my-3" id="msgerror"></p>
            <button class="btn btn-success btn-lg" onclick="addService('${escapeHTML(city)}', '${escapeHTML(address)}')">Aggiungi</button>
        </div>
            `)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}



function cityChangeSearchOffice(){
    let selectCity = $('#selectCity')
    let selectAddress = $('#selectAddress')
    selectAddress.html('<option value="null" selected>Seleziona Via</option>')
    if(selectCity.val() != null){
        getAddress(selectCity.val(), '')
    }
}

/**
 * DELETE OFFICE
 */

function searchOfficeDelete(){
    
    let city = $('#selectCity').val()
    let address = $('#selectAddress').val()

    let title = $('#officename')

    $('#addservice').html('')    

    $.ajax({
        url: uriServices + '/' + city + '/' + address,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            title.html(`${data?.name ?? 'AnimalHouse - ' + address}`)
            $('#deleteOffice').html(`
                <button class="btn btn-lg btn-danger" onclick="deleteOffice()">Elimina</button>
            `)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}

function deleteOffice(){
        let city = $('#selectCity').val()
        let address = $('#selectAddress').val()
    
        $.ajax({ 
            url: uriServices + "/" + city + "/" + address,
            type: "DELETE",
            processData: false,
            contentType: "application/json; charset=UTF-8",
            xhrFields: {
                 withCredentials: true
            },
            success: function (data, stringStatus, xhr) {
                alert('Sede eliminata con successo!');
                window.location.href = "https://site212234.tw.cs.unibo.it/backoffice/services";
         
             },
             error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                alert('Errore, sede non aggiunta correttamente. Riprovare.');
             },
          })
}