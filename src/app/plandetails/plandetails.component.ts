import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import { OverlayPanel, OverlayPanelModule} from 'primeng/overlaypanel';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';

import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-plandetails',
  templateUrl: './plandetails.component.html',
  styleUrls: ['./plandetails.component.css'],
  providers: [DialogService, MessageService, DatePipe]
})
export class PlandetailsComponent {
  loggedinuser: any;
  myDate: any = new Date ();
  product: any = {};
  bookings: any[] = [];
  prodinstructs: any[] = [];
  newcontractbatch: any;
  batches:any[]=[];
  books:any[]=[];
  batch:any;
  submitted: boolean = false;
  addNewDialogue = false;
  selectedbatch:any;
  selectedInstruction: any = {};
  blockedPanel: boolean = false;
  updateObject: any = [];
  Shipinstructs:any[]=[];
  Prdinstructs:any=[];
  myjson:any=JSON;
  mywindow: any = window;
  addNewDialogueR: boolean = false;
  DummyContract:any=[];
  Dumcols:any=[];
  Xid: any;
  Doxobj:any={};
  Doxobjs:any[]=[];
  ShipselectedInstruction: any = {};
  Railobjs:any[]=[];
  Railobj:any={};
  ImportPrmits:any[]=[];
  ImportPrmit:any = {};
  uploadedFiles: any[] = [];
  isDisabled:boolean = true;
  isplanned: boolean = false;
  IsActualTransaction: boolean=true;
  ref: DynamicDialogRef = new DynamicDialogRef;
  Notes:string = '<div>Hello World!</div><div>PrimeNG <b>Editor</b> Rocks</div><div><br></div>';
  RailCarsMap:any []= [];
  RailCarMap:any={};
  Pkages:any[]=[];
  selectedRailcarmap:any;
  lastTotal: number = 0;
  Remaining: number = 0;
  ActualTransaction: any[]=[];
  ActualCols:any[]=[];
  batchcols:any[]=[];
  AcRemaining: number = 0;
  AclastTotal: number = 0 ;
  importcols:any=[];
  ActualupdateObject:any=[];
  EntityId: string = "";
  OwnerName: string = "";
  OwnerId: string = "";
  EntityType: string = "";
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  bdg: number = 0;
  planned: number = 0;
  QtyPln:number = 0;
  stopCalc:number =0;
  PurCols:any=[];
  Purchases:any=[];
  WrxSourceCols:any=[];
  WrxSourceData:any=[];
  prdTemprows:any=[];
  prdTempcols:any=[];
  selectedprod:any=[];
  selectedpins:any=[];
  selectedpkg:any;
  seltrans:any={};
  termtrans:any=[];
  seltrm:any={};
  WrxSplitData:any=[];
  visible:boolean=false;
  ChkCountry:any=[];
  addNewDialogueATT:boolean=false;
  prdcommodity:any=[];
  shpcommodity:any=[];
  ShpTemprows:any=[];
  ShpTempcols:any=[];
  selectedpu:any = [];
  selecteddu:any=[];
  commodities:any=[];
  DummyDetailContract:any=[];
  Descountry:any=[];
  Ports:any=[];
  seldateto:any={};
  ConStats:any={};
  wrxconstatsmaster:any=[];
  OldSplit:any;
  Dumycls:any;
  bookdisp:any=[];
  selorigin:any={};
  origins:any=[];
  IDs:any=[];
  Subsplitcols:any =[];
  Subsplit:any =[];

