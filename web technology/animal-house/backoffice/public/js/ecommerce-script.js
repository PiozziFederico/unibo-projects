// ECOMMERCE

// path
const uriCategories = "https://site212234.tw.cs.unibo.it/api/v1/ecommerce/categories/"

/**
 * CATEGORIES
 */

function getCategories(){
      $.ajax({
         url: uriCategories,
         type: "GET",
         dataType: 'json',
         async: false,
         xhrFields: {
            withCredentials: true
         },success: function (data) {
            let categories = document.getElementById('categories')
            for( category of data ){
               // no empty category
               if( category != ''){
               categories.innerHTML += `
               <div class="col">
                  <div class="card home-card">
                     <div class="card-body">
                        <div class="card-title card-title-font text-center mb-4 fs-3">${category}</div>
                        <hr>
                        <div class="container p-3 text-center">
                              <img src="../../img/navbar-brand/Animal_house_backoffice.svg" alt="Logo AnimalHouse Back-Office" class="w-50">
                        </div>
                        <hr>
                        <div class="container text-center">
                              <a href="/backoffice/ecommerce/${category}" class="btn btn-primary">Esplora</a>
                        </div>
                        
                     </div>
                  </div>
               </div>
               `
               }
            }
         },
         error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
         },
      })
}

function selectCategories(){
   let categories = $('#standardCategory')

   $.ajax({
      url: uriCategories,
      type: "GET",
      dataType: 'json',
      xhrFields: {
         withCredentials: true
      },success: function (data) {
         for( category of data ){
            // no empty category
            if( category != ''){
            categories.html(categories.html() + `
            <option value="${category}">${category}</option>
            `) 
            }
         }
      },
      error: function (xhr, ajaxOptions, thrownError) {
         console.log(xhr.status);
      }
      })
}



/**
 * PRODUCTS
 */

// path
const uriProducts = "https://site212234.tw.cs.unibo.it/api/v1/ecommerce/products"


function getAllProducts(){
   $.ajax({
      url: uriProducts,
      type: "GET",
      dataType: 'json',
      xhrFields: {
         withCredentials: true 
      },success: function (data) {
         document.getElementById('searchProductsByNameResult').innerHTML = ''
         for( productName of data ){
            getProductCard(productName)
         }
      },
      error: function (xhr, ajaxOptions, thrownError) {
         console.log(xhr.status)
      },
   }) 
}

