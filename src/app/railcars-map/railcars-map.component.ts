import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import { OverlayPanelModule} from 'primeng/overlaypanel';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {TooltipModule} from 'primeng/tooltip';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-railcars-map',
  templateUrl: './railcars-map.component.html',
  styleUrls: ['./railcars-map.component.css'],
  providers: [DialogService, MessageService, DatePipe]
})
export class RailcarsMapComponent {
  RailCarsMap:any []= [];
  RailCarMap:any={};
  loggedinuser: any;
  myDate: any = new Date ();
  Railobjs:any[]=[];
  Railobj:any={};
  updateObject: any = [];
  selectedrailcar:any;
  submitted: boolean = false;
  books:any[]=[];
  Pkages:any[]=[];
  cols: any [] = [];
  uploadedFiles: any[] = [];
  blockedPanel: boolean = false;
  fileReaded: any;
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  mymessages:any = [];
  viewme:boolean=false;
  commodities:any = [];

  constructor(private generalservice: GeneralService,
  private http: HttpClient,
  private route: ActivatedRoute,
  private router: Router,
  private messageService: MessageService, private confirmationService: ConfirmationService, private datePipe: DatePipe, public dialogService: DialogService)
  {
    this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
    
  }
  ngOnInit(): void 
  {
    this.getRailCars();
    this.getCommodities();
  }
  

showPositionDialog(position: string, message: string) 
    {
      this.dialougmessage = message;
      this.position = position;
      this.displayPosition = true;
    }
  Clear()
  {
    //delete json and database from raw
    this.confirmationService.confirm({
    message: 'Are you sure you want to Clear RailCars Data ?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
        
        //Delete SQL Database
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/clearRailCarsData";
        console.log(url);
        let param: any = {};
        param.op = "clearRailCarsData";
        param.userid = this.generalservice.loggeduser.id;
        
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.Railobjs= [];
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'RailCars Data Cleared', life: 3000});
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Network Connection Error', life: 3000});
            }
          },response => 
            {
            console.log("Post call in error", response);  
            this.blockedPanel=false;
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
          },
              () => 
            {
            console.log("The Post observable is now completed.");
            this.blockedPanel=false;
            })
          }
        })
      }
  getRailCars()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select * from vw_RailCarCommodity;";
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
            this.Railobjs = response.result.queryresult;
            console.log(this.Railobjs)
          }
          else
          {
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Network Connection Error', life: 3000});
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
  addRailCarMap()
  {
    let RailCarMap:any = {};
        //importpermit.Contractid = this.product.Contractid;
            
        //RailCarMap.splitno = this.updateObject.SplitNo;
        RailCarMap.RailCarid = 0;
        RailCarMap.Pkageid = 0;
        RailCarMap.containerid = 0;
        RailCarMap.Tonnage = 0;
        RailCarMap.sealno = 0;
        RailCarMap.bookingid = 0;
        RailCarMap.VGM = 0;
        RailCarMap.Shipdate = 0;
        RailCarMap.Expiredate = 0;
        RailCarMap.balancetomap = 0;
        //RailCarMap.contractid = this.product.Contractnumber;
        this.RailCarsMap = [...this.RailCarsMap,RailCarMap];
  }
  saveDataR(RailCarMap:any)
  {
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
    console.log(url);
    let param: any = {};
    param.op = "create";
    param.entity = "Wrx_RailCarsMaster";
    param.attributes = RailCarMap;
    let headers = new HttpHeaders();
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'New RailCar Mapped', life: 3000});
        this.getRailCars();
      }else{
        this.messageService.add({severity:'error', summary: 'Failed', detail: 'RailCar Not Mapped', life: 3000});
      }
    },response => 
        {
          console.log("Post call in error", response);      
        },
        () => {
                console.log("The Post observable is now completed.");
              })
  }
  UpdateRailCarMap()
    {
      if(this.updateObject && this.updateObject.length>0)
    {
      this.submitted = true;
          
      //this.commodities[this.findIndexById(this.shipinstruct.id)] = this.commodities;
      this.updateObject.forEach((element: any) => {
        element.modifiedby = this.loggedinuser.id;
        element.modifiedon = this.myDate;
        //element.Contractid = this.product.Contractid
      });
      
      console.log(this.updateObject);
      this.blockedPanel=true;

      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/updateMultiple";
      console.log(url);
      let param: any = {};
      param.op = "updateMultiple";
      //param.entityid={id:this.updateObject.id};
      param.entity = "Wrx_RailCars";
      param.attributes = this.updateObject;
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'RailCarMap Updated', life: 3000});
            this.getRailCars();
            this.updateObject = {};
          }else{
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'RailCarMap Not Updated', life: 3000});
          }
        },response => 
          {
            console.log("Post call in error", response);
            this.blockedPanel=false;
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
          },
            () => 
          {
            console.log("The Post observable is now completed.");
          })
        }
    }
    isRowSelectable(event:any) {
      return (event.data.id)? true : false;
    }
    onRowUnselect(event: any) 
    {
      this.messageService.add({key: 'toast01',severity:'info', summary:'RailCar Unselected',  detail: event.data.Transloader});
    }
    getPackages()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Packages;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.Pkages = response.result.queryresult;
          console.log(this.Pkages)
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
    },
    () => {
        console.log("The Post observable is now completed.");
        
    })
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
  csv2Array(fileInput: any)
 {
      this.blockedPanel = true;
      //read file from input
      this.fileReaded = fileInput.files[0];
      
      let reader: FileReader = new FileReader();
      reader.readAsText(this.fileReaded);
      
      reader.onload = (e) => {
    if(reader.result)
    {
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
          console.log(allTextLines.length);
  
        for (let i = 0; i < allTextLines.length-1; i++) 
        {  
          if(i>0)
          {
            let RailCars: any = {};
            let data = allTextLines[i].split(';');
            console.log(data);
              
            for (let j = 0; j < headers.length; j++) 
            {
              headers[j] = headers[j].trim();
              switch(headers[j])
              {
                case "ship-date":
                  headers[j] = "shipdate";
                  break;
                case "lading-num":
                  headers[j] = "ladingnum";
                  break;
                case "car #":
                  headers[j] = "carnumber";
                  break;
                case "origin-name":
                  headers[j] = "originname";
                  break;
                case "product-no":
                  headers[j] = "productno";
                  break;
                case "pk-unit-code":
                  headers[j] = "pkunitcode";
                  break;
                case "shipped-qty":
                  headers[j] = "shippedqty";
                  break;
                case "addr-number":
                  headers[j] = "transloaderid";
                  break;
                case "ship-to-info":
                    headers[j] = "shiptoinfo";
                    break;
                case "Carrier Name":
                  headers[j] = "CarrierName";
                  break;
                case "Bin Number":
                  headers[j] = "BinNumber";
                  break;
                case "Ship Unit Desc":
                  headers[j] = "ShipUnitDesc";
                  break;
                case "Packing Units":
                  headers[j] = "PackingUnits";
                  break;
                case "Product Name":
                  headers[j] = "ProductName";
                  break;
                case "Pack unit Desc":
                  headers[j] = "PackunitDesc";
                  break;
                case "Routing Info":
                  headers[j] = "RoutingInfo";
                  break;
              }
              if(headers[j]=="shippedqty")
              {
                RailCars[headers[j]] = Number(data[j].trim());
              }
              else if(data[j] && (headers[j] == "ladingnum" || headers[j]=="originname" || headers[j]=="carnumber" || headers[j]=="shiptoinfo" 
               || headers[j]=="productno" || headers[j]=="pkunitcode" || headers[j]=="transloaderid"))
              {
                data[j] = data[j].replace(/[^\w\s]/gi, "");
                RailCars[headers[j]] = data[j].trim();
              }
              else if(headers[j] == "company" || headers[j]=="contract-num" || headers[j]=="xref-qty" || headers[j]=="invoiced-qty" || headers[j]=="invoice-num" 
              || headers[j]=="Invoice-date" || headers[j] =="Bal Cost" || headers[j]=="tot-inv-qty" || headers[j]=="frght-ppd-by" 
              || headers[j] =="dest-type" || headers[j]=="user-id" || headers[j] == "cust-cons-name" || headers[j]=="Grade Code" || headers[j]=="Issued Date" 
              || headers[j]=="Short-uom-code" || headers[j]=="branch-code" || headers[j]=="cust-no" || headers[j]=="totinv-qty" || headers[j]=="Bal Cost")
              {
                continue;
              }
              else if(headers[j]=="ProductName" || headers[j]=="PackunitDesc")
              {
                RailCars[headers[j]] = data[j].trim();
              // console.log("sales contract", salescontract);
              }
              else if(headers[j]=="shipdate" && data[j].trim()!="")
              {
                RailCars[headers[j]] = new Date(data[j].trim());
              }
              else
              {
                RailCars[headers[j]] = (data[j])? data[j].trim():"";
              }

            }

            if ( RailCars.shipdate=="" ) //RailCars.shiptoinfo.includes("ETG COMMODITIES INC")==false |||| RailCars.RoutingInfo.includes("TRANSFER")
            {
              continue;
            }
            console.log("line", RailCars);        
            lines.push(RailCars);
        
      }
   }
  //  console.log(lines.length);
   
   // all rows in the csv file 
   //console.log(">>>>>>>>>>>>>>>>>", lines);
   if(lines.length>0){
    this.Railobjs = lines;
    this.uploadImportedRecords();
    
    let hasDuplicate=this.Railobjs.some((item, id)=>{ 
      if(this.Railobjs.indexOf(item) != id)
        return item;
    });
    console.log("hasduplicates", hasDuplicate);
   }
   console.log("RailsObjs", this.Railobjs);
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
      param.entity = "Wrx_RailCarsMaster";
      param.attributes = this.Railobjs;
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
          console.log(res);
          var response: any = res;
          if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'RailCars Data Imported.', life: 3000});
              this.getRailCars();
              //this.processRailCars();
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'RailCars Data Failed to Upload', life: 3000});
            }
          },response => 
            {
              console.log("Post call in error", response);
              this.blockedPanel=false;
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            },
            () => {
                   console.log("The Post observable is now completed.");
                   this.blockedPanel = false;
                  })
       }
