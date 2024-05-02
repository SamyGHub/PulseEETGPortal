import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-servcietype',
  templateUrl: './servcietype.component.html',
  styleUrls: ['./servcietype.component.css']
})
export class ServcietypeComponent {
  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedTrans: any =[];
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  ServiceTypes: any = [];
  ServiceType: any;
  submitted: boolean = false;
  TransloaderSrvType: any = [];
  SrvDialogue: any;
  sourceTransloader: any [] = [];
  targetTransloader: any [] = [];
  selectedSrv: any = [];
  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
  private http: HttpClient) 
  {
    this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
  }
  ngOnInit(): void 
  {
    
    this.getServicetype();
  }
  getServicetype()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_ServcieType;";
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
             
    },
    () => {
        console.log("The Post observable is now completed.");
        
    })
  }

  addToservicetype(){
    //get grades by comodity id and bind with gradesfromcomodity
    this.TransloaderSrvType = [];
  }
  addNew()
  {
      this.ServiceType = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedService(Servty: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + Servty.SrvName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.id !== Servty.id);
          this.ServiceType = {};
          //Delete SQL Database
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:Servty.id};
          param.entity = "Wrx_ServcieType";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Servcie Type Deleted', life: 3000});
                this.getServicetype();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Servcie Type Not Deleted', life: 3000});
              }
            },response => 
              {
              console.log("Post call in error", response);    
              },
                () => 
              {
              console.log("The Post observable is now completed.");
              })
          //End of Delete Database
      }
  });
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  editServiceType(ServiceType: any)
  {
    this.submitted = true;
    this.ServiceType = {...ServiceType};
    console.log(this.ServiceType)
    this.addNewDialogue = true;
  }
  saveServiceType()
  {
    this.submitted = true;
      
        if (this.ServiceType.Name && this.ServiceType.Name.trim()) 
        {
            if (this.ServiceType.id) 
            {
              this.ServiceTypes[this.findIndexById(this.ServiceType.id)] = this.ServiceType;
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.ServiceType.id};
              param.entity = "Wrx_ServcieType";
              param.attributes = this.ServiceType;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Service Type Updated', life: 3000});
                  }
                },response => 
                  {
                   console.log("Post call in error", response);    
                  },
                    () => 
                  {
                   console.log("The Post observable is now completed.");
                  })
                   
            }
            else
            {
             if(this.rows.find((element:any)=>element.Name==this.ServiceType.Name))
              {
                this.ServiceType.Name = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Service Type Name Exist', life: 3000});
                return;
              }
                this.ServiceType.id = this.createId();
                this.ServiceType.status = true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_ServiceType";
                param.attributes = this.ServiceType;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    //this.cols = response.result.cols[0];
                    this.rows = response.result.queryresult;
                    //console.log(this.rows)
                    //console.log(this.cols.toString())
                    this.tablefilter = this.cols.toString();
                  }
                },response => 
                    {
                      console.log("Post call in error", response);      
                    },
                    () => {
                            console.log("The Post observable is now completed.");
                          })
                  //this.commodities.push(this.commodity);
                  this.messageService.add({severity:'success', summary: 'Successful', detail: 'Service Type Created', life: 3000});
      }
        this.addNewDialogue = false;
        this.ServiceType = {};
        this.onSave();
      }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.ServiceTypes.length; i++) 
    {
      if (this.ServiceTypes[i].id === id) 
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
onSave()
  {
    this.getServicetype();
  }
  saveTransloadertoSrv()
  {

  }
}
