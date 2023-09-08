import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  username = '';
  password = '';
  name = '';
  surname = '';

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  registration() {
    let data = {
      name: this.name,
      surname: this.surname,
      password: this.password
    };
    fetch('/api/v1/users/'+this.username, {
      method: 'PUT',
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
