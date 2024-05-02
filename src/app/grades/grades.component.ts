import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { PickListFilterOptions } from 'primeng/picklist';
import { Utils } from '../utils';
import { GeneralService } from '../general.service';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css'], 
  providers: [DatePipe]
})
export class GradesComponent {
  
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedGrades: any=[];
  sourceCommodity: any=[];
  targetCommodity: any=[];
  VariteyDialogue = false;
  grades: any = [];
  grade: any;
  submitted: boolean = false;
  rows: any[]  = [];
  cols: any [] = [];
  vwcols:any[] = [];
  vwrows:any[]=[];
  commoditygrades: any [] = [];
  Varities: any = [];
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
      this.getGrades();
       this.getVarities();
    }


  getVarities()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select id, variety from Wrx_Variety;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.Varities = response.result.queryresult;
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
    console.log(this.selectedGrades)
    this.sourceCommodity = this.Varities;
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_CommodityGrade where fromid=" + this.selectedGrades[0].id + " and fromtype='grade';";
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
    
      this.VariteyDialogue = true;
  }
  savegradetocommodity()
  {
    this.grade.modifiedby = this.loggedinuser.Uid;
    this.grade.modifiedon = this.myDate;
    this.grade.createdby = this.loggedinuser.Uid;
    this.grade.createdon = this.myDate;
    
    this.blockedPanel=true;
    //this.targetTeams.forEach((element: { ID: any; }) =>{this.usersinteams.push(this.selectedUsers[0].ID), element.ID;});
      this.commoditygrades = [];
      //start the delete statment
      let urlDel = this.generalservice.appconfigs.URLs.apiUrl+"/api/DeleteTow";
      console.log(urlDel);
      let paramDel: any = {};
      paramDel.op = "DeleteTow";
      paramDel.entityid={FromId:this.selectedGrades[0].id, FromType:'grade'};
      paramDel.entity = "Wrx_ManyMany";
      let Delheaders = new HttpHeaders();
      this.http.post(urlDel, paramDel, {headers: Delheaders}).subscribe(
      (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Grade Removed', life: 3000});
          }
          else
          {
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Failed to delete', life: 3000});
          }
        },response => 
          {
          console.log("Post call in error", response);    
          },
            () => 
          {
          console.log("The Post observable is now completed.");
          this.getGrades();
          })
    //End the delete statment 
          console.log(this.targetCommodity)
            this.selectedGrades.forEach((grade: any) => {
              this.targetCommodity.forEach((commodity: any) => {
              this.commoditygrades.push({"FromId": grade.id, "ToId": commodity.id});
            })
          });   
          console.log(this.commoditygrades);
      //this.targetTeams.forEach((element: any) => {
      //if(element.ID == this.selectedUsers[0].ID)
      //{
       // element.teams = this.targetTeams;

        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createRelations";
          console.log(url);
          let param: any = {};
          param.op = "createRelations";
          param.FromType = "grade";
          param.ToType = "Commodity";
          param.attributes = this.commoditygrades;
            let headers = new HttpHeaders();
            this.http.post(url, param, {headers: headers}).subscribe(
              (res) => 
              {
                console.log(res);
                var response: any = res;
                if(response.success)
                {
                  this.messageService.add({severity:'success', summary: 'Successful', detail: 'Grade added to Comodity', life: 3000});
                }
                else
                {
                  this.messageService.add({severity:'error', summary: 'Failed', detail: 'Grade Not Added to Commdity', life: 3000});
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
              this.getGrades();
                    })
                this.VariteyDialogue = false;
    }
  getGrades()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_GradeCommodity;";
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
      this.grade = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedAllGrades(Grades:any)
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
          param.entity = "Wrx_Grade";
          param.attributes=Grades;

          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Grades Deleted', life: 3000});
                this.getGrades();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Grades Not Deleted', life: 3000});
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
  
  deleteSelectedGrades(grade: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + grade.Grade + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rows = this.rows.filter(val => val.id !== grade.id);
        this.grade = {};
        //Delete SQL Database
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
        console.log(url);
        let param: any = {};
        param.op = "delete";
        param.entityid={id:grade.id};
        param.entity = "Wrx_Grade";
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Grade Deleted', life: 3000});
              this.getGrades();
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Grade Not Deleted', life: 3000});
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
  editGrade(grade: any)
  {
    this.submitted = true;
    this.grade = {...grade};
    console.log(this.grade)
    this.addNewDialogue = true;
  }
  saveGrade()
  {
    this.grade.modifiedby = this.loggedinuser.Uid;
    this.grade.modifiedon = this.myDate;
    this.grade.createdby = this.loggedinuser.Uid;
    this.grade.createdon = this.myDate;

    this.blockedPanel=true;
    this.submitted = true;
      
        if (this.grade.Grade && this.grade.Grade.trim()) 
        {
            if (this.grade.id) 
            {
              delete this.grade["Name"];
              delete this.grade["CUName"];
              delete this.grade["MUName"];
              
              this.grades[this.findIndexById(this.grade.id)] = this.grade;
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.grade.id};
              param.entity = "Wrx_grade";
              param.attributes = this.grade;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Grade Updated', life: 3000});
                    this.getGrades();
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
             if(this.rows.find((element:any)=>element.Grade==this.grade.Grade))
              {
                this.grade.Grade = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Grade Name Exist', life: 3000});
                return;
              }
                delete this.grade["Name"];
                delete this.grade["CUName"];
                delete this.grade["MUName"];

                //this.grade.id = this.createId();
                //this.grade.status = true;
                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_grade";
                param.attributes = this.grade;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Grade Created', life: 3000});
                    this.tablefilter = this.cols.toString();
                    this.getGrades();
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
            this.grade = {};
      
        }
  }
 
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.grades.length; i++) 
    {
      if (this.grades[i].id === id) 
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
  generateCode(): string 
  {
    let Code = '';
    var Suffix = 'Comm_';
    for ( var i = 0; i < 5; i++ ) {
        Code += Suffix + Math.random()*100;
    }
    return Code;
  }
}