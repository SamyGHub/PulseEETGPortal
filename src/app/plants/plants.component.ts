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
  selector: 'app-plants',
  templateUrl: './plants.component.html',
  styleUrls: ['./plants.component.css'],
  providers: [DatePipe]
})

export class PlantsComponent {
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
  Plants: any = [];
  Plant: any;
  submitted: boolean = false;
  myDate = new Date();

  ngOnInit(): void 
  {
    
    this.primengConfig.ripple = true;
    this.getPlants();
  }
  savePlant()
  {
    this.submitted = true;
      
        if (this.Plant.Plant && this.Plant.Plant.trim()) 
        {
            if (this.Plant.id) 
            {
              this.blockedPanel=true;
              this.Plants[this.findIndexById(this.Plant.id)] = this.Plants;
              this.Plant.modifiedby = this.loggedinuser.id;
              this.Plant.modifiedon = this.myDate;
              
              delete this.Plant.CUName;
              delete this.Plant.MUName;
              
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.Plant.id};
              param.entity = "Wrx_Plants";
              param.attributes = this.Plant;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Plant Updated', life: 3000});
                    this.getPlants();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Plant Not Updated', life: 3000});
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
             if(this.rows.find((element:any)=>element.Plant==this.Plant.Plant))
              {
                this.Plant.Plant = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Plant Name Exist', life: 3000});
                return;
              }
              this.blockedPanel=true;
                this.Plant.modifiedby = this.loggedinuser.id;
                this.Plant.modifiedon = this.myDate;
                this.Plant.createdby = this.loggedinuser.id;
                this.Plant.createdon = this.myDate;

                delete this.Plant.CUName;
                delete this.Plant.MUName;

    //SQL to create Commodity
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_Plants";
                param.attributes = this.Plant;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Plant Created', life: 3000});
                    this.getPlants();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Plant Not Created', life: 3000});
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
            this.Plant = {};
    }
      this.getPlants();
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.Plants.length; i++) 
    {
      if (this.Plants[i].id === id) 
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
    var Suffix = 'Comm_';
    id = 'Comm_';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  getPlants()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_Wrx_Plants;";
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
      this.Plant = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedPlants() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected Plants?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.rows = this.rows.filter(val => !this.selectedPlants.includes(val));
            this.selectedPlants = null;
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Plants Deleted', life: 3000});
            this.getPlants();
        }
    });
}

  hideDialog()
  {
    this.addNewDialogue = false;
  }
  editPlant(Plant: any)
  {
    this.submitted = true;
    this.Plant = {...Plant};
    this.addNewDialogue = true;
  }
  deleteSelectedPlant(Plant: any)
  {  
      this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + Plant.Plant + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.blockedPanel=true;
          this.rows = this.rows.filter(val => val.id !== Plant.id);
          this.Plant = {};
          //Delete SQL Database
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:Plant.id};
          param.entity = "Wrx_Plants";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Plant Deleted', life: 3000});
                this.getPlants();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Plant Not Deleted', life: 3000});
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
}
