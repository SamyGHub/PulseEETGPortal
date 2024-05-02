import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService, ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { GeneralService } from '../general.service';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-origins',
  templateUrl: './origins.component.html',
  styleUrls: ['./origins.component.css'],
  providers: [DatePipe]
})
export class OriginsComponent {
  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedorigins: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  origins: any = [];
  origin: any;
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
      this.getOrigins();
    }
    getOrigins()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select * from vw_Wrx_Origins;";
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
            console.log(this.rows)
            console.log(this.cols.toString())
            this.tablefilter = this.cols.toString();
          }
        },response => {
          console.log("Post call in error", response);
          this.blockedPanel=false;
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      },
      () => {
          console.log("The Post observable is now completed.");
          this.blockedPanel=false;
      })
    }
    showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  editOrigin(origin: any)
  {
    this.submitted = true;
    this.origin = {...origin};
    console.log(this.origin)
    this.addNewDialogue = true;
  }
  addNew()
  {
      this.origin = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedOrigins(Origins:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to Delete Selected?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          //this.rows = this.rows.filter(val => val.id !== grade.id);
          //this.grade = {};
          //Delete SQL Database
          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/deleteMultiple";
          console.log(url);
          let param: any = {};
          param.op = "deleteMultiple";
          //param.entityid={id:grade.id};
          param.entity = "Wrx_Grade";
          param.attributes=Origins;

          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Origins Deleted', life: 3000});
                this.getOrigins();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Origins Not Deleted', life: 3000});
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
  deleteSelectedCountry(origin: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + origin.Origin + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.id !== origin.id);
          this.origin = {};
    //Delete SQL Database
    this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:origin.id};
          param.entity = "Wrx_Origin";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Origin Deleted', life: 3000});
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Origin Not Deleted', life: 3000});
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
        this.getOrigins();
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  saveOrigin()
  {
    this.submitted = true;
      
        if (this.origin.Origin && this.origin.Origin.trim()) 
        {
            if (this.origin.id) 
            {
              this.origins[this.findIndexById(this.origin.id)] = this.origins;
              this.origin.modifiedby = this.loggedinuser.id;
              this.origin.modifiedon = this.myDate;

              delete this.origin.MUName;
              delete this.origin.CUName;
              
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              this.blockedPanel=true;
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.origin.id};
              param.entity = "Wrx_Origin";
              param.attributes = this.origin;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Origin Updated', life: 3000});
                    this.getOrigins();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Origin Not Updated', life: 3000});
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
             if(this.rows.find((element:any)=>element.Name==this.origin.Origin))
              {
                this.origin.Origin = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Origin Name Exist', life: 3000});
                return;
              }
                //this.country.id = this.createId();
                //this.origin.status = true;
                this.origin.createdby = this.loggedinuser.id;
                this.origin.createdon = this.myDate;
                this.origin.modifiedby = this.loggedinuser.id;
                this.origin.modifiedon = this.myDate;

                delete this.origin.MUName;
                delete this.origin.CUName;

                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_Origin";
                param.attributes = this.origin;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Origin Created', life: 3000});
                    this.getOrigins();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Origin Not Created', life: 3000});
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
        this.origin = {};
      }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.origins.length; i++) 
    {
      if (this.origins[i].id === id) 
      {
        index = i;
        break;
      }
    }

    return index;
  }
}
