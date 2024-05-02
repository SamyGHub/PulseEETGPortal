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
  selector: 'app-do-x',
  templateUrl: './do-x.component.html',
  styleUrls: ['./do-x.component.css'],
  providers: [DialogService, MessageService]
})
export class DoXComponent {
  
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
      this.getDumpExcelfile();

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
    Dumprows:any=[];
    Insurance:any[]=[];
    myjson:any=JSON;
    mywindow: any = window;
    blockedPanel: boolean = false;
    position: string = "";
    displayPosition: boolean=false;
    dialougmessage: string ="";
    tablefilter: string = "";
    
    commodities: any = [];

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
  
  getDumpExcelfile()
  {
    
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
          this.Dumprows = response.result.queryresult;
          
          this.Dumprows.forEach((element:any,index:number)=>{
            this.Dumprows[index].Contractdate = new Date(element.Contractdate);
            this.Dumprows[index].Quantity = Number(element.Quantity);
            this.Dumprows[index].CalcQuantity = Number(element.CalcQuantity);
            this.Dumprows[index].Price = Number(element.Price);
            this.Dumprows[index].Amount = Number(element.Amount);
            this.Dumprows[index].Paymentreceived = Number(element.Paymentreceived);
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
  getContractSplits()
  {
    this.blockedPanel=true;
    if (this.loggedinuser.id!=1){
        let param: any = {};
        param.op = "query";
        param.query = "select * from vw_SplitContractDox;"//where ownerid=" + this.loggedinuser.Uid + ";";
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
              this.rows[index].Contractdate = new Date(element.Contractdate);
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
      param.query = "select * from vw_SplitContractDox;";
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
            this.rows[index].Contractdate = new Date(element.Contractdate);
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
  onRowSave(Doxobj:any)
  {
    this.blockedPanel=true;
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
    console.log(url);
    let param: any = {};
    param.op = "create";
    param.entity = "Wrx_Dox";
    param.attributes = Doxobj;
    let headers = new HttpHeaders();
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'New Dox Created', life: 3000});
        this.getContractSplits();
      }else{
        this.messageService.add({severity:'error', summary: 'Failed', detail: 'Dox Not Created', life: 3000});
      }
    },response => 
        {
          console.log("Post call in error", response);
          this.blockedPanel=false;      
        },
        () => {
                console.log("The Post observable is now completed.");
                this.blockedPanel=false;
              })
  }

  myUploader(event:any)
  {
    this.uploadedFiles= [];
    for(let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles);
      //this.commodity.image = this.uploadedFiles[0].name;
      //console.log(this.commodity);
    }

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
  isRowSelectable(event:any) {
    return (event.data.id)? true : false;
  }
  onRowSelect(event: any) {
    if(!this.updateObject.find((obj: any)=>obj.id==event.data.id))
      this.updateObject.push(event.data);
    console.log(this.updateObject);
    
    this.messageService.add({key: 'toast01',severity:'info', summary:'Product Selected', detail: event.data.id});
}
  onRowUnselect(event: any) {
    this.messageService.add({key: 'toast01',severity:'info', summary:'Product Unselected',  detail: event.data.Transloader});
}
  saveDoxobj()
  {
    this.submitted = true;
      
        if (this.Doxobj.splitno && this.Doxobj.splitno.trim()) 
        {
            if (!this.Doxobj.splitno) 
            {
              // this.Doxobjs[this.findIndexById(this.Doxobj.splitno)] = this.Doxobjs;
              // this.Doxobj.modifiedby = this.loggedinuser.id;
              // this.Doxobj.modifiedon = this.myDate;

              // let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              // console.log(url);
              // let param: any = {};
              // param.op = "update";
              // param.entityid={splitno:this.Doxobj.splitno};
              // param.entity = "Wrx_Dox";
              // param.attributes = this.Doxobj;
              // let headers = new HttpHeaders();
              // this.http.post(url, param, {headers: headers}).subscribe(
              //  (res) => 
              //   {
              //     console.log(res);
              //     var response: any = res;
              //     if(response.success)
              //     {
              //       this.messageService.add({severity:'success', summary: 'Successful', detail: 'Dox for Split Updated', life: 3000});
              //     }else{
              //       this.messageService.add({severity:'error', summary: 'Failed', detail: 'Dox for Split Not Updated', life: 3000});
              //     }
              //   },response => 
              //     {
              //      console.log("Post call in error", response);    
              //     },
              //       () => 
              //     {
              //      console.log("The Post observable is now completed.");
              //     })
                   
            }
            else
            {
              console.log(this.Doxobj);
              
                //this.Doxobj.id = this.createId();
                this.Doxobj.modifiedby = this.loggedinuser.Uid;
                this.Doxobj.modifiedon = this.myDate;
                this.Doxobj.createdby = this.loggedinuser.Uid;
                this.Doxobj.createdon = this.myDate;
           //SQL to create Doxobj
           this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_Dox";
                param.attributes = this.Doxobj;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Doxobj Created', life: 3000});
                    this.getContractSplits();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Doxobj Not Created', life: 3000});
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
                  this.Doxobj = {};
    }
  }

  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.Doxobjs.length; i++) 
    {
      if (this.Doxobjs[i].id === id) 
      {
        index = i;
        break;
      }
    }
    return index;
  }
  UpdateDox()
  {

  }
  addDox(rowData:any)
  {
    let Doxobj:any = {};
    this.Doxobj.SplitNo = rowData.id
    this.submitted = false;
    this.addNewDialogue = true;
    console.log(this.Doxobj);
  }
  addNew()
  {
      this.Doxobj = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  exportExcel()
  {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.Dumprows);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'DoXDump');
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
