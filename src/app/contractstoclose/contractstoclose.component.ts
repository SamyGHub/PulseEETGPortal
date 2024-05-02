import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import FileSaver from 'file-saver';
import { MenuItem, SelectItem, MessageService, ConfirmationService, FilterService, FilterMatchMode } from 'primeng/api';
import { GeneralService } from '../general.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-contractstoclose',
  templateUrl: './contractstoclose.component.html',
  styleUrls: ['./contractstoclose.component.css']
})
export class ContractstocloseComponent {
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  Ddata: any [] = [];
  myDate: any = new Date ();
  loggedinuser:any;
  prod:any=0;
  book:any=0;
  commodities: any = [];
  commodity: any;
  goal:any;
  items: MenuItem[] = [];
  activeIndex: number = 0;
  addNewDialogue = true;
  selectedCommodities: any=[];
  myjson:any=JSON;
  mywindow: any = window;
  blockedPanel: boolean = false;
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  matchModeOptions: SelectItem[]=[];
  first:any;

  constructor(   
    private generalservice: GeneralService,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService, private confirmationService: ConfirmationService, private datePipe: DatePipe, private filterService: FilterService) {
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      this.rows = generalservice.SalesContract;
      console.log(this.rows);
      if(!this.loggedinuser)
      {   
        this.router.navigateByUrl('/app-login');
      }
      const customFilterName = 'custom-equals';

        this.filterService.register(customFilterName, (value:any, filter:any): boolean => {
            if (filter === undefined || filter === null || filter.trim() === '') {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            return value.toString() === filter.toString();
        });

    this.matchModeOptions = [
        { label: 'Custom Equals', value: customFilterName },
        { label: 'Starts With', value: FilterMatchMode.STARTS_WITH },
        { label: 'Contains', value: FilterMatchMode.CONTAINS }
    ];

}
    paginate(event:any) 
    {
      this.first = event.first;
      console.log("Pagination");
      console.log(this.first);
      
      
    }
    OpenDialog(event:number)
    {
      this.activeIndex= event + 1;
      //this.router.navigateByUrl('/app-booking')
    }
    ngOnInit() 
    {
      
     this.getFromDB();
     this.getCommodities();
     
    }  
    calculateCustomerTotal(name: any) 
    {
    let total = 0;
    console.log(this.Ddata)
    if (this.Ddata) {
        for (let customer of this.Ddata) {
          if (customer.Commodity.Itemnumber === name) 
          {
            total=total+customer.Contractquantity;
          }
        }
    }
    return total;
}
  planContract(product: any){
    console.log(product)
    // this.router.navigate(['/app-plandetails/id', btoa(JSON.stringify(product))]);
  }
 
  hideDialog()
    {
      this.addNewDialogue = false;
    }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getFromDB()
  {
    if(this.loggedinuser.id !=1)
      {
        
        let param: any = {};
          param.op = "query";
          param.query = "select distinct * from vw_ContractsTobeclosedbyuser where Cancel = 0 And Closed = 0 and FromID =" + this.loggedinuser.Uid + ";"; //where id =" + this.loggedinuser.id + ";";
          let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.blockedPanel = true;
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.cols = response.result.cols[0];
              this.rows = response.result.queryresult;
              if(!this.rows.length){
                this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
              }else{console.log(this.rows)
              console.log(this.cols.toString())
              this.tablefilter = this.cols.toString();
             
              }
              console.log(this.rows);
            }
            else{
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
            }
          },response => {
            console.log("Post call in error", response);
            this.blockedPanel = false;
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        },
        () => {
            console.log("The Post observable is now completed.");
            this.blockedPanel = false;
        })
      }else{
        
        let param: any = {};
          param.op = "query";
          param.query = "select * from vw_ContractsTobeClose where Cancel = 0 And Closed = 0;"; //where id =" + this.loggedinuser.id + ";";
          let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        this.blockedPanel = true;
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.cols = response.result.cols[0];
              this.rows = response.result.queryresult;
              console.log(this.rows);
            }
            else
            {
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
              this.blockedPanel=false;
            }
          },response => {
            console.log("Post call in error", response);
            this.blockedPanel = false;
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        },
        () => {
            console.log("The Post observable is now completed.");
            this.blockedPanel = false;
        })
      }
   }
   clear(table: Table) 
   {
     table.clear();
   }
   getCommodities()
  {
    //this.blockedPanel = true;
    let param: any = {};
      param.op = "query";
      param.query = "select id, Commodityimg from Wrx_Commodity;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.commodities = response.result.queryresult;
          console.log(this.commodities)
          console.log(this.cols.toString())
          //this.tablefilter = this.cols.toString();
        }
        else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            this.blockedPanel=false;
        }
      },response => {
        console.log("Post call in error", response);
       // this.blockedPanel=false;
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
    },
    () => {
        console.log("The Post observable is now completed.");
       // this.blockedPanel=false;
    })
  }
  UpdCancel(pcancl:any)
  {
    let conup:any = {};
    conup.id = pcancl.id;
    conup.Cancel = 1;
    this.confirmationService.confirm({
      message: 'Are you sure you want to Cancel the selected contract?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid={id:conup.id};
          param.entity = "Wrx_SalesContracts";
          param.attributes = conup;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Contract is Canceled', life: 3000});
                this.getFromDB();
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
  UpdClose(pClose:any)
  {
    let concls:any = {};
    concls.id = pClose.id;
    concls.Closed = 1;
    this.confirmationService.confirm({
      message: 'Are you sure you want to Close the selected contract?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid={id:concls.id};
          param.entity = "Wrx_SalesContracts";
          param.attributes = concls;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Contract is Closed', life: 3000});
                this.getFromDB();
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
  exportExcel()
  {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.rows);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'ContractinPlaning');
  });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
