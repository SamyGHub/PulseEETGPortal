import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';

@Component({
  selector: 'app-importpermitmatrix',
  templateUrl: './importpermitmatrix.component.html',
  styleUrls: ['./importpermitmatrix.component.css']
})
export class ImportpermitmatrixComponent {
 
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedimports: any=[];
  rows: any  = [];
  cols: any = [];
  importmatrix: any;
  importmatrixs: any = [];
  teamsDialogue = false;
  submitted: boolean = false;
  tablefilter: string = "";
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  myDate = new Date();
  adddtDialogue:boolean=false;
  updateObject:any=[];
  countrycols:any=[];
  countryrows:any=[];
  importallow:any=[];
  Phyto:any=[];
  constructor(
    private messageService: MessageService, private router: Router,
    private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient) 
    {
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
      {  
        this.router.navigateByUrl('/app-login');
      }
      this.getImports();
      this.getCountries();
      
      this.importallow = [{id:0,name:"False"},{id:1,name:"True"}];
      this.Phyto = [{id:0,name:"False"},{id:1,name:"True"}];
    }
    getCountries()
    {
      let param: any = {};
      param.op = "query";
      param.query = "select * from vw_ImportCountries;";
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
    editImport(importmatrix: any)
    {
      this.submitted = true;
      this.importmatrix = {...importmatrix};
      console.log(this.importmatrixs);
      
      this.addNewDialogue = true;
    }
    deleteSelectedImport(importmatrix: any)
    {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + importmatrix.Country + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          //this.rows = this.rows.filter(val => val.id !== importmatrix.id);
          this.importmatrix = {};
          //Delete SQL Database
          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:importmatrix.id};
          param.entity = "Wrx_ImportPermitMatrix";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Import Matrix Country Deleted', life: 3000});
                this.getImports();
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
  getImports()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_ImportPermitMatrix;";
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
    this.importmatrix = {};
    this.submitted = false;
    this.addNewDialogue = true;
  }
  Updateimport()
  {

  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
    saveImport()
  {
    this.submitted = true;
    
      if (this.importmatrix.id) 
      {
                   
          this.importmatrixs[this.findIndexById(this.importmatrix.id)] = this.importmatrix;
          
          this.importmatrix.modifiedby = this.loggedinuser.id;
          this.importmatrix.modifiedon = this.myDate;
          
          delete this.importmatrix.Name;
          delete this.importmatrix.CUName;
          delete this.importmatrix.MUName;

          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          this.blockedPanel=true;
          let param: any = {};
          param.op = "update";
          param.entityid={id:this.importmatrix.id};
          param.entity = "Wrx_ImportPermitMatrix";
          param.attributes = this.importmatrix;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Import Matrix Updated', life: 3000});
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Import Matrix Not Updated', life: 3000});
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
                this.getImports();
                //this.blockedPanel=false;
              })
            
          }
        
           else 
          {
          
            this.importmatrix.createdby = this.loggedinuser.Uid;
            this.importmatrix.createdon = this.myDate;
            this.importmatrix.modifiedby = this.loggedinuser.Uid;
            this.importmatrix.modifiedon = this.myDate;
            
            delete this.importmatrix.Name;
            delete this.importmatrix.CUName;
            delete this.importmatrix.MUName;

            this.blockedPanel=true;
            let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
            console.log(url);
            let param: any = {};
            param.op = "create";
            param.entity = "Wrx_ImportPermitMatrix";
            param.attributes = this.importmatrix;
            let headers = new HttpHeaders();
            this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Import Matrix Created', life: 3000});
                this.getImports();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Import Matrix Not Created', life: 3000});
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
              this.importmatrix = {};
        }
findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.importmatrixs.length; i++) 
    {
      if (this.importmatrixs[i].id === id) 
      {
        index = i;
        break;
      }
    }
    return index;
  }
}