  constructor(   
    public generalservice: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService, private confirmationService: ConfirmationService, public datePipe: DatePipe, public dialogService: DialogService) {
      this.loggedinuser = this.generalservice.getLoggedUser();
      console.log(this.loggedinuser);
      
      if(!this.loggedinuser)
      {
        //this.generalservice.removeLoggedUser();
        this.router.navigateByUrl('/app-login');
      }
      
      if(this.route.snapshot.queryParamMap.get("product"))
      {
        let productstring = this.product = this.route.snapshot.queryParamMap.get("product");
        
        if(productstring){
          this.product = JSON.parse(atob(productstring));
          this.seldateto.Deliverytodate = new Date(this.product.Deliverytodate);
        }
      }
        console.log("Product print ---> ", this.product);
        let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
        
        let newcontractbatch:any = {};
         newcontractbatch.Bookingid = 0;
          newcontractbatch.prodinstructid = 0;
          newcontractbatch.Shipinstruct = 0;
          newcontractbatch.SlipNo = 0;
          newcontractbatch.Contractid = this.product.Contractid;
          newcontractbatch.prdinstruct={};
          newcontractbatch.UserComments="";
          
          //this.isRowSelectable = this.isRowSelectable.bind(this);
          this.EntityId = this.product.Contractid;
          this.OwnerId = this.loggedinuser.id;
          this.OwnerName = this.loggedinuser.Name;
          this.EntityType = "Planning";
          
      this.getbookings();
      this.getbatches();
      this.getshipinstruct();
      this.getPrdInstruct();
      this.getImports();
      this.getRailCars();
      this.getActualTransaction();
      this.getPurchase();
      this.getSource();
      this.getPackages();
      this.getSalesTrans();
      this.getSalesTrm();
      this.getPaymentTerms();
      this.getactualSplits();
      this.CheckImport();
      this.getprdcommodity();
      this.getshpcommodity();
      this.getDummyContract();
      this.getCommodities();
      this.getcountries();
      this.getports();
      this.getstatusmaster();
      this.getdeliveryto();
      this.getbookingdisplay();
      this.getorigins();
      

      //this.calculatequantity();
      ref: DynamicDialogRef;
    }
    strategicObjectiveSelect(event:any)
    {

    }
    strategicObjectiveUnselect(event:any)
    {

    }
    opendialogATT(Entityid:any)
    {
      this.EntityId = Entityid;     
      this.addNewDialogueATT = true;
    }
    getorigins()
    {
      this.blockedPanel=true;
      let param: any = {};
      param.op = "query";
      param.query = "select id, Origin from Wrx_Origin;";
      let headers = new HttpHeaders();
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.origins = response.result.queryresult;
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
    getports()
    {
      this.blockedPanel=true;
      let param: any = {};
      param.op = "query";
      param.query = "select id, PortName from Wrx_DischargePorts;";
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
    getcountries()
    {
      let param: any = {};
      param.op = "query";
      param.query = "select id, Name from Wrx_Countries;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.Descountry = response.result.queryresult;
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
    CheckImport() 
    {
      let termparam: any = {};
      termparam.op = "query";
      termparam.query = "select * from vw_ImportPermitCountry where id =" + this.product.DestinationCountry + ";";

      console.log(termparam.query);
      
      let termheaders = new HttpHeaders();
    
      let termurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(termurl, termparam, {headers: termheaders}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.ChkCountry = response.result.queryresult;
            if(this.ChkCountry.length!=0)
            {
                  console.log(this.ChkCountry[0].ImportPermit);
                  console.log(this.product.DestinationCountry);
            
                  if(this.ChkCountry[0].id === this.product.DestinationCountry && this.product.DestinationCountry!==null)
                  {  if(this.ChkCountry[0].ImportPermit!=="False")
                    {
                      this.visible=true;
                    }else{
                      this.visible=false;
                    }
                    
                  }else{
                    this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.MatrixCountry);
                  }
              }else{
                this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.MatrixCountry);
              }
          }
        },response => {
          console.log("Post call in error", response);
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
      },
      () => {
          console.log("The Post observable is now completed.");
      });
    }
    deleteSelectedimport(Selimport:any)
    {
      this.confirmationService.confirm({
        message: 'Are you sure you want to Delete Selected?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          //this.rows = this.rows.filter(val => val.id !== grade.id);
          //this.grade = {};
          //Delete SQL Database
          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:Selimport.id};
          param.entity = "Wrx_ImportPermit";
          param.attributes=Selimport;

          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Import Permit Deleted', life: 3000});

              this.getImports();
                
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Import Permit Deleted', life: 3000});
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
          });
    }
    getshpcommodity()
    {
      let termparam: any = {};
      termparam.op = "query";
      termparam.query = "select * from vw_ShpCommodity where Commodityid =" + this.product.Commodityid + ";";
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
      termparam.query = "select * from vw_PrdCommodity where Commodityid =" + this.product.Commodityid + ";";
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
    getPaymentTerms()
    {
      let termparam: any = {};
      termparam.op = "query";
      termparam.query = "select * from Wrx_PaymentTerms;";
      let termheaders = new HttpHeaders();
    
    let termurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(termurl, termparam, {headers: termheaders}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.termtrans = response.result.queryresult;
          console.log(this.termtrans)
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
    },
    () => {
        console.log("The Post observable is now completed.");
        
    });
    }
    getSalesTrans()
    {
      this.seltrans={};
      let selparam: any = {};
      selparam.op = "query";
      selparam.query = "select ContractId, Configuration from Wrx_TransContract where ContractId=" + this.product.ContractId + ";";
      let selheaders = new HttpHeaders();
    
    let selurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(selurl, selparam, {headers: selheaders}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.seltrans = response.result.queryresult;
          console.log(this.seltrans)
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
    },
    () => {
        console.log("The Post observable is now completed.");
        
    });
   
    }
    getSalesOrigin()
    {
      this.seltrans={};
      let selparam: any = {};
      selparam.op = "query";
      selparam.query = "select id, Originid from Wrx_SalesContracts where id=" + this.product.ContractId + ";";
      let selheaders = new HttpHeaders();
    
    let selurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(selurl, selparam, {headers: selheaders}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.selorigin = response.result.queryresult;
          console.log(this.selorigin)
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
    },
    () => {
        console.log("The Post observable is now completed.");
        
    });
   
    }
    getSalesTrm()
    {
      this.seltrm={};
      let seltrmparam: any = {};
      seltrmparam.op = "query";
      seltrmparam.query = "select * from Wrx_SalesContracts where id=" + this.product.ContractId + ";";
      let seltrmheaders = new HttpHeaders();
    
      let selurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(selurl, seltrmparam, {headers: seltrmheaders}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.seltrm = response.result.queryresult;
            console.log(this.seltrm)
          }
        },response => {
          console.log("Post call in error", response);
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
      },
      () => {
          console.log("The Post observable is now completed.");
          
      });
   
    }
    UpdateTrm()
    {
      this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entityid={id:this.product.ContractId};
        param.entity = "Wrx_SalesContracts";
        param.attributes = this.seltrm[0];
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Payment Term Updated', life: 3000});
              //this.getCommodities();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Payment Term Not Updated', life: 3000});
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
            });
    }
    getstatusmaster()
    {
      //this.seldateto={};
      let selparam: any = {};
      selparam.op = "query";
      selparam.query = "select id, Statusname from Wrx_ContractStatusMaster;";
      let selheaders = new HttpHeaders();
    
    let selurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(selurl, selparam, {headers: selheaders}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.wrxconstatsmaster = response.result.queryresult;
          //console.log(this.seldateto)
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
    },
    () => {
        console.log("The Post observable is now completed.");
        
    });
    }
    getconstats()
    {
      //this.seldateto={};
      let selparam: any = {};
      selparam.op = "query";
      selparam.query = "select id, ContractStatus from Wrx_SalesContracts where id=" + this.product.ContractId + ";";
      let selheaders = new HttpHeaders();
    
    let selurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(selurl, selparam, {headers: selheaders}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.ConStats = response.result.queryresult;
          //console.log(this.seldateto)
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
    },
    () => {
        console.log("The Post observable is now completed.");
        
    });
   
    }
    UpdateConstats()
    {
      this.blockedPanel=true;
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
      console.log(url);
      let param: any = {};
      param.op = "update";
      param.entityid={id:this.product.ContractId};
      param.entity = "Wrx_SalesContracts";
      param.attributes = this.seltrm[0];
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Date Updated', life: 3000});
            this.getSalesTrm();
          }else{
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Date Not Updated', life: 3000});
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
          });
    }
    getdeliveryto()
    {
      this.seldateto={};
      let selparam: any = {};
      selparam.op = "query";
      selparam.query = "select id, Deliverytodate from Wrx_SalesContracts where id=" + this.product.ContractId + ";";
      let selheaders = new HttpHeaders();
    
    let selurl = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(selurl, selparam, {headers: selheaders}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          //this.seldateto = response.result.queryresult[0];
          this.seldateto.Deliverytodate = new Date(response.result.queryresult[0].Deliverytodate);

          console.log(this.seldateto)
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);    
    },
    () => {
        console.log("The Post observable is now completed.");
        
    });
   
    }
    
    UpdateDate()
    {
      //set date format to SQL format for dattime fields example
      this.seldateto.Deliverytodate = this.datePipe.transform(this.seldateto.Deliverytodate, 'yyyy-MM-dd');
      console.log("deltodate",this.seldateto.Deliverytodate);
      
      this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entityid={id:this.product.ContractId};
        param.entity = "Wrx_SalesContracts";
        // param.attributes = this.seldateto[0];
        param.attributes = this.seldateto;
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Date Updated', life: 3000});
              //this.getSalesTrm();
              
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Date Not Updated', life: 3000});
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
            });
    }
    Updateport()
    {
      
      this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entityid={id:this.product.ContractId};
        param.entity = "Wrx_SalesContracts";
        param.attributes = this.seltrm[0];
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Ports Updated', life: 3000});
              this.getbookingport(this.seltrm[0].Portdischargeid);
              //this.getCommodities();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Ports Not Updated', life: 3000});
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
            });
    }
    UpdateDes()
    {
      this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entityid={id:this.product.ContractId};
        param.entity = "Wrx_SalesContracts";
        param.attributes = this.seltrm[0];
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Destination Country Updated', life: 3000});
              //this.getCommodities();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Destination Country Not Updated', life: 3000});
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
            });
    }
    Updateorg()
    {
      
      this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entityid={id:this.product.ContractId};
        param.entity = "Wrx_SalesContracts";
        param.attributes = this.selorigin[0];
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Origin Updated', life: 3000});
              //this.getCommodities();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Origin Not Updated', life: 3000});
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
            });
    }
    Updatebag()
    {
      
      this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entityid={ContractId:this.product.ContractId};
        param.entity = "Wrx_TransContract";
        param.attributes = this.seltrans[0];
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Configuration Updated', life: 3000});
              //this.getCommodities();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Configuration Not Updated', life: 3000});
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
            });
    }
    showPositionDialog(position: string, message: string) 
    {
      this.dialougmessage = message;
      this.position = position;
      this.displayPosition = true;
    }
    getPurchase()
    {
      let param: any = {};
      param.op = "query";
      param.query = "select * from vw_PurchaseContractsRemain where Commodityid =" + this.product.Commodityid + ";";
      let headers = new HttpHeaders();
      
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.PurCols = response.result.cols[0];
          this.Purchases = response.result.queryresult;
          }
          else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.PurchaseData);
          }
        }
      ,response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;
    })
    }
    getDummyContract()
    {
      let param: any = {};
      param.op = "query";
      param.query = "select * from vw_DummyCreation where Commodityid =" + this.product.Commodityid + ";";
      let headers = new HttpHeaders();
      
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.Dumcols = response.result.cols[0];
          this.DummyContract = response.result.queryresult;
          }
          else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.PurchaseData);
          }
        }
      ,response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;
    })
    }
    getDummyDetailsContract(id:any)
    {
      let param: any = {};
      param.op = "query";
      param.query = "select * from vw_DummyCreation where id =" + id + ";";
      let headers = new HttpHeaders();
      
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.DummyDetailContract = response.result.queryresult;
          this.Dumycls = this.DummyDetailContract[0].Contractid;
          //this.selecteddu.forEach((A:any)=>{
          //   this.selecteddu.usercomments = "transfer dummy split# " + this.selecteddu.splitno;
          //   this.selecteddu.splitno = this.updateobject[0].splitno;
          //   this.selecteddu.contractid = this.updateobject[0].contractid;
          // //});

          // console.log("after update", this.selecteddu);
          
          }
          else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.PurchaseData);
          }
        }
      ,response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;
    })
    }
  getActualTransaction()
  {
      this.blockedPanel=true;
      let param: any = {};
      param.op = "query";
      param.query = "select distinct * from Wrx_TransContract where ContractId=" + this.product.ContractId + ";";
      let headers = new HttpHeaders();
      
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.ActualCols = response.result.cols[0];
          this.ActualTransaction = response.result.queryresult;
          if(this.ActualTransaction.length>0)
            this.IsActualTransaction=false; 
          let total = 0;
            for(let quant of this.ActualTransaction) 
            {
              total += +quant.Shippedquantity;
            }
          this.AcRemaining = this.product.Quantity - total;
          this.AclastTotal = total;
          }
          else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            this.blockedPanel=false;
          }
        }
      ,response => {
        console.log("Post call in error", response);
        this.blockedPanel=false;
            
    },
    () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel=false;
    })
  }

