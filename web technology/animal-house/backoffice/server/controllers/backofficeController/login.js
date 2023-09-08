// site212234.tw.cs.unibo.it/backoffice/login

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render login
exports.renderLogin = async (req,res) => {

    try {

    //body
    let body = `
    <body class="bg-light">
        <div class="container-fluid text-center bg-backoffice p-4 h-50">
            <img src="../../img/navbar-brand/Animal_house_backoffice.svg" alt="" class="w-75">
        </div>

        <div class="container text-center mt-3 w-50">
        
            <h1>LOGIN</h1>

            <form>

                <div class="mb-3">
                    <label for="username" class="form-label">Nome Utente</label>
                    <input type="email" class="form-control" id="username" aria-describedby="usernameHelp" required>
                    <div id="usernameHelp" class="form-text">Nota. Accesso consentito solo ad utenti admin</div>
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" required>
                </div>

                <div id="login-error" hidden>
                    <p class="fw-light text-danger">
                        Nome Utente e/o Password sbagliati. Riprovare.
                    </p>
                </div>

                <button type="button" class="btn btn-lg btn-dark mt-1" onclick="login()">Accedi</button>

            </form>
        </div>
    ` 
    + scripts() +
    ` 
    </body>
    </html>
    `

    let login = header('Backoffice | Login', 'login-script') + body

    res.send(login)
    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' });

    }
}