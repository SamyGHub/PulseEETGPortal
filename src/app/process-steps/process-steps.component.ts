import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-process-steps',
  templateUrl: './process-steps.component.html',
  styleUrls: ['./process-steps.component.css'],
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
    `],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]
})
export class ProcessStepsComponent {
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
      label: 'Import Permit & Tags',
      //routerLink: 'app-importpermit',
      command: () => {this.router.navigateByUrl('/app-importpermit');}
      // command: (event: any) => {
      //     this.activeIndex = 1;
      //     this.messageService.add({severity:'info', summary:'Import Certificate', detail: event.item.label});
      // }
      },
      {
            label: 'Booking',
            routerLink: 'app-booking',
            command: (event: any) => {
                this.activeIndex = 2;
                this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label});
            }
        },
        {
          label: 'Shipping Instructions',
          routerLink: 'app-shipping-instruct',
          command: (event: any) => {
              this.activeIndex = 3;
              this.messageService.add({severity:'info', summary:'Shipping Instruction', detail: event.item.label});
          }
      },
        {
            label: 'Production Instructions',
            routerLink: 'app-prodinstruct',
            command: (event: any) => {
                this.activeIndex = 4;
                this.messageService.add({severity:'info', summary:'Production Instruction', detail: event.item.label});
            }
        },
        {
          label: 'Planning Phase Closed',
          routerLink: '',
          command: (event: any) => {
              this.activeIndex = 5;
              this.messageService.add({severity:'info', summary:'Last Step', detail: event.item.label});
          }
      }
    ];
    console.log(this.generalservice.SalesContract.length)
}
  OpenDialog(event:number)
  {
    this.activeIndex= event + 1;
    //this.router.navigateByUrl('/app-booking')
  }
}
