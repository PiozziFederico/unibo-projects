import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  username = '';
  password = '';

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    fetch('/api/v1/auth', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data) => {
      this.router.navigate(['/home', {user: data.username}]);
    })
    .catch((error) => {
      this.openSnackBar('Non sei loggato, fai la login.', 'Chiudi')
    });
  }

  login() {
    let data = {username: this.username, password: this.password};
    fetch('/api/v1/auth', {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then((data) => {
        if(data.status == 200) {
          this.router.navigate(['/home', {user: this.username}]);
        } else {
          this.openSnackBar('Errore, riprova.', 'Chiudi')
        }
      })
      .catch(() => {
        this.openSnackBar('Errore, riprova.', 'Chiudi')
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

}
