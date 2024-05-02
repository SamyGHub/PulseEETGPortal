import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GeneralService } from '../general.service';
import { TooltipModule} from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import FileSaver from 'file-saver';
import { DropdownModule } from 'primeng/dropdown';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-shipping-instruct',
  templateUrl: './shipping-instruct.component.html',
  styleUrls: ['./shipping-instruct.component.css'],
  providers: [DatePipe, DialogService, MessageService]
})
export class ShippingInstructComponent {
  rows: any [] =[];
  myDate = new Date ();
  loggedinuser:any;
  prod:any=0;
  cols: any [] = [];
  Shipinstructs:any[]=[];
  Shipinstruct:any;
  activeIndex: number = 0;
  submitted: boolean = false;
  selectedtransloader:any;
  Transloaders:any=[];
  SrvType:any = [];
  selectedSrvType: any;
  selectedUnit:any;
  Unit:any=[];
  selectedInstruction: any = {};
  blockedPanel: boolean = false;
  updateObject: any = [];
  FCLs:any=[];
  ref: DynamicDialogRef = new DynamicDialogRef;
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  Gw:any[]=[];
  CFIA:any []=[];
  SGS:any[]=[];
  Tags:any[]=[];
  origin:any=[];
  origincols:any=[];
  Exsrvcols:any=[];
  Exsrvrows:any=[];
  Commrows:any=[];
  Commcols:any=[];
  pkgsrows:any=[];
  graderows:any =[];
  pkgsweight: any =[];
  bagweight: any =0;
  ShipInstructExcel: any = [];
  palldicols:any=[];
  palldirows:any=[];
  pallstackcols:any=[];
  pallstackrows:any=[];
  addNewDialogue:boolean =false;
  Varirows:any=[];
  selectedExtras:any=[];
  ShipExtra:any=[];
  Extras:any=[];
  filteredvariety: any = [];
  Extrastring:string="";
  Exstringobj:any =[];

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe, private router: Router, private filterService: FilterService) 
    {
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
      this.isRowSelectable = this.isRowSelectable.bind(this);
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      this.getTransloaders();
      this.getservicetype();
      this.getshipinstruct();
      this.getFCL();
      this.getGw();
      this.getOrigins();
      this.getExtraSrv();
      this.getCommodities();
      this.getPkgs();
      this.getShipInstructExcel();
      this.FGrade();
      this.getpalletdimensions();
      this.getpalletstack();
      this.FGradeMap();
      this.getCFIA();
      this.getSGS();
      this.getTags();
     
  }
    
    clear(table: Table) 
    {
      table.clear();
    }

    filtervarietybycommodity(commodityid:number)
    {
        
        this.filteredvariety=this.Varirows.filter((item:any) => item.commodityid == commodityid);
        console.log(this.filteredvariety);
    
    }
    getTags()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select id, Tag from Wrx_Tags;";
    let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.Tags = response.result.queryresult;
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
    getShipInstructExcel()
    {
      let param: any = {};
        param.op = "query";
        param.query = "select * from vw_ShipinstructExcel;";
        let headers = new HttpHeaders();
      
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.ShipInstructExcel = response.result.queryresult;   
          }
        },response => {
          console.log("Post call in error", response);
        },
        () => {
            console.log("The Post observable is now completed.");
        })
    }
    getSGS()
    {
      this.blockedPanel=true;
        let param: any = {};
            param.op = "query";
            param.query = "select id, SGS from Wrx_SGS;";
            let headers = new HttpHeaders();
          
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
          
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success){
                this.SGS = response.result.queryresult;
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
    getCFIA()
    {
      this.blockedPanel=true;
        let param: any = {};
            param.op = "query";
            param.query = "select id, CFIA from Wrx_CFIA;";
            let headers = new HttpHeaders();
          
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
          
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success){
                this.CFIA = response.result.queryresult;
               
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
    getPkgs()
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
      if(response.success)
      {
        this.pkgsrows = response.result.queryresult;
      }
    },response => {
      console.log("Post call in error", response);
    },
    () => {
        console.log("The Post observable is now completed.");
    })
  }
  getpalletdimensions()
  {
    this.blockedPanel=true;

    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Palletdimensions;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.palldicols = response.result.cols[0];
          this.palldirows = response.result.queryresult;
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
  FGradeMap()
  {
    this.blockedPanel=true;
    //console.log(item);
      let param: any = {};
      param.op = "query";
      param.query = "select id, Grade from Wrx_GradeMap;";
      let headers = new HttpHeaders();
    console.log(param.query);
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {  
          this.graderows = response.result.queryresult;
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
  getpalletstack()
    {
        this.blockedPanel=true;

      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_Palletstacking;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.pallstackcols = response.result.cols[0];
            this.pallstackrows = response.result.queryresult;
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
  FGrade()
  {
    
      let param: any = {};
      param.op = "query";
      param.query = "select id, variety,commodityid from Wrx_Variety;";
      let headers = new HttpHeaders();
    console.log(param.query);
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
        
          this.Varirows = response.result.queryresult;
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
    getCommodities()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select id, Name from Wrx_Commodity;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.Commrows = response.result.queryresult;
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
  
    getExtraSrv()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_ExtraSrv;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.Exsrvcols = response.result.cols[0];
            this.Exsrvrows = response.result.queryresult;
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
   
    getOrigins()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_Origin;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.origincols = response.result.cols[0];
            this.origin = response.result.queryresult;
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
    showPositionDialog(position: string, message: string) 
    {
      this.dialougmessage = message;
      this.position = position;
      this.displayPosition = true;
    }
    getGw()
    {
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_GrainCalendar;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.Gw = response.result.queryresult;
            console.log(this.Gw)
          }
        },response => {
          console.log("Post call in error", response);
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
          this.blockedPanel = false;               
      },
      () => {
          console.log("The Post observable is now completed.");
          this.blockedPanel=false;
      })
    }
    deleteSelectedins(Delshp:any)
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
          param.entityid={id:Delshp.id};
          param.entity = "Wrx_ShipInstruct";
          param.attributes=Delshp;

          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Instruction Deleted', life: 3000});

              this.getshipinstruct();
                
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Instruction Not Deleted', life: 3000});
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
    CalcMTTimes(pkgid:any)
    {
      this.bagweight=0;
      let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_Packages where id=" + pkgid + ";";
    let headers = new HttpHeaders();
  
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
  
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.pkgsweight= response.result.queryresult;
        this.bagweight = this.pkgsweight[0].MTConversion;
        console.log(this.bagweight);     
        
        let unitnm: number = this.Shipinstruct.UnitNum;
        let bgnum: number = this.Shipinstruct.BagsNum;
        let bgwe: number = this.bagweight;
        let TotalM: number = this.Shipinstruct.MTNum;

        //let Tot = unitnm * bgnum;

        this.Shipinstruct.BagsNum = (TotalM * bgwe)/ unitnm ;
  
        console.log("Change in Total");
        
        console.log(this.Shipinstruct.BagsNum);
        
      }
      },response => {
        console.log("Post call in error", response);
      },
      () => {
          console.log("The Post observable is now completed.");
      })
    }

    CalcMT(pkgid:any)
    {
      this.bagweight=0;
      let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_Packages where id=" + pkgid + ";";
    let headers = new HttpHeaders();
  
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
  
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.pkgsweight= response.result.queryresult;
        this.bagweight = this.pkgsweight[0].MTConversion;
        console.log(this.bagweight);     
        
        let unitnm: number = this.Shipinstruct.UnitNum;
        let bgnum: number = this.Shipinstruct.BagsNum;
        let bgwe: number = this.bagweight;
  
        let Tot = unitnm * bgnum;
  
        Tot = Tot /bgwe ;
  
  console.log("VVVVVVVVVVV");
        
        console.log(Tot);
        
        this.Shipinstruct.MTNum = Tot;
        
      }
    },response => {
      console.log("Post call in error", response);
    },
    () => {
        console.log("The Post observable is now completed.");
    })
    }
  Updateinstruct()
  {
    if(this.updateObject && this.updateObject.length>0)
    this.blockedPanel=true;
    {
      this.submitted = true;
          
              //this.commodities[this.findIndexById(this.shipinstruct.id)] = this.commodities;
      this.updateObject.forEach((element: any) => {
        element.modifiedby = this.loggedinuser.id;
        element.modifiedon = this.myDate;
        element.MTNum = 0;
        element.MTNum = (element.UnitNum * element.BagsNum)/this.bagweight;
      });
      
      console.log("Upadte multipled ...");
      
      console.log(this.updateObject);
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/updateMultiple";
      console.log(url);
      let param: any = {};
      param.op = "updateMultiple";
      //param.entityid={id:this.updateObject.id};
      param.entity = "Wrx_ShipInstruct";
      param.attributes = this.updateObject;
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Shipping instruction Updated', life: 3000});
          }else{
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Shipping instruction Not Updated', life: 3000});
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
  addinstruct()
  {
    this.Shipinstruct = {};
    this.Extrastring="";

    this.submitted = false;
    this.Shipinstruct.createdon = this.myDate;
    this.Shipinstruct.createdby = this.loggedinuser.Uid;
    this.Shipinstruct.modifiedby = this.loggedinuser.Uid;
    this.Shipinstruct.modifiedon = this.myDate;
    this.addNewDialogue = true;

  }
  
  getTransloaders()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_Wrx_Transloader;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.Transloaders = response.result.queryresult;
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);   
    },
    () => {
        console.log("The Post observable is now completed.");
    })
  }
  getservicetype()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_ServcieType;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.SrvType = response.result.queryresult;
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
    },
    () => {
        console.log("The Post observable is now completed.");
        
    })
  }
  getUnit()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Units;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.Unit = response.result.queryresult;
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);     
    },
    () => {
        console.log("The Post observable is now completed.");
        
    })
  }
  getFCL()
  {
    let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_FCL;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.FCLs = response.result.queryresult;
            console.log(this.FCLs)
          }
        },response => {
          console.log("Post call in error", response);
          //this.blockedPanel=false;
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
      },
      () => {
          console.log("The Post observable is now completed.");
          //this.blockedPanel=false;
      })
  }
  editinstruction(Shipinstruct: any)
  {
    this.selectedExtras=[];
    this.Extrastring="";
    
    this.submitted = true;
    this.Shipinstruct = {...Shipinstruct};
    console.log(this.Shipinstruct);
    //--Get Extra Servcies details
    let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_ManyMany where FromType='Ship' and ToType='ExSrv' and FromID =" + this.Shipinstruct.id + ";";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.Extras = response.result.queryresult;

             for(let i=0;i<this.Extras.length;i++)
              {
                this.selectedExtras = this.selectedExtras.concat(this.Extras[i].ToID);
                //this.getextrastring(this.Extras[i].ToID);
                this.Exsrvrows.forEach((r:any)=>{
                  if(r.id==this.Extras[i].ToID)
                  {
                    this.Extrastring += r.extrasrvname + ",";
                  }
                })
              }
              console.log(this.Extrastring);
          }
          else{
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
    //--
    this.addNewDialogue = true;
  }
  onRowcloneInit(Shipinstruct: any)
  {
    this.submitted = true;
    this.selectedExtras=[];
    this.Extrastring="";
    
    console.log(Shipinstruct);
    //--Get Extra Servcies details
    let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_ManyMany where FromType='Ship' and ToType='ExSrv' and FromID =" + Shipinstruct.id + ";";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.Extras = response.result.queryresult;

             for(let i=0;i<this.Extras.length;i++)
              {
                this.selectedExtras = this.selectedExtras.concat(this.Extras[i].ToID);
                //this.getextrastring(this.Extras[i].ToID);
                this.Exsrvrows.forEach((r:any)=>{
                  if(r.id==this.Extras[i].ToID)
                  {
                    this.Extrastring += r.extrasrvname + ",";
                  }
                })
              }
              console.log(this.Extrastring);
          }
          else{
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
    //--
    Shipinstruct.id="";
    this.Shipinstruct = {...Shipinstruct};
    
    this.addNewDialogue = true;
  }
   getshipinstruct()
  {
    this.blockedPanel=true;
    let param: any = {};
        param.op = "query";
        param.query = "select * from vw_ShipinstructScreen order by id desc;";
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
            this.Shipinstructs = response.result.queryresult;
            this.Shipinstructs.forEach((Shp:any,index:any)=>{
              this.Shipinstructs[index].createdon = new Date(Shp.createdon);
            });
            console.log(this.Shipinstructs)
            //console.log(this.cols.toString())
            //this.tablefilter = this.cols.toString();
          }
          else{
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
  isRowSelectable(event:any) {
    return (event.data.id)? true : false;
  }
  onRowSelect(event: any) {
    if(!this.updateObject.find((obj: any)=>obj.id==event.data.id))
    {
      let Tot: number =event.data.MTNum;
      //Tot = 0;
     // this.CalcMT(event.data.Pkgid);
      let unitnm: number = event.data.UnitNum;
      let bgnum: number = event.data.BagsNum;
      let bgwe: number = this.bagweight;

      Tot = unitnm * bgnum;

      Tot += Tot / bgwe;

console.log("VVVVVVVVVVV");
      
      console.log(Tot);
      
      event.data.MTNum = Tot;
      
      this.updateObject.push(event.data);
    }
      console.log(this.updateObject);
    this.generalservice.selectedObject = this.updateObject;
    this.generalservice.shipDialogueDisplay = false;
   // this.messageService.add({key: 'toast01',severity:'info', summary:'Product Selected', detail: event.data.id});
  }

  onRowUnselect(event: any) {
      //this.messageService.add({key: 'toast01',severity:'info', summary:'Product Unselected',  detail: event.data.Transloader});
  }
  onRowEditInit(Shipinstruct:any, index:number) 
  {
    this.Shipinstructs[index] = {...Shipinstruct};
  }

   
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.Shipinstructs.length; i++) 
    {
      if (this.Shipinstructs[i].id === id) 
      {
        index = i;
        break;
      }
    }
  
    return index;
  }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  FVariety(V:any)
  {
    this.blockedPanel=true;
    //console.log(item);
      let param: any = {};
      param.op = "query";
      param.query = "select id, variety from Wrx_Variety where commodityid =" + V + ";";
      let headers = new HttpHeaders();
    console.log(param.query);
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          
          this.Varirows = response.result.queryresult;
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
    onRowSave()
    {
      //SQL to create Record
      this.ShipExtra = [];
      
      this.submitted = true;
      this.Shipinstruct.MTNum = Number((this.Shipinstruct.UnitNum * this.Shipinstruct.BagsNum)/this.bagweight);
      
      this.Exsrvrows.forEach((r:any, index:any)=>{
        if(r.id==this.selectedExtras[index])
        {
          this.Extrastring += r.extrasrvname + ",";
        }
      })

      this.Shipinstruct.ExtraSrv = this.Extrastring;
      this.blockedPanel=true;

      
        
      if(this.Shipinstruct.id)
        {
        
          this.Shipinstructs[this.findIndexById(this.Shipinstruct.id)] = this.Shipinstructs;
            this.Shipinstruct.modifiedby = this.loggedinuser.Uid;
            this.Shipinstruct.modifiedon = this.myDate;
            this.Shipinstruct.MTNum = Number((this.Shipinstruct.UnitNum * this.Shipinstruct.BagsNum)/this.bagweight);
            this.Shipinstruct.MTNum = (this.Shipinstruct.MTNum);
            this.Shipinstruct.BagsNum = Number(this.Shipinstruct.BagsNum);
            this.Shipinstruct.UnitNum = Number(this.Shipinstruct.UnitNum);
            //this.Shipinstruct.ExtraSrv = this.selectedExtras.toString;
            
            
            delete this.Shipinstruct.GWName;
            delete this.Shipinstruct.TransName;
            delete this.Shipinstruct.Name;  
            delete this.Shipinstruct.variety;
            delete this.Shipinstruct.Grade;
            delete this.Shipinstruct.bagname;
            delete this.Shipinstruct.CFIAName;  
            delete this.Shipinstruct.QualityInspection;
            delete this.Shipinstruct.GradeName;
            delete this.Shipinstruct.Origin;
            delete this.Shipinstruct.GW;
            delete this.Shipinstruct.Tag;

            //--ExtraService Details update
            let urlDel = this.generalservice.appconfigs.URLs.apiUrl+"/api/DeleteTow";
            console.log(urlDel);
            this.blockedPanel=true;

            let paramDel: any = {};
            paramDel.op = "DeleteTow";
            paramDel.entityid={FromId:this.Shipinstruct.id, ToType:'ExSrv'};
            paramDel.entity = "Wrx_ManyMany";
            let Delheaders = new HttpHeaders();
            this.http.post(urlDel, paramDel, {headers: Delheaders}).subscribe(
            (res) => 
              {
                console.log(res);
                var response: any = res;
                if(response.success)
                {
                  console.log(this.selectedExtras);
                  
                  this.selectedExtras.forEach((EX: any) => 
                      {
                        this.ShipExtra.push({"FromId": this.Shipinstruct.id, "ToId": EX , "FromType":"Ship", "ToType":"ExSrv"});
                      });
        
                      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createRelations";
                      console.log(url);
                      let param: any = {};
                      param.op = "createRelations";
                      param.FromType = "Ship";
                      param.ToType = "ExSrv";
                      param.attributes = this.ShipExtra;
                      let headers = new HttpHeaders();
                      this.http.post(url, param, {headers: headers}).subscribe(
                        (res) => 
                        {
                          console.log(res);
                          var response: any = res;
                          if(response.success)
                          {
                            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Extra Services Updated', life: 3000});
                          }
                          else
                          {
                            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Extra Services Not Updated', life: 3000});
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
                        else
                        {
                          this.messageService.add({severity:'error', summary: 'Failed', detail: 'Failed to Update Extra Servcies', life: 3000});
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
            //--ExtraService update
            this.blockedPanel=true;
            let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
            console.log(url);
            let param: any = {};
            param.op = "update";
            param.entityid={id:this.Shipinstruct.id};
            param.entity = "Wrx_ShipInstruct";
            param.attributes = this.Shipinstruct;
            console.log(param.attributes);
            
            let headers = new HttpHeaders();
            this.http.post(url, param, {headers: headers}).subscribe(
              (res) => 
              {
                console.log(res);
                var response: any = res;
                if(response.success)
                {
                  this.messageService.add({severity:'success', summary: 'Successful', detail: 'Shipment instruction Updated', life: 3000});
                  this.getshipinstruct();

                }else{
                  this.messageService.add({severity:'error', summary: 'Failed', detail: 'Shipment instruction Not Updated', life: 3000});
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

            if(this.Shipinstructs.find((element:any)=>element.Transloader==this.Shipinstruct.Transloader && element.GW==this.Shipinstruct.Gw && element.Commodityid==this.Shipinstruct.Commodityid))
              {
                this.Shipinstruct.Transloader = null;
                this.Shipinstruct.Gw = null;
                this.Shipinstruct.Commodityid = null;
                this.blockedPanel=false;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Ship Instruction Exist', life: 3000});
                return;
              }
            let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
            console.log(url);
            let param: any = {};
            param.op = "create";
            param.entity = "Wrx_ShipInstruct";
            param.attributes = this.Shipinstruct;
            let headers = new HttpHeaders();
            this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Shipment instruction Created', life: 3000});
                this.getshipinstruct();

          //-- Create relation in many many
              console.log("Extra servcie-->>" + response.result.maxID);
              
              this.selectedExtras.forEach((EX: any) => 
              {
                this.ShipExtra.push({"FromId": response.result.maxID, "ToId": EX , "FromType":"Ship", "ToType":"ExSrv"});
              });

              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createRelations";
              console.log(url);
              let param: any = {};
              param.op = "createRelations";
              param.FromType = "Ship";
              param.ToType = "ExSrv";
              param.attributes = this.ShipExtra;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Extra Services Created', life: 3000});
                  }
                  else
                  {
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Extra Services Not Created', life: 3000});
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
                
                this.Shipinstruct();
      
          //--End of relation       

                this.blockedPanel=false;
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Shipment instruction Not Created', life: 3000});
                    this.blockedPanel=false;
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
                        }
        
          this.addNewDialogue = false;
        //SQL finish create...........................................................................................................
    }
onRowEditCancel(Shipinstruct:any, index:number) 
  {
    this.rows[index] = this.Shipinstructs[this.Shipinstruct.ID];
    delete this.Shipinstructs[this.Shipinstruct.ID];
  }
  exportSelExcel(Ins:any)
  {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(Ins);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'SelectedShipInstruct');
  });
  }
  exportExcel()
  {
    
    this.getShipInstructExcel();

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.ShipInstructExcel);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'ShipInstruct');
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
