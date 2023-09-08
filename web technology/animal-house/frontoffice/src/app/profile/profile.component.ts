import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { NewAnimalComponent } from '../new-animal/new-animal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  dataSource: any;
  points: any;
  username = this.route.snapshot.paramMap.get('user');
  user: any;
  editProfile = false;
  newAnimal: any;
  newAnimalName = '';
  displayedColumns: string[] = ['game', 'best', 'last'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getDataUser();
  }

  getDataUser() {
    fetch('/api/v1/users/'+this.username, {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data) => {
        this.user = data;
        this.dataSource = Object.entries(data.animals);
        this.points = Object.entries(data.points);
      })
      .catch(() => {
        this.openSnackBar('Errore, riprova.', 'Chiudi')
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  editingProfile() {
    this.editProfile = true;
  }

  saveEdits() {
    this.editProfile = false;
    let userEdited = {
      name: this.user.name,
      surname: this.user.surname,
      password: this.user.password,
      animals: this.user.animals,
      admin: true
    }
    fetch('/api/v1/users/'+this.username, {
      method: 'PUT',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userEdited),
    })
      .then((data) => {
        if(data.status == 200) {
          this.openSnackBar('Modifiche salvate!', 'Chiudi')
        } else {
          this.openSnackBar('Errore, riprova.', 'Chiudi')
        }
      })
      .catch(() => {
        this.openSnackBar('Errore, riprova.', 'Chiudi')
      });
  }

  logout() {
    fetch('/api/v1/auth', {
      method: 'DELETE',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((data) => {
        this.router.navigate(['/login']);
      })
      .catch(() => {
        this.openSnackBar('Errore, riprova.', 'Chiudi')
      });
  }

  addAnimal() {
    const dialogRef = this.dialog.open(NewAnimalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.newAnimal = result[0][0];
        this.newAnimalName = result[0][0].name;
        this.updateAnimals();
      }
    });
  }

  removeNullOrEmpty(obj: object) {
    // https://stackoverflow.com/a/38340730
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v !== ""));
  }
  
  updateAnimals() {
    if(this.newAnimal && this.newAnimal.name) {
      delete this.newAnimal.name;
      this.newAnimal = this.removeNullOrEmpty(this.newAnimal);
      fetch('/api/v1/users/'+this.username+'/animals/'+this.newAnimalName, {
        method: 'PUT',
        credentials: "same-origin",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.newAnimal)
      })
        .then((data) => {
          if(data.status == 200 || data.status == 201) {
            this.openSnackBar('Modifiche salvate!', 'Chiudi')
          } else {
            this.openSnackBar('Errore, riprova.', 'Chiudi')
          }
          this.getDataUser();
        })
        .catch(() => {
          this.openSnackBar('Errore, riprova.', 'Chiudi')
        });
    }
  }

  deleteOldAnimal(animalName: any) {
    fetch('/api/v1/users/'+this.username+'/animals/'+animalName, {
      method: 'DELETE',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => this.updateAnimals())
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

  editCardAnimal(animal: any) {
    const dialogRef = this.dialog.open(NewAnimalComponent, {
      data: {
        dataKey: animal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.newAnimal = result[0][0];
        this.newAnimalName = result[0][0].name;
        this.deleteOldAnimal(result[1]);
      }
    });
  }

  deleteAnimal(event: any, animal: string) {
    event.stopPropagation();
    fetch('/api/v1/users/'+this.username+'/animals/'+animal, {
      method: 'DELETE',
      credentials: "same-origin",
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        this.openSnackBar('Animale eliminato.', 'Chiudi')
      })
      .catch(() => {
        this.openSnackBar('Errore, riprova.', 'Chiudi')
      });
    this.getDataUser();
  }

}