function getProductsByCategory(category){
   $.ajax({
      url: uriProducts + "?category=" + category,
      type: "GET",
      dataType: 'json',
      async: false,
      xhrFields: {
         withCredentials: true
      },success: function (data) {
        for(let product of data){
           getProductCardByCategory(product);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) { 
         console.log(xhr.status);
      },
   });   
}


// SEARCH

function searchProductsByName(){
   let name = document.getElementById('productSearch').value

   $.ajax({
      url: uriProducts + '?name=' + name,
      type: "GET",
      dataType: 'json',
      xhrFields: {
         withCredentials: true
      },success: function (data) {
         if(data.length != 0){
            document.getElementById('searchProductsByNameMessage').innerHTML = ''
            document.getElementById('searchProductsByNameResult').innerHTML = ''
            for( let product of data ){
               getProductCard(product)
            }
           
         } else {
            document.getElementById('searchProductsByNameMessage').innerHTML = '<span class="text-danger">Nessun Prodotto Trovato!</span>' 
            document.getElementById('searchProductsByNameResult').innerHTML = ''
         }
      },
      error: function (xhr, ajaxOptions, thrownError) {
         console.log(xhr.status);
         document.getElementById('searchProductsByNameMessage').innerHTML = '<span class="text-danger">Nessun Prodotto Trovato!</span>'
         document.getElementById('searchProductsByNameResult').innerHTML = '' 
      },
   })
}

function searchProductsByNameAndCategory(){
   let name = document.getElementById('productSearch').value

   $.ajax({
      url: uriProducts + '?name=' + name,
      type: "GET",
      dataType: 'json',
      xhrFields: {
         withCredentials: true
      },success: function (data) {
         if(data.length != 0){
            document.getElementById('searchProductsByNameResult').innerHTML = ''
            for( let product of data ){
               getProductCard(product)
            }
           
         } else {
            document.getElementById('searchProductsByNameResult').innerHTML = ''
         }
      },
      error: function (xhr, ajaxOptions, thrownError) {
         console.log(xhr.status);
         document.getElementById('searchProductsByNameResult').innerHTML = '' 
      },
   })
}

function getProductCard(name){
   $.ajax({
      url: uriProducts + '/' + name,
      type: "GET",
      dataType: 'json',
      async: false,
      xhrFields: {
         withCredentials: true
      },success: function (data) {
         let productsCards = document.getElementById('searchProductsByNameResult')
         productsCards.innerHTML += `
         <div class="col">
            <div class="card text-center mb-3 p-2 home-card" style="height: 600px">
               <div class="card-body">
                  <img src="${data.image}" alt="Ciotola Cani - img categoria prodotti: Cibo" width="200px">
               </div>
               <h4 class="card-title mb-3">${data.name}</h4>
               <p class="text-ligth fs-5">Prezzo: ${data.price}$</p>
               <p class="text-ligth fs-5">Quantità: ${data.amount}</p>
               <hr>
               <p class="fw-light my-auto fs-6">${data.description}</p>
               <hr>
               <div class="d-flex justify-content-center align-items-center">
                  <button type="button" class="btn bg-warning mb-2" data-bs-toggle="modal" data-bs-target="#modalInfo${data.name.replaceAll(' ', '§')}">
                        <p hidden>Info prodotto</p>
                        <i class="bi bi-info-lg"></i> 
                  </button>
                  <button type="button" class="btn bg-primary mb-2 mx-2" data-bs-toggle="modal" data-bs-target="#modalModify${data.name.replaceAll(' ', '§')}">
                        <p hidden>Modifica prodotto</p>
                        <i class="bi bi-pencil"></i> 
                  </button>
                  <button type="button" class="btn bg-danger mb-2" data-bs-toggle="modal" data-bs-target="#modalDelete${data.name.replaceAll(' ', '§')}">
                        <p hidden>Elimina prodotto</p>
                        <i class="bi bi-trash"></i> 
                  </button>
               </div> 
            </div>
         </div>

         <!-- Modal Info-->
         <div class="modal fade" id="modalInfo${data.name.replaceAll(' ', '§')}" tabindex="-1" aria-labelledby="Info${data.name}" aria-hidden="true">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header bg-backoffice">
               <h1 class="modal-title fs-5" id="Info${data.name.replaceAll(' ', '§')}">Info Prodotto</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
               <div class="modal-body text-center">
               <div class="row row-cols-2">
                   <div class="col w-25 px-2 text-end">
                       <p style="height: 58px;">Nome:</p>
                       <p style="height: 58px;">Quantità:</p>
                       <p style="height: 58px;">Categoria:</p>
                       <p style="height: 58px;">Descrizione:</p>
                       <p style="height: 58px;">Prezzo:</p>                           
                   </div> 
                   <div class="col w-75 px-2 text-center">
                       <div class="form-floating mb-3">
                           <input type="text" class="form-control" id="productName${data.name.replaceAll(' ', '§')}" placeholder="Nome Prodotto" disabled>
                           <label for="productName${data.name.replaceAll(' ', '§')}">${data.name}</label>
                         </div>
                         <div class="form-floating mb-3">
                           <input type="text" class="form-control" id="productAmount${data.name.replaceAll(' ', '§')}" placeholder="Quantità Prodotto" disabled>
                           <label for="productAmount${data.name.replaceAll(' ', '§')}">${data.amount}</label>
                         </div>
                         <div class="form-floating mb-3">
                           <input type="text" class="form-control" id="productCategory${data.name.replaceAll(' ', '§')}" placeholder="Categoria Prodotto" disabled>
                           <label for="productCategory${data.name.replaceAll(' ', '§')}">${data.category}</label>
                         </div>
                         <div class="form-floating mb-3">
                           <input type="text" class="form-control" id="productDescription${data.name.replaceAll(' ', '§')}" placeholder="Descrizione Prodotto" disabled>
                           <label for="productDescription${data.name.replaceAll(' ', '§')}">${data.description}</label>
                         </div>
                         <div class="form-floating mb-3">
                           <input type="text" class="form-control" id="productPrice${data.name.replaceAll(' ', '§')}" placeholder="Prezzo Prodotto" disabled>
                           <label for="productPrice${data.name.replaceAll(' ', '§')}">${data.price}</label>
                         </div> 
                   </div>  
               </div>
               <p class="my-4 text-center">Immagine:</p> <br>
               <img src="${data.image}" alt="Immagine Prodotto ${data.name}" width="200px"></img>            
             </div>
               <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
               </div>
            </div>
         </div>
         </div>

         <!-- Modal Modify-->
         <div class="modal fade" id="modalModify${data.name.replaceAll(' ', '§')}" tabindex="-1" aria-labelledby="Modify${data.name}" aria-hidden="true">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header bg-primary">
               <h1 class="modal-title fs-5" id="Modify${data.name.replaceAll(' ', '§')}">Modifica Prodotto</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
               <div class="modal-body text-center">
               <div class="row row-cols-2">
                   <div class="col w-25 px-2 text-end">
                       <p style="height: 37.6px;">Nome:</p>
                       <p style="height: 37.6px;">Quantità:</p>
                       <p style="height: 37.6px;">Categoria:</p>
                       <p style="height: 37.6px;">Descrizione:</p>
                       <pstyle="height: 37.6px;">Prezzo:</p>                           
                   </div> 
                   <div class="col w-75 px-2 text-center">
                       <div class="mb-3">
                           <input type="text" class="form-control productName" id="modalModify${data.name.replaceAll(' ', '§')}ProductName" placeholder="Nome Prodotto" value="${data.name}" disabled>
                           <label for="modalModify${data.name.replaceAll(' ', '§')}ProductName" hidden>${data.name}</label>
                         </div>
                         <div class="mb-3">
                           <input type="number" min="1" scale="1" class="form-control productAmount" id="modalModify${data.name.replaceAll(' ', '§')}ProductAmount" placeholder="Quantità Prodotto" value="${data.amount}" required>
                           <label for="modalModify${data.name.replaceAll(' ', '§')}ProductAmount" hidden>${data.amount}</label>
                         </div>
                         <div class="mb-3">
                           <input type="text" class="form-control productCategory" id="modalModify${data.name.replaceAll(' ', '§')}ProductCategory" placeholder="Categoria Prodotto" value="${data.category}" required>
                           <label for="modalModify${data.name.replaceAll(' ', '§')}ProductCategory" hidden>${data.category}</label>
                         </div>
                         <div class="mb-3">
                           <input type="text" class="form-control productDescription" id="modalModify${data.name.replaceAll(' ', '§')}ProductDescription" placeholder="Descrizione Prodotto" value="${data.description}" required>
                           <label for="modalModify${data.name.replaceAll(' ', '§')}ProductDescription" hidden>${data.description}</label>
                         </div>
                         <div class="mb-3">
                           <input type="number" min="0.01" scale="0.01" class="form-control productPrice" id="modalModify${data.name.replaceAll(' ', '§')}ProductPrice" placeholder="Prezzo Prodotto" value="${data.price}" required>
                           <label for="modalModify${data.name.replaceAll(' ', '§')}ProductPrice" hidden>${data.price}</label>
                         </div> 
                   </div>  
               </div>          
             </div>
               <div class="modal-footer">
               <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="modifyProduct('${data.name}')">Modifica</button>
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
               </div>
            </div>
         </div>
         </div>

         <!-- Modal Delete-->
         <div class="modal fade" id="modalDelete${data.name.replaceAll(' ', '§')}" tabindex="-1" aria-labelledby="Delete${data.name}" aria-hidden="true">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header bg-danger">
                  <h1 class="modal-title fs-5" id="Delete${data.name.replaceAll(' ', '§')}">Elimina Prodotto</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
               <div class="modal-body text-center fs-4">${data.name}</div>
               <div class="modal-footer">
               <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="deleteProduct('${data.name}')">Conferma</button>
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
               </div>
            </div>
         </div>
         </div>
         `
      },
      error: function (xhr, ajaxOptions, thrownError) {
         console.log(xhr.status);
      },
   })
}

function getProductCardByCategory(name){
   let productsCards = $('#searchProductsByNameResult')

   $.ajax({
      url: uriProducts + '/' + name,
      type: "GET",
      dataType: 'json',
      async: false,
      xhrFields: {
         withCredentials: true
      },success: function (data) {
         productsCards.html(productsCards.html() + `
         <div class="col">
            <div class="card text-center mb-3 p-2 home-card" style="height: 600px">
               <div class="card-body">
                  <img src="${data.image}" alt="Ciotola Cani - img categoria prodotti: Cibo" width="200px">
               </div>
               <h3 class="card-title mb-3">${data.name}</h3>
               <p class="text-ligth fs-5">Prezzo: ${data.price}$</p>
               <p class="text-ligth fs-5">Quantità: ${data.amount}</p>
               <hr>
               <p class="fw-light my-auto fs-6">${data.description}</p>
               <hr>
               <div class="d-flex justify-content-center align-items-center">
                  <button type="button" class="btn bg-warning mb-2" data-bs-toggle="modal" data-bs-target="#modalInfo${data.name.replaceAll(' ', '§')}">
                        <p hidden>Info prodotto</p>
                        <i class="bi bi-info-lg"></i> 
                  </button>
                  <button type="button" class="btn bg-primary mb-2 mx-2" data-bs-toggle="modal" data-bs-target="#modalModify${data.name.replaceAll(' ', '§')}">
                        <p hidden>Modifica prodotto</p>
                        <i class="bi bi-pencil"></i> 
                  </button>
                  <button type="button" class="btn bg-danger mb-2" data-bs-toggle="modal" data-bs-target="#modalDelete${data.name.replaceAll(' ', '§')}">
                        <p hidden>Elimina prodotto</p>
                        <i class="bi bi-trash"></i> 
                  </button>
               </div> 
            </div>
         </div>

         <!-- Modal Info-->
         <div class="modal fade" id="modalInfo${data.name.replaceAll(' ', '§')}" tabindex="-1" aria-labelledby="Info${data.name}" aria-hidden="true">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header bg-backoffice">
               <h1 class="modal-title fs-5" id="Info${data.name.replaceAll(' ', '§')}">Info Prodotto</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
               <div class="modal-body text-center">
               <div class="row row-cols-2">
                   <div class="col w-25 px-2 text-end">
                       <p style="height: 58px;">Nome:</p>
                       <p style="height: 58px;">Quantità:</p>
                       <p style="height: 58px;">Categoria:</p>
                       <p style="height: 58px;">Descrizione:</p>
                       <p style="height: 58px;">Prezzo:</p>                           
                   </div> 
                   <div class="col w-75 px-2 text-center">
                       <div class="form-floating mb-3">
                           <input type="text" class="form-control" id="productName${data.name.replaceAll(' ', '§')}" placeholder="Nome Prodotto" disabled>
                           <label for="productName${data.name.replaceAll(' ', '§')}">${data.name}</label>
                         </div>
                         <div class="form-floating mb-3">
                           <input type="text" class="form-control" id="productAmount${data.name.replaceAll(' ', '§')}" placeholder="Quantità Prodotto" disabled>
                           <label for="productAmount${data.name.replaceAll(' ', '§')}">${data.amount}</label>
                         </div>
                         <div class="form-floating mb-3">
                           <input type="text" class="form-control" id="productCategory${data.name.replaceAll(' ', '§')}" placeholder="Categoria Prodotto" disabled>
                           <label for="productCategory${data.name.replaceAll(' ', '§')}">${data.category}</label>
                         </div>
                         <div class="form-floating mb-3">
                           <input type="text" class="form-control" id="productDescription${data.name.replaceAll(' ', '§')}" placeholder="Descrizione Prodotto" disabled>
                           <label for="productDescription${data.name.replaceAll(' ', '§')}">${data.description}</label>
                         </div>
                         <div class="form-floating mb-3">
                           <input type="text" class="form-control" id="productPrice${data.name.replaceAll(' ', '§')}" placeholder="Prezzo Prodotto" disabled>
                           <label for="productPrice${data.name.replaceAll(' ', '§')}">${data.price}</label>
                         </div> 
                   </div>  
               </div>
               <p class="my-4 text-center">Immagine:</p> <br>
               <img src="${data.image}" alt="Immagine Prodotto ${data.name}" width="200px"></img>            
             </div>
               <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
               </div>
            </div>
         </div>
         </div>

         <!-- Modal Modify-->
         <div class="modal fade" id="modalModify${data.name.replaceAll(' ', '§')}" tabindex="-1" aria-labelledby="Modify${data.name}" aria-hidden="true">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header bg-primary">
               <h1 class="modal-title fs-5" id="Modify${data.name.replaceAll(' ', '§')}">Modifica Prodotto</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
               <div class="modal-body text-center">
               <div class="row row-cols-2">
                   <div class="col w-25 px-2 text-end">
                       <p style="height: 37.6px;">Nome:</p>
                       <p style="height: 37.6px;">Quantità:</p>
                       <p style="height: 37.6px;">Categoria:</p> 
                       <p style="height: 37.6px;">Descrizione:</p>
                       <pstyle="height: 37.6px;">Prezzo:</p>                           
                   </div> 
                   <div class="col w-75 px-2 text-center">
                       <div class="mb-3">
                           <input type="text" class="form-control productName" id="modalModify${data.name.replaceAll(' ', '§')}ProductName" placeholder="Nome Prodotto" value="${data.name}" disabled>
                           <label for="modalModify${data.name.replaceAll(' ', '§')}ProductName" hidden>${data.name}</label>
                         </div>
                         <div class="mb-3">
                           <input type="number" min="1" scale="1" class="form-control productAmount" id="modalModify${data.name.replaceAll(' ', '§')}ProductAmount" placeholder="Quantità Prodotto" value="${data.amount}" required>
                           <label for="modalModify${data.name.replaceAll(' ', '§')}ProductAmount" hidden>${data.amount}</label>
                         </div>
                         <div class="mb-3">
                           <input type="text" class="form-control productCategory" id="modalModify${data.name.replaceAll(' ', '§')}ProductCategory" placeholder="Categoria Prodotto" value="${data.category}" required>
                           <label for="modalModify${data.name.replaceAll(' ', '§')}ProductCategory" hidden>${data.category}</label>
                         </div>
                         <div class="mb-3">
                           <input type="text" class="form-control productDescription" id="modalModify${data.name.replaceAll(' ', '§')}ProductDescription" placeholder="Descrizione Prodotto" value="${data.description}" required>
                           <label for="modalModify${data.name.replaceAll(' ', '§')}ProductDescription" hidden>${data.description}</label>
                         </div>
                         <div class="mb-3">
                           <input type="number" min="0.01" scale="0.01" class="form-control productPrice" id="modalModify${data.name.replaceAll(' ', '§')}ProductPrice" placeholder="Prezzo Prodotto" value="${data.price}" required>
                           <label for="modalModify${data.name.replaceAll(' ', '§')}ProductPrice" hidden>${data.price}</label>
                         </div> 
                   </div>  
               </div>              
             </div>
               <div class="modal-footer">
               <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="modifyProductByCategory('${data.name}')">Modifica</button>
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
               </div>
            </div>
         </div>
         </div>

         <!-- Modal Delete-->
         <div class="modal fade" id="modalDelete${data.name.replaceAll(' ', '§')}" tabindex="-1" aria-labelledby="Delete${data.name}" aria-hidden="true">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header bg-danger">
                  <h1 class="modal-title fs-5" id="Delete${data.name.replaceAll(' ', '§')}">Elimina Prodotto</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
               <div class="modal-body text-center fs-4">${data.name}</div>
               <div class="modal-footer">
               <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="deleteProductByCategory('${data.name}', '${data.category}')">Conferma</button>
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
               </div>
            </div>
         </div>
         </div>
         `)
      },
      error: function (xhr, ajaxOptions, thrownError) {
         console.log(xhr.status);
      },
   })
}

// MODIFY & DELETE

function modifyProduct(pName){

   const select = '#modalModify' + (pName.replaceAll(' ', '§'))

   const amount = $(select + 'ProductAmount').val()
   const category = $(select + 'ProductCategory').val()
   const description = $(select + 'ProductDescription').val()
   const price = $(select + 'ProductPrice').val()
   
   let p = {
      "amount": Number(amount),
      "category": category,
      "description": description,
      "price": Number(price)
   }

   let product = removeNullOrEmpty(p)


   $.ajax({ 
      url: uriProducts + '/' + pName,
      type: "PATCH",
      data: JSON.stringify(
         product
      ),
      processData: false,
      contentType: "application/json; charset=UTF-8",
      xhrFields: {
          withCredentials: true
      },
      success: function (data, stringStatus, xhr) {
         alert('Il prodotto è stato modificato con successo!')
         getAllProducts()
      },
      error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
         console.log(xhr.status)
      },
      });
}

