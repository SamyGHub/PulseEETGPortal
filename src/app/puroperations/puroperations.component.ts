import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../general.service';
//import { MessagesService } from '../messages.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import moment from 'moment';
// import * as moment from "moment";

@Component({
  selector: 'app-puroperations',
  templateUrl: './puroperations.component.html',
  styleUrls: ['./puroperations.component.css'],
  providers: [DialogService, MessageService, DatePipe]
})
export class PuroperationsComponent {
  rows: any[] = [];
  cols: any[] = [];
  tablefilter: string = "";
  Ddata: any[] = [];
  loggedinuser: any;
  uploadedFiles: any[] = [];
  blockedPanel: boolean = false;
  fileReaded: any;
  selectedContracts:any;
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  Transactionsrows:any=[];
  TData:any[]=[];
  commodities: any = [];
  Contractrows:any=[];
  conMatch:any=[];
  constructor(
    private generalservice: GeneralService,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    public dialogService: DialogService) 

    {
      this.loggedinuser = generalservice.getLoggedUser();
      if (!this.loggedinuser) {
        this.router.navigateByUrl('/app-login');
      }
      this.getfromDB();
      //this.getInjectedTransaction();
    }
  getfromDB() {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_PurchaseContractsMaster;";
    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.cols = response.result.cols[0];
          this.Contractrows = response.result.queryresult;
          this.tablefilter = this.cols.toString();
          console.log("Hello",this.Contractrows);
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel=false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;
      })
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
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/clearPRImportedData";
        console.log(url);
        let param: any = {};
        param.op = "clearPRImportedData";
        param.userid = this.generalservice.loggeduser.id;
        
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.Contractrows= [];
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Purchase Master Data Cleared', life: 3000});
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
              //this.rows = response.result.queryresult;
              this.Transactionsrows = response.result.queryresult;
              this.processPCTransaction();
            }
          },response => {
            console.log("Post call in error", response);              
        },
        () => {
          this.blockedPanel = false;
            console.log("The Post observable is now completed.");
            
        })
      }
  processPCTransaction()
  {

    console.log("Purchaseto process",this.Transactionsrows);
    
    this.confirmationService.confirm({
      message: 'Are you sure you want to Process Selected Purchase Transactions?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/processPRTransaction";
        console.log(url);
        let param: any = {};
        param.op = "processPRTransaction";
        param.entity = "Wrx_TransPurchase";
        param.userid = this.generalservice.loggeduser.Uid;
        param.ownerid = this.generalservice.loggeduser.Uid //this.generalservice.getAssignedUser();
        param.attributes = this.Transactionsrows;
        console.log(this.Transactionsrows);

        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
          console.log(res);
          var response: any = res;
          if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Purchase Transaction Contracts has been processed.', life: 3000});
              this.selectedContracts = [];
             
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failure', detail: 'Connection to DB' + response.message, life: 3000});
            }
          },response => 
            {
              console.log("Post call in error", response);
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
              this.blockedPanel=false;  
            },
            () => {
                   console.log("The Post observable is now completed.");
                   this.blockedPanel = false;
                  })
          }
        })
  }
  processPC()
  {
    console.log("Purchaseto process",this.Contractrows);
    
    this.confirmationService.confirm({
      message: 'Are you sure you want to Process Selected Purchase Contracts?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/processPRContract";
        console.log(url);
        let param: any = {};
        param.op = "processPRContract";
        param.entity = "Wrx_PurchaseContracts";
        param.userid = this.generalservice.loggeduser.Uid;
        param.ownerid = this.generalservice.loggeduser.Uid //this.generalservice.getAssignedUser();
        param.attributes = this.Contractrows;
        console.log(this.Contractrows);

        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
          console.log(res);
          var response: any = res;
          if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Purchase Contracts has been processed.', life: 3000});
              this.selectedContracts = [];
              this.getfromDB();
              this.getInjectedTransaction();
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failure', detail: 'Connection to DB' + response.message, life: 3000});
            }
          },response => 
            {
              console.log("Post call in error", response);
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
              this.blockedPanel=false;  
            },
            () => {
                   console.log("The Post observable is now completed.");
                   this.blockedPanel = false;
                  })
          }
        }) 
  }
  
  getCommodities()
  {
    //this.blockedPanel = true;
    let param: any = {};
      param.op = "query";
      param.query = "select id, Name, Commodityimg from Wrx_Commodity;";
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
  csv2Array(fileInput: any) 
  {
    this.blockedPanel = true;
  //read file from input
  this.fileReaded = fileInput.files[0];
  let finalrecords: any = [];
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
            case "Terms of payment":
              headers[j] = "Termsofpayment";
              break;
            case "Reference number":
              headers[j] = "Referencenumber";
              break;
            case "Warehouse":
              headers[j] = "Warehouse";
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
          if(headers[j]=="Price" || headers[j]=="Quantity" ||headers[j]=="Amount") {
            salescontract[headers[j]] = (data[j].trim());}
          // }else if (headers[j] == "Contractdate"){
          //   console.log(data[j]);
            
          //   console.log(moment.utc(new Date( data[j])).format("MM/d/yyyy"));
            
          //   salescontract[headers[j]] = moment(new Date( data[j].trim())).format("MM/d/yyyy");
          //   console.log(salescontract[headers[j]]);} 
            else if ( headers[j] == "Contractdate" || headers[j] == "Commission group" || headers[j] == "Through" || headers[j] == "Commission amount")
            {
              continue;
            }
              
          else if(data[j] && (headers[j]=="Shipmentperiod" || headers[j] == "Name" || headers[j]=="Portofdischarge" || headers[j]=="Contractnumber" || headers[j]=="Itemnumber"))
          {
            data[j] = data[j].replace(/[^\w\s]/gi, "")
            salescontract[headers[j]] = data[j].trim();
          }
          else
            salescontract[headers[j]] = (data[j])? data[j].trim():"";
          //  console.log("sales contract", salescontract);
        }
        console.log("line", salescontract);
          if (salescontract.Quantity==0 ||
            salescontract.Name.includes("ETG FOOD PRODUCTS INC")==true || 
            salescontract.Price ==0) //|| this.RData[i].Status.includes("Cancelled")==true)//    ||   // )
          {
            continue;
          }
          
          lines.push(salescontract);
          
         
      }

    }
    console.log("lines are", lines);
    
     //........................................................................
     let param: any = {};
     param.op = "query";
     param.query = "select distinct Contractnumber from Wrx_PurTransactions;";
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
            console.log(finalrecords);
            
            if(finalrecords.length>0)
            {
              this.TData = finalrecords;
              this.uploadImportedRecords();
            
            let hasDuplicate=this.TData.some((item, id)=>{ 
              if(this.TData.indexOf(item) != id)
                return item;
            });
            console.log("hasduplicates", hasDuplicate);
            }
            console.log("TDAta",this.TData);       
          
                  
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
  uploadImportedRecords() {
    
    this.blockedPanel=true;
    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/createMultiple";
    console.log(url);
    let param: any = {};
    param.op = "createMultiple";
    param.entity = "Wrx_PurchaseContractsMaster";
    param.attributes = this.TData;
    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Purchase Master Data Imported.', life: 3000 });
          this.getfromDB();
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Purchase Master Data Failed to Upload', life: 3000 });
        }
      }, response => {
      console.log("Post call in error", response);
      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      this.blockedPanel = false;
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
}

