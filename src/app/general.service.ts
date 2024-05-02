import { Injectable } from '@angular/core';
import * as configs from '../assets/config.json';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  appconfigs: any;
  loggeduser: any;
  AssignedUsr:any;
  SalesContract: any[]=[];
  initialinfo:any[]=[];
  Booking: any;
  SelectedContract: any []=[];
  login:boolean=false;
  shipDialogueDisplay: boolean = false;
  prodDialogueDisplay: boolean = false;
  usersDialougeDisplay: boolean = false;
  purDialogueDisplay: boolean = false;
  selectedObject: any = {};
  sourceObject: any = {};
  mymessages:any=[];
  
  constructor() {
    this.appconfigs = configs;
    console.log(this.appconfigs);
    if(sessionStorage.length>0 && sessionStorage.getItem("loggedinuser")) 
    {
      let user: any =sessionStorage.getItem("loggedinuser");
      this.setLoggedUser(JSON.parse(user));
    }
   }
   setLoggedUser(user: any){
    //console.log(user); 
    sessionStorage.setItem("loggedinuser",JSON.stringify(user));
    //console.log(JSON.parse(sessionStorage.getItem("loggedinuser")));
    this.loggeduser = user;
   }
   setAssignedUser(Ausr: any)
   {
    this.AssignedUsr = Ausr;
   }
   
   
   removeLoggedUser(){
     this.loggeduser=null;
     sessionStorage.removeItem("loggedinuser");
   }
   getLoggedUser(){
    return this.loggeduser;
  }
  getAssignedUser()
  {
    return this.AssignedUsr;
  }
  getinitialinfo(){
    let initial: any = {};
    initial.bookingid = "";
    initial.name = "Click to Edit";
    initial.percent = 0;
    this.initialinfo = [...this.initialinfo,initial];
       }
  }
