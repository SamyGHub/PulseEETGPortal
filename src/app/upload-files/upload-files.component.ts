
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConditionalExpr } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { GeneralService } from '../general.service';
import { Utils } from '../utils';
import { DialogService} from 'primeng/dynamicdialog';
import { DynamicDialogRef} from 'primeng/dynamicdialog';
import { DynamicDialogConfig} from 'primeng/dynamicdialog';
import { UsersListComponent } from '../users-list/users-list.component';
import { ProdinstructComponent } from '../prodinstruct/prodinstruct.component';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';
import moment from 'moment';
import { Table } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
  providers: [DialogService, MessageService, DatePipe]
})
export class UploadFilesComponent {
  fileReaded: any;
  value: number = 0;
  RData: any []=[];
  Ddata: any [] = [];
  rows: any[]  = [];
  cols: any = [];
  Tcols:any=[];
  uploadedFiles: any[] = [];
  tablefilter: string = "";
  TotConOut: number=0;
  TotConIn: number=0;
  ContractID: any;
  blockedPanel: boolean = false;
  selectedContracts:any =[];
  usrcols: any [] = [];
  usr: any[]=[];
  ref: DynamicDialogRef = new DynamicDialogRef;
  Fdlvdt: Date = new Date();
  loggedinuser: any;
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  mymessages:any=[];
  viewme:boolean=false;
  TData: any [] = [];
  commodities:any=[];
  conMatch:any=[];
  rowstoclose:any=[];
  
  
  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, public dialogService: DialogService, private datePipe: DatePipe) 
    {
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      this.router.navigateByUrl('/app-login');
    }
      this.getImportedContract();
      this.getCommodities();
      //this.getInjectedTransaction();
    }
    
