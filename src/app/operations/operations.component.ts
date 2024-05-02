import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode, MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { GeneralService } from '../general.service';
import { MessagesService } from '../messages.service';
import { FilterMatchMode, FilterService, SelectItem } from 'primeng/api';
import FileSaver from 'file-saver';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe, FilterService]
})
export class OperationsComponent {
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  Ddata: any [] = [];
  myDate: Date = new Date ();
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
  custfilter:any=[];

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
     
    this.getcustomers();
    this.getFromDB();
    this.getCommodities();
  }
  clear(table: Table) 
  {
    table.clear();
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
  getcustomers()
  {
    let param: any = {};
    param.op = "query";
    param.query = "select id, CustName from Wrx_Customers;";
    let headers = new HttpHeaders();
  
  let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
  
  this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.custfilter = response.result.queryresult;
        
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
  getFromDB()
  {
    if(this.loggedinuser.id !=1)
      {
        
        let param: any = {};
          param.op = "query";
          param.query = "select distinct * from vw_QTYPlannedUsers where Cancel = 0 And Closed = 0 and FromID =" + this.loggedinuser.Uid + " order by createdon;"; //where id =" + this.loggedinuser.id + ";";
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
              
              // this.rows.sort(function(a, b){
              //   return a.id - b.id;
              //   });

              if(!this.rows.length)
              {
                this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
              }
              else
              {
                console.log(this.rows)
                console.log(this.cols.toString())
                this.tablefilter = this.cols.toString();
                            
                              let records: any = this.rows;
                              let finalrecords: any = [];

                      records.forEach((element:any, index:number)=>{
                        this.rows[index].Deliverytodate = (this.rows[index].Deliverytodate!="") ? new Date(element.Deliverytodate):"";
                        this.rows[index].Deliveryfromdate = (this.rows[index].Deliveryfromdate!="")? new Date(element.Deliveryfromdate):"";
                        this.rows[index].Contractdate = (this.rows[index].Contractdate!="")? new Date(element.Contractdate):"";
                        this.rows[index].Price = Number(element.Price);
                        this.rows[index].Quantity = Number(element.Quantity);
                        this.rows[index].createdon = new Date(element.createdon);
                        this.rows[index].modifiedon = new Date(element.modifiedon);
                        this.rows[index].newmodifiedon = new Date(element.modifiedon);
                        this.rows[index].newmodifiedon.setDate(this.rows[index].modifiedon.getDate() + 2)

                        let Xremx = 0;
                        let Xqty = Number(element.Quantity);
                        let Xtot = Number(element.TotalShipped);
                        if(element.QTYPlanned=="")
                        {
                          element.QTYPlanned=0;
                        }
                          Xremx = Xqty-Xtot;
                          //i++;
                          //element.REMX = "0";
                        element.REMX = Xremx;
                        //  console.log(element.REMX)
                        console.log("REMMMM", Xremx);
                          if(Xremx>(Xqty * 0.1))
                          {
                            
                            
                          //this.rows = records.splice(index,1);
                            finalrecords.push(element);
                           
                          }
                  console.log("I am Here to get Rows");
                  
               });
              this.rows = finalrecords;
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
          param.query = "select * from vw_QTYPlanned where Cancel =0 And Closed =0 order by createdon;"; //where id =" + this.loggedinuser.id + ";";
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

             
              if(!this.rows.length)
              {
                this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
              }
              else
              {
                console.log(this.rows)
              console.log(this.cols.toString())
              this.tablefilter = this.cols.toString();
              //let i = 0;
              let records: any = this.rows;
              let finalrecords: any = [];
              records.forEach((element:any , index: number)=>{
                this.rows[index].Deliverytodate = (this.rows[index].Deliverytodate!="") ? new Date(element.Deliverytodate):"";
                this.rows[index].Deliveryfromdate = (this.rows[index].Deliveryfromdate!="")? new Date(element.Deliveryfromdate):"";
                this.rows[index].Contractdate = (this.rows[index].Contractdate!="")? new Date(element.Contractdate):"";
                this.rows[index].Price = Number(element.Price);
                this.rows[index].createdon = new Date(element.createdon);
                this.rows[index].modifiedon = new Date(element.modifiedon);
                this.rows[index].newmodifiedon = new Date(element.modifiedon);
                this.rows[index].newmodifiedon.setDate(this.rows[index].modifiedon.getDate() + 2)

                let remx = 0;
                let qty = Number(element.Quantity);
                let tot = Number(element.TotalShipped);
                if(element.QTYPlanned=="")
                {
                  element.QTYPlanned=0;
                }
                  remx= qty-tot;
                  //i++;
                  //element.REMX = "0";
                element.REMX = remx;
                //  console.log(element.REMX)
                  if(remx>(qty * 0.1))
                  {
                    
                   //this.rows = records.splice(index,1);
                    finalrecords.push(element);
                    console.log("Remxxx", remx);
                    
                    
                    //this.rows.splice(this.rows.indexOf(element.id),1);
                  }
                  
              });
              this.rows = finalrecords;
              }
              
              console.log(this.rows);
              
            }
            else{
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
    this.rows.forEach((element:any)=>{
      delete element.Configuration;
      delete element.DestinationCountry;
      delete element.PaymentTrm;
      delete element.Cancel;
      delete element.Closed;
      delete element.ContractId;
      delete element.Commodityid;
      delete element.id;
      delete element.UnitName;
      delete element.newmodifiedon;
      delete element.PortId;
      delete element.varietyid;
    })
    
    
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
