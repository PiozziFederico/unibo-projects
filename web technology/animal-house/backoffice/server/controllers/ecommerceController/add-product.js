// site212234.tw.cs.unibo.it/backoffice/ecommerce/addproduct

// require
const { header, scripts } = require('../../../public/js/utils/template')

// render home
exports.renderAddProduct = async (req,res) => {

    // username
    let username = req.session.username

    try{

    // script 
    let script = `
    <script>
        let selectCategory = $('#standardCategory')
        selectCategories()

        selectCategory.on('click', function updateSelect(){
            if($('#otherCategory').prop('selected')){
                $('#newCategory').attr('hidden', false)
            } else {
                $('#newCategory').attr('hidden', true)
            } 
        })
        

        let form = $('#form-img')
        $('#addProductBTN').onclick = async (e) => {
            e.preventDefault()
            const url = form.action
            try {
                const formData = new FormData(form);
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });
   
            } catch (error) {
                console.error(error);
            }
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
        Aggiungi Prodotto
    </div>

    <hr>

    <div class="container p-3">
        <form>
            <fieldset>
            <legend>Dati Prodotto</legend>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="productName" placeholder="Nome Prodotto" required>
                <label for="productName">Nome Prodotto</label>
            </div>
            <div class="form-floating mb-3">
                <input type="number" min="0.01" step="0.01" class="form-control" id="productPrice" placeholder="0.00$">
                <label for="productPrice">Prezzo</label>
            </div>
            <div class="form-floating mb-3">
                <textarea class="form-control" placeholder="Descrizione" id="productDescription" style="height: 100px; resize: none;"></textarea>
                <label for="productDescription">Descrizione</label>
            </div>
            <div class="form-floating mb-3">
                <input type="number" min="1" step="any" class="form-control" id="productQuantity" placeholder="Quantità">
                <label for="productQuantity">Quantità</label>
            </div>
            <select class="form-select mb-3 productCategory" id="standardCategory" aria-label="productCategory">
                <option value="null" selected>Seleziona Categoria</option>
                <option value="" id="otherCategory">Altro</option>
            </select>
            <input type="text" value="" class="form-control productCategory" id="newCategory" placeholder="Nuova Categoria" hidden>
            <label for="newCategory" hidden>Nuova Categoria</label>

            </fieldset>
        </form>
        
            <legend class="mt-2">Immagine Prodotto</legend>
            <form action="/api/v1/images" method="post" enctype='multipart/form-data'>
                <input type="file" name="image" onchange="uploadImage(this)">
                <div class="imageUploaderReceiver" id="productImage" hidden></div>
            </form>
            <div class="d-flex align-items-center justify-content-center mt-4">
                <button type="button" class="btn btn-success mx-2" onclick="addProduct()" id="addProductBTN">Aggiungi</button>
                <a type="button" class="btn btn-danger" href="/backoffice/ecommerce">Annulla</a>
            </div>
           
    </div>
    ` 
    + script + scripts() +
    ` 
    </body>
    </html>
    `

    let addProduct = header('Backoffice | Ecommerce | Nuovo Prodotto', 'ecommerce-script') + body

    res.send(addProduct)

    } catch(error) {

        res.status(500).send({ message: error.message || 'Error Occured' });
    
    }
}