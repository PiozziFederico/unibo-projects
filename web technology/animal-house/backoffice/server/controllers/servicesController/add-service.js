// site212234.tw.cs.unibo.it/backoffice/services/modifyservice/service/:city/:address/:officename/addservice

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render home
exports.renderAddService = async (req,res) => {

    // username
    let username = req.session.username

    // params
    let city = req.params.city
    let address = req.params.address
    let name = req.params.officename

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


    <div class="container-fluid text-center bg-backoffice py-4">
        <h1>Servizi</h1>
    </div>
    <div class="container-fluid pt-4 px-3">
        <a class="link-dark" href="javascript:history.go(-1)">Indietro</a>
    </div>
    <div class="container text-center fs-2 p-4">
        Aggiungi Servizio - ${name}
    </div>
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
        `
    + scripts() +
    ` 
    </body>
    </html>
    `

let addService = header('Backoffice | Servizi | Aggiungi', 'services-script') + body

res.send(addService)

} catch(error) {

    res.status(500).send({ message: error.message || 'Error Occured' });

}
}

function escapeHTML(str) {
    return str.replaceAll('&', '\\&').replaceAll('<', '\\<').replaceAll('>', '\\>').replaceAll('"', '\\"').replaceAll("'", "\\'");
}
