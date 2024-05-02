import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, FilterService, FilterMatchMode, SelectItem } from 'primeng/api';
import { GeneralService } from '../general.service';
import FileSaver from 'file-saver';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-railnophytorpt',
  templateUrl: './railnophytorpt.component.html',
  styleUrls: ['./railnophytorpt.component.css']
})
export class RailnophytorptComponent {
  
  rows: any [] =[];
  myDate = new Date ();
  loggedinuser:any;
  cols:any []=[];
  railcar:any;
  submitted: boolean = false;
  blockedPanel: boolean = false;
  invalidDates: Array<Date>;
  tablefilter: string = "";
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";

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
      invalidDate.setDate(today.getDate() - 1);
      this.invalidDates = [today,invalidDate];
         
      
      this.getrails();
      
  }
  
  clear(table: Table) {
    table.clear();
  }
  getrails()
  {
    this.blockedPanel=true;
      let param: any = {};
          param.op = "query";
          param.query = "select * from vw_RailCarswithoutPhyto;";
          let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success){
              this.cols = response.result.cols[0];
              this.rows = response.result.queryresult;
              console.log(this.rows)
              //console.log(this.cols.toString())
              this.tablefilter = this.cols.toString();
              this.rows.forEach((rail:any,index:number)=>{
                this.rows[index].shipdate = new Date(rail.shipdate);
              })
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
  exportExcel()
  {
    this.getrails();
    
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.rows);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'RailCars');
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
   showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
}
