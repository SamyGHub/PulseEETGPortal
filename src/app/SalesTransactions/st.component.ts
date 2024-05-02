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
import moment from 'moment';

@Component({
  selector: 'app-st',
  templateUrl: './st.component.html',
  styleUrls: ['./st.component.css'],
  providers: [DialogService, MessageService]
})

export class STComponent {
  fileReaded: any;
 
  value: number = 0;
  TData: any [] = [];
  Ddata: any [] = [];
  rows: any[]  = [];
  cols: any [] = [];
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
  mymessages:any=[];
  viewme:boolean=false;

  constructor(
    private router: Router, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    private generalservice: GeneralService,
    private http: HttpClient, 
    public dialogService: DialogService) 
    {
      this.loggedinuser = this.generalservice.getLoggedUser();
      if(!this.loggedinuser)
      {
        //this.generalservice.removeLoggedUser();
        this.router.navigateByUrl('/app-login');
      }
      else
        this.getInjectedTransaction();
    }
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
    getInjectedTransaction()
    {
      this.blockedPanel = true;
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
              this.cols = response.result.cols[0];
              //this.rows = response.result.queryresult;
              this.TData = response.result.queryresult;
              console.log(this.TData)
              console.log(this.cols.toString())
              this.tablefilter = this.cols.toString();
              this.blockedPanel=false;
            }
          },response => {
            console.log("Post call in error", response);
            this.blockedPanel=false;              
        },
        () => {
            console.log("The Post observable is now completed.");
            
        })
      }
processSalesTransaction()
{
  this.confirmationService.confirm({
    message: 'Are you sure you want to Process Selected Transaction Contracts?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.blockedPanel=true;

      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/processSalesTransaction";
      console.log(url);
      let param: any = {};
      param.op = "processSalesTransaction";
      param.entity = "Wrx_SalesTrans";
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
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Contract Transaction has been processed.', life: 3000});
              this.selectedContracts = [];
              this.mymessages = response.result.mymessages;
              if (this.mymessages.length)
              this.viewme= true;
             
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
        }) 
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
                  else if (headers[j] == "Commission group" || headers[j] == "Through" || headers[j]=="Reference sales/purchase contract" || headers[j] == "Date" || headers[j] == "Cost center" || headers[j] == "Business unit" || headers[j] == "Price type" || headers[j] == "Reference number")
                  {
                    continue;
                  }
                    
                else if(data[j] && (headers[j] =="BillofLading" || headers[j]=="Shipmentperiod" || headers[j] == "Warehouse" || headers[j] == "Name" || headers[j] == "Payment" || headers[j]=="Name2" || headers[j]=="Portofloading" || headers[j]=="Portofdischarge" || headers[j]=="Grade" || headers[j]=="Buyer" || headers[j]=="Contractnumber" || headers[j]=="Itemnumber" || headers[j]=="ORIGINVARIETY" || headers[j]=="Ordertype"))
                {
                  data[j] = data[j].replace(/[^\w\s]/gi, "")
                  salescontract[headers[j]] = data[j].trim();
                }
                else if(headers[j]=="Invoice")
                {
                  if(data[j].includes('P') ==false)
                  {
                    salescontract[headers[j]] = Number((data[j].trim()));
                  }
                  else
                  {
                    salescontract[headers[j]] = (data[j].trim());
                  }
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
          
        });
    }
    Clear()
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
          param.userid = this.generalservice.loggeduser.id;
          
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
}
