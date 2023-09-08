import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  username: any;
  listProductsQuantity: any;
  listProducts: Array<any> = [];
  productToBuy: any;
  buyAllProducts: any = {}

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('user');
    this.getProductsFromCart();
  }

  onChange(number: number, element: any) {
    this.listProducts.forEach(function (el) {
      if(element.name == el.name) el.quantity = number;
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  getProductsFromCart() {
    this.listProducts = [];
    fetch('/api/v1/users/'+this.username+'/cart', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data) => {
      this.listProductsQuantity = data;
      for(let item in this.listProductsQuantity) {
        fetch('/api/v1/ecommerce/products/'+ item, {
          method: 'GET',
          credentials: "same-origin",
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then((data: any) => {
          this.listProducts = this.listProducts.concat(data);
          this.listProducts.forEach(function (element) {
            element.quantity = 1;
          });
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

  buyProduct(item: any) {
    this.productToBuy = item;
    let name = this.productToBuy.name.toString();
    const data = {
      [name]: this.productToBuy.quantity
    };
    fetch('/api/v1/ecommerce/buy', {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    .then(() => {
      this.removeProduct(item, true);
      this.openSnackBar('Prodotto acquistato.', 'Chiudi');
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

  buyAll() {
    for(let item of this.listProducts) {
      let name = item.name.toString();
      this.buyAllProducts[name] = item.quantity;
    }
    fetch('/api/v1/ecommerce/buy', {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.buyAllProducts),
    })
    .then(() => {
      for(let item of this.listProducts) {
        this.removeProduct(item, true);
      }
      this.openSnackBar('Prodotti acquistati.', 'Chiudi');
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

  removeProduct(item: any, deleteAfterBuy: boolean) {
    fetch('/api/v1/users/'+this.username+'/cart/'+item.name, {
      method: 'DELETE',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      this.getProductsFromCart();
      if(!deleteAfterBuy) this.openSnackBar('Prodotto eliminato dal carrello.', 'Chiudi');
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

}
