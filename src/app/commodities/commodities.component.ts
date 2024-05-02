import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PickListFilterOptions } from 'primeng/picklist';
import { Utils } from '../utils';
import { GeneralService } from '../general.service';
import { FieldsetModule} from 'primeng/fieldset';
import { SelectItem, PrimeNGConfig} from 'primeng/api';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-commodities',
  templateUrl: './commodities.component.html',
  styleUrls: ['./commodities.component.css'],
  providers: [DatePipe]
})
export class CommoditiesComponent implements OnInit
{
  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedCommodities: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  commodities: any = [];
  commodity: any;
  submitted: boolean = false;
  gradesfromcomodity: any = [];
  uploadedFiles: any[] = [];
  myDate = new Date();
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  userscols:any=[];
  usersrows:any=[];
  sourceusers:any=[];
  targetusers:any=[];
  usersDialogue:boolean=false;
  userscommodity:any=[];
  fileBase64: any = "";
  newimg:boolean=false;
  CommodityType:any=[{type:'MC',id:'MC'},{type:'FD',id:'FD'}];
  type = new FormControl(2);

  constructor(private router: Router, private primengConfig: PrimeNGConfig,private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
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
    this.primengConfig.ripple = true;
    this.getCommodities();
  }
    
  getCommodities()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_CommodityCreation;";
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
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel=false;
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;        
    })
  }

  getGradesByCommodityID(comodity: any){
    //get grades by comodity id and bind with gradesfromcomodity
    this.gradesfromcomodity = [];
  }
  addNew()
  {
      this.commodity = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedCommodity(commodity: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + commodity.Name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.id !== commodity.id);
          this.commodity = {};
          //Delete SQL Database
          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:commodity.id};
          param.entity = "Wrx_Commodity";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Commodity Deleted', life: 3000});
                this.getCommodities();
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
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  deleteSelectedCommodities(commodities:any) 
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
          param.entity = "Wrx_Commodity";
          param.attributes=commodities;

          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Comodites Deleted', life: 3000});
                this.getCommodities();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Commodites Not Deleted', life: 3000});
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

  hideDialog()
  {
    this.addNewDialogue = false;
  }
  editCommodity(commodity: any)
  {
    this.newimg=false;
    this.submitted = true;
    this.commodity = {...commodity};
    this.commodity.fileBase64 = this.commodity.Commodityimg;
    console.log(this.commodity)
    this.addNewDialogue = true;
  }
  
  saveCommodity()
  {
    this.submitted = true;
      
        if (this.commodity.Name && this.commodity.Name.trim()) 
        {
            if (this.commodity.id) 
            {
              this.commodities[this.findIndexById(this.commodity.id)] = this.commodities;
              this.commodity.modifiedby = this.loggedinuser.id;
              this.commodity.modifiedon = this.myDate;
              
              if(this.newimg)
              this.commodity.Commodityimg = this.fileBase64;
              
              delete this.commodity.MUName;
              delete this.commodity.CUName;
              delete this.commodity.fileBase64;

              this.blockedPanel=true;
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.commodity.id};
              param.entity = "Wrx_Commodity";
              param.attributes = this.commodity;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Commodity Updated', life: 3000});
                    this.getCommodities();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Commodity Not Updated', life: 3000});
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
             if(this.rows.find((element:any)=>element.Name==this.commodity.Name))
              {
                this.commodity.Name = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Commodity Name Exist', life: 3000});
                return;
              }
                //this.commodity.id = this.createId();
                this.commodity.status = true;
                this.commodity.modifiedby = this.loggedinuser.id;
                this.commodity.modifiedon = this.myDate;
                this.commodity.createdby = this.loggedinuser.id;
                this.commodity.createdon = this.myDate;
               
                if(this.newimg)
                this.commodity.Commodityimg = this.fileBase64;

                delete this.commodity.MUName;
                delete this.commodity.CUName;
                delete this.commodity.fileBase64;
                //console.log(myjsonobj);

  //SQL to create Commodity
                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_Commodity";
                param.attributes = this.commodity;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Commodity Created', life: 3000});
                    this.getCommodities();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Commodity Not Created', life: 3000});
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
//SQL finish create...........................................................................................................
            //this.commodities = [...this.commodities];
            this.addNewDialogue = false;
            this.commodity = {};
    }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.commodities.length; i++) 
    {
      if (this.commodities[i].id === id) 
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
  generateCode(): string 
  {
    let Code = '';
    var Suffix = 'Comm_';
    for ( var i = 0; i < 5; i++ ) {
        Code += Suffix + Math.random()*100;
    }
    return Code;
  }
  handleFileInput(files: any){
    // console.log(files);
    let selectedfile = files.currentFiles[0];
    // console.log(selectedfile);
    const reader = new FileReader();
    reader.readAsDataURL(selectedfile);
    reader.onload = () => {
        
        if(reader.result)
          this.fileBase64 = reader.result.toString();
          this.newimg=true;
        
    };
   }
  myUploader(event:any)
  {
    this.commodity.fileBase64="";
    this.uploadedFiles= [];
    for(let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles);
      this.commodity.image = this.uploadedFiles[0].name;
      console.log(this.commodity);
    }

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
}
