import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-general-service',
  templateUrl: './general-service.component.html',
  styleUrls: ['./general-service.component.css']
})
export class GeneralServiceComponent implements OnInit {

  username: any;
  type: any;
  data: any;
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };
  listOfCity: any;
  listOfAddress: any;
  listOfServices: any;
  options = ['Veterinario', 'Psicologo', 'Toelettatura', 'Dog sitter', 'Visita a domicilio per animali soli'];
  servicesInOneLocation: any = [];
  city: any;
  address: any;
  doctor: any;
  booked: any;
  listOfDateAvailable: any;
  date: any;
  dateFormatted: any = [];

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('user');
    this.type = this.route.snapshot.paramMap.get('type');
    this.getData();
  }

  getData() {
    fetch('/api/v1/services/', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data) => {
      this.listOfCity = data;
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

  getAddressHavingCity() {
    fetch('/api/v1/services/'+this.city+'?type='+this.type, {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data) => {
      this.listOfAddress = data;
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

  getDoctors() {
    fetch('/api/v1/services/'+this.city+'/'+this.address+'/services?type='+this.type, {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data) => {
      this.listOfServices = Object.entries(data);
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

  getFilteredData() {
    fetch('/api/v1/services/'+this.city+'/'+this.address+'/services/'+this.doctor[0], {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data) => {
      this.booked = Object.entries(data.booked);
      this.listOfDateAvailable = data.available;
      for(let i=0; i<this.listOfDateAvailable.length; i++) {
        let dateNotFormatted = new Date(this.listOfDateAvailable[i]);
        const date = dateNotFormatted.toLocaleDateString("it-IT") + ' alle ore: ' + dateNotFormatted.toLocaleTimeString("it-IT",  { hour: "2-digit" });
        this.dateFormatted = this.dateFormatted.concat({
          dateNotFormatted,
          date
        });
        this.dateFormatted.sort((date1: any, date2: any) => date1.dateNotFormatted - date2.dateNotFormatted);
      }
      this.booked.forEach((element: any) => {
        let dateNotFormatted = new Date(element[0]);
        element[2] = dateNotFormatted.toLocaleDateString("it-IT");
        element[2] = element[2] + ' alle ore: ' + dateNotFormatted.toLocaleTimeString("it-IT",  { hour: "2-digit" });
      });
      console.log(this.booked)
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  resetAllFields() {
    this.type = null;
    this.city = null;
    this.address = null;
    this.doctor = null;
    this.listOfCity = null;
    this.listOfAddress = null;
    this.listOfServices = null;
    this.booked = null;
    this.dateFormatted = [];
    this.date = null;
  }

  serviceChanged(event: any) {
    this.type = event;
    this.city = null;
    this.address = null;
    this.doctor = null;
    this.listOfCity = null;
    this.listOfAddress = null;
    this.listOfServices = null;
    this.booked = null;
    this.dateFormatted = [];
    this.date = null;
    this.getData();
  }

  cityChanged(event: any) {
    this.city = event;
    this.address = null;
    this.doctor = null;
    this.listOfAddress = null;
    this.listOfServices = null;
    this.booked = null;
    this.dateFormatted = [];
    this.date = null;
    this.getAddressHavingCity();
  }

  addressChanged(event: any) {
    this.address = event;
    this.doctor = null;
    this.listOfServices = null;
    this.booked = null;
    this.dateFormatted = [];
    this.date = null;
    this.getDoctors();
  }

  doctorChanged(event: any) {
    this.doctor = event;
    this.booked = null;
    this.dateFormatted = [];
    this.date = null;
    this.getFilteredData();
  }

  dateChanged(event: any) {
    this.date = event;
  }

  book(date: any) {
    let bodyDate = {
      'booking': [date.dateNotFormatted]
    }
    fetch('/api/v1/services/'+this.city+'/'+this.address+'/services/'+this.doctor[0], {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyDate)
    })
    .then(() => {
      this.dateFormatted = [];
      this.getFilteredData();
      this.date = null;
      this.openSnackBar('Appuntamento prenotato correttamente.', 'Chiudi')
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

  deleteBooked(date: any) {
    let bodyDate = {
      'booking': [date]
    }
    fetch('/api/v1/services/'+this.city+'/'+this.address+'/services/'+this.doctor[0]+'/booked', {
      method: 'DELETE',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyDate)
    })
    .then(() => {
      this.dateFormatted = [];
      this.getFilteredData();
      this.date = null;
      this.openSnackBar('Appuntamento eliminato correttamente.', 'Chiudi')
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

}
