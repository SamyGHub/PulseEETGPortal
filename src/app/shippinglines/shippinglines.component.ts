import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PickListFilterOptions } from 'primeng/picklist';
import { Utils } from '../utils';
import { GeneralService } from '../general.service';
import { HttpClient } from '@angular/common/http';
import { DividerModule} from 'primeng/divider';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {TooltipModule} from 'primeng/tooltip';

@Component({
  selector: 'app-shippinglines',
  templateUrl: './shippinglines.component.html',
  styleUrls: ['./shippinglines.component.css'],
  providers: [DatePipe]
})
export class ShippinglinesComponent {

  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedRailcars: any=[];
  sourcecontainers: any = [];
  targetcontainers: any = [];
  targetOrigin: any = [];
  sourceOrigin: any = []; 
  Lines: any = [];
  Line: any;
  containersDialogue = false;
  OriginDialogue = false;
  submitted: boolean = false;
  containers: any;
  cols:any=[];
  tablefilter: string = "";
  myDate = new Date();
  uploadedFiles: any[] = [];
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  fileBase64: any = "";
  newlogo:boolean=false;
  
  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService,private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe) {
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
    const customFilterName = 'custom-equals';
    this.getLines();
    }
    getLines()
    {
      this.blockedPanel=true;
        let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_ShippingLines;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.cols = response.result.cols[0];
            this.Lines = response.result.queryresult;
            this.tablefilter = this.cols.toString();
          }
        },response => {
          console.log("Post call in error", response);
          this.blockedPanel=false;
      },
      () => {
          console.log("The Post observable is now completed.");
          this.blockedPanel=false;
        })
    }
  
  deleteSelectedLines()
  {

  }
  addNew()
  {
      this.Line = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  handleFileInput(files: any){
    // console.log(files);
    //this.newlogo=""
    let selectedfile = files.currentFiles[0];
    // console.log(selectedfile);
    const reader = new FileReader();
    reader.readAsDataURL(selectedfile);
    reader.onload = () => {
        
        if(reader.result)
          this.fileBase64 = reader.result.toString();
          this.newlogo=true;
              
    };
   }
  saveLine()
  {
    this.submitted = true;
    if (this.Line.LineName && this.Line.LineName.trim()) 
    {
        if (this.Line.id) {
          this.Lines[this.findIndexById(this.Line.id)] = this.Line;
          this.Line.modifiedby = this.loggedinuser.id;
              this.Line.modifiedon = this.myDate;
              
              delete this.Line.fileBase64;

              if (this.newlogo)
                  this.Line.Logo = this.fileBase64;

          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid={id:this.Line.id};
          param.entity = "Wrx_ShippingLines";
          param.attributes = this.Line;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Shipping Line Updated', life: 3000});
                this.getLines();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Shipping Line Not Updated', life: 3000});
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
            if(this.Lines.find((element:any)=>element.TypeName==this.Line.LineName))
            {
              this.Line.LineName = null;
              this.messageService.add({severity:'Error', summary: 'Failed', detail: 'Same Line Name Exist', life: 3000});
              return;
            }
              //this.railcar.id = this.createId();
              this.Line.modifiedby = this.loggedinuser.id;
              this.Line.modifiedon = this.myDate;
              this.Line.createdby = this.loggedinuser.id;
              this.Line.createdon = this.myDate;
              
              delete this.Line.fileBase64;

              if (this.newlogo)
              this.Line.Logo = this.fileBase64;
//SQL to create Commodity

            let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
            console.log(url);
            let param: any = {};
            param.op = "create";
            param.entity = "Wrx_ShippingLines";
            param.attributes = this.Line;
            let headers = new HttpHeaders();
            this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Line Name Created', life: 3000});
                this.getLines();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Line Name Not Created', life: 3000});
              }
            },response => 
                {
                  console.log("Post call in error", response);      
                },
                () => {
                        console.log("The Post observable is now completed.");
                      })
            }
            //SQL finish create...........................................................................................................
//this.commodities = [...this.commodities];
            this.addNewDialogue = false;

            }
            this.Lines = [...this.Lines];
            this.addNewDialogue = false;
            this.Line = {};
  
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.Lines.length; i++) 
    {
        if (this.Lines[i].id === id) 
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
editLine(Line: any)
  {
    this.newlogo = false;
    this.submitted = true;  
    this.Line = {...Line};
    this.Line.fileBase64 = this.Line.Logo;
    console.log(this.Line)
    this.addNewDialogue = true;
  }
  deleteLine(Line: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + Line.LineName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          //Delete SQL Database
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:Line.id};
          param.entity = "Wrx_ShippingLines";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Line Name Deleted', life: 3000});
                this.getLines();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Line Name Not Deleted', life: 3000});
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
  myUploader(event:any)
  {
    this.Line.fileBase64="";
    this.uploadedFiles= [];
    for(let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles);}
      //this.Line.image = this.uploadedFiles[0].name;}

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
}
