// COMMUNITY

// path
const uriCommunity = "https://site212234.tw.cs.unibo.it/api/v1/boards/"


// BOARD

// get
function getPostsByBoard(boardName){
    $.ajax({
        url: uriCommunity + boardName,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            for(let post of data){
                getPostCards(boardName, post)
            } 
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}

function getPostCards(boardName, post){
    let posts = $('#posts'+boardName)

    $.ajax({
        url: uriCommunity + boardName + '/' + post,
        type: "GET",
        dataType: 'json',
        async: false,
        xhrFields: {
           withCredentials: true
        },success: function (data) {

            let date = new Date(data.date).toLocaleDateString("it-IT")

            if(data?.image == undefined){
            posts.html(posts.html() + `
            <div class="container mb-3">
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <div class="me-auto">${data.username}</div>
                        <div>${date}</div>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p class="card-text">
                        ${data.description}
                    </p>
                    <hr>
                    <button type="button" class="btn btn-outline-dark" id="showComments${data.id}" onclick="showComments('${data.id}', ${escapeHTML(JSON.stringify(data.comments))})">
                        <p hidden>Mostra Commenti</p>
                        <i class="bi bi-chevron-down"></i>
                    </button>
                    <button type="button" class="btn btn-outline-dark" id="hideComments${data.id}" onclick="hideComments('${data.id}')" hidden>
                            <p hidden>Nascondi Commenti</p>
                            <i class="bi bi-chevron-up"></i>
                    </button>
                    <button onclick="deletePost('${boardName}','${data.id}')" class="btn btn-danger">Elimina</button>
                </div>
            </div>
            <div class="list-group" id="comments${data.id}">          
            </div>
            </div>
                `)
            } else {
                posts.html(posts.html() + `
                <div class="container mb-3">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between">
                            <div class="me-auto">${data.username}</div>
                            <div>${date}</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${data.title}</h5>
                        <p class="card-text">
                            ${data.description}
                        </p>
                        <img class="card-img-bottom w-25" src="${data.image}" alt="Immagine Post"></img>
                        <hr>
                        <button type="button" class="btn btn-outline-dark" id="showComments${data.id}" onclick="showComments('${data.id}', ${escapeHTML(JSON.stringify(data.comments))})">
                            <p hidden>Mostra Commenti</p>
                            <i class="bi bi-chevron-down"></i>
                        </button>
                        <button type="button" class="btn btn-outline-dark" id="hideComments${data.id}" onclick="hideComments('${data.id}')" hidden>
                                <p hidden>Nascondi Commenti</p>
                                <i class="bi bi-chevron-up"></i>
                        </button>
                        <button onclick="deletePost('${boardName}','${data.id}')" class="btn btn-danger">Elimina</button>
                    </div>
                </div>
                <div class="list-group" id="comments${data.id}">          
                </div>
                </div> `)
            }
/*             if(data.image != ''){
                posts.html(posts.html() + `<img class="card-img-bottom" src="${data.image}" alt="Immagine Post"></img>`)
            } */
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}

// https://stackoverflow.com/a/6234804
function escapeHTML(str) {
    return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

// delete
function deletePost(boardName, postId){
    $.ajax({ 
        url: uriCommunity + boardName + '/' + postId,
        type: "DELETE",
        xhrFields: {
             withCredentials: true
        },
        success: function (data, stringStatus, xhr) {
           alert('Post rimosso con successo!')
           $('#posts'+boardName).html('')
           getPostsByBoard(boardName)
         },
         error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            console.log(xhr.status)
         },
      });
}


// SEARCH POSTS

// By Username
function searchPostsByUsername(boardName){
    let username = $('#searchPostsByUsername').val()

    $.ajax({
        url: uriCommunity + boardName + '?username=' + username,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            if(data.length != 0){
                $('#posts'+boardName).html('')
                for(let post of data){
                    getPostCards(boardName, post)
                } 
            } else $('#posts'+boardName).html('<p class="text-danger mt-3">Nessun post con username: ' + username + '</p>')
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}

// By Title
function searchPostsByTitle(boardName){
    let title = $('#searchPostsByTitle').val()

    $.ajax({
        url: uriCommunity + boardName + '?title=' + title,
        type: "GET",
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },success: function (data) {
            if(data.length != 0){
                $('#posts'+boardName).html('')
                for(let post of data){
                    getPostCards(boardName, post)
                } 
            } else $('#posts'+boardName).html('<p class="text-danger mt-3">Nessun post con titolo: ' + title + '</p>')
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
        },
     })
}


// COMMENTS

function showComments(id, commentsArr){
    $('#showComments'+id).attr('hidden', true)
    $('#hideComments'+id).attr('hidden', false)

    let comments = $('#comments'+id)

    for(let comment in commentsArr){
        let date = new Date(commentsArr[comment]?.date).toLocaleDateString("it-IT")
        comments.html(comments.html() + `
        <div class="list-group-item list-group-item" aria-current="true">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${commentsArr[comment]?.username}</h6>
                <small>${date}</small>
            </div>
            <p class="my-4">${commentsArr[comment]?.description}</p>
            <hr>
            <button class="btn btn-danger" onclick="deleteComment('${id}', '${comment}')">Elimina</button>
        </div>`)
    }
}

function hideComments(id){
    $('#showComments'+id).attr('hidden', false)
    $('#hideComments'+id).attr('hidden', true)

    let comments = $('#comments'+id)
    comments.html('')
}

// delete
function deleteComment(id, index){
    $.ajax({ 
        url: uriCommunity + id + '/comments/' + index,
        type: "DELETE",
        xhrFields: {
             withCredentials: true
        },
        success: function (data, stringStatus, xhr) {
           alert('Commento rimosso con successo!')
           hideComments(id)
         },
         error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status)
         },
      });
}