showshipinstruct(newcontractbatch: any) {
  if(!this.updateObject.find((obj: any)=>obj.id==newcontractbatch.id))
      {
        this.updateObject.push(newcontractbatch);
        console.log(this.updateObject);
      }
  
  this.generalservice.sourceObject = newcontractbatch;
  this.generalservice.shipDialogueDisplay = true;
}
showPurchase(newcontractbatch:any)
{
  if(!this.updateObject.find((obj: any)=>obj.id==newcontractbatch.id))
  {
    this.updateObject.push(newcontractbatch);
    console.log(this.updateObject);
  }

  this.generalservice.sourceObject = newcontractbatch;
  this.generalservice.purDialogueDisplay = true;
}
showQuant(newcontractbatch: any)
{
  console.log(this.Remaining);
  console.log(newcontractbatch.CalcQuantity);
    
 newcontractbatch.CalcQuantity = this.Remaining;
}
showprodinstruct(newcontractbatch: any) {

  if(!this.updateObject.find((obj: any)=>obj.id==newcontractbatch.id))
        {
          this.updateObject.push(newcontractbatch);
          console.log(this.updateObject);
        }

  this.generalservice.sourceObject = newcontractbatch;
  this.generalservice.prodDialogueDisplay = true;
}
setPurchaseValueFromService()
{

  if(!this.selectedpu)
    return;
  let selectedObject = this.selectedpu;
  let sourceObject  = this.generalservice.sourceObject;
  console.log("service selected object", this.selectedpu);
  
  this.batches.forEach((element: any,index: number)=>{
    
    element.children.forEach((sourceelement:any,sourceindex: number) => {
   
      if(sourceelement.id == this.generalservice.sourceObject.id)
        this.batches[index].children[sourceindex].Sourceid = this.selectedpu.id;  
      });
  });
  console.log(this.batches);
  
  // this.generalservice.sourceObject
}
setDummyValueFromService()
{
  if(!this.selecteddu)
    return;
  let selectedObject = this.selecteddu;
  let sourceObject  = this.generalservice.sourceObject;
  console.log("service selected object", this.selecteddu);
  
  this.batches.forEach((element: any,index: number)=>{
   
    element.children.forEach((sourceelement:any,sourceindex: number) => {
   
      if(sourceelement.id == this.generalservice.sourceObject.id)
        this.batches[index].children[sourceindex].Sourceid = this.selecteddu.id;  
      });
  });
  console.log(this.batches);
  
  // this.generalservice.sourceObject
}
setShippingInstructValueFromService(){
 // if(!this.generalservice.selectedObject[0])
  if(!this.selectedprod)
    return;
  let selectedObject = this.selectedprod;
  let sourceObject  = this.generalservice.sourceObject;
  console.log("service selected object", this.selectedprod);
  
  this.batches.forEach((element: any,index: number)=>{
    element.children.forEach((sourceelement:any,sourceindex: number) => {
   
      if(sourceelement.id == this.generalservice.sourceObject.id)
        this.batches[index].children[sourceindex].Shipinstruct = this.selectedprod.id;  
      });
    
  });
  
  
  // this.generalservice.sourceObject
}
setProductionInstructValueFromService()
{
  if(!this.selectedpins)
    return;
  let selectedObject = this.selectedpins;
  let sourceObject  = this.generalservice.sourceObject;
  console.log("Service source object", sourceObject);
  
  console.log("service selected object", this.selectedpins);
  
  this.batches.forEach((element: any,index: number)=>{
    element.children.forEach((sourceelement:any,sourceindex: number) => {
      console.log("batches data",element);
    
    if(sourceelement.id == this.generalservice.sourceObject.id)
      this.batches[index].children[sourceindex].prodinstructid = this.selectedpins.id;  
    });
    
  });
  
  // this.generalservice.sourceObject
}
clearValueOnService()
{
  this.generalservice.selectedObject = {};
}
calculatequantity() 
{
  let total = 0;
  for(let quant of this.batches) 
  {
    if((quant.Bookingid!==0 && quant.Shipinstruct!==0 && quant.prodinstructid!==0) || (quant.Bookingid!==0 && quant.Shipinstruct!==0 && quant.Source!==2))
    {
      let CalcQuantity = parseFloat(quant.CalcQuantity);
      this.lastTotal = this.lastTotal + CalcQuantity;
    }
  }
  //this.lastTotal = total;
}
addRailCarMap()
{
  let RailCarMap:any = {};
      //importpermit.Contractid = this.product.Contractid;
           
      RailCarMap.splitno = this.updateObject.SplitNo;
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
      RailCarMap.contractid = this.product.Contractnumber;
      this.RailCarsMap = [...this.RailCarsMap,RailCarMap];
}
    addimport()
    {
      let importpermit:any = {};
      //mportpermit.Contractid = this.product.Contractid;
      //console.log(this.product.contractid);
      
      importpermit.contractid = this.product.ContractId;
      importpermit.importno = 0;
      importpermit.importquantity = 0;
      importpermit.importdate = 0;
      importpermit.importexpiry = 0;

      this.ImportPrmits = [...this.ImportPrmits,importpermit];
    }
    saveData()
    {
      
    }
    saveDataR(RailCarMap:any)
    {
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
      console.log(url);
      let param: any = {};
      param.op = "create";
      param.entity = "Wrx_RailCarMap";
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
          this.getbatches();
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
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  hidedialogATT()
    {
      this.addNewDialogueATT = false;
    }
  opendialogR()
  {
    this.addNewDialogueR = true;
  }
  hideDialogR()
  {
    this.addNewDialogueR = false;
  }
   
  opendialog()
    {
      this.addNewDialogue = true;
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
        element.Contractid = this.product.ContractId
      });
      
      console.log(this.updateObject);
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/updateMultiple";
      console.log(url);
      let param: any = {};
      param.op = "updateMultiple";
      //param.entityid={id:this.updateObject.id};
      param.entity = "Wrx_RailCarMap";
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
          },
            () => 
          {
            console.log("The Post observable is now completed.");
          })  
            
        }
    }
  Updateinstruct(Split:any)
  {
    
    delete Split.children;
   
    if(Split)
    {
      this.submitted = true;
        //Split.forEach((element: any) => {
        Split.modifiedby = this.loggedinuser.id;
        Split.modifiedon = this.myDate;
        Split.Contractid = this.product.ContractId
         
        console.log(this.updateObject);
        this.blockedPanel=true;
       
            let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
            console.log(url);
            let param: any = {};
            param.op = "update";
            param.entityid={id:Split.id};
            param.entity = "Wrx_BatchContract";
            param.attributes =  Split;

            let headers = new HttpHeaders();
            this.http.post(url, param, {headers: headers}).subscribe(
              (res) => 
              {
                console.log(res);
                var response: any = res;
                if(response.success)
                {
                  this.messageService.add({severity:'success', summary: 'Successful', detail: 'Split Updated', life: 3000});
                // //................................Get Status for Contratc if bboking is assigned to split
                // this.updateObject.forEach((index:number)=>{
                //   if (this.updateObject[index].Bookingid !="0")
                //   {  
                //   let updatestatus:any ={};
                //     updatestatus.SplitStatus = 2;
                //     this.blockedPanel=true;
                //       let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
                //       console.log(url);
                //       let param: any = {};
                //       param.op = "update";
                //       param.entityid={id:this.updateObject[index].id};
                //       param.entity = "Wrx_BatchContract";
                //       param.attributes = updatestatus;
                //       let headers = new HttpHeaders();
                //       this.http.post(url, param, {headers: headers}).subscribe(
                //         (res) => 
                //         {
                //           console.log(res);
                //           var response: any = res;
                //           if(response.success)
                //           {
                //             this.messageService.add({severity:'success', summary: 'Successful', detail: 'Status Updated As Planned', life: 3000});
                //             //this.getCommodities();
                //           }else{
                //             this.messageService.add({severity:'error', summary: 'Failed', detail: 'Status Not Updated', life: 3000});
                //           }
                //         },response =>               
                //           {
                //             console.log("Post call in error", response);
                //             this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
                //             this.blockedPanel=false;    
                //           },
                //             () => 
                //           {
                //             console.log("The Post observable is now completed.");
                //             this.blockedPanel=false;
                //           });
                //       }  
                // });
                
                //  //..................................................
                  this.getbatches();
                  
                }else{
                  this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
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
  
}
PrintTransfer()
{
  console.log("Dummy to Close",this.DummyDetailContract[0].Contractid);
}
TransferDummy()
{

  delete this.selecteddu.Contractnumber;
  delete this.selecteddu.DestCountry;
  delete this.selecteddu.DestPort;
  delete this.selecteddu.Commodity;
  delete this.selecteddu.variety;
  delete this.selecteddu.Grade;
  delete this.selecteddu.Quantity;
  delete this.selecteddu.BookingRef;
  delete this.selecteddu.TransID;
  delete this.selecteddu.Plant;
  delete this.selecteddu.LineName;
  delete this.selecteddu.DestinationCountry;
  delete this.selecteddu.DestinationPort;
  delete this.selecteddu.Commodityid;
  delete this.selecteddu.BatchId;
  delete this.selecteddu.Shipinstructid;
  delete this.selecteddu.id;
  delete this.selecteddu.Closed;
  delete this.selecteddu.Cancel;

  console.log("Update for dummy",this.selecteddu);

  console.log("Split old id ", this.OldSplit)
  

  this.confirmationService.confirm({
   message: 'Are you sure you want to Transfer to Dummy Selected, if yes please Note that the Dummy will no longer exist?',
   header: 'Confirm',
   icon: 'pi pi-exclamation-triangle',
   accept: () => {
     let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
     console.log(url);
     let param: any = {};
     param.op = "update";
     param.entityid={id:this.Xid};
     param.entity = "Wrx_BatchContract";
     param.attributes =  this.selecteddu
      
     console.log(param.entityid, "--",param.attributes);
      
     let headers = new HttpHeaders();
     this.http.post(url, param, {headers: headers}).subscribe(
       (res) => 
       {
         console.log(res);
         var response: any = res;
         if(response.success)
         {
            let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
            console.log(url);
            let param: any = {};
            param.op = "delete";
            
            console.log("olssplit", this.OldSplit);
            
            param.entityid={id:this.OldSplit};
            param.entity = "wrx_batchcontract";
            
            let headers = new HttpHeaders();
            this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
              {
                console.log(res);
                var response: any = res;
                if(response.success)
                {
                  this.messageService.add({severity:'success', summary: 'successful', detail: 'Dummy Transfered', life: 3000});
                  this.getbatches();
                  this.getactualSplits();
                  this.updateObject = [];
                  //.........................Close the Dummy Contract...................................
                  let cls:any= {}
                  cls.Closed = 1;
                  console.log("Dummy to Close",this.DummyDetailContract[0].Contractid);
                  let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
                      console.log(url);
                      let param: any = {};
                      param.op = "update";
                      param.entityid={id:this.DummyDetailContract[0].Contractid};
                      param.entity = "wrx_salescontracts";
                      param.attributes =  cls;
                        
                      console.log(param.entityid, "--",param.attributes);
                        
                      let headers = new HttpHeaders();
                      this.http.post(url, param, {headers: headers}).subscribe(
                        (res) => 
                        {
                          console.log(res);
                          var response: any = res;
                          if(response.success)
                          {
                            this.messageService.add({severity:'success', summary: 'successful', detail: 'dummy contract is closed', life: 3000});
                          }else{
                            this.messageService.add({severity:'error', summary: 'failed', detail: 'dummy contract is not closed', life: 3000});
                          }
                        },response => 
                            {
                              console.log("post call in error", response);   
                              this.blockedPanel=false;   
                              this.showPositionDialog('top',this.generalservice.appconfigs.messages.networkerror);
                            },
                            () => {
                                    console.log("the post observable is now completed.");
                                    this.blockedPanel=false;
                                  });
                  //..........................................................................
                }else{
                  this.messageService.add({severity:'error', summary: 'failed', detail: 'Split Not Transfered', life: 3000});
                }
                
              },response => 
                {
                console.log("post call in error", response);
                this.blockedPanel=false;
                this.showPositionDialog('top',this.generalservice.appconfigs.messages.networkerror);
                },
                  () => 
                {
                console.log("the post observable is now completed.");
                this.blockedPanel=false;
                })
               this.messageService.add({severity:'success', summary: 'successful', detail: 'Dummy Transfered', life: 3000});
               this.getbatches();
               this.updateObject = [];
             }
           else{
             this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
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
           });
         }
       }); 
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
  onRowOVSelect(event:any, op: OverlayPanel, newcontractbatch:any) {
    
    if(!this.updateObject.find((obj: any)=>obj.id==newcontractbatch.id))
    {
      console.log("in update");
      console.log(newcontractbatch.id);
      
      this.updateObject.push(newcontractbatch);
      console.log(this.updateObject);
      console.log(newcontractbatch);
    }
      this.generalservice.sourceObject = newcontractbatch
      
    op.hide();
}
onRowpOVSelect(event:any, pop: OverlayPanel, newcontractbatch:any) {
    
  if(!this.updateObject.find((obj: any)=>obj.id==newcontractbatch.id))
  {
    console.log("in update");
    console.log(newcontractbatch.id);
    
    this.updateObject.push(newcontractbatch);
    console.log(this.updateObject);
    console.log(newcontractbatch);
    
  }

    this.generalservice.sourceObject = newcontractbatch;
    console.log("updated source", newcontractbatch);
    
    pop.hide();
}
onRowpuOVSelect(event:any, popu: OverlayPanel, newcontractbatch:any) {
    
  if(!this.updateObject.find((obj: any)=>obj.id==newcontractbatch.id))
  {
    console.log("in update");
    console.log(newcontractbatch.id);
    
    this.updateObject.push(newcontractbatch);
    console.log(this.updateObject);
    console.log(newcontractbatch);
    
  }

    this.generalservice.sourceObject = newcontractbatch;
    popu.hide();
}
onRowDummySelect(event:any, podu: OverlayPanel, newcontractbatch:any)
{
  console.log("bid", newcontractbatch.SplitNo);

  console.log("Update obj", this.updateObject);
  
  this.OldSplit = newcontractbatch.id;

  if(!this.updateObject.find((obj: any)=>obj.id==newcontractbatch.id))
  {
    console.log("in update", event);
    //initialize the barch object
        //let newcontractbatch:any = {};
        newcontractbatch.Contractid = this.product.ContractId;
        newcontractbatch.Bookingid = event.data.Bookingid;
        newcontractbatch.prodinstructid = event.data.prodinstructid;
        newcontractbatch.Shipinstruct = event.data.Shipinstructid;
        newcontractbatch.UserComments="Dummy Transfer from " + event.data.Contractnumber;
        newcontractbatch.Source  = 4;
        newcontractbatch.SplitNo = newcontractbatch.SplitNo;
        //newcontractbatch.id = event.data.BatchId;

        console.log("before push to update", newcontractbatch);
    
    this.updateObject.push(newcontractbatch);
    console.log("Update Batch",this.updateObject);
   
    
  }
    this.generalservice.sourceObject = newcontractbatch;
    this.getDummyDetailsContract(event.data.id)
    console.log(event.data.id);
    

    //Transfer Dumy to another Split
    this.Xid = this.selecteddu.BatchId;
    this.selecteddu.Contractid = this.product.ContractId;
    this.selecteddu.UserComments="Dummy Transfer from " + event.data.Contractnumber;
    this.selecteddu.SplitNo = newcontractbatch.SplitNo;
    this.selecteddu.Shipinstruct = this.selecteddu.Shipinstructid
    this.selecteddu.Source=4;
    this.selecteddu.Sourceid = this.selecteddu.id;

    console.log("Batch ID for dummy",this.Xid);
   
    
    
       
    //,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    podu.hide();
}
  onRowSaveImport(importpermit:any)
  {
    //SQL to create Record
    console.log(importpermit);
    this.blockedPanel=true;
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
    console.log(url);
    let param: any = {};
    param.op = "create";
    param.entity = "Wrx_ImportPermit";
    param.attributes = importpermit;
    let headers = new HttpHeaders();
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'New Import Created', life: 3000});
        this.getImports();
      }else{
        this.messageService.add({severity:'error', summary: 'Failed', detail: 'Import Not Created', life: 3000});
      }
    },response => 
        {
          console.log("Post call in error", response);   
          this.blockedPanel=false;   
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        },
        () => {
                console.log("The Post observable is now completed.");
                this.blockedPanel=false;
              })
//SQL finish create...............................................................
  }
  onrowbatchSave(newbatchparent:any)
  {
    if (newbatchparent.bookingid !=0)
      {
        newbatchparent.SplitStatus=2;
      }
      console.log(newbatchparent);
      
      this.blockedPanel=true;
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
      console.log(url);
      let param: any = {};
      param.op = "create";
      param.entity = "Wrx_BatchContract";
      param.attributes = newbatchparent;
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'New Split Source Created', life: 3000});
            this.getbatches();
            this.getactualSplits();
          }else{
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'New Split Source Not Created', life: 3000});
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
  onRowSave(newcontractbatch:any)
  {
    if (newcontractbatch.bookingid !=0)
    {
      newcontractbatch.SplitStatus=2;
    }
  //SQL to create Record
  if (newcontractbatch.Source  != 4)
    {
      console.log(newcontractbatch);
      this.blockedPanel=true;
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
      console.log(url);
      let param: any = {};
      param.op = "create";
      param.entity = "Wrx_SubSplit";
      param.attributes = newcontractbatch;
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'New Split Source Created', life: 3000});
          this.getbatches();
          this.getactualSplits();
        }else{
          this.messageService.add({severity:'error', summary: 'Failed', detail: 'New Split Source Not Created', life: 3000});
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
               } else
                { 
                delete this.selecteddu.Contractnumber;
                delete this.selecteddu.DestCountry;
                delete this.selecteddu.DestPort;
                delete this.selecteddu.Commodity;
                delete this.selecteddu.variety;
                delete this.selecteddu.Grade;
                delete this.selecteddu.Quantity;
                delete this.selecteddu.BookingRef;
                delete this.selecteddu.TransID;
                delete this.selecteddu.Plant;
                delete this.selecteddu.LineName;
                delete this.selecteddu.DestinationCountry;
                delete this.selecteddu.DestinationPort;
                delete this.selecteddu.Commodityid;
                delete this.selecteddu.BatchId;
                delete this.selecteddu.Shipinstructid;
                delete this.selecteddu.id;
                delete this.selecteddu.Closed;
                delete this.selecteddu.Cancel;

                  
                  this.blockedPanel=true;
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.Xid};
              param.entity = "Wrx_SubSplit";
              param.attributes = this.selecteddu;

              console.log("in update while save", this.selecteddu);
              
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    //.........................Close the Dummy Contract...................................
                  let cls:any= {}
                  cls.Closed = 1;
                  console.log("Dummy to Close",this.DummyDetailContract[0].Contractid);
                  let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
                      console.log(url);
                      let param: any = {};
                      param.op = "update";
                      param.entityid={id:this.DummyDetailContract[0].Contractid};
                      param.entity = "wrx_salescontracts";
                      param.attributes =  cls;
                        
                      console.log(param.entityid, "--",param.attributes);
                        
                      let headers = new HttpHeaders();
                      this.http.post(url, param, {headers: headers}).subscribe(
                        (res) => 
                        {
                          console.log(res);
                          var response: any = res;
                          if(response.success)
                          {
                            this.messageService.add({severity:'success', summary: 'successful', detail: 'dummy contract is closed', life: 3000});
                          }else{
                            this.messageService.add({severity:'error', summary: 'failed', detail: 'dummy contract is not closed', life: 3000});
                          }
                        },response => 
                            {
                              console.log("post call in error", response);   
                              this.blockedPanel=false;   
                              this.showPositionDialog('top',this.generalservice.appconfigs.messages.networkerror);
                            },
                            () => {
                                    console.log("the post observable is now completed.");
                                    this.blockedPanel=false;
                                  });
                                  //-------------------------------------------------------------------
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Dummy is Transfered', life: 3000});
                    this.getbatches();
                    this.getactualSplits();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Dummy is Failed To Transfer', life: 3000});
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
                  });
          }
