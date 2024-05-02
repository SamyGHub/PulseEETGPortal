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
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css'],
  providers: [DatePipe]
})
export class PackagesComponent 
{
  constructor(private router:Router, private primengConfig: PrimeNGConfig,private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe) {
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      this.router.navigateByUrl('/app-login');
    }
      this.color=[{name:'White',code:'White'},{name:'Transparent',code:'Transparent'},{name:'RED',code:'RED'},{name:'Green',code:'Green'},{name:'Yellow',code:'Yellow'},{name:'Black',code:'Black'}]
      this.plain = [{name:'Yes',code:1},{name:'No', code:0}];

    }

  [x: string]: any;
  blockedPanel: boolean = false;
  plain:any[]=[];
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedPlants: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  Pkgs: any = [];
  Pkg: any;
  submitted: boolean = false;
  myDate = new Date();
  Pkgstypes:any[]=[];
  Pkgstype:any={};
  Units:any[]=[];
  uploadedFiles: any[] = [];
  color:any[]=[];

  ngOnInit(): void 
  {
    
    this.primengConfig.ripple = true;
    this.getPkgs();
    this.getUnits();
    this.getPkgstypes();
  }
  getUnits()
    {
      let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Units;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {  
          this.Units = response.result.queryresult;
        }
      },response => {
        console.log("Post call in error", response);
    },
    () => {
        console.log("The Post observable is now completed.");
    })
    }
  getPkgstypes()
  {
    let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_Pkagetypes;";
    let headers = new HttpHeaders();
  
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
  
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success){
        this.Pkgstypes = response.result.queryresult;
      }
    },response => {
      console.log("Post call in error", response);
    },
    () => {
        console.log("The Post observable is now completed.");
    })
  }
  getPkgs()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_Packages;";
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
        this.tablefilter = this.cols.toString();      }
    },response => {
      console.log("Post call in error", response);
      this.blockedPanel=false;
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;
    })
  }
  addNew()
  {
    this.Pkg = {};
    this.submitted = false;
    this.addNewDialogue = true;
  }
  deleteSelectedPlants()
  {

  }
  editPkage(pkage:any)
  {
    this.submitted = true;
    this.Pkg = {...pkage};
    console.log(this.Pkg)
    this.addNewDialogue = true;
  }
  deleteSelectedPkage(pkage:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete [' + pkage.bagname + ']?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.blockedPanel=true;
          this.rows = this.rows.filter(val => val.id !== pkage.id);
          this.Pkg = {};
          //Delete SQL Database
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:pkage.id};
          param.entity = "Wrx_Packages";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Package Deleted', life: 3000});
                this.getPkgs();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Package Not Deleted', life: 3000});
              }
            },response => 
              {
              console.log("Post call in error", response);    
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
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  savepkg()
  {
    this.submitted = true;
        if (this.Pkg.bagname && this.Pkg.bagname.trim()) 
        {
            if (this.Pkg.id) 
            {
              this.blockedPanel=true;
              this.Pkgs[this.findIndexById(this.Pkg.id)] = this.Pkgs;
              this.Pkg.modifiedby = this.loggedinuser.id;
              this.Pkg.modifiedon = this.myDate;

              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.Pkg.id};
              param.entity = "Wrx_Packages";
              param.attributes = this.Pkg;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Package Updated', life: 3000});
                    this.getPkgs();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Package Not Updated', life: 3000});
                  }
                },response => 
                  {
                   console.log("Post call in error", response);
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
             if(this.rows.find((element:any)=>element.bagname==this.Pkg.bagname))
              {
                this.Pkg.bagname = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Package Name Exist', life: 3000});
                return;
              }
              this.blockedPanel=true;
                //this.Pkg.id = this.createId();
                //this.Pkg.status = true;
                this.Pkg.modifiedby = this.loggedinuser.id;
                this.Pkg.modifiedon = this.myDate;
                this.Pkg.createdby = this.loggedinuser.id;
                this.Pkg.createdon = this.myDate;
  //SQL to create Commodity
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_Packages";
                param.attributes = this.Pkg;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Package Created', life: 3000});
                    this.getPkgs();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Package Not Created', life: 3000});
                  }
                },response => 
                    {
                      console.log("Post call in error", response);
                      this.blockedPanel=false;     
                    },
                    () => {
                      console.log("The Post observable is now completed.");
                      this.blockedPanel=false;
                    })
            }
//SQL finish create...........................................................................................................
            this.addNewDialogue = false;
            this.Pkg = {};
    }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.Pkgs.length; i++) 
    {
      if (this.Pkgs[i].id === id) 
      {
        index = i;
        break;
      }
    }

    return index;
  }
  myUploader(event:any)
  {
    this.uploadedFiles= [];
    for(let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles);
      this.Pkg.image = this.uploadedFiles[0].name;
      console.log(this.Pkg);
    }

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
}