processRailCars()
{
  console.log("ProcessME", this.Railobjs);
  
  this.confirmationService.confirm({
    message: 'Are you sure you want to Process Selected RailCars ?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.blockedPanel=true;
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/processRailCars";
      console.log(url);
      let param: any = {};
      param.op = "processRailCars";
      param.entity = "Wrx_RailCarsMaster";
      param.userid = this.generalservice.loggeduser.Uid;
      param.ownerid = this.generalservice.loggeduser.Uid //this.generalservice.getAssignedUser();
      param.attributes = this.Railobjs;

      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
          console.log(res);
          var response: any = res;
          if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'RailCars has been processed.', life: 3000});
              this.mymessages = response.result.mymessages;
              if (this.mymessages.length)
              this.viewme= true;
              this.getRailCars();
            }
            else
            {
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
            }
          },response => 
            {
              console.log("Post call in error", response);
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
              //this.messageService.add({key: 'tc', severity:'error', summary: 'Failure', detail: 'Network Connection issue::::' + response.message, life: 3000});
              this.blockedPanel=false;
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            },
            () => {
                  console.log("The Post observable is now completed.");
                  this.blockedPanel = false;
                  })
          }
        }) 
  }
  exportExcel()
  {
        
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.Railobjs);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'RailCarsUpload');
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
