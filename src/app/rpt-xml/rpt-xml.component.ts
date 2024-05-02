import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-rpt-xml',
  templateUrl: './rpt-xml.component.html',
  styleUrls: ['./rpt-xml.component.css'],
  providers: [DialogService, MessageService]
})
export class RptXMLComponent {

  rowsforxml:any=[];

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
    param.query = "select * from vw_XMLGen;";
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
        this.rows.forEach((element: any,index: number)=>{
          //element.splice(9,0,element.ProvOrigin);
          // if(element.plant=="plum coulee"){
          
          //  element.provorigin = "mb";}
          // else{}
            element.ProvOrigin = "SK";
            
          
         
          element.UOM="KGM";
          element.UOMTN = "TNE";
          if(element.VesselName=="NA"){
            element.MOT = "2";
            element.Containerized ="N";}
            else{
              element.MOT = "1";
              element.Containerized ="Y";
            }
           element.RPI = "N";
           element.permit="";
           element.DoxCutoff=element.DoxCutoff == "" ? "" : new Date(element.DoxCutoff);//this.datePipe.transform(element.DoxCutoff,'yyyy-MM-dd');
           element.FreightValue = Number(element.FreightValue);
           element.FOB = Number (element.FOB);
           element.ShippedQTY = Number (element.ShippedQTY);
           element.ShippedQTYTN = Number (element.ShippedQTYTN);
          
           this.rowsforxml[index] = {
            'Canadian Port of Exit' : element.PortCode.replace('\r\n',''),
            'Country of Final Destination' : element.Code.replace('\r\n',''),
            'HS (8) Code': element.HSCODEXML,
            'DESCRIPTION OF GOODS': element.Commodity,
            'Quantity' : element.ShippedQTY,
            'UOM': element.UOM,
            'Domestic Freight Charges': element.FreightValue,
            'Value FOB': element.FOB,
            'Currency of Declared Value' : element.CurrencyName,
            'Country of Origin' : element.OriginCode,
            'Province of Origin' : element.ProvOrigin,
            'Gross Weight': element.ShippedQTYTN,
            'UOM TON' : element.UOMTN,
            'Mode of Transport (MOT)': element.MOT,
            'Vessel Name': element.VesselName,
            'Related Party Indicator': element.RPI,
            'Permit Number' : element.permit,
            'Containerized' : element.Containerized,
            'DoxCutoff': element.DoxCutoff,
            'Split Number': element.SplitNo
           }
          
           delete element.Plant;
        });
        console.log(this.rowsforxml);
        
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
      const worksheet = xlsx.utils.json_to_sheet(this.rowsforxml);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'XMLReport');
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