//SQL finish create...........................................................................................................

let selectedSplit = {};
this.batches.forEach((spelement: any)=>{
  let total = 0;
  if(spelement.id == newcontractbatch.Splitid){
    spelement.children.forEach((selement: any) => {
      
          total += +selement.CalcQuantity;
          
    });
    spelement.CalcQuantity = total;
    selectedSplit = spelement;
  }
    console.log(spelement);
 });
  this.Updateinstruct(selectedSplit);
}
UpdateActual()
{
  if(this.ActualupdateObject && this.ActualupdateObject.length>0)
  {
    this.submitted = true;
        
    //this.commodities[this.findIndexById(this.shipinstruct.id)] = this.commodities;
    this.ActualupdateObject.forEach((element: any) => {
      element.modifiedby = this.loggedinuser.id;
      element.modifiedon = this.myDate;
    });
    
    console.log(this.ActualupdateObject);
    this.blockedPanel=true;
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/updateMultiple";
    console.log(url);
    let param: any = {};
    param.op = "updateMultiple";
    //param.entityid={id:this.updateObject.id};
    param.entity = "Wrx_TransContract";
    param.attributes = this.ActualupdateObject;
    let headers = new HttpHeaders();
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {                  
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Actuals Transactions Updated', life: 3000});
          this.getActualTransaction();
        }else{
          this.messageService.add({severity:'error', summary: 'Failed', detail: 'Actuals Transactions Not Updated', life: 3000});
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
    }
    deleteSelectedSplit(newcontractbatch:any)
    {
      this.confirmationService.confirm({
        message: 'Are you sure you want to Delete Selected?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          //this.rows = this.rows.filter(val => val.id !== grade.id);
          //this.grade = {};
          //Delete SQL Database
          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:newcontractbatch.id};
          param.entity = "Wrx_BatchContract";
          param.attributes=newcontractbatch;

          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Split Deleted', life: 3000});

                this.getbatches();
                this.getactualSplits();
                this.ActualTransaction = [];
                this.getActualTransaction();
                
                let total = 0;
                this.Remaining = this.product.Quantity - total
                this.Remaining = +this.Remaining + (this.product.Quantity * 0.1);
                this.lastTotal = total;
                this.planned = this.product.Quantity * 0.1;
                if(this.Remaining <= this.planned)
                {
                    this.isplanned = true;
                  if(this.Remaining>=this.planned)
                  {
                    this.isDisabled = true;}
                    else{
                      this.isDisabled=false;
                    }
                  }
                else{
                  this.isplanned = false;
                }
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Split Not Deleted', life: 3000});
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
          });
    }
    getshipinstruct()
  {
    this.blockedPanel=true;
    let param: any = {};
        param.op = "query";
        param.query = "select * from vw_ShippingInstruction;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
           
            this.Shipinstructs = response.result.queryresult;
            console.log(this.Shipinstructs)
            //console.log(this.cols.toString())
            //this.tablefilter = this.cols.toString();
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
    //isRowSelectable(event:any) {
  //    return (event.data.id)? true : false;
   // }
    onRowSelect(event: any) 
    {
      //this.QtyPln=0;
      //event.data.CalcQuantity = 0;
      if(!this.updateObject.find((obj: any)=>obj.id==event.data.id))
        {
          this.updateObject.push(event.data);
          this.Remaining += +event.data.CalcQuantity;
          console.log(this.updateObject);
        }    
          
          
      //this.messageService.add({key: 'toast01',severity:'info', summary:'Product Selected', detail: event.data.id});
  }
  onActualRowSelect(event: any)
    {
      if(!this.ActualupdateObject.find((obj: any)=>obj.id==event.data.id))
        {
          this.ActualupdateObject.push(event.data);
          console.log(this.ActualupdateObject);
        }
      this.messageService.add({key: 'toast01',severity:'info', summary:'Product Selected', detail: event.data.id});
  }
  onRowSelectOv(event: any)
  { 
    if(!this.updateObject.find((obj: any)=>obj.id==event.data.id))   
      this.updateObject.forEach((element: any) => {
      element.prodinstructid = event.data.id;
    });
  }
  onRowSelectShip(event: any)
  {   
    if(!this.updateObject.find((obj: any)=>obj.id==event.data.id))
    this.updateObject.forEach((element: any) => {
      element.Shipinstruct = event.data.id;
    });
   
  }
  
  onRowUnselect(event: any) 
  {
      
      this.messageService.add({key: 'toast01',severity:'info', summary:'Product Unselected',  detail: event.data.Transloader});
  }
  onActualRowUnselect(event: any) 
  {
      
      this.messageService.add({key: 'toast01',severity:'info', summary:'Product Unselected',  detail: event.data.Transloader});
  }
  getImports()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_ImportPermit where contractid =" + this.product.ContractId + ";";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.importcols = response.result.cols[0];
            //this.rows = response.result.queryresult;
            this.ImportPrmits = response.result.queryresult;
            console.log(this.importcols)
            //console.log(this.cols.toString())
            //this.tablefilter = this.cols.toString();
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
    getbookingdisplay()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_ShipBooking;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.bookdisp = response.result.queryresult;
            console.log("bookingRef",this.bookdisp)
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
    getbookingport(p:any)
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_ShipBooking where DischargePort=" + p + ";";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.books = [];
            this.books = response.result.queryresult;
            console.log("bookingRef",this.books)
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
    getbookings()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_ShipBooking where DischargePort=" + this.product.PortId + ";";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.books = response.result.queryresult;
            console.log("bookingRef",this.books)
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
    getRailCars()
    {
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_RailCars;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            
            this.Railobjs = response.result.queryresult;
            console.log(this.Railobjs)
          }
        },response => {
          console.log("Post call in error", response);
               
      },
      () => {
          console.log("The Post observable is now completed.");
          
      })
    }
    getSource()
    {
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_Source;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.WrxSourceCols = response.result.cols[0];
            this.WrxSourceData = response.result.queryresult;
           //console.log(this.newcontractbatch.Bookingid);
          }else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);

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
    getactualSplits()
    {
      let param: any = {};
      param.op = "query";
      param.query = "select id, SplitNo from Wrx_BatchContract where Contractid =" + this.product.ContractId + ";";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.WrxSplitData = response.result.queryresult;
         //console.log(this.newcontractbatch.Bookingid);
        }else{
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
    },
    () => {
        console.log("The Post observable is now completed.");
    })
    }
    getbatches()
    {
      this.blockedPanel=true;
      this.batches= [];
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_BatchContract where Contractid =" + this.product.ContractId + ";";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
           this.batchcols = response.result.cols[0];
        //    this.batchcols = [
        //     { field: 'Bookingid', header: 'Booking' },
        //     { field: 'CalcQuantity', header: 'Quantity' },
        //    { field: 'Contractid', header: 'Contract' },
        //    { field: 'Shipinstruct', header: 'Shipment Instruction' }
        // ];
            this.batches = response.result.queryresult;
           //console.log(this.newcontractbatch.Bookingid);
           
            if (this.batches.length>0){
              this.isDisabled=false;
            }
            if (this.batches.length>0)
            {
              let total = 0;
              let bdgin = 0;
              this.bdg = 0;
              for(let quant of this.batches) 
              {
                if((quant.Bookingid!==0 && quant.Shipinstruct!==0 && quant.prodinstructid!==0) || (quant.Bookingid!==0 && quant.Shipinstruct!==0 && quant.Source!==2))
                 {
                   total += +quant.CalcQuantity;
                 }
                else{
                    this.bdg += bdgin + 1;
                }
              }
              this.Remaining = this.product.Quantity - total
              this.Remaining = +this.Remaining + (this.product.Quantity * 0.1);
              this.lastTotal = total;
              this.planned = this.product.Quantity * 0.1;
              if(this.Remaining <= this.planned){
              this.isplanned = true;}
              else{
                this.isplanned = false;
              }
            }
            this.getSubSplit();
          }else{
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data);

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
       
    getSubSplit()
    {
      if(this.batches)
  {
      
      this.batches.forEach((idelement:any,idindex:number)=>{
        this.IDs[idindex] = idelement.id.toString();
      });
      console.log(this.IDs.toString());
      
      let param: any = {};
        param.op = "query";
        param.query = "select SplitNo, Bookingid, CalcQuantity, Contractid, Shipinstruct, id, Source, Sourceid,Splitid from Wrx_SubSplit where Contractid =" + this.product.ContractId + " and Splitid in (" + this.IDs.toString() + ");";
        let headers = new HttpHeaders();
        console.log(param.query);

      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log("sub split result", res);
          var response: any = res;
          if(response.success)
            {
              
            this.Subsplitcols = response.result.cols[0];
            this.Subsplit = response.result.queryresult;

              this.batches.forEach((Belement:any, index: number)=>{
                this.batches[index].children = [];
                this.Subsplit.forEach((Selement:any)=>
                {
                  if(Belement.id == Selement.Splitid)
                    {
                                           
                      //   let total = 0;
                      //   let bdgin = 0;
                      //   this.bdg = 0;
                        
                      //   for(let quant of this.Subsplit) 
                      //   {
                      //     if((quant.Bookingid!==0 && quant.Shipinstruct!==0 && quant.prodinstructid!==0) || (quant.Bookingid!==0 && quant.Shipinstruct!==0 && quant.Source!==2))
                      //      {
                      //        total += +quant.CalcQuantity;
                      //      }
                      //     else
                      //     {
                      //         this.bdg += bdgin + 1;
                      //     }
                      //   }
                      //     let avg  = 0.1 / this.batches.length;

                      //     this.Remaining = this.product.Quantity - total
                      //     this.Remaining = +this.Remaining + (this.product.Quantity * avg);
                      //     this.lastTotal = total;
                      //     this.planned = this.product.Quantity * avg;
                      //     if(this.Remaining <= this.planned)
                      //       {
                      //         this.isplanned = true;
                      //       }
                      //     else
                      //       {
                      //        this.isplanned = false;
                      //       }
                      
                      // Belement.CalcQuantity = this.Remaining;

                      this.batches[index].children = [...this.batches[index].children,Selement];
                      
                    }
                });
                
           });

           this.batches.forEach((spelement: any)=>{
            let total = 0;
              spelement.children.forEach((selement: any) => {

                total += +selement.CalcQuantity;

              });
              spelement.CalcQuantity = total;

           });
           
           //console.log("batch cols", this.batchcols);
             console.log("Batches Children",this.batches );
            // console.log("Batches String",JSON.stringify(this.tableData) );
            
          }else{

          }
        },response => {
          console.log("Post call in error", response);
       
      },
      () => {
          console.log("The Post observable is now completed.");
      })
    }
  }
    isRowSelectable(event:any) {
      return (event.data.id)? true : false;
    }
    
    addBatch()
    {
      let newcontractbatch:any = {};
      newcontractbatch.Contractid = this.product.ContractId;
      newcontractbatch.Bookingid = 0;
      newcontractbatch.SplitStatus = 1;
      newcontractbatch.prodinstructid = 0;
      newcontractbatch.Shipinstruct = 0;
      newcontractbatch.UserComments="";
      newcontractbatch.SplitNo = this.createId();
      newcontractbatch.createdby = this.loggedinuser.Uid;
      newcontractbatch.createdon = this.myDate;
      
      this.batches = [...this.batches,newcontractbatch];
    }
    
    addBatchsource(split: any, index:number)
    {
      if (split.id){
        let Bsource:any = {};
        Bsource.Contractid = this.product.ContractId;
        Bsource.Bookingid = split.Bookingid;
        Bsource.SplitStatus = 1;
        Bsource.prodinstructid = 0;
        Bsource.Shipinstruct = 0;
        Bsource.UserComments = "";
        Bsource.Splitid = split.id;
        Bsource.Sourceid = 0;
        Bsource.SplitNo = split.SplitNo +'-'+ (this.batches[index].children.length + 1);
        this.batches[index].children = [...this.batches[index].children,Bsource];
        console.log("new source", Bsource);
      }else{
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.EmailMessage);

      }
    }
    createId(): string 
  {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    id = '';
    //for ( var i = 0; i < 5; i++ ) {

        id += this.product.Contractnumber + '-' + (this.batches.length + 1) //chars.charAt(Math.floor(Math.random() * chars.length));
    //}
    return id;
  }
  
  onRowEditInit(newcontractbatch:any) {
      this.batches[this.newcontractbatch.SlipNo] = {...newcontractbatch};
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.books.length; i++) 
    {
      if (this.books[i].id === id) 
      {
        index = i;
        break;
      }
    }

    return index;
  }
  
  onRowEditCancel(newcontractbatch:any, index:number) 
  {
      this.batches[index] = this.batches[this.newcontractbatch.id];
      delete this.batches[this.newcontractbatch.id];
  }
  myUploader(event:any)
  {
    this.uploadedFiles= [];
    for(let file of event.files) 
    {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles);
      this.ImportPrmit.image = this.uploadedFiles[0].name;
      console.log(this.ImportPrmit);
    }

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
  GetTemplatePrd(Splitid:any)
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_PrdInstructTemp where id="+ Splitid + ";";
      let headers = new HttpHeaders();
    
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.prdTempcols = response.result.cols[0];
            this.prdTemprows = response.result.queryresult;
      //..................................................................
            let table = "Please find below the Production instructions Details";
            table +=
            '<table border="1">' +
                '<thead>' +
                    '<tr>' +
                        '<th>GW</th>' +
                        '<th>bagname</th>' +
                        '<th>Commodity</th>' +
                        '<th>Variety</th>'  +
                        '<th>Grade</th>' +
                        '<th>Split Number</th>' +
                        '<th>Transloader Name</th>' +
                        '<th>Type Name</th>'+
                        '<th>Unit Number</th>'+
                        '<th>Total Tonnage</th>'+
                        '<th>Destination Country</th>'+
                        '<th>CFIA</th>'+
                        '<th>SGS</th>'+
                        '<th>Tag</th>'+
                        '<th>Supervision</th>'+
                        '<th>Pallet</th>'+
                        '<th>Pallet Stack</th>'+
                        
                        '<th>Comments</th>'+
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<tr>';

      for(let i = 0; i < this.prdTemprows.length; i++) 
      {
        table += '<td>' + this.prdTemprows[i].GW + '</td>';
        table += '<td>' + this.prdTemprows[i].bagname + '</td>';
        table += '<td>' + this.prdTemprows[i].Name + '</td>';
        table += '<td>' + this.prdTemprows[i].Grade + '</td>';
        table += '<td>' + this.prdTemprows[i].variety + '</td>';
        table += '<td>' + this.prdTemprows[i].SplitNo + '</td>';
        table += '<td>' + this.prdTemprows[i].TransName + '</td>';
        table += '<td>' + this.prdTemprows[i].TypeName + '</td>';
        table += '<td>' + this.prdTemprows[i].UnitNum + '</td>';
        table += '<td>' + this.prdTemprows[i].TotalMT + '</td>';
        table += '<td>' + this.prdTemprows[i].DestinationCountry + '</td>';
        table += '<td>' + this.prdTemprows[i].CFIA + '</td>';
        table += '<td>' + this.prdTemprows[i].SGS + '</td>';
        table += '<td>' + this.prdTemprows[i].Tag + '</td>';
        table += '<td>' + this.prdTemprows[i].Supervision + '</td>';
        table += '<td>' + this.prdTemprows[i].Pallet + '</td>';
        table += '<td>' + this.prdTemprows[i].PalletStack + '</td>';
        table += '<td>' + this.prdTemprows[i].UserComments + '</td>';
       
        if(i < this.prdTemprows.length - 1) table += '</tr><tr>';
      }
        table += '</tr></tbody></table>';

