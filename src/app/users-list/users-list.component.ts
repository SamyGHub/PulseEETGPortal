import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component} from '@angular/core';
import { DynamicDialogRef} from 'primeng/dynamicdialog';
import { DynamicDialogConfig} from 'primeng/dynamicdialog';
import { GeneralService } from '../general.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {
  users: any = [];
  user: any;
  cols:any[]=[];
  rows:any[]=[];
    loggedinuser: any;

          
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService, 
      private confirmationService: ConfirmationService, private generalservice: GeneralService,private http: HttpClient,private router:Router) {
        this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
       }

  ngOnInit() {
      //this.productService.getProductsSmall().then(products => this.products = products);
      let param: any = {};
      param.op = "query";
      param.query = "select * from vw_UserTeams;";
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
          }
      },response => {
          console.log("Post call in error", response);    
          
      },
      () => {
          console.log("The Post observable is now completed.");
      })
  }

  selectUsr(usrsel: any) {
      this.ref.close(usrsel);
      console.log(usrsel);
      console.log();
      
      this.generalservice.setAssignedUser(usrsel.FromID);
      //this.UpComp.ProcessContract();
  }
}
