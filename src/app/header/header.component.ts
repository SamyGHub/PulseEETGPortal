import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { GeneralService } from '../general.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  loggedinuser: any;
  fullName:any;
  Title:any;
  distributor:any;
  IsAdmin:boolean = false

  constructor(private router: Router, private generalservices: GeneralService) 
  { 
    this.loggedinuser = generalservices.getLoggedUser();
      if(!this.loggedinuser)
    {
      this.router.navigateByUrl('/app-login');
    }
    console.log('loggedinuser is ' ,this.loggedinuser);
    if(this.loggedinuser)
    {
    this.fullName = this.loggedinuser.Name
    this.Title = this.loggedinuser.Title
        if(this.loggedinuser.IsAdmin == 'True')
        {
         this.IsAdmin =true
        }
        else
        {
         this.IsAdmin =false
        }
      console.log(this.fullName)
    }
    // if(this.generalservices.login!=true)
    // this.router.navigateByUrl('/app-login');
  }

  ngOnInit(): void {
    
      this.items = [
        
        {
        label:'Log out',
        icon:'pi pi-fw pi-sign-out',
        
        command: () => {
            this.logout();
        }
        }
    ]

  }
  gotoSettings(){
    this.router.navigateByUrl('/app-settings');
  }
  logout(){
    //this.moralis.logOut();
    this.generalservices.removeLoggedUser();
    this.generalservices.login= false;
    this.router.navigateByUrl('/app-login');
  }
}
