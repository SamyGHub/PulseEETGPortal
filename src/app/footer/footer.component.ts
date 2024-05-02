import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  dateNow: Date = new Date();
  myimage:string ="./assets/img/BkETG4.jpg";
  constructor() { }

  ngOnInit(): void {
  }

}
