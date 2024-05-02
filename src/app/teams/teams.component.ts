import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PickListFilterOptions } from 'primeng/picklist';
import { Utils } from '../utils';
import { GeneralService } from '../general.service';
import { Router } from '@angular/router';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
  providers: [DatePipe]
})
export class TeamsComponent 
{
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedTeams: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  Teams: any = [];
  Team: any;
  submitted: boolean = false;
  gradesfromcomodity: any = [];
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  myDate = new Date();

  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe) 
    {
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
    }
    ngOnInit(): void 
  {
    this.getTeams();
  }
  getTeams()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Teams;";
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
        }else{
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);

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
  getGradesByTeamID(Team: any)
  {
    //get grades by comodity id and bind with gradesfromcomodity
    this.Teams = [];
  }
  addNew()
  {
      this.Team = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedTeam(Team: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + Team.Name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      this.blockedPanel=true;
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
      console.log(url);
      let param: any = {};
      param.op = "delete";
      param.entityid={id:this.Team.id};
      param.entity = "Wrx_Teams";
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Team Removed', life: 3000});
            this.getTeams();
          //UnAssign users from Removed Teams.
            let urlDel = this.generalservice.appconfigs.URLs.apiUrl+"/api/DeleteTow";
            console.log(urlDel);
            let paramDel: any = {};
            paramDel.op = "DeleteTow";
            paramDel.entityid={FromId:this.Team.id, FromType:'Team'};
            paramDel.entity = "Wrx_ManyMany";
            let Delheaders = new HttpHeaders();
            this.http.post(urlDel, paramDel, {headers: Delheaders}).subscribe(
            (res) => 
              {
                console.log(res);
                var response: any = res;
                if(response.success)
                {
                  this.messageService.add({severity:'success', summary: 'Successful', detail: 'Users UnAssigned from Team', life: 3000});
                }
                else
                {
                  this.messageService.add({severity:'error', summary: 'Failed', detail: 'UnAssigned Faild', life: 3000});
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
            //End of the Unassigned Teams.
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
    });
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  editTeam(Team: any)
  {
    this.submitted = true;
    this.Team = {...Team};
    console.log(this.Team)
    this.addNewDialogue = true;
  }
  saveTeam()
  {
    this.submitted = true;
      
        if (this.Team.Name && this.Team.Name.trim()) 
        {
            if (this.Team.id) 
            {
              this.blockedPanel=true;
              this.Team.modifiedby = this.loggedinuser.id;
              this.Team.modifiedon = this.myDate;
              this.Teams[this.findIndexById(this.Team.id)] = this.Teams;

              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.Team.id};
              param.entity = "Wrx_Teams";
              param.attributes = this.Team;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                   this.messageService.add({severity:'success', summary: 'Successful', detail: 'Team Updated', life: 3000});
                   this.getTeams();
                  }
                  else
                  {
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Team Not Updated', life: 3000});
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
             if(this.rows.find((element:any)=>element.Name==this.Team.Name))
              {
                this.Team.Name = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Team Name Exist', life: 3000});
                return;
              }
                this.blockedPanel=true;
                //this.Team.id = this.createId();
                this.Team.modifiedby = this.loggedinuser.id;
                this.Team.modifiedon = this.myDate;
                this.Team.createdby = this.loggedinuser.id;
                this.Team.createdon = this.myDate;
                this.Team.IsActive = true;

                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_Teams";
                param.attributes = this.Team;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Team Created', life: 3000});
                    this.getTeams();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Team Not Created', life: 3000});
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
                  //this.Teams.push(this.Team);
           }

            //this.Teams = [...this.Teams];
            this.addNewDialogue = false;
            this.Team = {};
        }
  }
  findIndexById(id: number): number 
  {
    console.log(id);
    
    let index = -1;
    for (let i = 0; i < this.Teams.length; i++) 
    {
      if (this.Teams[i].id === id) 
      {
        index = i;
        break;
      }
    }

    return index;
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
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
