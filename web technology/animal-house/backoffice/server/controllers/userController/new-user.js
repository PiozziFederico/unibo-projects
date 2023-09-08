// site212234.tw.cs.unibo.it/backoffice/users/newuser

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render new user
exports.renderNewUser = async (req,res) => {

    // username
    let username = req.session.username

    try{
        // script
        let script = `
        <script>
        $("#admin").on('change', function() {
            if ($(this).is(':checked')) {
              $(this).attr('value', 'true');
            } else {
              $(this).attr('value', 'false');
            }
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

        <!--Titolo-->
        <div class="container-fluid text-center p-5" style="background-color: #ffb703;">
            <div class="text-dark fs-1">Anagrafica Clienti</div>
        </div>

        <!--Aggiungi Cliente-->
        <section id="new-user">
        <div class="container mt-3">
            <div class="fs-2 text-center">
                <span>Aggiungi Cliente</span>
            </div>
        </div>

        <div class="container mt-3">
                    <legend>Dati Cliente</legend>
                    <div class="row g-3 p-sm-5">
                        <div class="col">
                            <label for="name" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="name">
                        </div>
                        <div class="col">
                            <label for="surname" class="form-label">Cognome</label>
                            <input type="text" class="form-control" id="surname">
                        </div>
                    </div>
                    <div class="row g-3 p-sm-5">
                        <div class="col">
                            <label for="usernameInput" class="form-label">Username</label>
                            <input type="text" class="form-control" id="usernameInput" required>
                        </div>
                        <div class="col">
                            <label for="password" class="form-label">Password</label>
                            <input type="text" class="form-control" id="password">
                        </div>
                    </div>
                    <div class="text-center pb-sm-5 pt-2">
                        <input class="form-check-input" type="checkbox" value="false" id="admin">
                        <label class="form-check-label" for="admin">Admin</label>
                    </div>

                    <div class="text-center">
                        <button type="button" class="btn btn-lg btn-dark m-5" onclick="AddNewUser()">Registra Cliente</button>
                        <a type="button" class="btn btn-lg btn-danger m-5" href="/backoffice/users" style="width: 171.41px;">Annulla</a>
                    </div>
        </div>
        ` 
        + script + scripts() +
        ` 
        </body>
        </html>
        `
    
        let newUser = header('Backoffice | Clienti | Nuovo Cliente', 'user-script') + body
    
        res.send(newUser)
    
        } catch(error) {
    
            res.status(500).send({ message: error.message || 'Error Occured' });
        
        }
}
