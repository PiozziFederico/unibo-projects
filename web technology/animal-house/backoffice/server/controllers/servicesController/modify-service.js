// site212234.tw.cs.unibo.it/backoffice/services/modifyservice

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render home
exports.renderModifyService = async (req,res) => {

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
        Modifica Servizio
    </div>
    <div class="container text-center">
        <form>
            <fieldset>
                <select class="form-select mb-3" id="selectServiceName" aria-label="selectServiceName" onchange="serviceNameChange()">
                    <option value="null" selected>Seleziona Servizio</option>
                    <option value="Veterinario">Veterinario</option>
                    <option value="Dog Sitter">Dog Sitter</option>
                    <option value="Toelettatura">Toelettatura</option>
                    <option value="Psicologo">Psicologo</option>
                    <option value="Visita a domicilio per animali soli">Visita a domicilio per animali soli</option>
                </select>
                <select class="form-select mb-3" id="selectCity" aria-label="selectCity" onchange="cityChange($('#selectServiceName').val())">
                    <option value="null" selected>Seleziona Città</option>
                </select>
                <select class="form-select mb-3" id="selectAddress" aria-label="selectAddress" onchange="addressChange($('#selectServiceName').val())">
                    <option value="null" selected>Seleziona Via</option>
                </select>
            </fieldset>
        </form>
        <button class="btn btn-warning btn-lg" onclick="searchForModifyOffice()">Cerca</button>
    </div>
    <hr>
    <div class="container text-center">
        <p class="fs-3" id="officeNameAndService"></p>
    </div>
    <div class="container">
        <div class="row row-cols-1 row-cols-lg-3" id="expertsName">
        </div>
    </div>
    <div id="addServiceLink">
    </div>
        `
    + scripts() +
    ` 
    </body>
    </html>
    `

let modifyService = header('Backoffice | Servizi | Modifica', 'services-script') + body

res.send(modifyService)

} catch(error) {

    res.status(500).send({ message: error.message || 'Error Occured' });

}
}

