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
  selector: 'app-pkagetypes',
  templateUrl: './pkagetypes.component.html',
  styleUrls: ['./pkagetypes.component.css'],
  providers: [DatePipe]
})
export class PkagetypesComponent 
{
  constructor(private router:Router, private primengConfig: PrimeNGConfig,private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe) {
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
    
    }

  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedPlants: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  Pkgtypes: any = [];
  Pkgtype: any;
  submitted: boolean = false;
  myDate = new Date();

  ngOnInit(): void 
  {
    
    this.primengConfig.ripple = true;
    this.getPkgs();
  }
  getPkgs()
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
  addNew()
  {
    this.Pkgtype = {};
    this.submitted = false;
    this.addNewDialogue = true;
  }
  deleteSelectedPlants()
  {

  }
  editPkage(pkage:any)
  {
    this.submitted = true;
    this.Pkgtype = {...pkage};
    console.log(this.Pkgtype)
    this.addNewDialogue = true;
  }
  deleteSelectedPkage(pkage:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + pkage.pkagetype + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.id !== pkage.id);
          this.Pkgtype = {};
          //Delete SQL Database
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:pkage.id};
          param.entity = "Wrx_Pkagetypes";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Package Type Deleted', life: 3000});
                this.getPkgs();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Package Type Not Deleted', life: 3000});
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
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.Pkgtypes.length; i++) 
    {
      if (this.Pkgtypes[i].id === id) 
      {
        index = i;
        break;
      }
    }
    return index;
  }
  savePkge()
  {
    this.submitted = true;
      
    if (this.Pkgtype.pkagetype && this.Pkgtype.pkagetype.trim()) 
    {
        if (this.Pkgtype.id) 
        {
          this.Pkgtypes[this.findIndexById(this.Pkgtype.id)] = this.Pkgtypes;
          this.Pkgtype.modifiedby = this.loggedinuser.id;
          this.Pkgtype.modifiedon = this.myDate;

          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid={id:this.Pkgtype.id};
          param.entity = "Wrx_Pkagetypes";
          param.attributes = this.Pkgtype;
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
              },
                () => 
              {
               console.log("The Post observable is now completed.");
              })
               
        }
        else
        {
         if(this.rows.find((element:any)=>element.pkagetype==this.Pkgtype.pkagetype))
          {
            this.Pkgtype.pkagetype = null;
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Package Name Exist', life: 3000});
            return;
          }
            this.Pkgtype.modifiedby = this.loggedinuser.id;
            this.Pkgtype.modifiedon = this.myDate;
            this.Pkgtype.createdby = this.loggedinuser.id;
            this.Pkgtype.createdon = this.myDate;
//SQL to create Commodity
            let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
            console.log(url);
            let param: any = {};
            param.op = "create";
            param.entity = "Wrx_Pkagetypes";
            param.attributes = this.Pkgtype;
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
                },
                () => {
                        console.log("The Post observable is now completed.");
                      })
        }
//SQL finish create...........................................................................................................
        //this.commodities = [...this.commodities];
        this.addNewDialogue = false;
        this.Pkgtype = {};
}
  }
}
