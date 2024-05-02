import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { GeneralService } from '../general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { now } from 'moment';
import { toLineHeight } from 'chart.js/dist/helpers/helpers.options';

@Component({
  selector: 'app-purtransactions',
  templateUrl: './purtransactions.component.html',
  styleUrls: ['./purtransactions.component.css'],
  providers: [DialogService, MessageService]
})
export class PurtransactionsComponent {
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  PTdata: any = [];
  loggedinuser: any;
  uploadedFiles: any[] = [];
  blockedPanel: boolean = false;
  fileReaded: any;
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  TData:any[]=[];
  Contractrows:any=[];
  myDate = new Date();

  constructor(
    private router: Router, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    private generalservice: GeneralService,
    private http: HttpClient, 
    public dialogService: DialogService) 
    {
        this.loggedinuser = generalservice.getLoggedUser();
        if(!this.loggedinuser)
          {
            this.router.navigateByUrl('/app-login');
          }
        
          this.loggedinuser = generalservice.getLoggedUser();
        if(!this.loggedinuser)
      {
        
        this.router.navigateByUrl('/app-login');
      }
      else
      {
        this.getInjectedTransaction();
      }
    }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  csv2Array(fileInput: any)
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
            case "GRN Number":
              headers[j] == "GRNNumber";
              break;
            case "Contract date":
              headers[j] = "Contractdate";
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
            case "Reference number":
              headers[j] = "Referencenumber";
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
            else if (headers[j] == "Contractdate" || headers[j] == "Deliveryfromdate" || headers[j] == "Deliverytodate"){
              
              salescontract[headers[j]] = new Date((data[j].trim()));
            }  
            else if (headers[j] == "GRN Number" || headers[j] == "Paid amount" || headers[j] == "Commission group" || headers[j] == "Through" || headers[j]=="Reference sales/purchase contract" || headers[j] == "Date" || headers[j] == "Cost center" || headers[j] == "Business unit" || headers[j] == "Price type")
              {
                continue;
              }
                
            else if(data[j] && (headers[j]=="Referencenumber" || headers[j] =="BillofLading" || headers[j]=="Shipmentperiod" || headers[j] == "Warehouse" || headers[j] == "Name" || headers[j] == "Payment" || headers[j]=="Name2" || headers[j]=="Portofloading" || headers[j]=="Portofdischarge" || headers[j]=="Grade" || headers[j]=="Buyer" || headers[j]=="Contractnumber" || headers[j]=="Itemnumber" || headers[j]=="ORIGINVARIETY" || headers[j]=="Ordertype"))
            {
              data[j] = data[j].replace(/[^\w\s]/gi, "")
              salescontract[headers[j]] = data[j].trim();
            }
            else
            salescontract[headers[j]] = (data[j])? data[j].trim():"";
          //  console.log("sales contract", salescontract);
        }
        console.log("line", salescontract);
        
        if(salescontract.Invoicedate=="")
        {
          salescontract.Invoicedate=this.myDate;
        }else{
          salescontract.Invoicedate = new Date(salescontract.Invoicedate);
        }
        
        if(salescontract.Paymentdate=="")
        {
          salescontract.Paymentdate=this.myDate;
        }else{
          salescontract.Paymentdate = new Date(salescontract.Paymentdate);
        }
        
       
        if (salescontract.Contractquantity==0 || 
          salescontract.Price ==0 
          || salescontract.Contractstatus.includes("Cancelled")==true 
          
          || (salescontract.Referencenumber.includes("TRACK")==false && salescontract.Warehouse.includes("TRACK")==false && salescontract.Referencenumber.includes("BULK VESSEL")==false && (salescontract.ORIGINVARIETY.includes("USA")==true || salescontract.ORIGINVARIETY.includes("CANADA")==true || salescontract.ORIGINVARIETY.includes("US")==true))
          
          || salescontract.Referencenumber.includes("USE")==true || salescontract.Status.includes("Canceled")==true)// || salescontract.Warehouse.indexOf("TRACK")<0)
          // || salescontract.ORIGINVARIETY.indexOf("US")>0 || salescontract.ORIGINVARIETY.indexOf("USA")>0 || salescontract.ORIGINVARIETY.indexOf("CANADA")>0) // || salescontract.Deliveryfromdate>this.Fdlvdt) //|| this.RData[i].Status.includes("Cancelled")==true)//    ||   // )
          {
            console.log("in Referencenumber");
            continue;
            
          } 
        
          lines.push(salescontract);
     
      }
    }
    if(lines.length>0)
    {
    this.TData = lines;
    this.uploadImportedRecords();
    
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
  uploadImportedRecords()
  {
    this.blockedPanel=true;
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createMultiple";
    console.log(url);
    let param: any = {};
    param.op = "createMultiple";
    param.entity = "Wrx_PurTransactions";
    param.attributes = this.TData;
    let headers = new HttpHeaders();
    
    console.log(param);
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
        {
        console.log(res);
        var response: any = res;
        if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Contract Transactions Data Imported.', life: 3000});
            this.getInjectedTransaction();
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
          this.blockedPanel = false;
        });
  }
  Clear()
  {
    this.confirmationService.confirm({
    message: 'Are you sure you want to Clear Imported Data ?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
        
        //Delete SQL Database
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/clearInjectedPRTrans";
        console.log(url);
        let param: any = {};
        param.op = "clearInjectedPRTrans";
        param.userid = this.generalservice.loggeduser.Uid;
        
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.Contractrows= [];
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Purchase Transaction Data Cleared', life: 3000});
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
        })
    }
  getInjectedTransaction()
    {
      this.blockedPanel = true;
      let param: any = {};
          param.op = "query";
          param.query = "select * from Wrx_PurTransactions;";
          let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success){
              this.cols = response.result.cols[0];
              //this.rows = response.result.queryresult;
              this.Contractrows = response.result.queryresult;
              this.Contractrows.forEach((element:any,index:number)=>{
                this.Contractrows[index].Contractdate = new Date(element.Contractdate);
                this.Contractrows[index].Deliveryfromdate = new Date(element.Deliveryfromdate);
                this.Contractrows[index].Deliverytodate= new Date(element.Deliverytodate);
                this.Contractrows[index].Invoicedate = new Date(element.Invoicedate);
                this.Contractrows[index].Paymentdate = new Date(element.Paymentdate);  
              });
              console.log("Contract Rows", this.Contractrows);
              
              this.tablefilter = this.cols.toString();
            }
          },response => {
            console.log("Post call in error", response);              
        },
        () => {
          this.blockedPanel = false;
            console.log("The Post observable is now completed.");
            
        })
      }
}
