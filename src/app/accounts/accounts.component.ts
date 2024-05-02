import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import FileSaver from 'file-saver';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  providers: [DialogService, MessageService]
})
export class AccountsComponent {
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
    }

    Accobj:any={};
    Accobjs:any[]=[];
    loggedinuser: any;
    myDate: any = new Date ();
    submitted: boolean = false;
    addNewDialogue = false;
    uploadedFiles:any [] =[];
    updateObject:any[]=[];
    selectedSplit:any[]=[];
    cols:any[]=[];
    rows:any[]=[];
    
    myjson:any=JSON;
    mywindow: any = window;
    
    blockedPanel: boolean = false;
    position: string = "";
    displayPosition: boolean=false;
    dialougmessage: string ="";
    clear(table: Table) 
    {
      table.clear();
    }
    getContractSplits()
  {
    this.blockedPanel=true;
    
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_SplitsAccounting;";
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
        this.rows.forEach((CS:any,index:number)=>{
          this.rows[index].Quantity = Number(CS.Quantity);
          this.rows[index].Price = Number(CS.Price);
          this.rows[index].Amount=Number(CS.Amount);
          this.rows[index].CalcQuantity = Number(CS.CalcQuantity);
          this.rows[index].Invoiceamount = Number(CS.Invoiceamount);
          this.rows[index].Paymentreceivedamount = this.rows[index].Paymentreceivedamount =="" ? 0:Number(CS.Paymentreceivedamount);
          this.rows[index].FCLNum = Number(CS.FCLNum);
          this.rows[index].FreightValue = Number(CS.FreightValue);
          this.rows[index].Freight = Number(CS.Freight);
          this.rows[index].Contractdate = new Date (CS.Contractdate);
          this.rows[index].Deliveryfromdate = new Date(CS.Deliveryfromdate);
          this.rows[index].Deliverytodate = new Date(CS.Deliverytodate);
          this.rows[index].DoxCutoff = this.datePipe.transform(CS.DoxCutoff,'M/d/yyyy');
          this.rows[index].ETA = this.datePipe.transform(CS.ETA,'M/d/yyyy');
          this.rows[index].ETS = this.datePipe.transform(CS.ETS,'M/d/yyyy');
        })
      }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
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
  addNew()
  {
      this.Accobj = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  UpdateAcc()
  {

  }
  exportExcel()
  {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.rows);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'AccountExcel');
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
