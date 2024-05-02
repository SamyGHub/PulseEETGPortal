import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../general.service';
//import { MessagesService } from '../messages.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import moment from 'moment';
import FileSaver from 'file-saver';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-purchasecontracts',
  templateUrl: './purchasecontracts.component.html',
  styleUrls: ['./purchasecontracts.component.css'],
  providers: [DialogService, MessageService, DatePipe]
})
export class PurchasecontractsComponent {
  rows: any = [];
  cols: any = [];
  tablefilter: string = "";
  blockedPanel: boolean = false;
  selectedContracts:any = {};
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  loggedinuser: any;
  updateObject: any = [];
  commodities:any=[];
  first:any;
  constructor(
    private generalservice: GeneralService,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService, private confirmationService: ConfirmationService, public dialogService: DialogService) 
    {
      this.loggedinuser = generalservice.getLoggedUser();
      if (!this.loggedinuser) {
        this.router.navigateByUrl('/app-login');
      }
      this.getContracts();
      this.getCommodities();
    }
    isRowSelectable(event:any) {
      return (event.data.id)? true : false;
    }
    onRowSelect(event: any) {
    
      if(!this.updateObject.find((obj: any)=>obj.id==event.data.id)){
        this.updateObject.push(event.data);
      }
      console.log(this.updateObject);
      this.generalservice.selectedObject = this.updateObject;
      this.generalservice.purDialogueDisplay = false;
      
      //this.messageService.add({key: 'toast01',severity:'info', summary:'Product Selected', detail: event.data.id});
  }
  onRowUnselect(event: any) {
    //this.messageService.add({key: 'toast01',severity:'info', summary:'Product Unselected',  detail: event.data.Transloader});
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
    UpdCancel(pcancl:any)
    {
      let conup:any = {};
      conup.id = pcancl.id;
      conup.Cancel = 1;
      conup.ContractStatus = 4
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
            param.entity = "Wrx_PurchaseContracts";
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
                  this.getContracts();
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
      concls.ContractStatus = 6
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
            param.entity = "Wrx_PurchaseContracts";
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
                  this.getContracts();
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
getContracts() 
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_PurchaseContractsRemain;";
    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.cols = response.result.cols[0];
          this.rows = response.result.queryresult;
          this.tablefilter = this.cols.toString();
          console.log("Hello" , this.rows);
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
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  exportExcel()
  {
     import('xlsx').then((xlsx) => {
     const worksheet = xlsx.utils.json_to_sheet(this.rows);
     const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
     this.saveAsExcelFile(excelBuffer, 'PurchaseContracts');
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
