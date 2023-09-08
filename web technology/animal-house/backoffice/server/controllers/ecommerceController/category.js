// site212234.tw.cs.unibo.it/backoffice/ecommerce/:category

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render category
exports.renderCategory = async (req,res) => {

    // username
    let username = req.session.username

    //category
    let categoryName = req.params.category

    try{

    // script
    let script = `
        <script>
            $(function() {
                getProductsByCategory('${categoryName}')
            })
        </script>
    `
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
        ${categoryName}
    </div>

    <hr class="m-0">
    
    <div class="container-fluid">
        <div class="row">
            <div class="col-3" id="filters">
                <h5 class="my-5">Filtri di Ricerca</h5>
                <p class="mt-3">Filtra per Nome</p>
                <div class="input-group mb-5">
                    <input type="text" class="form-control" placeholder="Nome" aria-label="Name" aria-describedby="productSearch" id="productSearch">
                    <button class="btn btn-outline-secondary btn-sm" type="button" onclick="searchProductsByNameAndCategory()">
                        <p hidden>Cerca</p>
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </div>
            <div class="col">
                <div class="container-fluid mt-3">
                    <div class="row row-cols-1 row-cols-xl-3" id="searchProductsByNameResult">
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

    let category = header('Backoffice | Ecommerce | ' + categoryName, 'ecommerce-script') + body

    res.send(category)

    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' });
    
    }
}