import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PickListFilterOptions } from 'primeng/picklist';
import { Utils } from '../utils';
import { GeneralService } from '../general.service';
import { ToastModule} from 'primeng/toast';
import { DividerModule} from 'primeng/divider';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [DatePipe]
})
export class UsersComponent implements OnInit 
{
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  sourceTeams: any = [];
  targetTeams: any = [];
  users: any = [];
  user: any;
  selectedUsers: any = [];
  teamsDialogue = false;
  submitted: boolean = false;
  teams: any;
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  usersteams: any = [];
  IsActive : Boolean = false;
  myDate = new Date();
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  targetCommodities:any[]=[];
  sourceCommodities:any=[];
  CommoditiesDialogue:boolean=false;
  userscommodities:any=[];
  commodityrows:any=[];
  commoditycols:any=[];

  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe,
    private router:Router) {
      this.loggedinuser = generalservice.getLoggedUser();
        if(!this.loggedinuser)
      {
        
        this.router.navigateByUrl('/app-login');
      }
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      this.getUsers();
      //this.getTeams();
      //this.getCommodities();
    }
    showPositionDialog(position: string, message: string) 
    {
      this.dialougmessage = message;
      this.position = position;
      this.displayPosition = true;
    }
  ngOnInit(): void 
  {
   
  }
  ResetPass(user: any)
  {
   
    user.Password = this.UABPassEncrypt("etg@123"); 
    
    this.blockedPanel=true;
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
      console.log(url);
      let param: any = {};
      param.op = "update";
      param.entityid = {id:user.id};
      param.entity = "Wrx_User";
      param.attributes = user;
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: user.Name + ' Password Reseted To Default', life: 3000});
            this.getUsers();
          }
          else
          {
            this.messageService.add({severity:'error', summary: 'Failed', detail: user.Name + ' Password Not Reseted To Default', life: 3000});
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
   UABPassEncrypt(strPassed: string){
		let  StrXX = strPassed;
		let strTemp:string = "";
		let strswap: string = "";
		let remaining:string = "";
		let remainingtemp:string = "";
		let i = 0;
		
		for (let intCnt = 0; intCnt< 3;intCnt++){
			let strTemp = "";
			strTemp = StrXX.split("").reverse().join("");
			StrXX = strTemp;
			//console.log(StrXX, "reversed"+intCnt)
			strswap = StrXX.substring(0,1)
			//console.log(strswap,"swap"+intCnt)
			remaining = StrXX.substring(1).split("").reverse().join("");
			StrXX = strswap+remaining;
			//console.log(StrXX, "result"+intCnt);
		}

		strTemp = StrXX
		//console.log(strTemp,"final before replace")
		StrXX = ""
		for(i = 0; i<strTemp.length;i++){
			StrXX = StrXX + this.UABencrSwap(strTemp.substring( i, i+1))
		}
		return StrXX;
	}
   UABencrSwap(strIn: string){
		let str: string= "";
		//console.log(strIn)
		switch (strIn) {
			case "A": 
			str = "t"; break;
			case "B": str = "y"; break;
			case "C": str = "c"; break;
			case "D": str = "w"; break;
			case "E": str = "l"; break;
			case "F": str = "L"; break;
			case "G": str = "z"; break;
			case "H": str = "s"; break;
			case "I": str = "r"; break;
			case "J": str = "J"; break;
			case "K": str = "X"; break;
			case "L": str = "o"; break;
			case "M": str = "n"; break;
			case "N": str = "R"; break;
			case "O": str = "m"; break;
			case "P": str = "k"; break;
			case "Q": str = "4"; break;
			case "R": str = "i"; break;
			case "S": str = "h"; break;
			case "T": str = "g"; break;
			case "U": str = "H"; break;
			case "V": str = "e"; break;
			case "W": str = "d"; break;
			case "X": str = "x"; break;
			case "Y": str = "b"; break;
			case "Z": str = "a"; break;
			case "0": str = "9"; break;
			case "1": str = "0"; break;
			case "2": str = "j"; break;
			case "3": str = "6"; break;
			case "4": str = "5"; break;
			case "5": str = "7"; break;
			case "6": str = "M"; break;
			case "7": str = "2"; break;
			case "8": str = "1"; break;
			case "9": str = "8"; break;
			case "a": str = "Z"; break;
			case "b": str = "Y"; break;
			case "c": str = "p"; break;
			case "d": str = "W"; break;
			case "e": str = "V"; break;
			case "f": str = "U"; break;
			case "g": str = "T"; break;
			case "h": str = "S"; break;
			case "i": str = "v"; break;
			case "j": str = "Q"; break;
			case "k": str = "P"; break;
			case "l": str = "O"; break;
			case "m": str = "N"; break;
			case "n": str = "B"; break;
			case "o": str = "u"; break;
			case "p": str = "K"; break;
			case "q": str = "q"; break;
			case "r": str = "I"; break;
			case "s": str = "A"; break;
			case "t": str = "G"; break;
			case "u": str = "F"; break;
			case "v": str = "E"; break;
			case "w": str = "D"; break;
			case "x": str = "C"; break;
			case "y": str = "3"; break;
			case "z": str = "f"; break;
		
			default:
				str = strIn
				break;
		}
		return str;
	}
  getCommodities(user:any)
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "SELECT id, Name from Wrx_Commodity as  c where c.id not in (select ToID from  Wrx_ManyMany where ToType='Commodity' and FromID = " + user + ");";
      let headers = new HttpHeaders();
    
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.commoditycols = response.result.cols[0];
          //this.commodityrows = response.result.queryresult;
          this.sourceCommodities = response.result.queryresult;
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
  getTeams(user:any)
  {
    let param: any = {};
    param.op = "query";
    param.query = "SELECT id, Name from Wrx_Teams as c where c.id not in (select ToID from  Wrx_ManyMany where ToType='Team' and FromID = " + user + ");";
    let headers = new HttpHeaders();
  
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
  
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success){
        this.sourceTeams = response.result.queryresult;
        console.log(this.teams)
      }
    },response => {
      console.log("Post call in error", response);    
      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);

  },
  () => {
      console.log("The Post observable is now completed.");
  })
  }
  getUsers()
  {
      this.blockedPanel=true;
      let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_User;";
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
        else{
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
          this.blockedPanel=false;
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
      this.user = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  addToTeams()
  {
    console.log(this.selectedUsers)
    this.getTeams(this.selectedUsers[0].id);
    this.sourceTeams = this.teams;
    console.log(this.sourceTeams);
    
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_UserTeams where FromID=" + this.selectedUsers[0].id + " and ToType='Team';";
      let headers = new HttpHeaders();
    
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
      this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.targetTeams = response.result.queryresult
          console.log(this.targetTeams)
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
    
      this.teamsDialogue = true;
  }
  addToCommodity(selectedUsers:any)
  {
    console.log(selectedUsers)
    this.getCommodities(selectedUsers[0].id);
    //this.sourceCommodities = this.commodityrows;
    console.log(this.sourceCommodities);
    
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_CommodityUsers where FromID=" + selectedUsers[0].id + " and ToType='Commodity';";
      let headers = new HttpHeaders();
    
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
      this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.targetCommodities = response.result.queryresult;
          console.log("Target --->" + this.targetCommodities);
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
    
      this.CommoditiesDialogue = true;
  }
  saveTeamstoUser()
  {
    this.usersteams = [];
    let urlDel = this.generalservice.appconfigs.URLs.apiUrl+"/api/DeleteTow";
    console.log(urlDel);
    this.blockedPanel=true;

    let paramDel: any = {};
    paramDel.op = "DeleteTow";
    paramDel.entityid={FromId:this.selectedUsers[0].id, ToType:'Team'};
    paramDel.entity = "Wrx_ManyMany";
    let Delheaders = new HttpHeaders();
    this.http.post(urlDel, paramDel, {headers: Delheaders}).subscribe(
    (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
            this.selectedUsers.forEach((user: any) => {
            this.targetTeams.forEach((team: any) => {
            this.usersteams.push({"FromId": user.id, "ToId": team.id, "FromType":"User", "ToType":"Team"});
          })
        });

          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createRelations";
          console.log(url);
          let param: any = {};
          param.op = "createRelations";
          param.FromType = "User";
          param.ToType = "Team";
          param.attributes = this.usersteams;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Updated', life: 3000});
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'User Not Updated', life: 3000});
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
            this.teamsDialogue = false;
            this.getUsers();
        }
        else
        {
          this.messageService.add({severity:'error', summary: 'Failed', detail: 'Failed to Assign User', life: 3000});
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
    //End the delete statment 
        }
  savecommoditytoUser(selectedUsers:any)
  {
    this.userscommodities = [];
    //this.getUsersCommodities(selectedUsers);
  
    let urlDel = this.generalservice.appconfigs.URLs.apiUrl+"/api/DeleteTow";
    console.log(urlDel);
    this.blockedPanel=true;

    let paramDel: any = {};
    paramDel.op = "DeleteTow";
    paramDel.entityid={FromId:selectedUsers[0].id, ToType:'Commodity'};
    paramDel.entity = "Wrx_ManyMany";
    let Delheaders = new HttpHeaders();
    this.http.post(urlDel, paramDel, {headers: Delheaders}).subscribe(
    (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          //this.userscommodities = this.targetCommodities
          this.selectedUsers.forEach((user: any) => {
            this.targetCommodities.forEach((commodity: any) => {
            this.userscommodities.push({"FromId": user.id, "ToId": commodity.id, "FromType":"User", "ToType":"Commodity"});
          })
        });   
        
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createRelations";
          console.log(url);
          console.log(this.userscommodities);
          
          let param: any = {};
          param.op = "createRelations";
          param.FromType = "User";
          param.ToType = "Commodity";
          param.attributes = this.userscommodities;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Updated', life: 3000});
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'User Not Updated', life: 3000});
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
            this.CommoditiesDialogue = false;
            this.getUsers();
        }
        else
        {
          this.messageService.add({severity:'error', summary: 'Failed', detail: 'Failed to Assign User', life: 3000});
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
  //End the delete statment 
     
  }

  getUsersTeams()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_ManyMany where fromtype='User' and totype='Team';";
      let headers = new HttpHeaders();
    
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
      this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.usersteams = response.result.queryresult
          console.log(this.usersteams)
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
  getUsersCommodities(selectedUsers:any)
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_CommodityUsers where fromid=" + selectedUsers.id + " and totype='Commodity';";
      let headers = new HttpHeaders();
    
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
      this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.userscommodities = response.result.queryresult
          console.log("------->" + this.userscommodities)
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
  
  deleteSelectedUsers(user:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter((val: any) => !this.selectedUsers.includes(val));
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/deleteMultiple";
        console.log(url);

        this.blockedPanel=true;
        let param: any = {};
        param.op = "deleteMultiple";
        //param.entityid={id:this.selectedUsers.id};
        param.entity = "Wrx_User";
        param.attributes=user;
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Removed', life: 3000});
              this.getUsers();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'User Not Removed', life: 3000});
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
            })
              this.selectedUsers = null;
              this.blockedPanel=false;
          }
        });
          
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  saveUser()
  {
    this.submitted = true;
    if (this.user.Name && this.user.Name.trim()) 
    {
        if (this.user.id) 
        {          
            this.users[this.findIndexById(this.user.id)] = this.user;
            this.user.modifiedby = this.loggedinuser.Uid;
            this.user.modifiedon = this.myDate;
            this.user.Password = this.UABPassEncrypt(this.user.Password);
          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid = {id:this.user.id};
          param.entity = "Wrx_User";
          param.attributes = this.user;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Updated', life: 3000});
                this.getUsers();
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'User Not Updated', life: 3000});
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
            else 
            {
              if(this.rows.find((element:any)=>element.Name==this.user.Name))
              {
                this.user.Name = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same User Name Exist', life: 3000});
                return;
              }
                //this.user.ID = this.createId();
                this.user.modifiedby = this.loggedinuser.id;
                this.user.modifiedon = this.myDate;
                this.user.createdby = this.loggedinuser.id;
                this.user.createdon = this.myDate;
                this.user.Password = this.UABPassEncrypt(this.user.Password);

                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_User";
                param.attributes = this.user;
                            
                  let headers = new HttpHeaders();
                  this.http.post(url, param, {headers: headers}).subscribe(
                    (res) => 
                    {
                      console.log(res);
                      var response: any = res;
                      if(response.success)
                      {
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Created', life: 3000});
                        this.getUsers();
                      }
                      else
                      {
                        this.messageService.add({severity:'error', summary: 'Failed', detail: 'User Not Created', life: 3000});
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
               // this.users.push(this.user);
            }
          }
            this.users = [...this.users];
            this.addNewDialogue = false;
            this.user = {};                
  }
  findIndexById(id: number): number 
  {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
  }
createId(): string 
{
  let ID = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 5; i++ ) {
      ID += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ID;
}
  editUser(user: any)
  {
    this.submitted = true;
    
    this.user = {...user};
    console.log(this.user)
    if(!user.IsActive)
      user.IsActive = false;
    if(!user.IsAdmin)
      user.IsAdmin = false;
        this.addNewDialogue = true;
  }
  deleteUser(user: any)
  {
    console.log(user);
    
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.Name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.users = this.users.filter((val: any) => val.id !== user.id);

          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:user.id};
          param.entity = "Wrx_User";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Removed', life: 3000});
                this.getUsers();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'User Not Removed', life: 3000});
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
                this.selectedUsers = null;
            }
          });
          this.user = {};
      }
 }