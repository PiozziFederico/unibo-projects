// site212234.tw.cs.unibo.it/backoffice/services/:service

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render home
exports.renderService = async (req,res) => {

    // username
    let username = req.session.username

    // service
    let serviceName = req.params.service

    if(serviceName == 'DogSitter'){
        serviceName = 'Dog Sitter'
    } else if(serviceName == 'AnimaliSoli'){
        serviceName = 'Visita a domicilio per animali soli'
    }

    try{

    // script
    let script = `
    <script>

        // on load
        $( () => {
            getCities('${serviceName}')
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
        ${serviceName}
    </div>

    <div class="container p-3">
        <form>
        <fieldset>
            <select class="form-select mb-3" id="selectCity" aria-label="selectCity" onchange="cityChange('${serviceName}')">
                <option value="null" selected>Seleziona Città</option>
            </select>
            <select class="form-select mb-3" id="selectAddress" aria-label="selectAddress" onchange="addressChange('${serviceName}')">
                <option value="null" selected>Seleziona Via</option>
            </select>
            <select class="form-select mb-3" id="selectService" aria-label="selectService">
                <option value="null" selected>Seleziona ${serviceName}</option>
            </select>
        </fieldset>
        </form>
        <div class="container text-center mt-2">
            <button class="btn btn-secondary btn-lg" onclick="searchReservation()">Cerca</button>
        </div>
    </div>
    
    <hr>

    <div class="container text-center fs-3 p-4">
    <p>Prenotazioni Attive</p>

    <p class="text-secondary fw-ligth fs-5 wait-for-search">Cerca un servizio...</p>

    <div id="filterReservation">
    </div>

    </div>
    <div class="container mb-5">
        <div class="row row-cols-1 row-cols-lg-3" id="activeReservations">
        </div>
        </div>
    
    
    
    
      <hr>
    
      <div class="container text-center fs-3 p-4">
        Prenotazioni Disponibili
        <p class="text-secondary fw-ligth fs-5 mt-2 wait-for-search">Cerca un servizio...</p>
      </div>
    
      <div class="container mb-5">
        <div class="row row-cols-1 row-cols-lg-3" id="availableReservations">
        </div>
        </div>
      
        <div class="container-fluid p-3 bg-warning">
          <div class="text-center">
              <span class="fs-4 px-3">
                  <a type="button" role="button" href="/backoffice/services/bookservice/${serviceName}" class="link-light text-decoration-none text-dark"> Prenota Appuntamento <i class="bi bi-chevron-double-right"></i></a>
              </span>                    
          </div>
      </div>
    `
    + script + scripts() +
    ` 
    </body>
    </html>
    `

    let service = header('Backoffice | Servizi |' + serviceName, 'services-script') + body

    res.send(service)

    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' });
    
    }
}
