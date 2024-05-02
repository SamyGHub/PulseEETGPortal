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
  selector: 'app-railcars',
  templateUrl: './railcars.component.html',
  styleUrls: ['./railcars.component.css'],
  providers: [DatePipe]
})
export class RailcarsComponent {
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedRailcars: any=[];
  sourcecontainers: any = [];
  targetcontainers: any = [];
  targetOrigin: any = [];
  sourceOrigin: any = []; 
  railcars: any = [];
  railcar: any;
  containersDialogue = false;
  OriginDialogue = false;
  submitted: boolean = false;
  containers: any;
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  Origincols: any =[];
  Originrows: any=[];
  myDate = new Date();

  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService,private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe) {
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
    }
  ngOnInit(): void 
  {
    

    this.getRailcars();
    this.getContainers();

    //this.getOrigins();
  }
  getContainers()
  {
    //let teams = sessionStorage.getItem("teams");
    let containers = localStorage.getItem("Containers");
    if(containers){
      this.sourcecontainers = JSON.parse(containers);
      this.containers = this.sourcecontainers;
    }
  }
  getRailcars()
  {
      let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_RailCarsTypes;";
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
          console.log(this.rows);
          this.tablefilter = this.cols.toString();
        }
      },response => {
        console.log("Post call in error", response);
    },
    () => {
        console.log("The Post observable is now completed.");
    })
  }
  getOrigins()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Origin;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.Origincols = response.result.cols[0];
          this.Originrows = response.result.queryresult;
          console.log(this.Originrows)
          console.log(this.Origincols.toString())
          this.tablefilter = this.Origincols.toString();
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
      this.railcar = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  addToContainer()
  {
    console.log(this.selectedRailcars)
    if(this.selectedRailcars && this.selectedRailcars[0].containers){
      this.targetcontainers = [...this.selectedRailcars[0].containers]
      console.log(this.targetcontainers)
    }
    else
    {
      this.targetcontainers = [];
      this.sourcecontainers = this.containers;
    }
      this.containersDialogue = true;
  }
  addToOrigin()
  {}
  saveOriginToRailCar()
  {
    console.log(this.selectedRailcars);
    console.log(this.targetcontainers);
    this.railcars.forEach((element: any) => 
    {
      if(element.id == this.selectedRailcars[0].id)
        element.teams = this.targetcontainers
        this.getRailcars();
        this.containersDialogue = false;
    });
  }
  saveContainertoRailcar()
  {
    console.log(this.selectedRailcars);
    console.log(this.targetcontainers);
    this.railcars.forEach((element: any) => 
    {
      if(element.id == this.selectedRailcars[0].id)
        element.teams = this.targetcontainers
        this.getRailcars();
        this.containersDialogue = false;
    });
  }
  deleteSelectedRailcars(){}
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  saveRailcar()
  {
    this.submitted = true;
        if (this.railcar.TypeName && this.railcar.TypeName.trim()) 
        {
            if (this.railcar.id) {
                this.railcars[this.findIndexById(this.railcar.id)] = this.railcar;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
                console.log(url);
                let param: any = {};
                param.op = "update";
                param.entityid={id:this.railcar.id};
                param.entity = "Wrx_RailCarsTypes";
                param.attributes = this.railcar;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                  {
                    console.log(res);
                    var response: any = res;
                    if(response.success)
                    {
                      this.messageService.add({severity:'success', summary: 'Successful', detail: 'RailCar Type Updated', life: 3000});
                      this.getRailcars();
                    }else{
                      this.messageService.add({severity:'error', summary: 'Failed', detail: 'RailCar Type Not Updated', life: 3000});
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
              if(this.railcars.find((element:any)=>element.TypeName==this.railcar.TypeName))
              {
                this.railcar.TypeName = null;
                this.messageService.add({severity:'Error', summary: 'Failed', detail: 'Same RailCar Type Code Exist', life: 3000});
                return;
              }
                //this.railcar.id = this.createId();
                this.railcar.modifiedby = this.loggedinuser.id;
                this.railcar.modifiedon = this.myDate;
                this.railcar.createdby = this.loggedinuser.id;
                this.railcar.createdon = this.myDate;
//SQL to create Commodity
            let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
            console.log(url);
            let param: any = {};
            param.op = "create";
            param.entity = "Wrx_RailCarsTypes";
            param.attributes = this.railcar;
            let headers = new HttpHeaders();
            this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'RailCar Type Created', life: 3000});
                this.getRailcars();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'RailCar Type Not Created', life: 3000});
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
            this.railcars = [...this.railcars];
            this.addNewDialogue = false;
            this.railcar = {};
  
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.railcars.length; i++) 
    {
        if (this.railcars[i].id === id) 
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
editRailcar(railcar: any)
  {
    this.submitted = true;  
    this.railcar = {...railcar};
    console.log(this.railcar)
    this.addNewDialogue = true;
  }
  deleterailcar(railcar: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + railcar.TypeName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          //Delete SQL Database
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:railcar.id};
          param.entity = "Wrx_RailCarsTypes";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'RailCarsType Deleted', life: 3000});
                this.getRailcars();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'RailCarsType Not Deleted', life: 3000});
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
}
