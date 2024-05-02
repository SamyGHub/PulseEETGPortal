import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig, MessageService, ConfirmationService } from 'primeng/api';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-sgs',
  templateUrl: './sgs.component.html',
  styleUrls: ['./sgs.component.css']
})
export class SGSComponent {
  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedexsrv: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  SGS:any={};
  SGSs:any=[];
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
    this.getSGS();
    
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getSGS()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_SGS;";
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
      this.SGS = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedexsrvs(selectedexsrv:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected SGS?',
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
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'SGS Selected Deleted', life: 3000});
              this.getSGS();
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'SGS Not Deleted', life: 3000});
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
  deleteSelectedexsrv(SGS: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + SGS.SGS + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.id !== SGS.id);
          this.SGS = {};
    //Delete SQL Database
        this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:SGS.id};
          param.entity = "Wrx_SGS";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'SGS Deleted', life: 3000});
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'SGS Not Deleted', life: 3000});
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
        this.getSGS();
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  editCFIA(SGS: any)
  {
    this.submitted = true;
    this.SGS = {...SGS};
    console.log(this.SGS)
    this.addNewDialogue = true;
  }
  
  saveCFIA()
  {
    this.submitted = true;
      
    if (this.SGS.SGS && this.SGS.SGS.trim()) 
    {
        if (this.SGS.id) 
        {
          this.SGSs[this.findIndexById(this.SGS.id)] = this.SGSs;
          this.SGS.modifiedby = this.loggedinuser.Uid;
          this.SGS.modifiedon = this.myDate;

          delete this.SGS.CUName;
          delete this.SGS.MUName;

          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid={id:this.SGS.id};
          param.entity = "Wrx_SGS";
          param.attributes = this.SGS;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'SGS Updated', life: 3000});
                this.getSGS();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'SGS Not Updated', life: 3000});
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
             if(this.rows.find((element:any)=>element.SGS==this.SGS.SGS))
              {
                this.SGS.Name = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same SGS Name Exist', life: 3000});
                return;
              }
                //this.country.id = this.createId();
                this.SGS.status = true;
                this.SGS.createdby = this.loggedinuser.Uid;
                this.SGS.createdon = this.myDate;
                this.SGS.modifiedby = this.loggedinuser.Uid;
                this.SGS.modifiedon = this.myDate;
                
                delete this.SGS.CUName;
                delete this.SGS.MUName;
                
                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_SGS";
                param.attributes = this.SGS;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'SGS Created', life: 3000});
                    this.getSGS();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'SGS Not Created', life: 3000});
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
        this.SGS = {};
      }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.SGSs.length; i++) 
    {
      if (this.SGSs[i].id === id) 
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
