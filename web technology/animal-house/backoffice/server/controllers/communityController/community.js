// site212234.tw.cs.unibo.it/backoffice/community

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render ecommerce
exports.renderCommunity = async (req,res) => {

    // username
    let username = req.session.username

    try{

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
                        <a class="nav-link" aria-current="page" href="#">Community</a>
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

    <div class="container text-center fs-2 p-4">
        Esplora Bacheche
    </div>

    <div class="container">
        <div class="row row-cols-1 row-cols-lg-3">
            <div class="col mb-3">
                <div class="card home-card">
                    <div class="card-body">
                    <div class="card-title card-title-font text-center mb-4 fs-3">Eccolo Qua</div>
                    <hr>
                    <div class="container p-3 text-center">
                            <img src="/img/community/eccoloqua.jpg" alt="Logo AnimalHouse Back-Office" class="w-100 rounded-circle">
                    </div>
                    <hr>
                    <div class="container text-center">
                            <a href="/backoffice/community/hereItIs" class="btn btn-primary">Esplora</a>
                    </div>
                    
                    </div>
                </div>
            </div>
            <div class="col mb-3">
                <div class="card home-card">
                    <div class="card-body">
                    <div class="card-title card-title-font text-center mb-4 fs-3">Cerco Partner</div>
                    <hr>
                    <div class="container p-3 text-center">
                            <img src="/img/community/cerco-partner.jpg" alt="Logo AnimalHouse Back-Office" class="w-100 rounded-circle">
                    </div>
                    <hr>
                    <div class="container text-center">
                            <a href="/backoffice/community/findingPartner" class="btn btn-success">Esplora</a>
                    </div>
                    
                    </div>
                </div>
            </div>
            <div class="col mb-3">
                <div class="card home-card">
                    <div class="card-body">
                    <div class="card-title card-title-font text-center mb-4 fs-3">Aiutatemi</div>
                    <hr>
                    <div class="container p-3 text-center">
                            <img src="/img/community/aiutatemi.jpg" alt="Logo AnimalHouse Back-Office" class="w-100 rounded-circle">
                    </div>
                    <hr>
                    <div class="container text-center">
                            <a href="/backoffice/community/needHelp" class="btn text-white" style="background-color: #e85d04;">Esplora</a>
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

    let community = header('Backoffice | Community', 'community-script') + body

    res.send(community)

    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' });
    
    }
}