import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import {MultiSelectModule} from 'primeng/multiselect';

@Component({
  selector: 'app-accdetails',
  templateUrl: './accdetails.component.html',
  styleUrls: ['./accdetails.component.css']
})
export class AccdetailsComponent {
  rowData: any = {};
  Accobj:any={};
  Accobjs:any[]=[];
  cols:any[]=[];
  rows:any[]=[];
  submitted: boolean = false;
  addNewDialogue = false;
  selectedAcc:any;
  Insurance:any[]=[];
  blockedPanel: boolean = false;
  loggedinuser: any;
  myDate = new Date();
  EDC:any[]=[];
  position: string = "";
  dialougmessage: string ="";
  displayPosition:boolean=false;
  SplitInfo: any=[];
  SplitInfoCols: any=[];
  Shipmonth:any = [];
  selectedmonths:any=[]
  myjson:any=JSON;
  invoices:any=[];
  iscreated:boolean=false;
  pdfURL:any;
  PhytoDeclaredQTY:any=[];
  ActualTransaction: any=[];
  ActualCols:any[]=[];
  product: any = {};
  seltrans: any ={};
  Customers:any=[];
  Invdate:any=[];
  rowURL: any[] = [];
  invRows:any=[];
  Invoicerpt: any;
  invoiceURL: any = {};
  israil: boolean = false;

  constructor(   
    private generalservice: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService, private confirmationService: ConfirmationService, private datePipe: DatePipe)
    {
        this.loggedinuser = generalservice.getLoggedUser();
        if(!this.loggedinuser)
      {
        this.router.navigateByUrl('/app-login');
      }
        if(this.route.snapshot.queryParamMap.get("rowData"))
      {
        let productstring = this.rowData = this.route.snapshot.queryParamMap.get("rowData");
        
        if(productstring)
          this.rowData = JSON.parse(atob(productstring));
          console.log("Redirected Data",this.rowData);
      }
          this.getPhytoDeclaredQTY();

          this.Insurance = [{name:'Yes',code:0},{name:'No', code:1}];
          let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
          this.loggedinuser = generalservice.getLoggedUser();
          //this.EDC = [{name:'NOT APPROVED - DON’T SHIP',code:0},{name:'APPROVED', code:1},{name:'NOT REQUIRED', code:2}];
          this.Shipmonth = [{name:'Jan' , code:1},{name:'FEB' ,code:2},{name:'March',code:3},{name:'April',code:4},{name:'May',code:5},{name:'June',code:6},{name:'July',code:7},{name:'Aug',code:8},{name:'Sep',code:9},{name:'Oct',code:10},{name:'Nov',code:11},{name:'Dec',code:12}];
          
        }
  showPositionDialog(position: string, message: string) 
    {
      this.dialougmessage = message;
      this.position = position;
      this.displayPosition = true;
    }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  ngOnInit() 
  {
    this.getAcc();
    this.getInfo();
    this.getEDC();
    this.getActualTransaction();
    this.getcustomersList();
    this.getprice();
    this.getURL();
  }
  getURL() 
  {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select id, InvoiceURL from Wrx_BatchContract where id=" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.rowURL = response.result.queryresult;
          console.log("URLS -->")
          console.log(this.rowURL);

        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  GetInvoice() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_getinvoices where id=" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.invRows = response.result.queryresult;
          this.invRows.forEach((element: any) => {
            element.Username = this.loggedinuser.UName;
            element.signature = this.loggedinuser.UName;
            element.Email = this.loggedinuser.Email;
            element.Phone = this.loggedinuser.Phone;
            element.BLDate = (element.BLDate != "") ? element.BLDate : this.myDate;
          })
          this.rptInvoice();
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  rptInvoice() {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/Invoice";

    console.log(url);
    let param: any = {};
    param.op = "Invoice";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.invRows;
    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });
          
          console.log(this.invRows);
          
          if(this.invRows[0].CurrencyName=="CAD")
          {
            this.Invoicerpt = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.InvoicerptCAD + this.rowData.id + ".pdf";
          }else{
          this.Invoicerpt = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.Invoicerpt + this.rowData.id + ".pdf";
          }
          this.rowURL[0].InvoiceURL = this.Invoicerpt;
          this.updateURL();
          window.open(this.rowURL[0].InvoiceURL);

