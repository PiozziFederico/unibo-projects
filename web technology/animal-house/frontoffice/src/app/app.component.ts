import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'FrontOffice';
  logged = false;

  constructor(
    private router: Router
  ) {
    if(!this.logged) {
      this.router.navigateByUrl('login');
    }
  }
}
