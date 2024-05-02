import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig, MessageService, ConfirmationService } from 'primeng/api';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent {
  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedtag: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  TAG:any={};
  TAGs:any=[];
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
    this.saveTAG();
    
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getTag()
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
      this.TAG = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedexsrvs(selectedexsrv:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected TAG?',
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
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'TAG Selected Deleted', life: 3000});
              this.getTag();
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'TAG Not Deleted', life: 3000});
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
  deleteSelectedexsrv(TAG: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + TAG.TAG + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.id !== TAG.id);
          this.TAG = {};
    //Delete SQL Database
        this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:TAG.id};
          param.entity = "Wrx_SGS";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'TAG Deleted', life: 3000});
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'TAG Not Deleted', life: 3000});
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
        this.getTag();
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  editTag(TAG: any)
  {
    this.submitted = true;
    this.TAG = {...TAG};
    console.log(this.TAG)
    this.addNewDialogue = true;
  }
  
  saveTAG()
  {
    this.submitted = true;
      
    if (this.TAG.TAG && this.TAG.TAG.trim()) 
    {
        if (this.TAG.id) 
        {
          this.TAGs[this.findIndexById(this.TAG.id)] = this.TAGs;
          this.TAG.modifiedby = this.loggedinuser.id;
          this.TAG.modifiedon = this.myDate;

          delete this.TAG.CUName;
          delete this.TAG.MUName;

          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid={id:this.TAG.id};
          param.entity = "Wrx_SGS";
          param.attributes = this.TAG;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'TAG Updated', life: 3000});
                this.getTag();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'TAG Not Updated', life: 3000});
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
             if(this.rows.find((element:any)=>element.TAG==this.TAG.TAG))
              {
                this.TAG.Name = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same TAG Name Exist', life: 3000});
                return;
              }
                //this.country.id = this.createId();
                this.TAG.status = true;
                this.TAG.createdby = this.loggedinuser.id;
                this.TAG.createdon = this.myDate;
                this.TAG.modifiedby = this.loggedinuser.id;
                this.TAG.modifiedon = this.myDate;
                
                delete this.TAG.CUName;
                delete this.TAG.MUName;
                
                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_SGS";
                param.attributes = this.TAG;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'TAG Created', life: 3000});
                    this.getTag();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'TAG Not Created', life: 3000});
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
        this.TAG = {};
      }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.TAGs.length; i++) 
    {
      if (this.TAGs[i].id === id) 
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
