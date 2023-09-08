// site212234.tw.cs.unibo.it/backoffice/ecommerce/searchproducts

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render home
exports.renderSearchProducts = async (req,res) => {

    // username
    let username = req.session.username

    try{

    // script
    let script = `
    <script>
        window.onload = () => {
            getAllProducts()
        }
    </script>
    `

    // body
    let body = `
    <body class="bg-light">
    <nav class="navbar navbar-expand-lg bg-backoffice py-3">
        <div class="container-fluid text-dark mx-3">

            <a class="navbar-brand" href="#">
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
                    <a class="nav-link" href="/backoffice/community">Ecommerce</a>
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

    <div class="container-fluid pt-4 px-3">
        <a class="link-dark" href="javascript:history.go(-1)">Indietro</a>
    </div>


    <div class="container text-center fs-2 p-4">
        Ricerca Prodotti
    </div>

    <div class="container mb-3">
        <div class="d-flex justify-content-between align-items-center w-50 mx-auto">
            <div class="input-group">
                <input type="text" class="form-control" id="productSearch" placeholder="Inserire Nome Prodotto" aria-label="Product Name">
                <button type="button" value="productSearch" class="btn btn-outline-secondary" onclick="searchProductsByName()">
                    <span hidden>Cerca</span>
                    <i class="bi bi-search"></i>
                </button>
            </div>
        </div>
    </div>

    <hr>

    <div class="container mt-4">
        <p class="lead text-secondary text-center" id="searchProductsByNameMessage">Nessun prodotto cercato...</p>
        <div class="row row-cols-1 row-cols-lg-3" id="searchProductsByNameResult"></div>
    </div>
    ` 
    + script + scripts() +
    ` 
    </body>
    </html>
    `

    let searchProducts = header('Backoffice | Ecommerce | Ricerca', 'ecommerce-script') + body

    res.send(searchProducts)

    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' });
    
    }
}