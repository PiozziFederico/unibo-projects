import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() backButton: boolean = false;
  @Input() username: any;

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
  }

  backNavigation() {
    this.location.back();
  }

}
