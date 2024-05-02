import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../general.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ChartModule} from 'primeng/chart';
import {DividerModule} from 'primeng/divider';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  loggedinuser: any;
  statuscounts:any=[];

  constructor(private messageService: MessageService, 
    private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private router: Router) 
    {
      this.loggedinuser = this.generalservice.getLoggedUser();
      console.log(this.loggedinuser);
      
      if(!this.loggedinuser)
      {
        this.router.navigateByUrl('/app-login');
      }
      this.getcountofnondox();
      this.getcounstatus();
      this.getSalesbycommodity();
      this.getsplitcounstatus();
    }

    basicData: any;
    basicOptions: any;
    data:any=[];
    chartOptions: any;
    blockedPanel: boolean = false;
    position: string = "";
    displayPosition: boolean=false;
    dialougmessage: string ="";
    cols:any;
    values:any =[];
    salesbycommodity:any=[];
    salesbycommodityvalues:any=[];
    options:any;
    splitstatuscounts:any=[];

    getsplitcounstatus()
    {
      let param: any = {};
      param.op = "query";
      param.query = "select * from vw_SplitStatusCount;";
      let headers = new HttpHeaders();
      
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        
        if(response.success)
        {
          this.splitstatuscounts= response.result.queryresult;
          //var obj = JSON.parse(this.data);
          
      }else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            this.blockedPanel=false;
          }
        }
      ,response => {
        console.log("Post call in error", response);
        this.blockedPanel=false;
      },
      () => {
          console.log("The Post observable is now completed.");
          this.blockedPanel=false;
      })
    }

    getcounstatus()
    {
      let param: any = {};
      param.op = "query";
      param.query = "select * from vw_ContractsStatusCount;";
      let headers = new HttpHeaders();
      
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        
        if(response.success)
        {
          this.statuscounts= response.result.queryresult;
          //var obj = JSON.parse(this.data);
          
      }else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            this.blockedPanel=false;
          }
        }
      ,response => {
        console.log("Post call in error", response);
        this.blockedPanel=false;
      },
      () => {
          console.log("The Post observable is now completed.");
          this.blockedPanel=false;
      })
    }
    getSalesbycommodity()
    {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      
      let param: any = {};
      param.op = "query";
      param.query = "select * from vw_SalesbyCommodity;";
      let headers = new HttpHeaders();
      
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        
        if(response.success)
        {
          this.salesbycommodity= response.result.queryresult;
          this.salesbycommodityvalues = this.salesbycommodity.map(Object.values);

          console.log(this.salesbycommodityvalues);
          

          this.salesbycommodity = {
            labels: response.result.cols[0],
            datasets: [
                {
                    data: this.salesbycommodityvalues[0],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')],
                  
                }
            ]
        };
    
    
        this.options = {
            cutout: '20%',
            plugins: {
                legend: {
                    labels: {
                        color: 'red',
                        font:{
                          size: 5
                        }
                      }
                }
              },
            scales: {
                  y: {
                    ticks: {
                      color: textColorSecondary,
                      font:{
                        size: 20
                      }
                    }
                  },
                  x: {
                    ticks: {
                      color: textColorSecondary,
                      font:{
                        size: 20
                      }
                    }
              }
          }
            
        };
          
      }else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            this.blockedPanel=false;
          }
        }
      ,response => {
        console.log("Post call in error", response);
        this.blockedPanel=false;
      },
      () => {
          console.log("The Post observable is now completed.");
          this.blockedPanel=false;
      })


      
    }
    getcountofnondox()
{
  
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  
      let param: any = {};
  param.op = "query";
  param.query = "select * from vw_CountforNonDox;";
  let headers = new HttpHeaders();
  
let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";

this.http.post(url, param, {headers: headers}).subscribe(
  (res) => 
  {
    console.log(res);
    var response: any = res;
    
    if(response.success)
    {
      this.data= response.result.queryresult;
      //var obj = JSON.parse(this.data);
      
      delete this.data.TotalSplits;

      console.log(this.data);
      
      this.values = this.data.map(Object.values);
      
      this.data = {
          labels: response.result.cols[0],
          datasets: [
          {
            data: this.values[0],
            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(86, 172, 255, 0.2)'],
            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(86, 172, 255)'],
            borderWidth: 1

            }
          ]
    
    }; 
    this.chartOptions = { 
      plugins: { 
          legend: { 
              labels: { 
                  color: '#495057',
                  fontSize: 30
              } 
          } 
      },
      scales: {
        y: {
          ticks: {
            color: textColorSecondary,
            font:{
              size: 20
            }
          }
        },
        x: {
          ticks: {
            color: textColorSecondary,
            font:{
              size: 20
            }
          }
    }
}
  } 
    console.log(this.data);
  
  }else{
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel=false;
      }
    }
  ,response => {
    console.log("Post call in error", response);
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
    ngOnInit() 
    {
      
      this.basicData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: '#42A5F5',
                data: [65, 59, 80, 81, 56, 55, 40],
                font: {
                  size: 42
                }
            },
            {
                label: 'My Second dataset',
                backgroundColor: '#FFA726',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    }; 
    this.chartOptions = { 
      plugins: { 
          legend: { 
              labels: { 
                  color: '#495057',
                  font: {
                    size: 42
                  }
              } 
          } 
      } 
  } 
    
    
    }
  }