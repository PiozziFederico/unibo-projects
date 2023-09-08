// site212234.tw.cs.unibo.it/backoffice/users

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render home
exports.renderUser = async (req,res) => {

    // username
    let username = req.session.username

    try{

    // script
    let script = `
        <script>
        $("#admin1").on('change', function() {
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
                    <a class="nav-link" aria-current="page" href="#">Clienti</a>
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
        <h1>Anagrafica Clienti</h1>
    </div>

    <!--Ricerca Cliente-->
    <section id="search-user">
        <div class="container my-4">
            <div class="fs-2 text-center">
                <span>Ricerca Cliente</span>
            </div>
        </div>

        <div class="container">
            <div class="d-flex justify-content-between align-items-center w-50 mx-auto">
                <div class="input-group">
                    <input type="text" class="form-control" id="usernameSearch" placeholder="Inserire Nome Utente" aria-label="Username">
                    <button type="button" value="searchUser" class="btn btn-outline-secondary" onclick="searchUser()">
                        <span hidden>Cerca</span>
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </div>
        </div>

        
        <div class="container" id="user-data">
        <!--USER DATA-->
        </div>
        <div class="text-center text-danger fs-5" id="search-error">
        <!--MESSAGE ERROR-->
        </div>
        <div class="text-center text-success fs-5" id="message">
        <!--MESSAGE-->
        </div>
            
            <!--TABELLA ANIMALI E PUNTEGGIO DA MOSTRARE DOPO IL CLICK SUL BOTTONE MOSTRA ALTRO-->
            <div class="container-fluid">
                <div class="container text-center"  id="points">
                    <!--POINTS TABLE-->
                </div>
                <div id="msgreset" class="text-center text-success mb-2"></div>
                <div id="errorreset" class="text-center text-danger mb-2"></div>
                <div class="container text-center" id="animals">
                    <!--ANIMALS TABLE-->
                </div>
                <div id="msgdeleteanimalsuccess" class="text-center text-success mb-2"></div>
                <div id="msgdeleteanimalerror" class="text-center text-danger mb-2"></div>
            </div>

        <div class="modal" id="modifyAnimal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modifica Animale</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="formModifyAnimal">
                </div>
                <div class="modal-footer">
                    <div id="modal-error"></div>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" onclick="confirmModifyAnimal()" data-bs-dismiss="modal">Modifica</button>
                </div>
                </div>
            </div>
        </div>
    </section>

    <!--Aggiungere Nuovo Cliente-->
    <section class="my-5">
        <div class="container-fluid p-3" id="bg-add-user-link">
            <div class="text-center">
                <span class="fs-4 px-3">
                    <a type="button" role="button" href="/backoffice/users/newuser" class="link-light text-decoration-none"> Aggiungi un nuovo cliente <i class="bi bi-chevron-double-right"></i></a>
                </span>                    
            </div>
        </div>
    </section>

    <!--Tabella Clienti-->
    <section class="text-center" id="table-user">
        <div class="container pt-2">
            <div class="fs-2 text-center">
                <span>Tabella Clienti</span>
            </div>
        </div>

        <div class="container mt-3">
            <button type="button" class="btn btn-dark" id="show" onclick="showUsers()">Mostra Clienti <i class="bi bi-caret-down"></i></button>
            <button type="button" class="btn btn-dark" id="hide" onclick="hideUsers()" hidden>Nascondi Clienti <i class="bi bi-caret-up"></i></button>
        </div>

        <!--CONTENUTO DA MOSTRARE/NASCONDERE A SECONDA DEL BOTTONE PREMUTO -->
        <div class="container mt-5">
            <table class="table table-dark m-auto" id="userTable" hidden>
            </table>
            <p class="mt-2 text-warning" id="tableError"></p>
        </div>

        <div class="modal" id="modifyUser" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header bg-backoffice">
                    <h5 class="modal-title">Modifica Utente</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="formModifyUser">
                </div>
                <div class="modal-footer">
                    <div id="modal-error"></div>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" onclick="confirmModifyUser()" data-bs-dismiss="modal">Modifica</button>
                </div>
                </div>
            </div>
        </div>
    </section>

    ` 
    + script + scripts() +
    ` 
    </body>
    </html>
    `

    let user = header('Backoffice | Clienti', 'user-script') + body

    res.send(user)

    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' });
    
    }
}

