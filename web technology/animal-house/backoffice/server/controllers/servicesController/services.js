// site212234.tw.cs.unibo.it/backoffice/services

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render home
exports.renderServices = async (req,res) => {

    // username
    let username = req.session.username

    try{

    // body
    let body = `
    <body class="bg-light">
    <nav class="navbar navbar-expand-lg bg-backoffice py-3">
        <div class="container-fluid text-dark mx-3">

            <a class="navbar-brand" href="/backoffice/home">
                <img src="../../img/navbar-brand/Animal_house_backoffice.svg" alt="" height="40">
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
                    <a class="nav-link" aria-current="page"  href="#">Servizi</a>
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


    <div class="container-fluid text-center bg-backoffice py-4">
        <h1>Servizi</h1>
    </div>
    <div class="container text-center fs-2 p-4">
        Esplora Servizi
    </div>

    <div class="container">
        <div class="row row-cols-1 row-cols-lg-3">
            <div class="col mb-3">
                <div class="card home-card">
                    <div class="card-body">
                    <div class="card-title card-title-font text-center mb-4 fs-3">Veterinario</div>
                    <hr>
                    <div class="container p-3 text-center">
                            <img src="/img/services/veterinario.jpg" alt="Logo AnimalHouse Back-Office" class="w-100 rounded-circle">
                    </div>
                    <hr>
                    <div class="container text-center">
                            <a href="/backoffice/services/service/Veterinario" class="btn btn-primary">Esplora</a>
                    </div>
                    
                    </div>
                </div>
            </div>
            <div class="col mb-3 h-100">
                <div class="card home-card">
                    <div class="card-body">
                    <div class="card-title card-title-font text-center mb-4 fs-3">Psicologo</div>
                    <hr>
                    <div class="container p-3 text-center">
                            <img src="/img/services/psicologo.jpg" alt="Logo AnimalHouse Back-Office" class="w-100 rounded-circle">
                    </div>
                    <hr>
                    <div class="container text-center">
                            <a href="/backoffice/services/service/Psicologo" class="btn btn-primary">Esplora</a>
                    </div>
                    
                    </div>
                </div>
            </div>
            <div class="col mb-3">
                <div class="card home-card">
                    <div class="card-body">
                    <div class="card-title card-title-font text-center mb-4 fs-3">Toelettatura</div>
                    <hr>
                    <div class="container p-3 text-center">
                            <img src="/img/services/toelettatura.jpg" alt="Logo AnimalHouse Back-Office" class="w-100 rounded-circle">
                    </div>
                    <hr>
                    <div class="container text-center">
                            <a href="/backoffice/services/service/Toelettatura" class="btn btn-primary">Esplora</a>
                    </div>
                    
                    </div>
                </div>
            </div>
            <div class="col mb-3">
                <div class="card home-card">
                    <div class="card-body">
                    <div class="card-title card-title-font text-center mb-4 fs-3">Dog sitter</div>
                    <hr>
                    <div class="container p-3 text-center">
                            <img src="/img/services/dog-sitter3.jpg" alt="Logo AnimalHouse Back-Office" class="w-100 rounded-circle">
                    </div>
                    <hr>
                    <div class="container text-center">
                            <a href="/backoffice/services/service/DogSitter" class="btn btn-primary">Esplora</a>
                    </div>
                    
                    </div>
                </div>
            </div>
            <div class="col mb-3 h-100">
                <div class="card home-card">
                    <div class="card-body">
                    <div class="card-title card-title-font text-center mb-4 fs-3">Animali Soli</div>
                    <hr>
                    <div class="container p-3 text-center">
                            <img src="/img/services/animali-soli.jpg" alt="Logo AnimalHouse Back-Office" class="w-100 rounded-circle">
                    </div>
                    <hr>
                    <div class="container text-center">
                            <a href="/backoffice/services/service/AnimaliSoli" class="btn btn-primary">Esplora</a>
                    </div>
                    
                    </div>
                </div>
            </div>
        </div>
    </div>

    <hr>

    <div class="container text-center fs-2 p-4">
        Gestione Servizi
    </div>

    <div class="container mb-5">
        <div class="row row-cols-1 row-cols-xl-5">
            <div class="col mb-lg-0 mb-3">
                <div class="card mb-3 text-center home-card h-100">
                    <div class="card-body">
                    <h5 class="card-title">Prenota Servizio</h5>
                    <p class="card-text">Permette di prenotare un servizio specificando usede e data a scelta.</p>
                    <a href="/backoffice/services/book" class="btn btn-secondary">
                        Prenota <i class="bi bi-pencil-square"></i> 
                    </a>
                    </div>
                </div>
            </div>
            <div class="col mb-lg-0 mb-3">
                <div class="card mb-3 text-center home-card h-100">
                    <div class="card-body">
                    <h5 class="card-title">Modifica Servizio</h5>
                    <p class="card-text">Permette di modificare un servizio (nome, date prenotazioni ecc.)</p>
                    <a href="/backoffice/services/modifyservice" class="btn btn-primary">
                        Modifica <i class="bi bi-pencil"></i> 
                    </a>
                    </div>
                </div>
            </div>
            <div class="col mb-lg-0 mb-3">
            <div class="card mb-3 text-center home-card h-100">
                <div class="card-body">
                <h5 class="card-title">Aggiungi Servizio</h5>
                <p class="card-text">Permette di aggiungere un servizio (nome, date prenotazioni ecc.)</p>
                <a href="/backoffice/services/showoffices" class="btn btn-success">
                    Aggiungi <i class="bi bi-plus"></i> 
                </a>
                </div>
            </div>
        </div>
            <div class="col mb-lg-0 mb-3">
                <div class="card text-center home-card h-100">
                    <div class="card-body">
                    <h5 class="card-title">Aggiungi Sede</h5>
                    <p class="card-text">Permette di aggiungere una sede specificandone i servizi disponibili</p>
                    <a href="/backoffice/services/addoffice" class="btn btn-warning text-white">
                        Aggiungi <i class="bi bi-plus"></i> 
                    </a>
                    </div>
                </div>
            </div>
            <div class="col">
            <div class="card text-center home-card h-100">
                <div class="card-body">
                <h5 class="card-title">Elimina Sede</h5>
                <p class="card-text">Permette di eliminare una sede specificandone città e indirizzo</p>
                <a href="/backoffice/services/deleteoffice" class="btn btn-danger">
                    Elimina <i class="bi bi-trash"></i> 
                </a>
                </div>
            </div>
        </div>
            </div>
        </div>
    </div>
    `
    + scripts() +
    ` 
    </body>
    </html>
    `

    let services = header('Backoffice | Servizi', 'services-script') + body

    res.send(services)

    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' });
    
    }
}
