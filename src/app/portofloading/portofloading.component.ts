import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PickListFilterOptions } from 'primeng/picklist';
import { Utils } from '../utils';
import { GeneralService } from '../general.service';
import {FieldsetModule} from 'primeng/fieldset';
import { SelectItem, PrimeNGConfig} from 'primeng/api';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portofloading',
  templateUrl: './portofloading.component.html',
  styleUrls: ['./portofloading.component.css']
})
export class PortofloadingComponent {
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedports: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  ports: any = [];
  port: any;
  submitted: boolean = false;
  uploadedFiles: any[] = [];
  myDate = new Date();
  countryrows:any=[];
  countrycols:any=[];
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";

  constructor(private router: Router, private primengConfig: PrimeNGConfig,private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe) 
    {
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
      this.getports();
      this.getcountries();
    }
  getcountries()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Countries;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.countrycols = response.result.cols[0];
          this.countryrows = response.result.queryresult;
          this.tablefilter = this.cols.toString();
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
    },
    () => {
        console.log("The Post observable is now completed.");
        
    })
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getports()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_Portofloading;";
    let headers = new HttpHeaders();
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.cols = response.result.cols[0];
        this.rows = response.result.queryresult;
        console.log(this.rows)
        console.log(this.cols.toString())
        this.tablefilter = this.cols.toString();
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
 
  addNew()
  {
      this.port = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedPorts()
  {

  }
  editPorts(port:any)
  {
    this.submitted = true;  
    this.port = {...port};
    this.addNewDialogue = true;
  }
  deleteSelectedPort(port:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + port.LineName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          //Delete SQL Database
          this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
        console.log(url);
        let param: any = {};
        param.op = "delete";
        param.entityid={id:port.id};
        param.entity = "Wrx_Ports";
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Port Name Deleted', life: 3000});
              this.getports();
              
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Port Name Not Deleted', life: 3000});
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
          //End of Delete Database
      }
    });
  }
  myUploader(event:any)
  {
    this.uploadedFiles= [];
    for(let file of event.files) 
    {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles);
      this.port.image = this.uploadedFiles[0].name;
      console.log(this.port);
    }
      this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
  saveport()
  {
    this.submitted = true;
      
        if (this.port.PortName && this.port.PortName.trim()) 
        {
            if (this.port.id) 
            {
              this.blockedPanel=true;
             // this.ports[this.findIndexById(this.port.id)] = this.ports;
              this.port.modifiedby = this.loggedinuser.id;
              this.port.modifiedon = this.myDate;
              
              delete this.port.CUName;
              delete this.port.MUName;
              delete this.port.status;
              delete this.port.OtherName;

              
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.port.id};
              param.entity = "Wrx_Ports";
              param.attributes = this.port;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'port Updated', life: 3000});
                    this.getports();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'port Not Updated', life: 3000});
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
            else
            {
             if(this.rows.find((element:any)=>element.Name==this.port.PortName))
              {
                this.port.PortName = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same port Name Exist', life: 3000});
                return;
              }
              this.blockedPanel=true;
                //this.port.id = this.createId();
                this.port.status = true;
                this.port.modifiedby = this.loggedinuser.id;
                this.port.modifiedon = this.myDate;
                this.port.createdby = this.loggedinuser.id;
                this.port.createdon = this.myDate;

                delete this.port.CUName;
              delete this.port.MUName;
              delete this.port.status;
              delete this.port.OtherName;

  //SQL to create port
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_Ports";
                param.attributes = this.port;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'port Created', life: 3000});
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'port Not Created', life: 3000});
                  }
                },response => 
                    {
                      console.log("Post call in error", response);
                      this.blockedPanel=false;    
                      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
                    },
                    () => {
                            console.log("The Post observable is now completed.");
                            this.blockedPanel=false;
                          })
            }
//SQL finish create...........................................................................................................
            //this.ports = [...this.ports];
            this.addNewDialogue = false;
            this.port = {};
    }
      this.getports();
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
}
