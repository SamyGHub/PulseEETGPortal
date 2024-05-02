import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from '../general.service';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent {
  loginform = true;
  signupform = false;
  blockedPanel: boolean = false;
  formdata: any;
  user: any;
  cols:any[]=[];
  rows:any[]=[];
  loggedinuser:any = {};
  MessageSevirity: string = "";
  MessageContent: string = "";
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  useren: string =""
  userobj: any = {};

  constructor(private messageService: MessageService, 
    private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private router: Router) {
      this.generalservice.removeLoggedUser();
    }

  ngOnInit(): void 
  {
    this.formdata = new FormGroup({
      
      username: new FormControl("", Validators.compose([
         Validators.required
      ])),
      password: new FormControl("",Validators.compose([
        Validators.required
     ])),
      newpassword: new FormControl("",Validators.compose([
      Validators.required
   ])),
      cnewpassword: new FormControl("",Validators.compose([
      Validators.required
 ]))
   });
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
  checkPass(pass: any, cnew:string)
  {
      
    if(this.loggedinuser.Password === this.UABPassEncrypt(pass))
    {
      
      if (this.formdata.newpassword === this.formdata.cnewpassword)
      {
        console.log(cnew);
        
        this.useren = this.UABPassEncrypt(cnew);
        this.userobj ={Password:this.useren};
        console.log(pass);
        console.log(this.userobj);
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entityid = {id:this.loggedinuser.Uid};
        param.entity = "Wrx_User";
        param.attributes = this.userobj;
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Password Updated', life: 3000});
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Password Not Updated', life: 3000});
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
      }else
      {
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      }
      //this.getACL();
      this.generalservice.setLoggedUser(this.loggedinuser);
      console.log(this.generalservice.getLoggedUser());
      this.router.navigateByUrl('/app-home');
    }
    else
      {
        this.messageService.add({severity:'error', summary: 'Failed', detail: 'Wrong Password', life: 3000});
      }
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  checkUser(user: any, pass:any, cnew:any){
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_UserTeams where Login = '"+ user +"';";
    let headers = new HttpHeaders();
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => {
        //console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.cols = response.result.cols[0];
          this.rows = response.result.queryresult;
          if (this.rows.length>0)
          {
            //this.generalservice.setLoggedUser(this.rows[0]);
            this.loggedinuser = this.rows[0];
            console.log(this.loggedinuser)
            this.checkPass(pass, cnew)
          }
          else
          {
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.User);
          }
        }
        else{
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        }
      },
      response => {
          console.log("POST call in error", response);
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
          this.blockedPanel = false;
      },
      () => {
          console.log("The POST observable is now completed.");
          this.blockedPanel = false;
      }
    );
   }
   onSubmit(formdata: any)
    {
     this.rows = [];
     this.cols = []; 
     this.checkUser(formdata.username,formdata.password, formdata.cnewpassword);
     console.log(formdata);
    }
}
