import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PickListFilterOptions } from 'primeng/picklist';
import { Utils } from '../utils';
import { GeneralService } from '../general.service';
import { FieldsetModule} from 'primeng/fieldset';
import { SelectItem, PrimeNGConfig} from 'primeng/api';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-dummy-contract',
  templateUrl: './dummy-contract.component.html',
  styleUrls: ['./dummy-contract.component.css']
})
export class DummyContractComponent {
  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedDummies: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  Dummies: any = [];
  Dummy: any;
  submitted: boolean = false;
  grades: any = [];
  uploadedFiles: any[] = [];
  myDate = new Date();
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  userscols:any=[];
  commodities:any=[];
  countryrows:any=[];
  targetusers:any=[];
  usersDialogue:boolean=false;
  Ports:any=[];
  PrdIns:any=[];
  shpcommodity:any=[];
  prdcommodity:any=[];
  selectedpins:any=[];
  updateObject:any=[];
  selectedProduct:any={};
  prdcols:any=[];
  selectedShp:any={};
  Shpcols:any = [];
  selectedSins:any=[];
  books:any=[];
  selectedbook:any={};
  bookcols:any=[];
  Vareity:any=[];
  Vareitycols:any=[];
  filteredvariety:any=[];
  Prdinstructs:any=[];
  newcontractbatch: any;
  DummyBatchrows:any=[];
  DummyBatchcols:any=[];
  mywindow: any = window;
  myjson:any=JSON;
  DummySales:any=[];
  hasdumysp:Boolean = false;
  DummySplit:any=[];
  DMAXID:any=[];

