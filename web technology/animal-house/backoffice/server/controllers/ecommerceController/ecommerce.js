// site212234.tw.cs.unibo.it/backoffice/ecommerce

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render ecommerce
exports.renderEcommerce = async (req,res) => {

    // username
    let username = req.session.username

    try{

    // script
    let script = `
    <script>
        $( document ).ready(() => { getCategories() })
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
                        <a class="nav-link" aria-current="page" href="#">Ecommerce</a>
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
                Gestione Ecommerce
            </h1>
        </div>

        <div class="container text-center fs-2 p-4">
            Esplora Categorie
        </div>
        <div class="container">
            <div class="row row-cols-1 row-cols-xl-3 g-5" id="categories">
            </div>
        </div>

        <div class="container text-center p-4 fs-2 mt-3">
            Gestione Prodotti    
        </div>

        <div class="container mb-5">
            <div class="row row-cols-1 row-cols-lg-2">
                <div class="col mb-lg-0 mb-3">
                    <div class="card text-center home-card h-100">
                        <div class="card-body">
                        <h5 class="card-title">Ricerca Prodotti</h5>
                        <p class="card-text">Permette di ricercare e filtrare su tutti i prodotti presenti nell'ecommerce</p>
                        <a href="/backoffice/ecommerce/searchproducts" class="btn btn-secondary">
                            Cerca <i class="bi bi-search"></i> 
                        </a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card text-center home-card h-100">
                        <div class="card-body">
                        <h5 class="card-title">Aggiungi Prodotto</h5>
                        <p class="card-text">Permette di aggiungere prodotti specificandone nome, prezzo, descrizione</p>
                        <a href="/backoffice/ecommerce/addproducts" class="btn btn-success">
                            Aggiungi <i class="bi bi-plus"></i> 
                        </a>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    ` 
    + script + scripts() +
    ` 
    </body>
    </html>
    `

    let ecommerce = header('Backoffice | Ecommerce', 'ecommerce-script') + body

    res.send(ecommerce)

    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' });
    
    }
}