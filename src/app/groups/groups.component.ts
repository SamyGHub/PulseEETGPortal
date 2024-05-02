import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  styles: [`
  .ui-steps .ui-steps-item {
      width: 25%;
  }
  
  .ui-steps.steps-custom {
      margin-bottom: 30px;
  }
  
  .ui-steps.steps-custom .ui-steps-item .ui-menuitem-link {
      padding: 0 1em;
      overflow: visible;
  }
  
  .ui-steps.steps-custom .ui-steps-item .ui-steps-number {
      background-color: #0081c2;
      color: #FFFFFF;
      display: inline-block;
      width: 36px;
      border-radius: 50%;
      margin-top: -14px;
      margin-bottom: 10px;
  }
  
  .ui-steps.steps-custom .ui-steps-item .ui-steps-title {
      color: #555555;
  }
`]
})
export class GroupsComponent {
  items: MenuItem[] = [];
  activeIndex: number = 0;
  myDate: any = new Date ();
  loggedinuser:any;
  rows: any[]  = [];
  

  constructor(   
    private generalservice: GeneralService,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService, private confirmationService: ConfirmationService, private datePipe: DatePipe) 
    {
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
      
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      this.rows = generalservice.SalesContract;
      console.log(this.rows)

    }
  ngOnInit() {
    this.items = [
      {
        label: 'Sales Transaction Import',
        icon: 'pi pi-user', command: (event: any) => {this.router.navigateByUrl('/app-st');
                                            }
      },
      {
        label: 'Sales Contracts Import',
        icon: 'pi pi-user', command: (event: any) => {this.router.navigateByUrl('/app-upload-files');
                                            }
      },
      
      {
        label: 'Purchase Transaction Import',
        icon: 'pi pi-user', command: (event: any) => {this.router.navigateByUrl('/app-purtransactions');
                                            }
      },
      {
        label: 'Purchase Contracts Import',
        icon: 'pi pi-user', command: (event: any) => {this.router.navigateByUrl('/app-puroperations');
                                            }
      },
      {
        label: 'RailCars Import',
        icon: 'pi pi-user', command: (event: any) => {this.router.navigateByUrl('/app-railcars-map');},
      }
    ];
    //console.log(this.generalservice.SalesContract.length)
}
  OpenDialog(event:number)
  {
    console.log(event);
    
    this.activeIndex = event;
    //this.router.navigateByUrl('/app-booking')
  }
}