          console.log(this.Invoicerpt);

        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
          //window.location.reload()
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  updateURL() {
    this.blockedPanel = true;
    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/update";
    console.log(url);
    let param: any = {};
    param.op = "update";
    param.entityid = { id: this.rowData.id };
    param.entity = "Wrx_BatchContract";
    param.attributes = this.rowURL[0];
    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'URL Updated', life: 3000 });

          this.rowData.InvoiceURL = this.rowURL[0].InvoiceURL;
          
          console.log(this.rowData);

          //window.location.reload();
          //this.getCommodities();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'URL Not Updated', life: 3000 });
        }
      }, response => {
      console.log("Post call in error", response);
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
      this.blockedPanel = false;
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      });
  }
  getcustomersList() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_CustomerCreation;";
    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {

          this.Customers = response.result.queryresult;
          console.log("Customers", this.Customers);
          

        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  getActualTransaction()
  {
      this.blockedPanel=true;
      let param: any = {};
      param.op = "query";
      param.query = "select distinct id, invoice from Wrx_TransContract where ContractId=" + this.rowData.Contractid + ";";
      let headers = new HttpHeaders();
      
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.ActualTransaction = response.result.queryresult;
         
        }
          else{
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
  getEDC()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_EDC;";
      console.log(param.query);
      
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.EDC = response.result.queryresult;
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel=false;
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;        
    })
  }
  getPhytoDeclaredQTY()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_PhytoDeclaredQTY where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
      console.log(param.query);
      
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.PhytoDeclaredQTY = response.result.queryresult;
          this.PhytoDeclaredQTY[0].ShippedQTY = this.PhytoDeclaredQTY[0].ShippedQTY== undefined? 0:this.PhytoDeclaredQTY[0].ShippedQTY;
          this.israil=false;

          //this.PhytoDeclaredQTY[0].ShippedQTY= this.PhytoDeclaredQTY[0].ShippedQTY == 0 ? 0:this.PhytoDeclaredQTY[0].ShippedQTY;
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel=false;
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;        
    })
  }
  getInfo()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_AccInfo where id=" + this.rowData.id + ";";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.SplitInfoCols = response.result.cols[0];
          this.SplitInfo = response.result.queryresult;
          console.log(this.SplitInfo);
        }
      },response => {
        console.log("Post call in error", response);
        this.blockedPanel=false;
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;
        
    })
  }
  Getinvdate(I:any)
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select Invoicedate from Wrx_TransContract where ContractId=" + this.rowData.Contractid + " and Invoice =" + I + ";";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.Invdate = response.result.queryresult;
          
          console.log("Invoice Date", this.Invdate);
        }
      },response => {
        console.log("Post call in error", response);
        this.blockedPanel=false;
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;
        
    })
  }
  getAcc()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Accouting where SplitNo=" + this.rowData.id + ";";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.cols = response.result.cols[0];
          this.Accobjs = response.result.queryresult;
          
          console.log(this.Accobjs);
        }
      },response => {
        console.log("Post call in error", response);
        this.blockedPanel=false;
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;
        
    })
  }
  addNew()
  {
    this.PhytoDeclaredQTY[0].ShippedQTY = this.PhytoDeclaredQTY[0].ShippedQTY== undefined? 0:this.PhytoDeclaredQTY[0].ShippedQTY;
    this.Accobj = {};
    this.Accobj.SplitNo = this.rowData.id;
    this.Accobj.customerid = this.rowData.Custid;
    this.Accobj.shipmentvalue =  this.rowData.Price * this.PhytoDeclaredQTY[0].ShippedQTY;
    this.Accobj.PaymentReceivedate = this.rowData.Paymentdate;
    this.submitted = false;
    this.addNewDialogue = true;
  }
 
  editAcc(Acc:any)
  {
    Acc.shipmentvalue =  this.rowData.Price * this.PhytoDeclaredQTY[0].ShippedQTY;  
    this.submitted = true;
    this.Accobj = {...Acc};
    this.addNewDialogue = true;
    console.log(this.Accobj);
  }
  deleteSelectedAcc(Acc:any)
  {

  }
  saveAccobj()
  {
    this.submitted = true;
      
    if (this.Accobj.id) 
    {
      
        this.Accobjs[this.findIndexById(this.Accobj.SplitNo)] = this.Accobjs;
        this.Accobj.modifiedby = this.loggedinuser.id;
        this.Accobj.modifiedon = this.myDate;

        if(this.Accobj.PaymentReceivedate != "")
        {this.Accobj.PaymentReceivedate = this.datePipe.transform(this.Accobj.PaymentReceivedate,'yyyy-MM-dd')}else{delete this.Accobj.PaymentReceivedate};

        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entityid={splitno:this.Accobj.SplitNo};
        param.entity = "Wrx_Accouting";
        param.attributes = this.Accobj;
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
         (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Accounting for Split Updated', life: 3000});
              this.getAcc();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Accounting for Split Not Updated', life: 3000});
            }
          },response => 
            {
             console.log("Post call in error", response);    
            },
              () => 
            {
             console.log("The Post observable is now completed.");
            })
              
      }
      else
      {
        console.log(this.Accobj);
        
          //this.Doxobj.id = this.createId();
          this.Accobj.modifiedby = this.loggedinuser.id;
          this.Accobj.modifiedon = this.myDate;
          this.Accobj.createdby = this.loggedinuser.id;
          this.Accobj.createdon = this.myDate;
          this.Accobj.shipmonths = this.myjson.stringify(this.selectedmonths);
          console.log(this.Accobj.shipmonths);

          if(this.Accobj.PaymentReceivedate != "")
        {this.Accobj.PaymentReceivedate = this.datePipe.transform(this.Accobj.PaymentReceivedate,'yyyy-MM-dd')}else{delete this.Accobj.PaymentReceivedate};

        //SQL to create Doxobj
        this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
          console.log(url);
          let param: any = {};
          param.op = "create";
          param.entity = "Wrx_Accouting";
          param.attributes = this.Accobj;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Accounting Record Created', life: 3000});
              this.getAcc();
             // this.printinvoice();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Accounting Record Not Created', life: 3000});
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
          }
