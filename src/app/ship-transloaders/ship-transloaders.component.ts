import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-ship-transloaders',
  templateUrl: './ship-transloaders.component.html',
  styleUrls: ['./ship-transloaders.component.css'],
  providers: [DatePipe]
})
export class ShipTransloadersComponent {
  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedTrans: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  Transloaders: any = [];
  Transloader: any;
  submitted: boolean = false;
  TransloaderSrvType: any = [];
  SrvDialogue: any;
  sourceService: any [] = [];
  targetService: any [] = [];
  uploadedFiles: any[] = [];
  myDate = new Date();
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";

  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
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
    
    this.getTransloaders();
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getTransloaders()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_Wrx_Transloader;";
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
      this.Transloader = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedTransloader(Trans: any)
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
          param.entity = "Wrx_Transloaders";
          param.attributes=Trans;

          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Transloader Deleted', life: 3000});
                this.getTransloaders();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Transloader Not Deleted', life: 3000});
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
  editTransloader(Transloader: any)
  {
    this.submitted = true;
    this.Transloader = {...Transloader};
    console.log(this.Transloader)
    this.addNewDialogue = true;
  }
  saveTransloader()
  {
    this.submitted = true;
      
        if (this.Transloader.TransName && this.Transloader.TransName.trim()) 
        {
            if (this.Transloader.TransID) 
            {
              this.blockedPanel=true;
              this.Transloaders[this.findIndexById(this.Transloader.TransID)] = this.Transloader;
              this.Transloader.modifiedby = this.loggedinuser.id;
              this.Transloader.modifiedon = this.myDate;

              delete this.Transloader.CUName;
              delete this.Transloader.MUName;
              
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              let param: any = {};
              param.op = "update";
              param.entityid={TransID:this.Transloader.TransID};
              param.entity = "Wrx_Transloaders";
              param.attributes = this.Transloader;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Transloader Updated', life: 3000});
                    this.getTransloaders();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Transloader Not Updated', life: 3000});
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
             if(this.rows.find((element:any)=>element.TransName==this.Transloader.TransName))
              {
                this.Transloader.TransName = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Transloader Name Exist', life: 3000});
                return;
              }
              this.blockedPanel=true;
                this.Transloader.TransID = this.createId();
                //this.Transloader.status = true;
                this.Transloader.modifiedby = this.loggedinuser.id;
                this.Transloader.modifiedon = this.myDate;
                this.Transloader.createdby = this.loggedinuser.id;
                this.Transloader.createdon = this.myDate;

                delete this.Transloader.CUName;
                delete this.Transloader.MUName;

                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_Transloaders";
                param.attributes = this.Transloader;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Transloader Created', life: 3000});
                    this.getTransloaders();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Transloader Not Created', life: 3000});
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
                  //this.commodities.push(this.commodity);
                  
      }
        this.addNewDialogue = false;
        this.Transloader = {};
      }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.Transloaders.length; i++) 
    {
      if (this.Transloaders[i].TransID === id) 
      {
        index = i;
        break;
      }
    }

    return index;
  }
  createId(): string 
  {
    let id = 'Trans_';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  saveTransloadertoSrv()
  {

  }
  myUploader(event:any)
  {
    this.uploadedFiles= [];
    for(let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles);
      this.Transloader.Logo = this.uploadedFiles[0].name;
      console.log(this.Transloader);
    }

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
}

