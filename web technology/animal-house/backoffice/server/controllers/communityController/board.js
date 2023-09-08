// site212234.tw.cs.unibo.it/backoffice/community/:board

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render ecommerce
exports.renderBoard = async (req,res) => {

    // username
    let username = req.session.username

    // board
    let boardName = req.params.board

    let boardTitle = boardName
    // board title on screen
    if(boardName === 'hereItIs'){
        boardTitle = 'Eccolo Qua'
    } else if(boardName === 'findingPartner'){
        boardTitle = 'Cerco Partner'
    } else{
        boardTitle = 'Aiutatemi'
    } 

    try{

    // script
    let script = `
    <script>
        $(() => {
            getPostsByBoard('${boardName}')
        })
    </script>
    `

    // body
    let body = `
    <body class="bg-light">
    <nav class="navbar navbar-expand-lg bg-backoffice py-3">
        <div class="container-fluid text-dark mx-3">

            <a class="navbar-brand" href="/backoffice/home">
                <img src="/img/navbar-brand/Animal_house_backoffice.svg" alt="" height="40">
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto nav-link-margin">
                    <li class="nav-item">
                    <a class="nav-link" href="/backoffice/home">Home</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/backoffice/users">Clienti</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/backoffice/community">Community</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/backoffice/ecommerce">Ecommerce</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/backoffice/services">Servizi</a>
                    </li>
                </ul> 

                <div class="d-flex align-items-center">
                    <div class="h2">
                        <a href="/backoffice/profile" class="link-dark">
                            <p hidden>Profilo</p>
                            <i class="bi bi-person-circle"></i>
                        </a>
                    </div>

                    <div id="username" class="mx-2">${username}</div>
                </div>
                
                <a class="link-dark" id="logout-margin" href="/backoffice/login">Logout</a>
            </div>
        </div>
    </nav>

    <div class="container-fluid bg-backoffice text-center py-4">
        <h1>
            Gestione Community
        </h1>
    </div>

    
    <div class="container-fluid pt-4 px-3">
        <a class="link-dark" href="javascript:history.go(-1)">Indietro</a>
    </div>

    <div class="container text-center fs-2 p-4">
        ${boardTitle}
    </div>

    <hr class="m-0">
    
    <div class="container-fluid">
    <div class="row">
        <div class="col-3" id="filters">
            <h5 class="my-5">Filtri di Ricerca</h5>
            <p class="mt-3">Filtra per Username</p>
            <div class="input-group mb-5">
                <input type="text" class="form-control" placeholder="Nome Utente" id="searchPostsByUsername" aria-label="Username" aria-describedby="searchPostsByUsername">
                <button class="btn btn-outline-secondary btn-sm" type="button" onclick="searchPostsByUsername('${boardName}')">
                    <p hidden>Cerca per Nome Utente</p>
                    <i class="bi bi-search"></i>
                </button>
            </div>

            <p>Filtra per Titolo</p>
            <div class="input-group mb-5">
                <input type="text" class="form-control" placeholder="Titolo" id="searchPostsByTitle" aria-label="Title" aria-describedby="searchPostsByTitle">
                <button class="btn btn-outline-secondary btn-sm" type="button" onclick="searchPostsByTitle('${boardName}')">
                    <p hidden>Cerca per Titolo</p>
                    <i class="bi bi-search"></i>
                </button>
            </div>
        </div>
        <div class="col mt-2" id="posts${boardName}">
        </div>
    </div>
    </div>






    ` 
    + script + scripts() +
    ` 
    </body>
    </html>
    `

    let board = header('Backoffice | Community | ' + boardName, 'community-script') + body

    res.send(board)

    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' });
    
    }
}