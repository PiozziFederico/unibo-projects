// site212234.tw.cs.unibo.it/backoffice/

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render root
exports.renderRoot = async (req,res) => {

    try {
    //body
    let body = `
    <body class="bg-light">
        <div class="container-fluid bg-backoffice text-center p-5">
            <img src="/img/navbar-brand/Animal_house_backoffice.svg" alt="" class="dim-logo-backoffice">
            <div class="container text-center">
                <a href="/backoffice/login" type="button"class="btn btn-dark btn-lg mt-5">Accedi <i class="bi bi-chevron-right"></i></a>
            </div>
        </div>

        <div class="container text-center mt-3 h-25">
            <h1 class="my-5">Esplora Servizi</h1>
            <div class="row row-cols-1 row-cols-md-2 g-3">
                <div class="col">
                    <div class="card text-center home-card">
                        <span class="badge bg-secondary">
                            <img src="/img/home/clienti-icon.svg" class="w-25 mx-auto m-4" alt="icona community">
                        </span>
                        <div class="card-body">
                        <h5 class="card-title">Anagrafica Clienti</h5>
                        <a href="#users" class="btn btn-secondary">Esplora</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card text-center home-card">
                        <span class="badge bg-warning">
                            <img src="/img/home/community-icon.svg" class="w-25 mx-auto m-4" alt="icona community">
                        </span>
                        <div class="card-body">
                        <h5 class="card-title">Gestione Community</h5>
                        <a href="#community" class="btn btn-warning">Esplora</a>
                        </div>
                    </div>
                </div>
                <div class="col mt-5">
                    <div class="card text-center home-card">
                        <span class="badge bg-dark">
                            <img src="/img/home/ecommerce-icon.svg" class="w-25 mx-auto m-4" alt="icona ecommerce">
                        </span>
                        <div class="card-body">
                        <h5 class="card-title">Gestione Ecommerce</h5>
                        <a href="#ecommerce" class="btn btn-dark">Esplora</a>
                        </div>
                    </div>
                </div>
                <div class="col mt-5">
                    <div class="card text-center home-card">
                        <span class="badge bg-danger">
                            <img src="/img/home/servizi-icon.svg" class="w-25 mx-auto m-4" alt="icona servizi">
                        </span>
                        <div class="card-body">
                        <h5 class="card-title">Gestione Servizi</h5>
                        <a href="#services" class="btn btn-danger text-white">Esplora</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <!--Sezione Anagrafica Clienti-->
        <hr id="users">

        <section class="p-5 my-5">
            <div class="d-md-flex justify-content-center align-items-center">
                <div class="container w-md-50 text-center text-dark">
                    <h3>Anagrafica Clienti</h3>
                    <p class="lead m-5">
                        Questo servizio permette di gestire le informazioni sui clienti: registrazione, login, cambio/reset password ecc.
                    </p>
                    <p class="lead">
                        <a href="/backoffice/login"  type="button" role="button" onclick="login()" class="btn btn-secondary m-3 text-white">Accedi <i class="bi bi-chevron-compact-right"></i></a>
                    </p>
                </div>
                <div class="container w-md-50 text-center text-dark">
                    <img src="/img/home/clienti.jpg" alt="Immagine servizio anagrafica clienti" class="rounded-circle mx-auto w-75">
                </div>
            </div>
        </section>

        <!--Sezione Community-->
        <hr id="community">

        <section class="p-5 my-5">
            <div class="d-md-flex justify-content-center align-items-center">
                <div class="container w-md-50 text-center text-dark">
                    <img src="/img/home/community.jpg" alt="Immagine servizio gestione community" class="rounded-circle mx-auto w-75">
                </div>
                <div class="container w-md-50 text-center text-dark mt-3">
                    <h3>Gestione Community</h3>
                    <p class="lead m-5">
                        Questo servizio permette di controllare e/o cancellare i messaggi nelle bachece.
                    </p>
                    <p class="lead">
                        <a href="/backoffice/login" onclick="login()" type="button" role="button" class="btn btn-warning m-3">Accedi <i class="bi bi-chevron-compact-right"></i></a>
                    </p>
                </div>
            </div>
        </section>

        
        <!--Sezione E-Commerce-->
        <hr id="ecommerce">

        <section class="p-5 my-5">
            <div class="d-md-flex justify-content-center align-items-center">
                <div class="container w-md-50 text-center text-dark">
                    <h3>Gestione Ecommerce</h3>
                    <p class="lead m-5">
                        Questo servizio permette di aggiungere e/o togliere prodotti, prezzi e descrizioni. 
                    </p>
                    <p class="lead">
                        <a href="/backoffice/login" onclick="login()" type="button" role="button" class="btn btn-dark m-3">Accedi <i class="bi bi-chevron-compact-right"></i></a>
                    </p>
                </div>
                <div class="container w-md-50 text-center text-dark">
                    <img src="/img/home/ecommerce.jpg" alt="Immagine servizio gestione ecommerce" class="rounded-circle mx-auto w-75">
                </div>
            </div>
        </section>

        <!--Sezione Servizi-->
        <hr id="services">

        <section class="p-5 my-5">
            <div class="d-md-flex justify-content-center align-items-center">
            <div class="container w-md-50 text-center text-dark">
                <img src="/img/home/servizi.jpg" alt="Immagine servizio gestione ecommerce" class="rounded-circle mx-auto w-75">
            </div>
            <div class="container w-md-50 text-center text-dark mt-3">
                <h3>Gestione Servizi</h3>
                <p class="lead m-5">
                Questo servizio permette di prenotare servizi in presenza, modificare/cancellare prenotazioni e visualizzare le disponibilità.
                </p>
                <p class="lead">
                    <a href="/backoffice/login" onclick="login()" type="button" role="button" class="btn btn-danger m-3">Accedi <i class="bi bi-chevron-compact-right"></i></a>
                </p>
                </div>
            </div>
        </section>      
    ` 
    + scripts() +
    ` 
    </body>
    </html>
    `

    // no script in header
    let root = header('Backoffice') + body

    res.send(root)
    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' });

    }
}