function modifyProductByCategory(pName){

   const select = '#modalModify' + (pName.replaceAll(' ', '§'))

   const amount = $(select + 'ProductAmount').val()
   const category = $(select + 'ProductCategory').val()
   const description = $(select + 'ProductDescription').val()
   const price = $(select + 'ProductPrice').val()

   
   let p = {
      "amount": Number(amount),
      "category": category,
      "description": description,
      "price": Number(price)
   }

   let product = removeNullOrEmpty(p)


   $.ajax({ 
      url: uriProducts + '/' + pName,
      type: "PATCH",
      data: JSON.stringify(
         product
      ),
      processData: false,
      contentType: "application/json; charset=UTF-8",
      xhrFields: {
          withCredentials: true
      },
      success: function (data, stringStatus, xhr) {
         alert('Il prodotto è stato modificato con successo!')
         $('#searchProductsByNameResult').html('')
         getProductsByCategory(category)
      },
      error: function (xhr, ajaxOptions, thrownError) {
         console.log(xhr.status)
      },
      });
}


function deleteProductByCategory(pName, category){
   $.ajax({ 
      url: uriProducts + '/' + pName,
      type: "DELETE",
      xhrFields: {
           withCredentials: true
      },
      success: function (data, stringStatus, xhr) {
         alert('Prodotto rimosso con successo!')
         window.location.href = "https://site212234.tw.cs.unibo.it/backoffice/ecommerce/" + category
       },
       error: function (xhr, ajaxOptions, thrownError) { 
          console.log(xhr.status)
       },
    });
}


