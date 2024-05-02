import { Component } from '@angular/core';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-positionreprot',
  templateUrl: './positionreprot.component.html',
  styleUrls: ['./positionreprot.component.css']
})
export class PositionreprotComponent {
  myDate = new Date ();
  loggedinuser: any;
  blockedPanel: boolean;
  dialougmessage: string = "";
  position: string = "";
  displayPosition: boolean = false;
  VarietyByCommodity: any = [];
  RCNotmapped: any = [];
  cols:any=[];
  selectedposition:any;
  RCNotInvoiced:any = [];
  dummypassed:any=[];
  OpenSalesContractnotinvoiced:any = [];
  commodities: any = [];
  PCTrack:any=[];
  PCCNF:any=[];

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe, private router: Router, private filterService: FilterService) {
      
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
      //this.rows = generalservice.SalesContract;
      //console.log(this.rows);
      this.blockedPanel=true;
      let today = new Date();
      let invalidDate = new Date();
      this.getCommodities();
      this.getOpenSalesContractnotinvoiced();
      
  }
  
  isRowSelectable(event:any) 
  {
    return (event.data.id)? true : false;
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
  getOpenSalesContractnotinvoiced()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_OpenSalesContractnotinvoiced;";
    let headers = new HttpHeaders();
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.OpenSalesContractnotinvoiced = response.result.queryresult;
        this.getDummyContractbookigpassed()
      }
    },response => 
    {
      console.log("Post call in error", response);
      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      this.blockedPanel=false;     
    },
    () => {
      console.log("The Post observable is now completed.");
      //this.blockedPanel=false;
    })
  }
  getDummyContractbookigpassed()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_DummyContractETDpassed;";
    let headers = new HttpHeaders();
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.dummypassed = response.result.queryresult;
        this.getRCNotmapped()
      }
    },response => 
    {
      console.log("Post call in error", response);
      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      this.blockedPanel=false;     
    },
    () => {
      console.log("The Post observable is now completed.");
      //this.blockedPanel=false;
    })
  }
  getRCNotmapped()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_RCTotalMT;";
    let headers = new HttpHeaders();
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.RCNotmapped = response.result.queryresult;
        this.getRCNotInvoiced()
      }
    },response => 
    {
      console.log("Post call in error", response);
      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      this.blockedPanel=false;     
    },
    () => {
      console.log("The Post observable is now completed.");
      //this.blockedPanel=false;
    })
  }
  getRCNotInvoiced()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_RCNotInvoiced;";
    let headers = new HttpHeaders();
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.RCNotInvoiced = response.result.queryresult;
        this.getPCTrack();
      }
    },response => 
    {
      console.log("Post call in error", response);
      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      this.blockedPanel=false;     
    },
    () => {
      console.log("The Post observable is now completed.");
      //this.blockedPanel=false;
    })
  }
  getPCTrack()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_PurchasePositionTrack;";
    let headers = new HttpHeaders();
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.PCTrack = response.result.queryresult;
        console.log("PC Not Track", this.PCTrack);
        
        this.getPcnf()
      }
    },response => 
    {
      console.log("Post call in error", response);
      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      this.blockedPanel=false;     
    },
    () => {
      console.log("The Post observable is now completed.");
      //this.blockedPanel=false;
    })
  }
  getPcnf()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_PurchaseCNFPosition;";
    let headers = new HttpHeaders();
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.PCCNF= response.result.queryresult;
        console.log("PC CNF", this.PCCNF);
        
        this.getVarietyByCommodity()
      }
    },response => 
    {
      console.log("Post call in error", response);
      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      this.blockedPanel=false;     
    },
    () => {
      console.log("The Post observable is now completed.");
      //this.blockedPanel=false;
    })
  }
  getVarietyByCommodity()
  {
    //this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_VarietybyCommodity;";
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
        this.VarietyByCommodity = response.result.queryresult;
        this.VarietyByCommodity.forEach((element:any,index:number) => {

          let rcnotmapped = this.RCNotmapped.find((item:any)=>item.productno==element.id);
          if(rcnotmapped)
          {
            this.VarietyByCommodity[index].rcnotmapped = rcnotmapped.TotalMT;
          }
          else{
            this.VarietyByCommodity[index].rcnotmapped = 0;
          }

          let rcnotinvoiced = this.RCNotInvoiced.find((item:any)=>item.Commodityid==element.id);
          if(rcnotinvoiced)
          {
            this.VarietyByCommodity[index].rcnotinvoiced = rcnotinvoiced.Stuffed;
          }else{
            this.VarietyByCommodity[index].rcnotinvoiced = 0;
          }

          let dummypass = this.dummypassed.find((item:any)=>item.Commodityid==element.id)
          if(dummypass)
          {
            this.VarietyByCommodity[index].dummypassedETD = dummypass.TotalMT;
          }
          else
          {
            this.VarietyByCommodity[index].dummypassedETD = 0;
          }

          let OpenSalesContractnotinvoiced = this.OpenSalesContractnotinvoiced.find((item:any)=>item.Commodityid==element.id)
          if(OpenSalesContractnotinvoiced)
          {
            this.VarietyByCommodity[index].OpenSalesContractnotinvoiced = OpenSalesContractnotinvoiced.REM;
          }
          else
          {
            this.VarietyByCommodity[index].OpenSalesContractnotinvoiced= 0;

          }
          console.log("Find Formula",this.PCTrack.find((item:any)=>item.varietyid==element.varietyid));
          
          let PcTrack = this.PCTrack.find((item:any)=>item.Commodityid==element.id)
          
          
          if (PcTrack)
          {
            this.VarietyByCommodity[index].PcTrack = PcTrack.Remaining;
          }
          else
          {
            this.VarietyByCommodity[index].PcTrack = 0;
          }
          
          let PcCNF = this.PCCNF.find((item:any)=>item.commodityid==element.id)          
          if (PcCNF)
          {
            this.VarietyByCommodity[index].PcCNF = PcCNF.Remaining;
          }
          else
          {
            this.VarietyByCommodity[index].PcCNF = 0;
          }
        });
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
  getbycommodity()
  {
    
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
      const worksheet = xlsx.utils.json_to_sheet(this.VarietyByCommodity);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Position');
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
