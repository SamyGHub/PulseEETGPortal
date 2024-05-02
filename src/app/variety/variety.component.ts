import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, FilterService, MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GeneralService } from '../general.service';
import {TooltipModule} from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-variety',
  templateUrl: './variety.component.html',
  styleUrls: ['./variety.component.css']
})
export class VarietyComponent {

  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedVariety: any=[];
  sourceCommodity: any=[];
  targetCommodity: any=[];
  commodityDialogue = false;
  varaities: any = [];
  varaity: any;
  submitted: boolean = false;
  rows: any[]  = [];
  cols: any [] = [];
  vwcols:any[] = [];
  vwrows:any[]=[];
  commodityvaraity: any [] = [];
  commodities: any = [];
  tablefilter: string = "";
  myDate = new Date();
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";

  constructor(private router: Router, private primengConfig: PrimeNGConfig,private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe) {
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
      {
        
        this.router.navigateByUrl('/app-login');
      }
    }
    deleteSelectedAllVariety(Var:any)
    {

    }
    ngOnInit(): void 
    {
      this.getvaraitey();
      this.getCommodities();
    }
    saveVariety()
    {
      this.varaity.modifiedby = this.loggedinuser.id;
      this.varaity.modifiedon = this.myDate;
      this.varaity.createdby = this.loggedinuser.id;
      this.varaity.createdon = this.myDate;
  
      this.blockedPanel=true;
      this.submitted = true;
        
          if (this.varaity.variety && this.varaity.variety.trim()) 
          {
              if (this.varaity.id) 
              {
                delete this.varaity["Name"];
                delete this.varaity["CUName"];
                delete this.varaity["MUName"];
                
                this.varaities[this.findIndexById(this.varaity.id)] = this.varaity;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
                console.log(url);
                let param: any = {};
                param.op = "update";
                param.entityid={id:this.varaity.id};
                param.entity = "Wrx_Variety";
                param.attributes = this.varaity;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                 (res) => 
                  {
                    console.log(res);
                    var response: any = res;
                    if(response.success)
                    {
                      this.messageService.add({severity:'success', summary: 'Successful', detail: 'Varaity Updated', life: 3000});
                      this.getvaraitey();
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
               if(this.rows.find((element:any)=>element.variety==this.varaity.variety))
                {
                  this.varaity.Grade = null;
                  this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Grade Name Exist', life: 3000});
                  return;
                }
                  delete this.varaity["Name"];
                  delete this.varaity["CUName"];
                  delete this.varaity["MUName"];
  
                  //this.grade.id = this.createId();
                  //this.grade.status = true;
                  this.blockedPanel=true;
                  let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                  console.log(url);
                  let param: any = {};
                  param.op = "create";
                  param.entity = "Wrx_Variety";
                  param.attributes = this.varaity;
                  let headers = new HttpHeaders();
                  this.http.post(url, param, {headers: headers}).subscribe(
                  (res) => 
                  {
                    console.log(res);
                    var response: any = res;
                    if(response.success)
                    {
                      this.messageService.add({severity:'success', summary: 'Successful', detail: 'Variety Created', life: 3000});
                      this.tablefilter = this.cols.toString();
                      this.getvaraitey();
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
  
              //this.commodities = [...this.commodities];
              this.addNewDialogue = false;
              this.varaity = {};
        
          }
    }
    saveVarietytocommodity()
    {
    //   this.varaity.modifiedby = this.loggedinuser.Uid;
    //   this.varaity.modifiedon = this.myDate;
    //   this.varaity.createdby = this.loggedinuser.Uid;
    //   this.varaity.createdon = this.myDate;
    
    //   this.blockedPanel=true;
    // //this.targetTeams.forEach((element: { ID: any; }) =>{this.usersinteams.push(this.selectedUsers[0].ID), element.ID;});
    //   this.commodityvaraity = [];
    //   //start the delete statment
    //   let urlDel = this.generalservice.appconfigs.URLs.apiUrl+"/api/DeleteTow";
    //   console.log(urlDel);
    //   let paramDel: any = {};
    //   paramDel.op = "DeleteTow";
    //   paramDel.entityid={FromId:this.selectedGrades[0].id, FromType:'grade'};
    //   paramDel.entity = "Wrx_ManyMany";
    //   let Delheaders = new HttpHeaders();
    //   this.http.post(urlDel, paramDel, {headers: Delheaders}).subscribe(
    //   (res) => 
    //     {
    //       console.log(res);
    //       var response: any = res;
    //       if(response.success)
    //       {
    //         this.messageService.add({severity:'success', summary: 'Successful', detail: 'Grade Removed', life: 3000});
    //       }
    //       else
    //       {
    //         this.messageService.add({severity:'error', summary: 'Failed', detail: 'Failed to delete', life: 3000});
    //       }
    //     },response => 
    //       {
    //       console.log("Post call in error", response);    
    //       },
    //         () => 
    //       {
    //       console.log("The Post observable is now completed.");
    //       this.getGrades();
    //       })
    // //End the delete statment 
    //       console.log(this.targetCommodity)
    //         this.selectedGrades.forEach((grade: any) => {
    //           this.targetCommodity.forEach((commodity: any) => {
    //           this.commoditygrades.push({"FromId": grade.id, "ToId": commodity.id});
    //         })
    //       });   
    //       console.log(this.commoditygrades);
    //   //this.targetTeams.forEach((element: any) => {
    //   //if(element.ID == this.selectedUsers[0].ID)
    //   //{
    //    // element.teams = this.targetTeams;

    //     let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createRelations";
    //       console.log(url);
    //       let param: any = {};
    //       param.op = "createRelations";
    //       param.FromType = "grade";
    //       param.ToType = "Commodity";
    //       param.attributes = this.commoditygrades;
    //         let headers = new HttpHeaders();
    //         this.http.post(url, param, {headers: headers}).subscribe(
    //           (res) => 
    //           {
    //             console.log(res);
    //             var response: any = res;
    //             if(response.success)
    //             {
    //               this.messageService.add({severity:'success', summary: 'Successful', detail: 'Grade added to Comodity', life: 3000});
    //             }
    //             else
    //             {
    //               this.messageService.add({severity:'error', summary: 'Failed', detail: 'Grade Not Added to Commdity', life: 3000});
    //             }
    //           },response => 
    //           {
    //             console.log("Post call in error", response);
    //             this.blockedPanel=false;
    //             this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);                         
    //           },
    //           () => {
    //           console.log("The Post observable is now completed.");
    //           this.blockedPanel=false;
    //           this.getGrades();
    //                 })
    //             this.VariteyDialogue = false;
    }
    editVariety(varaity:any)
    {
      this.submitted = true;
      this.varaity = {...varaity};
      console.log(this.varaity);
      this.addNewDialogue = true;
    }
    getCommodities()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select id, Name from Wrx_Commodity;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            //this.cols = response.result.cols[0];
            //this.rows = response.result.queryresult;
            this.commodities = response.result.queryresult;
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
    showPositionDialog(position: string, message: string) 
      {
        this.dialougmessage = message;
        this.position = position;
        this.displayPosition = true;
      }
    addToCommodity()
    {
      console.log(this.selectedVariety)
      this.sourceCommodity = this.commodities;
      let param: any = {};
        param.op = "query";
        param.query = "select * from vw_Gradevaraity where fromid=" + this.selectedVariety[0].id + " and fromtype='varaity';";
        let headers = new HttpHeaders();
      
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            //this.vwcols = response.result.cols[0];
            //this.vwrows = response.result.queryresult;
            //console.log(this.vwrows)
            //console.log(this.vwcols.toString())
            this.targetCommodity = response.result.queryresult
            console.log(this.targetCommodity)
            this.tablefilter = this.cols.toString();
          }
        },response => {
          console.log("Post call in error", response);    
          
      },
      () => {
          console.log("The Post observable is now completed.");
      })
      
        this.commodityDialogue = true;
    }
    getvaraitey()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select * from vw_Wrx_Variety;";
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
  
    addNew()
    {
        this.varaity = {};
        this.submitted = false;
        this.addNewDialogue = true;
    }
    deleteSelectedAllvaraity(varaity:any)
    {
      this.confirmationService.confirm({
        message: 'Are you sure you want to Delete Selected?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            //this.rows = this.rows.filter(val => val.id !== varaity.id);
            //this.varaity = {};
            //Delete SQL Database
            this.blockedPanel=true;
            let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/deleteMultiple";
            console.log(url);
            let param: any = {};
            param.op = "deleteMultiple";
            //param.entityid={id:varaity.id};
            param.entity = "Wrx_Variety";
            param.attributes=varaity;
  
            let headers = new HttpHeaders();
            this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
              {
                console.log(res);
                var response: any = res;
                if(response.success)
                {
                  this.messageService.add({severity:'success', summary: 'Successful', detail: 'Varaitey Deleted', life: 3000});
                  this.getvaraitey();
                }
                else
                {
                  this.messageService.add({severity:'error', summary: 'Failed', detail: 'Varaitey Not Deleted', life: 3000});
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
    
  deleteSelectedVariety(varaity: any)
    {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + varaity.varaity + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.rows = this.rows.filter(val => val.id !== varaity.id);
          this.varaity = {};
          //Delete SQL Database
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:varaity.id};
          param.entity = "Wrx_Variety";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Variety Deleted', life: 3000});
                this.getvaraitey();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Variety Not Deleted', life: 3000});
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
    editvaraity(varaity: any)
    {
      this.submitted = true;
      this.varaity = {...varaity};
     
      console.log(this.varaity.Commodityid)
      this.addNewDialogue = true;
    }
    savevaraity()
    {
      this.varaity.modifiedby = this.loggedinuser.id;
      this.varaity.modifiedon = this.myDate;
      this.varaity.createdby = this.loggedinuser.id;
      this.varaity.createdon = this.myDate;
  
      this.blockedPanel=true;
      this.submitted = true;
        
          if (this.varaity.varaity && this.varaity.varaity.trim()) 
          {
              if (this.varaity.id) 
              {
                delete this.varaity["Name"];
                delete this.varaity["CUName"];
                delete this.varaity["MUName"];
                
                this.varaities[this.findIndexById(this.varaity.id)] = this.varaity;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
                console.log(url);
                let param: any = {};
                param.op = "update";
                param.entityid={id:this.varaity.id};
                param.entity = "Wrx_Variety";
                param.attributes = this.varaity;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                 (res) => 
                  {
                    console.log(res);
                    var response: any = res;
                    if(response.success)
                    {
                      this.messageService.add({severity:'success', summary: 'Successful', detail: 'varaity Updated', life: 3000});
                      this.getvaraitey();
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
               if(this.rows.find((element:any)=>element.varaity==this.varaity.varaity))
                {
                  this.varaity.varaity = null;
                  this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same varaity Name Exist', life: 3000});
                  return;
                }
                  delete this.varaity["Name"];
                  delete this.varaity["CUName"];
                  delete this.varaity["MUName"];
  
                  //this.varaity.id = this.createId();
                  //this.varaity.status = true;
                  this.blockedPanel=true;
                  let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                  console.log(url);
                  let param: any = {};
                  param.op = "create";
                  param.entity = "Wrx_varaity";
                  param.attributes = this.varaity;
                  let headers = new HttpHeaders();
                  this.http.post(url, param, {headers: headers}).subscribe(
                  (res) => 
                  {
                    console.log(res);
                    var response: any = res;
                    if(response.success)
                    {
                      this.messageService.add({severity:'success', summary: 'Successful', detail: 'varaity Created', life: 3000});
                      this.tablefilter = this.cols.toString();
                      this.getvaraitey();
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
  
              //this.commodities = [...this.commodities];
              this.addNewDialogue = false;
              this.varaity = {};
        
          }
    }
   
    findIndexById(id: string): number 
    {
      let index = -1;
      for (let i = 0; i < this.varaities.length; i++) 
      {
        if (this.varaities[i].id === id) 
        {
          index = i;
          break;
        }
      }
  
      return index;
    }
}