  constructor(private router: Router, private primengConfig: PrimeNGConfig,private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe) 
    {
      
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
        if(!this.loggedinuser)
      {
        this.router.navigateByUrl('/app-login');
      }
      this.primengConfig.ripple = true;
      this.getDummy();
      this.getcountries();
      this.getports();
      this.getCommodities();
      this.getGrades();
      //this.getbookings();
      this.getvariety();
      this.getDummyMaxid();
      //this.getPrdInstruct();

    }
    clear(table: Table) 
  {
    table.clear();
  }
    getDummyMaxid()
    {
       //.....Get MAX id for Dummy................................
       let param: any = {};
       param.op = "query";
       param.query = "select MAX(id) as maxid from vw_DummyContractsView;";
       let headers = new HttpHeaders();
     
     let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
     
     this.http.post(url, param, {headers: headers}).subscribe(
       (res) => 
       {
         console.log(res);
         var response: any = res;
         if(response.success){
           this.DMAXID = response.result.queryresult;
          console.log(this.DMAXID);
          this.DMAXID.forEach((element:any)=>{
            console.log(element.maxid);
            this.DMAXID.maxid=Number(element.maxid);
            this.DMAXID.maxid = +element.maxid+1;
            
          });
          console.log(this.DMAXID.maxid);
          
         
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
 //..............................................
    }
    getDummybatch()
    {
      console.log("selectedrow",this.selectedDummies);
     
     if (this.selectedDummies)
     {
          this.blockedPanel=true;
          let param: any = {};
          param.op = "query";
          param.query = "select * from vw_DummyBatchContract where Contractnumber='" + this.selectedDummies.Contractnumber + "';";
          let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success){
              this.DummyBatchrows = response.result.queryresult;
              console.log("Dummybatchrows",this.DummyBatchrows.length)
              if(this.DummyBatchrows.length>0)
              {
                //this.hasdumysp =true;
                this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.ExistingData);    
              }
              else
              {
                //this.hasdumysp=false;
                this.addDummyBatch();
              }
              
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
    }
    getPrdInstruct()
    {
      this.blockedPanel=true;
        let param: any = {};
          param.op = "query";
          param.query = "select * from vw_Productioninstructions;";
          let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success){
              this.Prdinstructs = response.result.queryresult;
              console.log(this.Prdinstructs)
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
      getbookings()
    {
      let param: any = {};
      param.op = "query";
      param.query = "select * from vw_BookingShipline where DischargePort =" + this.Dummy.DestinationPort + ";";
     console.log(param.query);
     
      let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.bookcols = response.result.cols[0];
            //this.rows = response.result.queryresult;
            this.books = response.result.queryresult;
            console.log(this.books)
            //console.log(this.cols.toString())
            //this.tablefilter = this.cols.toString();
          }
        },response => {
          console.log("Post call in error", response);
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      },
      () => {
          console.log("The Post observable is now completed.");
      })
    }
    getshpcommodity()
    {
      let termparam: any = {};
      termparam.op = "query";
      termparam.query = "select * from vw_ShpCommodity where Commodityid =" + this.Dummy.Commodityid + ";";
      let termheaders = new HttpHeaders();
    
    let termurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(termurl, termparam, {headers: termheaders}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.shpcommodity = response.result.queryresult;
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
    },
    () => {
        console.log("The Post observable is now completed.");
        
    });
    }
    getprdcommodity()
    {
      let termparam: any = {};
      termparam.op = "query";
      termparam.query = "select * from vw_PrdCommodity where Commodityid =" + this.Dummy.Commodityid + ";";
      let termheaders = new HttpHeaders();
    
    let termurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(termurl, termparam, {headers: termheaders}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.prdcommodity = response.result.queryresult;
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
    },
    () => {
        console.log("The Post observable is now completed.");
        
    });
    }
  
  getports()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_DischargePorts;";
    let headers = new HttpHeaders();
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.Ports = response.result.queryresult;
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
  setProductionInstructValueFromService()
{
  if(!this.selectedpins)
    return;
  let selectedObject = this.selectedpins;
  let sourceObject  = this.generalservice.sourceObject;
  console.log("service selected object", this.selectedpins);
  
  this.Dummy.forEach((element: any,index: number)=>{
    if(element.id == this.generalservice.sourceObject.id)
      this.Dummies[index].prodinstructid = this.selectedpins.id;
  });
  
  // this.generalservice.sourceObject
}
clearValueOnService()
{
  this.generalservice.selectedObject = {};
}
onRowpOVSelect(event:any, op: OverlayPanel, Dummy:any) {
    
  console.log(event);
  Dummy.prodinstructid = event.data.id;
  console.log(Dummy);
  
    //this.generalservice.sourceObject = Dummy;
    op.hide();
}
onRowBSelect(event:any, bop: OverlayPanel, Dummy:any) {
    
  console.log(event);
  Dummy.Bookingid = event.data.id;
  console.log(Dummy);
  
    //this.generalservice.sourceObject = Dummy;
    bop.hide();
}
onRowOVSelect(event:any, sop: OverlayPanel, Dummy:any) {
    
  console.log(event);
  Dummy.Shipinstructid = event.data.id;
  console.log(Dummy);
  
    //this.generalservice.sourceObject = Dummy;
    sop.hide();
}
getvariety()
{
  this.blockedPanel=true;
  let param: any = {};
    param.op = "query";
    param.query = "select * from vw_Wrx_Variety;";
    let headers = new HttpHeaders();
  
  let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
  
  this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success){
        this.Vareitycols = response.result.cols[0];
        this.Vareity = response.result.queryresult;
        console.log(this.rows)
        console.log(this.cols.toString())
        this.tablefilter = this.cols.toString();
        // this.getprdinstruct(id);
        // this.getshipinstruct(id);
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
  getcountries()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Countries;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        { 
          this.countryrows = response.result.queryresult; 
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
    },
    () => {
        console.log("The Post observable is now completed.");
        
    });
  }
  filtervarietybycommodity(commodityid:number)
  {
    console.log(commodityid);
    
    this.filteredvariety=this.Vareity.filter((item:any) => item.commodityid == commodityid);
    console.log(this.filteredvariety);
    this.getprdcommodity();
    this.getshpcommodity();
  }
  getCommodities()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_CommodityCreation;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          
          this.commodities = response.result.queryresult;
         
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
  getGrades()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_GradeMap;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        { 
          this.grades = response.result.queryresult;
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
  getDummy()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_DummyContractsView;";
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
          console.log(this.cols.toString())
          this.tablefilter = this.cols.toString();
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
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  addDummyBatch()
    {

      console.log("The Selected Dummeis", this.selectedDummies);
//Required to add to Sales contract
      let DummySalesContract:any = {};
      //this.selectedDummies.forEach((element:any)=>{
        DummySalesContract.Commodityid = Number(this.selectedDummies.Commodityid);
        DummySalesContract.Gradeid = Number(this.selectedDummies.Gradeid);
        DummySalesContract.createdby = Number(this.loggedinuser.Uid);
        DummySalesContract.createdon = this.myDate;
        DummySalesContract.modifiedby=Number(this.loggedinuser.Uid);
        DummySalesContract.modifiedon =  this.myDate //this.createbatchId();
        DummySalesContract.Contractdate =  this.myDate
        DummySalesContract.Ownerid = this.loggedinuser.Uid;
        DummySalesContract.Closed = 0;
        DummySalesContract.Quantity = Number(this.selectedDummies.Quantity);
        DummySalesContract.Cancel=0;
        DummySalesContract.Price=1;
        DummySalesContract.ContractStatus=7;
        DummySalesContract.varietyid= Number(this.selectedDummies.varietyid);
        DummySalesContract.Contractnumber = this.selectedDummies.Contractnumber;
        DummySalesContract.Portdischargeid = Number(this.selectedDummies.DestinationPort);
        DummySalesContract.DestinationCountry = Number(this.selectedDummies.DestinationCountry);
        DummySalesContract.Unitid=1;
        DummySalesContract.Currencyid=1;
      //});

//SQL to insert the Dummy Contract into the SQL
    console.log("Try New Contract",DummySalesContract);
    this.blockedPanel=true;
    let DummSalurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
    console.log(DummSalurl);
    let DummSalparam: any = {};
    DummSalparam.op = "create";
    DummSalparam.entity = "Wrx_SalesContracts";
    DummSalparam.attributes = DummySalesContract;
    let DummSalheaders = new HttpHeaders();
    this.http.post(DummSalurl, DummSalparam, {headers: DummSalheaders}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'New Dummy Contract Created', life: 3000});
            this.getDummyContract();  
    //................................................
  }else{
    this.messageService.add({severity:'error', summary: 'Failed', detail: 'New Dummy Contract Not Created', life: 3000});
    return;
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
    getDummyContract()
    {
      //SQL to get the Contract ID
      let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_SalesContracts where contractnumber ='" + this.selectedDummies.Contractnumber + "';";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          
          this.DummySales = response.result.queryresult;
          console.log("Dummysales", this.DummySales)
         //Required to add the Splits
              let newcontractbatch:any = {};
              //this.selectedDummies.forEach((element:any)=>{
                newcontractbatch.Contractid = this.DummySales[0].id;
                newcontractbatch.Bookingid = this.selectedDummies.Bookingid;
                newcontractbatch.prodinstructid = this.selectedDummies.prodinstructid;
                newcontractbatch.Shipinstruct = this.selectedDummies.Shipinstructid;
                newcontractbatch.UserComments="Dummy Batch";
                newcontractbatch.SplitNo =  this.selectedDummies.Contractnumber + "_1" //this.createbatchId();
                newcontractbatch.Source = 4;
                newcontractbatch.Sourceid = 4;
                newcontractbatch.CalcQuantity = this.selectedDummies.Quantity;
              //});
                
                
          //SQL to insert the Dummy batch into the SQL
            console.log("Try New Batch",newcontractbatch);
              this.blockedPanel=true;
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
              console.log(url);
              let param: any = {};
              param.op = "create";
              param.entity = "Wrx_BatchContract";
              param.attributes = newcontractbatch;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
              (res) => 
              {
                console.log(res);
                var response: any = res;
                if(response.success)
                {
                  this.messageService.add({severity:'success', summary: 'Successful', detail: 'New Dummy Split Created', life: 3000});
                this.getDummyBatchid();

                }else{
                  this.messageService.add({severity:'error', summary: 'Failed', detail: 'New Dummy Split Not Created', life: 3000});
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
           
            //...............................
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
    getDummyBatchid()
    {

      let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_BatchContract where Contractid ='" + this.DummySales[0].id + "';";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          
          this.DummySplit = response.result.queryresult;
          console.log("Dummysales", this.DummySplit)
       //.....................................................
            //...SQL insert in Transaction
            let TransContract:any = {};
            //this.selectedDummies.forEach((element:any)=>{
              TransContract.Splitno = this.DummySplit[0].id;
              TransContract.ContractId = this.DummySales[0].id;
              TransContract.Contractquantity = this.selectedDummies.Quantity;
              TransContract.Shippedquantity = 0;
              TransContract.DestinationCountry=this.selectedDummies.DestinationCountry;
               //this.createbatchId();
             
            //});

          //SQL to insert the Dummy batch into the SQL
            console.log("Try New Batch",TransContract);
            this.blockedPanel=true;
            let TransContracturl = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
            console.log(TransContracturl);
            let TransContractparam: any = {};
            TransContractparam.op = "create";
            TransContractparam.entity = "Wrx_TransContract";
            TransContractparam.attributes = TransContract;
            let TransContractheaders = new HttpHeaders();
            this.http.post(TransContracturl, TransContractparam, {headers: TransContractheaders}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'New Dummy Split Created', life: 3000});
              
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'New Dummy Split Not Created', life: 3000});
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
                      });
                      //......................................
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
  saveDummy()
  {
    this.submitted = true;
      
        if (this.Dummy.Contractnumber && this.Dummy.Contractnumber.trim()) 
        {
            if (this.Dummy.id) 
            {
              this.Dummies[this.findIndexById(this.Dummy.id)] = this.Dummies;
              this.Dummy.modifiedby = this.loggedinuser.Uid;
              this.Dummy.modifiedon = this.myDate;
              
              delete this.Dummy.MUName;
              delete this.Dummy.CUName;
              delete this.Dummy.Commodity;  
              delete this.Dummy.BookingRef;
              delete this.Dummy.TransID;
              delete this.Dummy.Plant;
              delete this.Dummy.LineName;
              delete this.Dummy.variety;
              delete this.Dummy.Grade;
              delete this.Dummy.DestCountry;
              delete this.Dummy.DestPort;

              this.blockedPanel=true;
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.Dummy.id};
              param.entity = "Wrx_DummyContracts";
              param.attributes = this.Dummy;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                   console.log("This dummy", this.Dummy);
                    
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Dummy Updated', life: 3000});
                    this.getDummy();
                    this.getDummyMaxid();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Dummy Not Updated', life: 3000});
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
            else
            {
             if(this.rows.find((element:any)=>element.Name==this.Dummy.Contractnumber))
              {
                this.Dummy.Contractnumber = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Dummy Name Exist', life: 3000});
                return;
              }
                this.Dummy.Contractnumber = this.createId();
                //this.Dummy.status = true;
                this.Dummy.modifiedby = this.loggedinuser.Uid;
                this.Dummy.modifiedon = this.myDate;
                this.Dummy.createdby = this.loggedinuser.Uid;
                this.Dummy.createdon = this.myDate;

                delete this.Dummy.MUName;
                delete this.Dummy.CUName;
                delete this.Dummy.Grade;
                delete this.Dummy.Commodity;  
                delete this.Dummy.BookingRef;
                delete this.Dummy.TransID;
                delete this.Dummy.Plant;
                delete this.Dummy.LineName;
                delete this.Dummy.variety;
                delete this.Dummy.DestCountry;
                delete this.Dummy.DestPort;

                //console.log(myjsonobj);

  //SQL to create Dummy
                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_DummyContracts";
                param.attributes = this.Dummy;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Dummy Contract Created', life: 3000});
                    
                    this.getDummy();
                    this.getDummyMaxid();
                        //adding the contract split dummy.
            
          }
          else
          {
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Dummy Contract Not Created', life: 3000});
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
                        });
            }
