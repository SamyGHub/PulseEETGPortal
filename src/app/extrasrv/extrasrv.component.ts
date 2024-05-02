import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-extrasrv',
  templateUrl: './extrasrv.component.html',
  styleUrls: ['./extrasrv.component.css']
})
export class ExtrasrvComponent {
  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedexsrv: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  extrasrv:any={};
  extrasrvs:any=[];
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
    
  }
  ngOnInit(): void 
  {
    this.getExtraSrv();
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getExtraSrv()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_Wrx_ExtraSrv;";
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
      this.extrasrv = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedexsrvs(selectedexsrv:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Extra Services?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/deleteMultiple";
        console.log(url);
        let param: any = {};
        param.op = "deleteMultiple";
        //param.entityid={id:grade.id};
        param.entity = "Wrx_Countries";
        param.attributes=selectedexsrv;

        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Extra Servcies Selected Deleted', life: 3000});
              this.getExtraSrv();
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Extra Servcies Selected Not Deleted', life: 3000});
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
  deleteSelectedexsrv(exsrv: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + exsrv.extrasrvname + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.id !== exsrv.id);
          this.extrasrv = {};
    //Delete SQL Database
        this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:exsrv.id};
          param.entity = "Wrx_ExtraSrv";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Extra Service Deleted', life: 3000});
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Extra Service Not Deleted', life: 3000});
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
        this.getExtraSrv();
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  editcountry(Country: any)
  {
    this.submitted = true;
    this.extrasrv = {...Country};
    console.log(this.extrasrv)
    this.addNewDialogue = true;
  }
  saveExSrv()
  {
    this.submitted = true;
      
    if (this.extrasrv.extrasrvname && this.extrasrv.extrasrvname.trim()) 
    {
        if (this.extrasrv.id) 
        {
          this.extrasrvs[this.findIndexById(this.extrasrv.id)] = this.extrasrvs;
          this.extrasrv.modifiedby = this.loggedinuser.id;
          this.extrasrv.modifiedon = this.myDate;

          delete this.extrasrv.CUName;
          delete this.extrasrv.MUName;

          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid={id:this.extrasrv.id};
          param.entity = "Wrx_ExtraSrv";
          param.attributes = this.extrasrv;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Extra Service Updated', life: 3000});
                this.getExtraSrv();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Extra Service Not Updated', life: 3000});
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
             if(this.rows.find((element:any)=>element.extrasrvname==this.extrasrv.extrasrvname))
              {
                this.extrasrv.Name = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Extra Service Name Exist', life: 3000});
                return;
              }
                //this.country.id = this.createId();
                this.extrasrv.status = true;
                this.extrasrv.createdby = this.loggedinuser.id;
                this.extrasrv.createdon = this.myDate;
                this.extrasrv.modifiedby = this.loggedinuser.id;
                this.extrasrv.modifiedon = this.myDate;
                
                delete this.extrasrv.CUName;
                delete this.extrasrv.MUName;
                
                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_ExtraSrv";
                param.attributes = this.extrasrv;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Extra Service Created', life: 3000});
                    this.getExtraSrv();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Extra Service Not Created', life: 3000});
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
        this.extrasrv = {};
      }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.extrasrvs.length; i++) 
    {
      if (this.extrasrvs[i].id === id) 
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