function deleteProduct(pName){
   $.ajax({ 
      url: uriProducts + '/' + pName,
      type: "DELETE",
      xhrFields: {
           withCredentials: true
      },
      success: function (data, stringStatus, xhr) {
         alert('Prodotto rimosso con successo!')
         getAllProducts()
       },
       error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
          console.log(xhr.status)
       },
    });
}



// ADD

function addProduct(){
   let name = $('#productName').val()
   let amount = $('#productQuantity').val()
   let description = $('#productDescription').val()
   let image = $('#productImage').html()
   let price = $('#productPrice').val()

   let category = $('#standardCategory').val()
   let newCategory = $('#newCategory').val()

   if( newCategory == ""){
      let p = {
         "amount": Number(amount),
         "category": category,
         "description": description,
         "image": image,
         "price": Number(price)
      }
   
      let product = removeNullOrEmpty(p)
   
      $.ajax({ 
         url: uriProducts + "/" + name,
         type: "PUT",
         data: JSON.stringify(
           product 
         ),
         processData: false,
         contentType: "application/json; charset=UTF-8",
         xhrFields: {
              withCredentials: true
         },
         success: function (data, stringStatus, xhr) {
             alert('Prodotto aggiunto con successo!');
             window.location.href = "https://site212234.tw.cs.unibo.it/backoffice/ecommerce";
      
          },
          error: function (xhr, ajaxOptions, thrownError) {
             console.log(xhr.status);
             alert('Errore, prodotto non aggiunto correttamente. Riprovare.');
          },
       });
   } else {
      let p = {
         "amount": Number(amount),
         "category": newCategory,
         "description": description,
         "image": image,
         "price": Number(price)
      }
   
      let product = removeNullOrEmpty(p)
   
      $.ajax({ 
         url: uriProducts + "/" + name,
         type: "PUT",
         data: JSON.stringify(
           product 
         ),
         processData: false,
         contentType: "application/json; charset=UTF-8",
         xhrFields: {
              withCredentials: true
         },
         success: function (data, stringStatus, xhr) {
             alert('Prodotto aggiunto con successo!');
             window.location.href = "https://site212234.tw.cs.unibo.it/backoffice/ecommerce";
      
          },
          error: function (xhr, ajaxOptions, thrownError) {
             console.log(xhr.status);
             alert('Errore, prodotto non aggiunto correttamente. Riprovare.');
          },
       });
   }

   
}

function removeNullOrEmpty(obj) {
   // https://stackoverflow.com/a/38340730
   return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v !== ""));
}
