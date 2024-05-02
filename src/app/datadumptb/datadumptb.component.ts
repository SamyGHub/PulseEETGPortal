import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-datadumptb',
  templateUrl: './datadumptb.component.html',
  styleUrls: ['./datadumptb.component.css'],
  providers: [DialogService, MessageService]
})
export class DatadumptbComponent {
  constructor(   
    private generalservice: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService, private confirmationService: ConfirmationService, private datePipe: DatePipe, public dialogService: DialogService) 
    {
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      this.router.navigateByUrl('/app-login');
    }
      this.getContractSplits();
      this.getCommodities();
      
      this.Insurance = [{name:'Yes',code:0},{name:'No', code:1}];
    }
    Doxobj:any={};
    Doxobjs:any[]=[];
    loggedinuser: any;
    myDate: any = new Date ();
    submitted: boolean = false;
    addNewDialogue = false;
    uploadedFiles:any [] =[];
    updateObject:any[]=[];
    selectedSplit:any[]=[];
    cols:any[]=[];
    rows:any[]=[];
    Insurance:any[]=[];
    myjson:any=JSON;
    mywindow: any = window;
    blockedPanel: boolean = false;
    position: string = "";
    displayPosition: boolean=false;
    dialougmessage: string ="";
    tablefilter: string = "";
    
    commodities: any = [];

  ngOnInit() 
  {

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
  getDox(Dox:any)
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Dox where SplitNo =" + Dox + ";";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.Doxobjs = response.result.queryresult;

        this.Doxobjs.forEach((element:any,index:number)=>{
          this.Doxobjs[index].Contractdate = new Date(element.Contractdate);
        })
          console.log(this.Doxobjs);
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
    this.addNewDialogue = true;
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getContractSplits()
  {
    this.blockedPanel=true;
    if (this.loggedinuser.id!=1){
        let param: any = {};
        param.op = "query";
        param.query = "select * from vw_DumpFile;"//where ownerid=" + this.loggedinuser.Uid + ";";
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
            this.cols = response.result.cols[0];
            this.rows = response.result.queryresult;
            
            this.rows.forEach((element:any,index:number)=>{
              
              this.rows[index].Contractdate = this.rows[index].Contractdate == "" ? "" : new Date(element.Contractdate);
              this.rows[index].Deliveryfromdate = this.rows[index].Deliveryfromdate =="" ? "" : new Date(element.Deliveryfromdate);
                
                this.rows[index].Quantity = Number(element.Quantity);
                this.rows[index].CalcQuantity = Number(element.CalcQuantity);
                this.rows[index].Price = Number(element.Price);
                this.rows[index].Amount = Number(element.Amount);
                //this.rows[index].Paymentreceived = Number(element.Paymentreceived);
                this.rows[index].FCLNum = Number(element.FCLNum);
                this.rows[index].FreightValue = Number(element.FreightValue);
                this.rows[index].Freight = Number(element.Freight);
  
                this.rows[index].Deliverytodate = this.rows[index].Deliverytodate == "" ? "" : new Date(element.Deliverytodate);
                this.rows[index].BLDraftReceived = this.rows[index].BLDraftReceived == "" ? "" : new Date(element.BLDraftReceived);
                this.rows[index].Appropriation = this.rows[index].Appropriation == "" ? "" : new Date(element.Appropriation);
                this.rows[index].BLApproval = this.rows[index].BLApproval == "" ? "" : new Date(element.BLApproval);
  
                this.rows[index].OBLReceived = this.rows[index].OBLReceived == "" ? "" : new Date(element.OBLReceived);
                this.rows[index].WQDraftReceived = this.rows[index].WQDraftReceived == "" ? "" : new Date(element.WQDraftReceived);
                this.rows[index].WQrequest = this.rows[index].WQrequest == "" ? "" : new Date(element.WQrequest);
                this.rows[index].Phytorequest = this.rows[index].Phytorequest == "" ? "" : new Date(element.Phytorequest);
                this.rows[index].PhytoDraftReceived = this.rows[index].PhytoDraftReceived == "" ? "" : new Date(element.PhytoDraftReceived);
                this.rows[index].OriginalWQReceived = this.rows[index].OriginalWQReceived == "" ? "" : new Date(element.OriginalWQReceived);
                this.rows[index].OriginalPhytoReceived = this.rows[index].OriginalPhytoReceived == "" ? "" : new Date(element.OriginalPhytoReceived);
                this.rows[index].COODraftReceived = this.rows[index].COODraftReceived == "" ? "" : new Date(element.COODraftReceived);
                this.rows[index].COOPhytoReceived = this.rows[index].COOPhytoReceived == "" ? "" : new Date(element.COOPhytoReceived);
                this.rows[index].DraftSentApproval = this.rows[index].DraftSentApproval == "" ? "" : new Date(element.DraftSentApproval);
                this.rows[index].Draftsapproved = this.rows[index].Draftsapproved == "" ? "" : new Date(element.Draftsapproved);
                this.rows[index].OriginalsCouriered = this.rows[index].OriginalsCouriered == "" ? "" : new Date(element.OriginalsCouriered);
                this.rows[index].DoxCutoff = this.rows[index].DoxCutoff == "" ? "" : new Date(element.DoxCutoff);
                this.rows[index].ETS = this.rows[index].ETS == "" ? "" : new Date(element.ETS);
                this.rows[index].ETA = this.rows[index].ETA == "" ? "" : new Date(element.ETA);
                this.rows[index].BLDate = this.rows[index].BLDate == "" ? "" : new Date(element.BLDate);
                this.rows[index].Invoicedate = this.rows[index].Invoicedate == "" ? "" : new Date(element.Invoicedate);
                this.rows[index].Paymentreceivedamount = this.rows[index].Paymentreceivedamount =="" ? 0:Number(element.Paymentreceivedamount);

            });
            
            this.tablefilter = this.cols.toString();
          }else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
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
  }else{
    
      let param: any = {};
      param.op = "query";
      param.query = "select * from vw_DumpFile;";
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
          this.cols = response.result.cols[0];
          this.rows = response.result.queryresult;
          this.rows.forEach((element:any,index:number)=>{
            
            this.rows[index].Contractdate = this.rows[index].Contractdate == "" ? "" : new Date(element.Contractdate);
            this.rows[index].Deliveryfromdate = this.rows[index].Deliveryfromdate =="" ? "" : new Date(element.Deliveryfromdate);
              
              this.rows[index].Quantity = Number(element.Quantity);
              this.rows[index].CalcQuantity = Number(element.CalcQuantity);
              this.rows[index].Price = Number(element.Price);
              this.rows[index].Amount = Number(element.Amount);
              //this.rows[index].Paymentreceived = this.rows[index].Paymentreceived=="" ? 0:Number(element.Paymentreceived);
              this.rows[index].FCLNum = Number(element.FCLNum);
              this.rows[index].FreightValue = Number(element.FreightValue);
              this.rows[index].Freight = Number(element.Freight);

              this.rows[index].Deliverytodate = this.rows[index].Deliverytodate == "" ? "" : new Date(element.Deliverytodate);
              this.rows[index].BLDraftReceived = this.rows[index].BLDraftReceived == "" ? "" : new Date(element.BLDraftReceived);
              this.rows[index].Appropriation = this.rows[index].Appropriation == "" ? "" : new Date(element.Appropriation);
              this.rows[index].BLApproval = this.rows[index].BLApproval == "" ? "" : new Date(element.BLApproval);

              this.rows[index].OBLReceived = this.rows[index].OBLReceived == "" ? "" : new Date(element.OBLReceived);
              this.rows[index].WQDraftReceived = this.rows[index].WQDraftReceived == "" ? "" : new Date(element.WQDraftReceived);
              this.rows[index].WQrequest = this.rows[index].WQrequest == "" ? "" : new Date(element.WQrequest);
              this.rows[index].Phytorequest = this.rows[index].Phytorequest == "" ? "" : new Date(element.Phytorequest);
              this.rows[index].PhytoDraftReceived = this.rows[index].PhytoDraftReceived == "" ? "" : new Date(element.PhytoDraftReceived);
              this.rows[index].OriginalWQReceived = this.rows[index].OriginalWQReceived == "" ? "" : new Date(element.OriginalWQReceived);
              this.rows[index].OriginalPhytoReceived = this.rows[index].OriginalPhytoReceived == "" ? "" : new Date(element.OriginalPhytoReceived);
              this.rows[index].COODraftReceived = this.rows[index].COODraftReceived == "" ? "" : new Date(element.COODraftReceived);
              this.rows[index].COOPhytoReceived = this.rows[index].COOPhytoReceived == "" ? "" : new Date(element.COOPhytoReceived);
              this.rows[index].DraftSentApproval = this.rows[index].DraftSentApproval == "" ? "" : new Date(element.DraftSentApproval);
              this.rows[index].Draftsapproved = this.rows[index].Draftsapproved == "" ? "" : new Date(element.Draftsapproved);
              this.rows[index].OriginalsCouriered = this.rows[index].OriginalsCouriered == "" ? "" : new Date(element.OriginalsCouriered);
              this.rows[index].DoxCutoff = this.rows[index].DoxCutoff == "" ? "" : new Date(element.DoxCutoff);
              this.rows[index].ETS = this.rows[index].ETS == "" ? "" : new Date(element.ETS);
              this.rows[index].ETA = this.rows[index].ETA == "" ? "" : new Date(element.ETA);
              this.rows[index].BLDate = this.rows[index].BLDate == "" ? "" : new Date(element.BLDate);
              this.rows[index].Invoicedate = this.rows[index].Invoicedate == "" ? "" : new Date(element.Invoicedate);
              this.rows[index].Paymentreceivedamount = this.rows[index].Paymentreceivedamount =="" ? 0:Number(element.Paymentreceivedamount);
          
            });
          this.tablefilter = this.cols.toString();
        }else{
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
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
  }
  exportExcel()
  {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.rows);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'DumpFile');
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
