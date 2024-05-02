import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PickListFilterOptions } from 'primeng/picklist';
import { Utils } from '../utils';
import { GeneralService } from '../general.service';
import { FieldsetModule} from 'primeng/fieldset';
import { SelectItem, PrimeNGConfig} from 'primeng/api';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';
import { DropdownModule} from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  providers: [DatePipe]
})

export class RolesComponent {
  rows: any[]  = [];
  cols: any [] = [];
  addNewDialogue = false;
  selectedRoles: any=[];
  Roles: any = [];
  Role: any;
  submitted: boolean = false;
  myDate = new Date();
  loggedinuser: any;
  tablefilter: string = "";
  entities: any[] = [];
  bool:any=[];
  entity:any;
  Right:any;
  Rights:any[]=[];
  blockedPanel: boolean = false;
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";

  constructor(
    private router: Router, 
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe) {
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      this.router.navigateByUrl('/app-login');
    }
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
      this.bool = [
        {name: 'Yes', code: 1},
        {name: 'No', code: 0}
    ];
    }
  ngOnInit(): void 
  {
    this.primengConfig.ripple = true;
    this.getRoles();
    this.getEntities();
  }
  getRoles()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Roles;";
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
  getEntities()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "getEntities";
      
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/getAllEntities";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          
          console.log(this.generalservice.appconfigs.ExcludeTables.length);
          this.generalservice.appconfigs.ExcludeTables.forEach((element:any)=>{
            let tbl = response.result.tables.findIndex((table:any)=>table.tablename==element.Name);
            if(tbl>=0)
            response.result.tables.splice(tbl);
            //console.log("After Splice -->" + tbl);
          })
          
          
          //this.entities = response.result.tables;
          response.result.tables.forEach((element: any)=>{
            //if(response.result.tables.find((p:any)=> p.tablename==entity.ScopeLevel))
            //{
              
              let entity: any = {};
              entity.ScopeLevel = element.tablename;
              entity.RoleID = 0;
              // entity.Access = {name: 'No', code: 0};
              entity.ReadRight = {name: 'No', code: 0};
              entity.AddRight = {name: 'No', code: 0};
              entity.EditRight = {name: 'No', code: 0};
              entity.DeleteRight = {name: 'No', code: 0};
              this.entities.push(entity);
              //this.entities = [...this.entities,entity];
            //}
          });
          console.log(this.entities);
          
          // if(response.result.tables.find((p:any)=> p.tablename=='Wrx_Commodity'))
        }else{
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;
    })
  }
  addNew()
  {
      this.Role = {};
      this.entity = {};
      this.submitted = false;
      this.addNewDialogue = true;

      this.Right = {};
      this.Right.ScopeLevel = "";
      this.Right.RoleID = 0;
      this.Right.ReadRight = 0;//{code: 0};
      this.Right.AddRight = 0;//{code: 0};
      this.Right.EditRight = 0;//{code: 0};
      this.Right.DeleteRight = 0;//{code: 0};
      this.Rights.push(this.Right);
  }
  disableAll(event: any, entity: any){
    console.log("selected read value", event.value);
    console.log("all entity", entity);
    if(event.value.code==0){
      entity.AddRight = {name: "No", code: 0};
      entity.EditRight = {name: "No", code: 0};
      entity.DeleteRight = {name: "No", code: 0};
    }
    console.log("entity after change", entity);
    
    
  }
  deleteSelectedRole(role: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + role.RoleName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.RoleID !== role.RoleID);
          this.Role = {};
          //Delete SQL Database
          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={RoleID:role.RoleID};
          param.entity = "Wrx_Roles";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Role Deleted', life: 3000});
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
                console.log(url);
                let param: any = {};
                param.op = "delete";
                param.entityid={RoleID:role.RoleID};
                param.entity = "Wrx_Rights";
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                  {
                    console.log(res);
                    var response: any = res;
                    if(response.success)
                    {
                      this.messageService.add({severity:'success', summary: 'Successful', detail: 'Rights Assigned To Role Deleted', life: 3000});
                    }
                    else{
                      this.messageService.add({severity:'error', summary: 'Failed', detail: 'Operation Failed', life: 3000});
                    }
                  },response => 
                    {
                    console.log("Post call in error", response);
                    this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);

                    },
                      () => 
                    {
                    console.log("The Post observable is now completed.");
                    //this.blockedPanel=false;
                    })
              }
              else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Role Not Removed', life: 3000});
              }
            },response => 
              {
              console.log("Post call in error", response);
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
              this.blockedPanel = false;
              },
                () => 
              {
              console.log("The Post observable is now completed.");
              this.blockedPanel=false;
              })
          //End of Delete Database
      }
  });
        this.getRoles();
  }
    showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  deleteSelectedRoles() 
  {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.rows = this.rows.filter(val => !this.selectedRoles.includes(val));
            this.selectedRoles = null;
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Roles Deleted', life: 3000});
  }
    });
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  editRole(Role: any)
  {
    this.submitted = true;
    this.Role = {...Role};
    console.log(this.Role)
    this.addNewDialogue = true;
  }
  saveRole()
  {
   // console.log(this.entities);
    //console.log(this.Role);
    
    this.submitted = true;
      
        if (this.Role.RoleName && this.Role.RoleName.trim()) 
        {
            if (this.Role.id) 
            {
              this.Roles[this.findIndexById(this.Role.id)] = this.Roles;
              this.Role.modifiedby = this.loggedinuser.id;
              this.Role.modifiedon = this.myDate;
              this.blockedPanel=true;
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.Role.id};
              param.entity = "Wrx_Roles";
              param.attributes = this.Role;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Role Updated', life: 3000});
                    this.getRoles();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Role Not Updated', life: 3000});
                  }
                },response => 
                  {
                    console.log("Post call in error", response);
                    this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
                    this.blockedPanel = false;
                  },
                    () => 
                  {
                   console.log("The Post observable is now completed.");
                   this.blockedPanel=false;
                  })
            }
            else
            {
             if(this.rows.find((element:any)=>element.RoleName==this.Role.RoleName))
              {
                this.Role.RoleName = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Role Name Exist', life: 3000});
                return;
              }
                //this.Role.id = this.createId();
                //this.Role.status = true;
                this.Role.modifiedby = this.loggedinuser.id;
                this.Role.modifiedon = this.myDate;
                this.Role.createdby = this.loggedinuser.id;
                this.Role.createdon = this.myDate;
        //SQL to create Roles
                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_Roles";
                param.attributes = this.Role;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    //this.addNewRights(response.result.maxID);
                    this.entities.forEach((element:any, index:number)=>{
                      this.entities[index].AddRight = element.AddRight.code;
                      this.entities[index].DeleteRight = element.DeleteRight.code;
                      this.entities[index].EditRight = element.EditRight.code;
                      this.entities[index].ReadRight = element.ReadRight.code;

                      this.entities[index].RoleID = response.result.maxID;
                    })
                    console.log(this.entities);
                    
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Role Created', life: 3000});
                    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createMultiple";

                    let param: any = {};
                    param.op = "createMultiple";
                    param.entity = "Wrx_Rights";
                    param.attributes = this.entities;
                    let headers = new HttpHeaders();
                    this.http.post(url, param, {headers: headers}).subscribe(
                      (res) => 
                        {
                        console.log(res);
                        var response: any = res;
                        if(response.success)
                          {
                            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Rights is not Saved', life: 3000});
                            this.getRoles();
                          }
                        },response => 
                          {
                            console.log("Post call in error", response);
                            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
                            this.blockedPanel = false;
                          },
                          () => {
                                console.log("The Post observable is now completed.");
                                this.blockedPanel=false;
                                })
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Role Not Created', life: 3000});
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
            this.Role = {};
    }
      //this.getRoles();
  }
  addNewRights(maxID: number){
    
    this.entities.forEach((entity: any)=>{
      let Right:any = {}
      Right.RoleID = maxID;
      Right.ScopeLevel = entity.ScopeLevel;
      // this.Right.ReadRight = 0;
      // this.Right.AddRight =0;
      // this.Right.EditRight = 0;
      // this.Right.DeleteRight = 0;
      this.Rights.push(Right);
     //console.log(this.Rights);

    })
    //create multiple entities
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.Roles.length; i++) 
    {
      if (this.Roles[i].id === id) 
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
}
