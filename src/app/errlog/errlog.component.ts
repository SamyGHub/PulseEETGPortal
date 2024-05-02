import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-errlog',
  templateUrl: './errlog.component.html',
  styleUrls: ['./errlog.component.css']
})

export class ERRLogComponent {
Errmessages:any=[];
loggedinuser: any;

constructor(
  private messageService: MessageService, private router: Router,
  private confirmationService: ConfirmationService, private generalservice: GeneralService,
  private http: HttpClient) {
    this.loggedinuser = generalservice.getLoggedUser();
    if(!this.loggedinuser)
  {
    
    this.router.navigateByUrl('/app-login');
  }
  
  //this.getcustdt(); 
  }
  ngOnInit(): void 
  {
    this.Errmessages = this.generalservice.mymessages; 
  }
  
}