ngOnInit() {}
calculateCustomerTotal(name:any) 
{
    let total = 0;

    if (this.TData) 
    {
    this.TData.forEach((element:any) => {
      if (element.Contractnumber === name) 
          {
          total = total + element.Squantity;
          }     
        }); 
    }
    return total;
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
        this.blockedPanel=false;
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
getImportedContract(){
  //this.blockedPanel = true;
  let param: any = {};
      param.op = "query";
      param.query = "SELECT * FROM dbo.vw_ContractedImported;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.cols = response.result.cols[0];
          //this.rows = response.result.queryresult;
          this.RData = response.result.queryresult;
          //console.log(this.rows)
          console.log(this.cols.toString())
          this.tablefilter = this.cols.toString();
         // this.blockedPanel=false;
        }else{
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
          //this.blockedPanel=false;
        }
      },response => {
        console.log("Post call in error", response);
       // this.blockedPanel=false;
    },
    () => {
        console.log("The Post observable is now completed.");
    })
}
show() {
    this.ref = this.dialogService.open(ProdinstructComponent, {
      data: {
          id: '51gF3'
      },
      header: 'Choose Production Instruction',
      width: '70%'
  });
  this.ref.onClose.subscribe(() => {
    //this.ProcessContract();
});
}
getUsers()
{
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
          this.usrcols = response.result.cols[0];
          this.usr = response.result.queryresult;
          this.tablefilter = this.cols.toString();
        }
      },response => {
        console.log("Post call in error", response);    
        
    },
    () => {
        console.log("The Post observable is now completed.");
    })
}
ProcessContract()
{
  this.confirmationService.confirm({
    message: 'Are you sure you want to Process Selected Contracts?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.blockedPanel=true;
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/processSalesContract";
      console.log(url);
      let param: any = {};
      param.op = "processSalesContract";
      param.entity = "Wrx_SalesContracts";
      param.userid = this.generalservice.loggeduser.Uid;
      param.ownerid = this.generalservice.loggeduser.Uid //this.generalservice.getAssignedUser();
      param.attributes = this.RData;
      console.log(this.selectedContracts);

      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
          console.log(res);
          var response: any = res;
          if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Contract has been processed.', life: 3000});
              this.selectedContracts = [];
              this.generalservice.mymessages = [];
              this.generalservice.mymessages = response.result.mymessages;
            //   if (this.mymessages.length)
            // {
            //   this.viewme= true;
            //   this.exportExcel(this.mymessages);
            // }
              this.getImportedContract();
              this.getInjectedTransaction();
              //this.blockedPanel=false;
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failure', detail: response.message, life: 3000});
              this.blockedPanel=false;
            }
          },response => 
            {
              console.log("Post call in error", response);
             // this.blockedPanel=false;  
            },
            () => {
                   console.log("The Post observable is now completed.");
                   //this.router.navigateByUrl('/app-st')
                  })
          }
        })
  
}
createId(): string 
 {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) 
    {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
 }
 csv2ArrayT(fileInput: any)
    {
      this.blockedPanel = true;
      //read file from input
      this.fileReaded = fileInput.files[0];
      
      let reader: FileReader = new FileReader();
      reader.readAsText(this.fileReaded);
      
        reader.onload = (e) => {
        if(reader.result){
        let csv: any = reader.result;
    
        //clean csv files
        let allTextLines: any = csv.split(/\r?\n/g);
        var bad = [];
    
        for(var i=allTextLines.length-1; i> 0; i--) 
        {
            // find all the unescaped quotes on the line:
            var m = allTextLines[i].match(/[^\\]?\"/g);
    
            // if there are an odd number of them, this line, and the line after it is bad:
            if((m ? m.length : 0) % 2 == 1) { bad.push(i--); }
        }
    
        // starting at the bottom of the list, merge lines back, using \r\n
        for(var b=0,len=bad.length; b < len; b++) 
        {
          allTextLines.splice(bad[b]-1, 2, allTextLines[bad[b]-1]+"\r\n"+allTextLines[bad[b]]);
        }
      //  let allTextLines = csv.split(/\r|\n|\r/);
        let headers = allTextLines[0].split(';');
        let lines: any = [];
        console.log("headers", headers);
        
        headers.push("DestinationCountry");

        for (let i = 0; i < allTextLines.length-1; i++) 
        {
          // split content based on semicomma
          if(i>0)
          {
            let salescontract: any = {};
            
            let data = allTextLines[i].split(';');
            // console.log(data);
          
            for (let j = 0; j < headers.length; j++) 
            {
              // console.log(headers[j]);
              
              headers[j] = headers[j].trim();
              // console.log(headers[j]);
              switch(headers[j])
              {
                case "Contract date":
                  headers[j] = "Contractdate";
                  break;
                case "Terms of payment":
                  headers[j] = "Termsofpayment";
                  break;
                case "Shipment period":
                  headers[j] = "Shipmentperiod";
                  break;
                case "Item number":
                  headers[j] = "Itemnumber";
                  break;
                case "Contract number":
                  headers[j] = "Contractnumber";
                  break;
                case "Port/Place of discharge":
                  headers[j] = "Portofdischarge";
                  break;
                case "ORIGIN/VARIETY":
                  headers[j] = "ORIGINVARIETY";
                  break;
                case "Sales/Purchase order":
                  headers[j] = "SalesPurchaseorder";
                  break;
                case "Order type":
                  headers[j] = "Ordertype";
                  break;
                case "Delivery from date":
                  headers[j] = "Deliveryfromdate";
                  break;
                case "Delivery to date":
                  headers[j] = "Deliverytodate";
                  break;
                case "Delivery terms":
                  headers[j] = "Deliveryterms";
                  break;
                case "Port/Place of loading":
                  headers[j] = "Portofloading";
                  break;
                case "Contract quantity":
                  headers[j] = "Contractquantity";
                  break;
                case "Shipped quantity":
                  headers[j] = "Shippedquantity";
                  break;
                case "Number of bags":
                  headers[j] = "Numberofbags";
                  break;
                case "Vessel name":
                  headers[j] = "Vesselname";
                  break;
                case "Bill of Lading":
                  headers[j] = "BillofLading";
                  break;
                case "Invoice account":
                  headers[j] = "Invoiceaccount";
                  break;
                case "Invoice date":
                  headers[j] = "Invoicedate"
                  break;
                case "Invoice amount":
                  headers[j] = "Invoiceamount";
                  break;
                case "Payment received":
                  headers[j] = "Paymentreceived";
                  break;
                case "Payment date":
                  headers[j] = "Paymentdate";
                  break;
                case "Contract status":
                  headers[j] = "Contractstatus";
                  break;
                case "Due date":
                  headers[j] = "Duedate";
                  break;
                case "Employee":
                  headers[j] == "Employee";
                  break;
              }
              //extract country from port of discharge and add in new column DestinationCountry
              if(headers[j]=="Portofdischarge")
                    {
                      if(data[j].indexOf(",")>0){
                        let portdata = data[j].split(",");
                        data.push(portdata[1]);
                        data[j] = portdata[0];
                      }
                      else
                      data.push(data[j]);
                    }
                if(headers[j]=="Invoiceamount" || headers[j]=="Price" || headers[j]=="Contractquantity" || headers[j]=="Shippedquantity" || headers[j]=="Oustanding" || headers[j]=="Numberofbags" || headers[j]=="Paymentreceived"){
                  salescontract[headers[j]] = (data[j].trim());}
                // }else if (headers[j] == "Contractdate"){
                //   console.log(data[j]);
                  
                //   console.log(moment.utc(new Date( data[j])).format("MM/d/yyyy"));
                  
                //   salescontract[headers[j]] = moment(new Date( data[j].trim())).format("MM/d/yyyy");
                //   console.log(salescontract[headers[j]]);} 
                else if (headers[j] == "Price")
                {
                  salescontract[headers[j]] = (data[j].trim());
                }  
                else if (headers[j] == "Commission group" || headers[j] == "Through" || headers[j]=="Reference sales/purchase contract" || headers[j] == "Date" || headers[j] == "Cost center" || headers[j] == "Business unit" || headers[j] == "Price type" || headers[j] == "Reference number")
                  {
                    continue;
                  }
                    
                else if(data[j] && (headers[j] =="BillofLading" || headers[j]=="Shipmentperiod" || headers[j] == "Warehouse" || headers[j] == "Name" || headers[j] == "Payment" || headers[j]=="Name2" || headers[j]=="Portofloading" || headers[j]=="Portofdischarge" || headers[j]=="Grade" || headers[j]=="Buyer" || headers[j]=="Contractnumber" || headers[j]=="Itemnumber" || headers[j]=="ORIGINVARIETY" || headers[j]=="Ordertype"))
                {
                  data[j] = data[j].replace(/[^\w\s]/gi, "")
                  salescontract[headers[j]] = data[j].trim();
                }
                else
                salescontract[headers[j]] = (data[j])? data[j].trim():"";
              //  console.log("sales contract", salescontract);
            }
            console.log("line", salescontract);
              if (salescontract.Contractquantity==0 || salescontract.Ordertype.includes('LOC')==true || 
                salescontract.Name2.includes("ETG FOOD PRODUCTS INC")==true || salescontract.Unit.includes("MT")==false || 
                salescontract.Price ==0 || salescontract.Contractstatus.includes("Cancelled")==true || salescontract.Employee.includes("E-830009")==true) // || salescontract.Deliveryfromdate>this.Fdlvdt) //|| this.RData[i].Status.includes("Cancelled")==true)//    ||   // )
              {
                continue;
              } 
              lines.push(salescontract);
            //  console.log('After Push' + lines);
          }
        }
        if(lines.length>0)
        {
        this.TData = lines;
        this.uploadImportedRecordsT();
        
        let hasDuplicate=this.TData.some((item, id)=>{ 
          if(this.TData.indexOf(item) != id)
            return item;
        });
        console.log("hasduplicates", hasDuplicate);
        }
        console.log(this.TData);       
      }
    } 
    this.blockedPanel = false;
  }
  uploadImportedRecordsT()
  {
    this.blockedPanel=true;
   let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createMultiple";
    console.log(url);
    let param: any = {};
    param.op = "createMultiple";
    param.entity = "Wrx_SalesTrans";
    param.attributes = this.TData;
    let headers = new HttpHeaders();
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
        {
        console.log(res);
        var response: any = res;
        if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Contract Transactions Data Imported.', life: 3000});
            this.getInjectedTransaction();
            this.blockedPanel = false;
          }
          else
          {
            this.messageService.add({severity:'error', summary: 'Failure', detail: 'Connection to DB' + response.message, life: 3000});
          }
        },response => 
          {
            console.log("Post call in error", response);
            this.blockedPanel=false;      
          },
          () => {
          console.log("The Post observable is now completed.");
          
        })
  }
  ClearT()
  {
    //delete json and database from raw
    this.confirmationService.confirm({
    message: 'Are you sure you want to Clear Injected Transaction ?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
        
        //Delete SQL Database
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/clearInjectedTrans";
        console.log(url);
        let param: any = {};
        param.op = "clearInjectedTrans";
        param.userid = this.generalservice.loggeduser.Uid;
        
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.TData= [];
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Sales Transaction Data Cleared', life: 3000});
              this.blockedPanel=false;
            }
          },response => 
            {
            console.log("Post call in error", response);
            this.blockedPanel=false; 
            },
              () => 
            {
            console.log("The Post observable is now completed.");
            
            })
          }
        })
      }
 csv2Array(fileInput: any)
 {
      this.blockedPanel = true;
      //read file from input
      this.fileReaded = fileInput.files[0];
      let finalrecords: any = [];

      let reader: FileReader = new FileReader();
      reader.readAsText(this.fileReaded);
      
      reader.onload = (e) => {
    if(reader.result)
    {
        let csv: any = reader.result;
        //clean csv files
        let allTextLines: any = csv.split(/\r?\n/g);
        var bad = [];

          for(var i=allTextLines.length-1; i> 0; i--) 
          {
            // find all the unescaped quotes on the line:
            var m = allTextLines[i].match(/[^\\]?\"/g);

            // if there are an odd number of them, this line, and the line after it is bad:
            if((m ? m.length : 0) % 2 == 1) { bad.push(i--); }
          }

        // starting at the bottom of the list, merge lines back, using \r\n
        for(var b=0,len=bad.length; b < len; b++) 
        {
          allTextLines.splice(bad[b]-1, 2, allTextLines[bad[b]-1]+"\r\n"+allTextLines[bad[b]]);
        }
  //  let allTextLines = csv.split(/\r|\n|\r/);
        let headers = allTextLines[0].split(';');
        let lines: any = [];
          console.log("headers", headers);
          console.log(allTextLines.length);
          
           headers.push("DestinationCountry");
  
        for (let i = 0; i < allTextLines.length-1; i++) 
        {  
          if(i>0)
          {
            let salescontract: any = {};
            let data = allTextLines[i].split(';');
            //console.log(data);
              
            for (let j = 0; j < headers.length; j++) 
            {
              headers[j] = headers[j].trim();
              switch(headers[j])
              {
                case "Terms of payment":
                  headers[j] = "Termsofpayment";
                  break;
                case "Shipment period":
                  headers[j] = "Shipmentperiod";
                  break;
                case "Item number":
                  headers[j] = "Itemnumber";
                  break;
                case "Contract number":
                  headers[j] = "Contractnumber";
                  break;
                case "Port/Place of discharge":
                  headers[j] = "Portofdischarge";
                  break;
              }

              //extract country from port of discharge and add in new column DestinationCountry
              if(headers[j]=="Portofdischarge")
                    {
                      if(data[j].indexOf(",")>0){
                        let portdata = data[j].split(",");
                        data.push(portdata[1]);
                        data[j] = portdata[0];
                      }
                      else
                      data.push(data[j]);
                    }

              if(headers[j]=="Amount" || headers[j]=="Price" || headers[j]=="Quantity" ){
                salescontract[headers[j]] = (data[j].trim());
              }else if (headers[j] == "Contract date" || headers[j]=="Through" || headers[j]=="Commission amount"){
                // salescontract[headers[j]] = moment(data[j].trim()).format("MM/dd/yyyy");
                // console.log(salescontract[headers[j]]);
              continue;
              }
              else if(data[j] && (headers[j]=="Termsofpayment" || headers[j]=="Name" || headers[j]=="Shipmentperiod" || headers[j]=="Portofdischarge"))
              {
                data[j] = data[j].replace(/[^\w\s]/gi, "")
                salescontract[headers[j]] = data[j].trim();
              }
              else{
                salescontract[headers[j]] = (data[j])? data[j].trim():"";
              // console.log("sales contract", salescontract);
            }
          }
          
        //console.log("line", salescontract);
        if (!salescontract.Quantity || salescontract.Quantity==0 || 
          salescontract.Name.includes("ETG FOOD PRODUCTS INC")==true || 
          salescontract.Price ==0)// || salescontract.Deliveryfromdate>this.Fdlvdt) //|| this.RData[i].Status.includes("Cancelled")==true)//    ||   // ) 
        {
          continue;
          //console.log(salescontract);
        }
        
        
        lines.push(salescontract);
        console.log('After Push' + lines);
        
      }
   }
   //.........................................................
      let param: any = {};
      param.op = "query";
      param.query = "select distinct Contractnumber from Wrx_SalesTrans;";
      let Xheaders = new HttpHeaders();
    
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: Xheaders}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.conMatch = response.result.queryresult;
          console.log("Match",this.conMatch);
          
          lines.forEach((element:any,index:number)=>{
            //if (this.conMatch.Contractnumber == element.Contractnumber)
            let foundme:any;
            //console.log(lines);
            
              foundme = this.conMatch.some((myobj:any)=>myobj.Contractnumber==element.Contractnumber);
              if (foundme)
              {
                finalrecords.push(element);
              }
          });
  //............................................................................... 
   // all rows in the csv file 
   //console.log(">>>>>>>>>>>>>>>>>", lines);
          if(finalrecords.length>0){
            this.RData = finalrecords;
            this.uploadImportedRecords();
            
            let hasDuplicate=this.RData.some((item, id)=>{ 
              if(this.RData.indexOf(item) != id)
                return item;
            });
            console.log("hasduplicates", hasDuplicate);
          }
          console.log(this.RData);
 
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
    this.blockedPanel=false;
      });
    }
  }
}    
  uploadImportedRecords()
  {
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createMultiple";
      console.log(url);
      let param: any = {};
      param.op = "createMultiple";
      param.entity = "Wrx_SalesContractMaster";
      param.attributes = this.RData;
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
          console.log(res);
          var response: any = res;
          if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Contract Master Data Imported.', life: 3000});
              this.getImportedContract();
              this.blockedPanel=false;
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Contract Master Data Failed to Upload', life: 3000});
              this.blockedPanel=false;
            }
          },response => 
            {
              console.log("Post call in error", response);  
              this.blockedPanel=false;    
            },
            () => {
                   console.log("The Post observable is now completed.");
                   
                  })
       }
  
  
