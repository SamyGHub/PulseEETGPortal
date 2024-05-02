import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig, MessageService, ConfirmationService } from 'primeng/api';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-palletdimensions',
  templateUrl: './palletdimensions.component.html',
  styleUrls: ['./palletdimensions.component.css']
})
export class PalletdimensionsComponent {
  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedexsrv: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  Palletd:any={};
  Pallets:any=[];
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
    this.getPallet();
    
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getPallet()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Palletdimensions;";
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
      this.Palletd = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedexsrvs(selectedexsrv:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Palletd?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/deleteMultiple";
        console.log(url);
        let param: any = {};
        param.op = "deleteMultiple";
        //param.entityid={id:grade.id};
        param.entity = "Wrx_Palletdimensions";
        param.attributes=selectedexsrv;

        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Palletd Selected Deleted', life: 3000});
              this.getPallet();
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Palletd Not Deleted', life: 3000});
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
  deleteSelectedexsrv(Palletd: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + Palletd.Palletd + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.id !== Palletd.id);
          this.Palletd = {};
    //Delete SQL Database
        this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:Palletd.id};
          param.entity = "Wrx_Palletdimensions";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Palletd Deleted', life: 3000});
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Palletd Not Deleted', life: 3000});
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
        this.getPallet();
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  editPallet(Palletd: any)
  {
    this.submitted = true;
    this.Palletd = {...Palletd};
    console.log(this.Palletd)
    this.addNewDialogue = true;
  }
  
  savePallet()
  {
    this.submitted = true;
      
    if (this.Palletd.Pallet && this.Palletd.Pallet.trim()) 
    {
        if (this.Palletd.id) 
        {
          this.Pallets[this.findIndexById(this.Palletd.id)] = this.Pallets;
          this.Palletd.modifiedby = this.loggedinuser.id;
          this.Palletd.modifiedon = this.myDate;

          delete this.Palletd.CUName;
          delete this.Palletd.MUName;

          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid={id:this.Palletd.id};
          param.entity = "Wrx_Palletdimensions";
          param.attributes = this.Palletd;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Palletd Updated', life: 3000});
                this.getPallet();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Palletd Not Updated', life: 3000});
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
             if(this.rows.find((element:any)=>element.Pallet==this.Palletd.Pallet))
              {
                this.Palletd.Pallet = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Palletd Name Exist', life: 3000});
                return;
              }
                //this.country.id = this.createId();
                this.Palletd.status = true;
                this.Palletd.createdby = this.loggedinuser.id;
                this.Palletd.createdon = this.myDate;
                this.Palletd.modifiedby = this.loggedinuser.id;
                this.Palletd.modifiedon = this.myDate;
                
                delete this.Palletd.CUName;
                delete this.Palletd.MUName;
                
                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_Palletdimensions";
                param.attributes = this.Palletd;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Palletd Created', life: 3000});
                    this.getPallet();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Palletd Not Created', life: 3000});
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
        this.Palletd = {};
      }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.Pallets.length; i++) 
    {
      if (this.Pallets[i].id === id) 
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