//SQL finish create...........................................................................................................
            //this.Dummies = [...this.Dummies];
            this.addNewDialogue = false;
            this.Dummy = {};
    }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.Dummies.length; i++) 
    {
      if (this.Dummies[i].id === id) 
      {
        index = i;
        break;
      }
    }

    return index;
  }
  createbatchId(): string 
  {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    id = '';
    //for ( var i = 0; i < 5; i++ ) {

        id += this.Dummy.Contractnumber + '-1'  //chars.charAt(Math.floor(Math.random() * chars.length));
    //}
    return id;
  }
  createId(): string 
  {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var Suffix = 'DUMMY_';
    id = 'DUMMY_';
    
      
      id += (this.DMAXID.maxid!=undefined)?this.DMAXID.maxid:3000;
      console.log(id);
      

    return id;
   
  }
  generateCode(): string 
  {
    let Code = '';
    var Suffix = 'DUMMY_';
    
    
    for ( var i = 0; i < 5; i++ ) {
        Code += Suffix + Math.random()*100;
    }
    return Code;
  }
  deleteSelectedDummy(dumm: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + dumm.Contractnumber + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.Dummies = this.rows.filter(val => val.id !== dumm.id);
          //dumm = {};
          //Delete SQL Database
          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:dumm.id};
          param.entity = "Wrx_DummyContracts";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Dummy Contract Deleted', life: 3000});
                this.getDummy();
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
          //End of Delete Database
      }
  });
  }
  editDummy(dumm: any)
  {
    this.submitted = true;
    this.Dummy = {...dumm};
    console.log(this.Dummy)
    this.addNewDialogue = true;
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  addNew()
  {
      this.Dummy = {};
      this.selectedSins = {};
      this.selectedpins={};
      this.selectedbook = {};
      this.Dummy.Contractnumber = this.createId();
      this.submitted = false;
      this.addNewDialogue = true;
  }
}
