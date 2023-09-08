import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.css']
})
export class EcommerceComponent implements OnInit {

  username: any;
  productsListName: any;
  productsList: Array<any> = [];
  categoryList = [];
  filterCategory = '';

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('user');
    this.getCategories();
    this.getProducts();
  }

  async getProducts() {
    let endpoint = '/api/v1/ecommerce/products';
    if(this.filterCategory !== '') {
      endpoint = `/api/v1/ecommerce/products?category=${this.filterCategory}`;
    }
    await fetch(endpoint, {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data) => {
      this.productsListName = data;
      for(let i=0; i<this.productsListName.length; i++) {
        fetch('/api/v1/ecommerce/products/'+ this.productsListName[i], {
          method: 'GET',
          credentials: "same-origin",
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then((data: any) => {
          this.productsList[i] = data;
        })
        .catch(() => {
          this.openSnackBar('Errore, riprova.', 'Chiudi')
        });
      }
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

  getCategories() {
    fetch('/api/v1/ecommerce/categories', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data: any) => {
      this.categoryList = data;
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

  onChange(event: any) {
    this.productsList = [];
    if(event == 'Nessuno') this.filterCategory = '';
    else this.filterCategory = event;
    this.getProducts();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  addProductToShoppingCart(product: any) {
    let name = product.name.toString();
    let data = {
      [name]: 1
    };
    fetch('/api/v1/users/'+this.username+'/cart', {
      method: 'PATCH',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(() => {
      this.openSnackBar('Prodotto aggiunto al carrello.', 'Chiudi')
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }
}
