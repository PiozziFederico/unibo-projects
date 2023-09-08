// site212234.tw.cs.unibo.it/backoffice/profile

// require
const { header, scripts } = require('../../../public/js/utils/template')
const { isAdmin } = require('../../../../database')

// render profile
exports.renderProfile = async (req,res) => {

    // username
    let username = req.session.username

    console.log(username)

    let admin = await isAdmin(username)

    try {

    // script
    let script = `
    <script>
        $(() => {
            if(${admin}){
                $('#admin').attr('checked')
            }
            getUserCredentials('${username}')
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

                    <a class="link-dark" id="logout-margin" href="/backoffice/login" onclick="logout(); return false;">Logout</a>
                </div>
            </div>
        </nav>

        <div class="container text-center my-3">
            <h1>Profilo Utente</h1>
            <img src="/img/profile/profile-icon.svg" alt="Icona Profilo" class="my-3">
            <p class="lead fs-2" id="username">${username}</p>
        </div>
        <hr>
        <div class="container text-center mt-4 w-50">
            <h2 class="mb-3">Dati Profilo</h2>
            <div class="row row-cols-1 row-cols-lg-2 g-2">
                <div class="col">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="usernameInput" placeholder="${username}" value="${username}" disabled>
                        <label for="usernameInput">Nome Utente</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="password" placeholder="" value="">
                        <label for="password">Password</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="name" placeholder="" value="">
                        <label for="name">Nome</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="surname" placeholder="" value="">
                        <label for="surname">Cognome</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="my-4 text-center">
            <input class="form-check-input" type="checkbox" id="admin" value=${admin}>
            <label class="form-check-label" for="admin">
                Admin
            </label>
        </div>
        <div class="container my-3 text-center">
            <a type="button" class="btn btn-danger" href="javascript:history.go(-1)">Indietro</a>
            <button class="btn btn-primary" onclick="patchUserCredentials()">Modifica</button>
        </div>

    ` 
    + script 
    + scripts() +
    ` 
    </body>
    </html>
    `

    let profile = header('Backoffice | Profilo', 'profile-script') + body

    res.send(profile)
    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' })

    }
}