// SQL finish create...........................................................................................................
//             this.commodities = [...this.commodities];
            this.addNewDialogue = false;
            this.Accobj = {};
  }
  printinvoice()
  {
    this.blockedPanel=true;
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/PhytoApplicationForm";
    
    console.log(url);
    let param: any = {};
    param.op = "PhytoApplicationForm";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.invoices;
    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    let headers = new HttpHeaders();
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.iscreated = false;
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Document Created', life: 3000});
        this.pdfURL = this.generalservice.appconfigs.URLs.fileURL+this.generalservice.appconfigs.URLs.phytoTemplateFileName+"_"+ this.rowData.id +".pdf";
        
        this.invoices.phytoURL = this.pdfURL;
        this.updateinvoice();
        console.log(this.pdfURL);
        
      }else{
        this.messageService.add({severity:'error', summary: 'Failed', detail: 'Document Not Created', life: 3000});
      }
    },response => 
        {
          console.log("Post call in error", response);    
          this.blockedPanel=false; 
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        },
        () => {
          console.log("The Post observable is now completed.");
          this.blockedPanel=false;
        })
  
  }
  getprice()
    {
        this.seltrans=[];
        let selparam: any = {};
        selparam.op = "query";
        selparam.query = "select Price, Customerid from Wrx_SalesContracts where Id=" + this.rowData.Contractid + ";";
        let selheaders = new HttpHeaders();
    
      let selurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(selurl, selparam, {headers: selheaders}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.seltrans = response.result.queryresult;
            console.log("inplace",this.seltrans)
          }
        },response => {
          console.log("Post call in error", response);
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
      },
      () => {
          console.log("The Post observable is now completed.");
      });
    }
  Updateprice()
    {
      
      this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entityid={Id:this.rowData.Contractid};
        param.entity = "Wrx_SalesContracts";
        param.attributes = this.seltrans[0];
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Data Updated', life: 3000});
              //this.getCommodities();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Data Not Updated', life: 3000});
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
    }
  updateinvoice()
  {

  }
  convertNumberToWords(num: number): string {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million', 'billion'];
  
    if (num === 0) return 'zero';
  
    let numStr = num.toString();
  
    if (numStr === '0') return '';
  
    if (numStr[0] === '-') {
      return `minus ${this.convertNumberToWords(parseInt(numStr.slice(1)))}`;
    }
  
    let numChunks = [];
    while (numStr.length > 0) {
      numChunks.push(numStr.slice(-3));
      numStr = numStr.slice(0, -3);
    }
  
    let wordsArr = [];
    for (let i = numChunks.length - 1; i >= 0; i--) {
      let chunkWordsArr = [];
      let chunkNum = parseInt(numChunks[i]);
  
      if (chunkNum === 0) {
        continue;
      }
  
      if (chunkNum < 0) {
        chunkWordsArr.push('minus');
        chunkNum *= -1;
      }
  
      if (chunkNum >= 100) {
        chunkWordsArr.push(`${ones[Math.floor(chunkNum / 100)]} hundred`);
        chunkNum %= 100;
      }
  
      if (chunkNum >= 10 && chunkNum <= 19) {
        chunkWordsArr.push(`${ones[chunkNum]}`);
        chunkNum = 0;
      } else if (chunkNum >= 20 || chunkNum === 10) {
        chunkWordsArr.push(`${tens[Math.floor(chunkNum / 10)]}`);
        chunkNum %= 10;
      }
  
      if (chunkNum > 0) {
        if (chunkWordsArr.length > 0) {
          chunkWordsArr.push('and');
        }
        chunkWordsArr.push(`${ones[chunkNum]}`);
      }
  
      if (i > 0) {
        chunkWordsArr.push(scales[i]);
      }
  
      wordsArr.push(chunkWordsArr.join(' '));
    }
  
    return wordsArr.reverse().join(' ');

    console.log(this.convertNumberToWords(123456789));
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.Accobjs.length; i++) 
    {
      if (this.Accobjs[i].id === id) 
      {
        index = i;
        break;
      }
    }
    return index;
  }
}