ProcessImportedContract(Cont:any[])
{
  this.confirmationService.confirm({
    message: 'Are you sure you want to Process Selected Contracts?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.blockedPanel=true;
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/processSalesContract";
      console.log(url);
      let param: any = {};
      param.op = "processSalesContract";
      param.entity = "Wrx_SalesContracts";
      param.userid = this.generalservice.loggeduser.Uid;
      param.ownerid = this.generalservice.loggeduser.Uid //this.generalservice.getAssignedUser();
      param.attributes = this.selectedContracts;
      console.log(this.selectedContracts);

      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
          console.log(res);
          var response: any = res;
          if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Contract has been processed.', life: 3000});
              this.selectedContracts = [];
              this.mymessages = response.result.mymessages;
              if (this.mymessages.length)
              this.viewme= true;
              this.getImportedContract();
              this.blockedPanel=false;
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failure', detail: response.message, life: 3000});
            }
          },response => 
            {
              console.log("Post call in error", response);
              this.blockedPanel=false;  
            },
            () => {
                   console.log("The Post observable is now completed.");
                   
                  })
          }
        })
}
Assign()
{
  console.log(this.selectedContracts);  
}
Clear()
{
  //delete json and database from raw
  this.confirmationService.confirm({
  message: 'Are you sure you want to Clear Imported Data ?',
  header: 'Confirm',
  icon: 'pi pi-exclamation-triangle',
  accept: () => {
      
      //Delete SQL Database
      this.blockedPanel=true;
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/clearImportedData";
      console.log(url);
      let param: any = {};
      param.op = "clearImportedData";
      param.userid = this.generalservice.loggeduser.Uid;
      
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.RData= [];
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Sales Master Data Cleared', life: 3000});
            this.blockedPanel=false;
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
          
          })
        }
      })
    }
showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getInjectedTransaction()
  {
    //this.blockedPanel = true;
    let param: any = {};
        param.op = "query";
        param.query = "select * from vw_SalesTrans;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.Tcols = response.result.cols[0];
            //this.rows = response.result.queryresult;
            this.TData = response.result.queryresult;
            console.log(this.TData)
            console.log(this.cols.toString())
            this.tablefilter = this.cols.toString();
            this.processSalesTransaction();
           // this.blockedPanel=false;
          }else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            this.blockedPanel=false;
          }
        },response => {
          console.log("Post call in error", response);    
         // this.blockedPanel=false;
           
      },
      () => {
        
          console.log("The Post observable is now completed.");
          
      })
    }
processSalesTransaction()
{

    this.blockedPanel=true;
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/processSalesTransaction";
    console.log(url);
    let param: any = {};
    param.op = "processSalesTransaction";
    param.entity = "vw_SalesTrans";
    param.userid = this.generalservice.loggeduser.Uid;
    param.ownerid = this.generalservice.loggeduser.Uid //this.generalservice.getAssignedUser();
    param.attributes = this.TData;
    console.log(this.TData);

    let headers = new HttpHeaders();
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
        {
        console.log(res);
        var response: any = res;
        if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Contract Transaction has been processed.', life: 3000});
            this.selectedContracts = [];
            //this.mymessages = response.result.mymessages;
            //this.generalservice.mymessages = [];
            this.generalservice.mymessages.push(response.result.mymessages);
            //this.getInjectedTransaction();
            this.getImportedContract();
            this.getcontractclosed();
            this.blockedPanel=false;
          }
          else
          {
            this.messageService.add({severity:'error', summary: 'Failure', detail: 'Connection to DB' + response.message, life: 3000});
            this.blockedPanel=false;
          }
        },response => 
          {
            console.log("Post call in error", response);
            this.blockedPanel=false;  
          },
          () => {
                 console.log("The Post observable is now completed.");
                })
 
}
getcontractclosed()
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
              this.rowstoclose.forEach((index:number)=>{
                //..........Updated Closed
                this.rowstoclose[index].ContractStatus = 6;
                this.blockedPanel=true;
                  let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
                  console.log(url);
                  let param: any = {};
                  param.op = "update";
                  param.entityid={id:this.rowstoclose[index].id};
                  param.entity = "Wrx_SalesContracts";
                  param.attributes = this.rowstoclose[index];
                  let headers = new HttpHeaders();
                  this.http.post(url, param, {headers: headers}).subscribe(
                    (res) => 
                    {
                      console.log(res);
                      var response: any = res;
                      if(response.success)
                      {
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Status Updated As Closed', life: 3000});
                        //this.getCommodities();
                      }else{
                        this.messageService.add({severity:'error', summary: 'Failed', detail: 'Status Not Updated', life: 3000});
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
                      });
                    });
                //........................
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
              this.rowstoclose = response.result.queryresult;

              this.rowstoclose.forEach((index:number)=>{
                  //..........Updated Closed
                  this.rowstoclose[index].ContractStatus = 6;
                  this.blockedPanel=true;
                    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
                    console.log(url);
                    let param: any = {};
                    param.op = "update";
                    param.entityid={id:this.rowstoclose[index].id};
                    param.entity = "Wrx_SalesContracts";
                    param.attributes = this.rowstoclose[index];
                    let headers = new HttpHeaders();
                    this.http.post(url, param, {headers: headers}).subscribe(
                      (res) => 
                      {
                        console.log(res);
                        var response: any = res;
                        if(response.success)
                        {
                          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Status Updated As Closed', life: 3000});
                          //this.getCommodities();
                        }else{
                          this.messageService.add({severity:'error', summary: 'Failed', detail: 'Status Not Updated', life: 3000});
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
                        });
                      });
                  //........................

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
exportExcel(rowsparam:any) 
{
  import('xlsx').then((xlsx) => {
    const worksheet = xlsx.utils.json_to_sheet(rowsparam);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'ERRTemprows');
  });
}
saveAsExcelFile(buffer: any, fileName: string): void 
{
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}
}