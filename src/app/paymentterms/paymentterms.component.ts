import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig, MessageService, ConfirmationService } from 'primeng/api';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-paymentterms',
  templateUrl: './paymentterms.component.html',
  styleUrls: ['./paymentterms.component.css']
})
export class PaymenttermsComponent {
  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedexsrv: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  paymentterm:any={};
  paymentterms:any=[];
  tablefilter: string = "";
  submitted: boolean = false;
  uploadedFiles: any[] = [];
  myDate = new Date();
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";

  constructor(private router:Router, private datePipe: DatePipe, private primengConfig: PrimeNGConfig,private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
  
  private http: HttpClient) {
    
    let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss'); //
    this.loggedinuser = generalservice.getLoggedUser();
    if(!this.loggedinuser)
  {
    this.router.navigateByUrl('/app-login');
  }
    console.log(this.generalservice.login);
    this.getPaymentTerms();
    
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getPaymentTerms()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_PaymentTerms;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.cols = response.result.cols[0];
          this.rows = response.result.queryresult;
          this.tablefilter = this.cols.toString();
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel=false;
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;
    })
  }
 
  addNew()
  {
      this.paymentterm = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedexsrvs(selectedexsrv:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected paymentterm?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/deleteMultiple";
        console.log(url);
        let param: any = {};
        param.op = "deleteMultiple";
        //param.entityid={id:grade.id};
        param.entity = "Wrx_SGS";
        param.attributes=selectedexsrv;

        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'paymentterm Selected Deleted', life: 3000});
              this.getPaymentTerms();
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'paymentterm Not Deleted', life: 3000});
            }
          },response => 
            {
            console.log("Post call in error", response);
            this.blockedPanel=false;
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            },
              () => 
            {
            console.log("The Post observable is now completed.");
            this.blockedPanel=false;
            })
          }
        });
  }
  deleteSelectedexsrv(paymentterm: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + paymentterm.Paymenttrm + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.id !== paymentterm.id);
          this.paymentterm = {};
    //Delete SQL Database
        this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:paymentterm.id};
          param.entity = "Wrx_SGS";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'paymentterm Deleted', life: 3000});
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'paymentterm Not Deleted', life: 3000});
              }
            },response => 
              {
              console.log("Post call in error", response);
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
              this.blockedPanel=false;
              },
                () => 
              {
              console.log("The Post observable is now completed.");
              this.blockedPanel=false;
              })
    //End of Delete Database
      }
  });
        this.getPaymentTerms();
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  editpayment(paymentterm: any)
  {
    this.submitted = true;
    this.paymentterm = {...paymentterm};
    console.log(this.paymentterm)
    this.addNewDialogue = true;
  }
  
  savepayment()
  {
    this.submitted = true;
      
    if (this.paymentterm.PaymentTrm && this.paymentterm.PaymentTrm.trim()) 
    {
        if (this.paymentterm.id) 
        {
          this.paymentterms[this.findIndexById(this.paymentterm.id)] = this.paymentterms;
          this.paymentterm.modifiedby = this.loggedinuser.id;
          this.paymentterm.modifiedon = this.myDate;

          delete this.paymentterm.CUName;
          delete this.paymentterm.MUName;

          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid={id:this.paymentterm.id};
          param.entity = "Wrx_PaymentTerms";
          param.attributes = this.paymentterm;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'paymentterm Updated', life: 3000});
                this.getPaymentTerms();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'paymentterm Not Updated', life: 3000});
              }
            },response => 
              {
                console.log("Post call in error", response);    
                this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
                this.blockedPanel=false;
              },
                () => 
              {
                console.log("The Post observable is now completed.");
                this.blockedPanel=false;
              })
                
            }
            else
            {
             if(this.rows.find((element:any)=>element.PaymentTrm==this.paymentterm.PaymentTrm))
              {
                this.paymentterm.Name = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same paymentterm Name Exist', life: 3000});
                return;
              }
                //this.country.id = this.createId();
                this.paymentterm.status = true;
                this.paymentterm.createdby = this.loggedinuser.Uid;
                this.paymentterm.createdon = this.myDate;
                this.paymentterm.modifiedby = this.loggedinuser.Uid;
                this.paymentterm.modifiedon = this.myDate;
                
                delete this.paymentterm.CUName;
                delete this.paymentterm.MUName;
                
                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_PaymentTerms";
                param.attributes = this.paymentterm;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'paymentterm Created', life: 3000});
                    this.getPaymentTerms();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'paymentterm Not Created', life: 3000});
                  }
                },response => 
                    {
                      console.log("Post call in error", response);      
                      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
                      this.blockedPanel=false;
                    },
                    () => {
                            console.log("The Post observable is now completed.");
                            this.blockedPanel=false;
                          })
      }
        this.addNewDialogue = false;
        this.paymentterm = {};
      }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.paymentterms.length; i++) 
    {
      if (this.paymentterms[i].id === id) 
      {
        index = i;
        break;
      }
    }

    return index;
  }
  createId(): string 
  {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  generateCode(): string 
  {
    let Code = '';
    var Suffix = 'Comm_';
    for ( var i = 0; i < 5; i++ ) {
        Code += Suffix + Math.random()*100;
    }
    return Code;
  }
}
