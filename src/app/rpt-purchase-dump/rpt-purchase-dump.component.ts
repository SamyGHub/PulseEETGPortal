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
  selector: 'app-rpt-purchase-dump',
  templateUrl: './rpt-purchase-dump.component.html',
  styleUrls: ['./rpt-purchase-dump.component.css'],
  providers: [DialogService, MessageService]
})
export class RptPurchaseDumpComponent {
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
 

  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getContractSplits()
  {
    this.blockedPanel=true;
    
        let param: any = {};
        param.op = "query";
        param.query = "select * from vw_PurchaseContractsRemain;"//where ownerid=" + this.loggedinuser.Uid + ";";
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
  exportExcel()
  {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.rows);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'PurchaseDumpFile');
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