// Your table is ready ! You can deal with it
      this.sendEmail(table,"Production Instructions For: "+ this.prdTemprows[0].SplitNo);
      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.EmailMessage);
      
            //this.exportExcel(this.prdTemprows);
          }
        },response => {
          console.log("Post call in error", response);
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      },
      () => {
          console.log("The Post observable is now completed.");
      })
  }
  GetTemplateShip(Splitid:any)
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_ShipInstructTemp where id="+ Splitid + ";";
      let headers = new HttpHeaders();
    
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.ShpTempcols = response.result.cols[0];
            this.ShpTemprows = response.result.queryresult;
//.................................................
            let table = "Please find below the Shipment instructions Details";
            table +=
            '<table border="1">' +
                '<thead>' +
                    '<tr>' +
                        '<th>GW</th>' +
                        '<th>Commodity</th>' +
                        '<th>Variety</th>'+
                        '<th>Split Number</th>' +
                        '<th>FCLNum</th>'+
                        '<th>Bags Number</th>'+
                        '<th>Max Container</th>'+
                        '<th>Total Tonnage</th>'+
                        '<th>CFIA</th>'+
                        '<th>Quality Inspection</th>'+
                        '<th>Extra Service Name</th>'+
                        '<th>Service Name</th>'+
                        '<th>Bag Name</th>'+
                       
                        '<th>Load Instructions</th>'+
                        '<th>Pallet Stack</th>'+
                        '<th>Pallet</th>'+
                        
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<tr>';

      for(let i = 0; i < this.ShpTemprows.length; i++) 
      {
        table += '<td>' + this.ShpTemprows[i].GW + '</td>';
        table += '<td>' + this.ShpTemprows[i].Name + '</td>';
        table += '<td>' + this.ShpTemprows[i].variety + '</td>';
        table += '<td>' + this.ShpTemprows[i].SplitNo + '</td>';
        table += '<td>' + this.ShpTemprows[i].FCLNum + '</td>';
        table += '<td>' + this.ShpTemprows[i].BagsNum + '</td>';
        table += '<td>' + this.ShpTemprows[i].maxcontainer + '</td>';
        table += '<td>' + this.ShpTemprows[i].MTNum + '</td>';
        table += '<td>' + this.ShpTemprows[i].CFIA + '</td>';
        table += '<td>' + this.ShpTemprows[i].SGS + '</td>';
        table += '<td>' + this.ShpTemprows[i].ExtraSrv + '</td>';
        table += '<td>' + this.ShpTemprows[i].SrvName + '</td>';
        table += '<td>' + this.ShpTemprows[i].bagname + '</td>';
         
        table += '<td>' + this.ShpTemprows[i].LoadInstructions + '</td>';
        table += '<td>' + this.ShpTemprows[i].PalletStack + '</td>';
        table += '<td>' + this.ShpTemprows[i].Pallet + '</td>';
        


        if(i < this.ShpTemprows.length - 1) table += '</tr><tr>';
      }
        table += '</tr></tbody></table>';

// Your table is ready ! You can deal with it
      this.sendEmail(table,"Shippment Instructions For: "+ this.ShpTemprows[0].SplitNo);
      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.EmailMessage);
//............................................................................
      //this.exportExcel(this.ShpTemprows);
      }
    },response => {
      console.log("Post call in error", response);
      this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      },
      () => {
          console.log("The Post observable is now completed.");
      })
  }
  sendEmail(table:any, subj:any)
  {
    let param: any = {};
    param.from = "ossama.talaat@etgworld.com";
    param.to = "ossama.talaat@etgworld.com";
    param.subject=subj;
    param.body=table;
    let headers = new HttpHeaders();
  
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/sendEmail";
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          console.log("Post call Sucess", response);
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
    },
    () => {
        console.log("The Post observable is now completed.");
    })
  }
  exportExcel(rowsparam:any) 
  {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(rowsparam);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'ShpTemprows');
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void 
  {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    
  }
}
