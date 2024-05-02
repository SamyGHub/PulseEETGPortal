import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import { DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import { TooltipModule} from 'primeng/tooltip';
import { FilterMatchMode, FilterService, SelectItem } from 'primeng/api';
import FileSaver from 'file-saver';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-prodinstruct',
  templateUrl: './prodinstruct.component.html',
  styleUrls: ['./prodinstruct.component.css'],
  providers: [DatePipe, DialogService, MessageService, FilterService],
  encapsulation: ViewEncapsulation.None
})
export class ProdinstructComponent {
  rows: any [] =[];
  myDate = new Date ();
  loggedinuser:any;
  prod:any=0;
  book:any=0;
  PrdIns:any[]=[];
  PrdIn:any;
  goal:any;
  activeIndex: number = 0;
  submitted: boolean = false;
  invalidDates: Array<Date>;
  Plants:any=[];
  Units:any=[];
  blockedPanel: boolean = false;
  updateObject: any = [];
  selectedInstruction: any = [];
  prodinstructid:any=[];
  Railobjs:any[]=[];
  Railobj:any={};
  Prd:any[]=[];
  ref: DynamicDialogRef = new DynamicDialogRef;
  Gw:any[]=[];
  CFIA:any =[];
  SGS:any=[];
  Tags:any[]=[];
  cols:any[]=[];
  crop:any[]=[];
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  Tot:number = 0;
  Supervision:any=[];
  Transloaders:any=[];
  Portsrows:any=[];
  Portscols:any=[];
  pkgrows:any=[];
  pkgcols:any=[];
  countriescols:any=[];
  countriesrows:any=[];
  palldicols:any=[];
  palldirows:any=[];
  pallstackcols:any=[];
  pallstackrows:any=[];
  Commcols:any=[];
  Commrows:any=[];
  graderows:any =[];
  pkgsweight: any =[];
  bagweight: any =0;
  ProdInstructExcel:any = [];
  Varirows:any=[];
  addNewDialogue:boolean=false;
  filteredvariety: any = [];

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

      this.book =1;
      let today = new Date();
      let invalidDate = new Date();
      invalidDate.setDate(today.getDate() - 1);
      this.invalidDates = [today,invalidDate];
      this.getPlants();
      this.getUnits();
      this.getrailcarstype();
      this.getGw();
      this.getTransloaders();
      this.getports();
      this.getPkgs();
      this.getcountries();
      this.getpalletstack();
      this.getpalletdimensions();
      this.getCommodities();
      this.getprdinstruct();
      this.getProdInstructionExcel();
      this.FGrade();
      this.getCFIA();
      this.getSGS();
      this.getSupervisions();
      this.getCrop();
      this.getTags();
      this.getVariety();
    
    }
    clear(table: Table) 
    {
      table.clear();
    }
    filtervarietybycommodity(commodityid:number)
    {
    console.log(commodityid);
    
    this.filteredvariety=this.Varirows.filter((item:any) => item.commodityid == commodityid);
    console.log(this.filteredvariety);
    
  }
    hideDialog()
  {
    this.addNewDialogue = false;
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
  getCrop()
  {
    this.blockedPanel=true;
      let param: any = {};
      param.op = "query";
      param.query = "select id, CropYear from Wrx_CropYear;";
      let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success){
              this.crop = response.result.queryresult;
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
  getSupervisions()
  {
    this.blockedPanel=true;
      let param: any = {};
          param.op = "query";
          param.query = "select id, Supervision from Wrx_Supervisions;";
          let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success){
              this.Supervision = response.result.queryresult;
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
  editinstruction(productionins: any)
  {
    this.submitted = true;
    this.PrdIn = {...productionins};
    console.log(this.PrdIn);
    //this.FVariety(this.PrdIn.Commodityid)
    this.addNewDialogue = true;
  }
  onRowcloneInit(productionins: any)
  {
    this.submitted = true;
    productionins.id="";
    
    this.PrdIn = {...productionins};
    console.log(this.PrdIn);
    //this.FVariety(this.PrdIn.Commodityid)
    this.addNewDialogue = true;
  }
  CalcMTTimes(pkgid:any)
    {
      console.log(this.PrdIn.pkgid);
      
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
        
        let unitnm: number = this.PrdIn.UnitNum;
        let bgnum: number = this.PrdIn.BagsNum;
        let bgwe: number = this.bagweight;
        let TotalM: number = this.PrdIn.TotalMT;
  
        //let Tot = unitnm * bgnum;
  
        this.PrdIn.BagsNum = (TotalM * bgwe)/ unitnm;
  
        console.log("Change in Total");
        
        console.log(this.PrdIn.BagsNum);
        
        //this.PrdIn.BagsNum = Tot;     
        
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
      console.log(pkgid);
      
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
        
        let unitnm: number = this.PrdIn.UnitNum;
        let bgnum: number = this.PrdIn.BagsNum;
        let bgwe: number = this.bagweight;
  
        let Tot = unitnm * bgnum;
  
        Tot = Tot /bgwe ;
  
      console.log("VVVVVVVVVVV");
        
        console.log(Tot);
        
        this.PrdIn.TotalMT = Tot;     
        
      }
    },response => {
      console.log("Post call in error", response);
    },
    () => {
        console.log("The Post observable is now completed.");
    })

    }
    FVariety(V:any)
  {
    this.blockedPanel=true;
    //console.log(item);
      let param: any = {};
      param.op = "query";
      param.query = "select id, variety from Wrx_Variety where commodityid =" + V + ";";
      let headers = new HttpHeaders();
    
    
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
  getVariety()
  {
      let param: any = {};
      param.op = "query";
      param.query = "select id, variety, commodityid from Wrx_Variety order by variety;";
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
  FGrade()
  {
    this.blockedPanel=true;
    //console.log(item);
      let param: any = {};
      param.op = "query";
      param.query = "select id, Grade from Wrx_GradeMap order by Grade;";
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
  getProdInstructionExcel()
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_ProdInstructExcel;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          //this.Commcols = response.result.cols[0];
          this.ProdInstructExcel = response.result.queryresult;
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
      param.query = "select id, Name from Wrx_Commodity order by Name;";
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
    getpalletdimensions()
    {
      this.blockedPanel=true;

      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_Palletdimensions order by Pallet;";
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
    getpalletstack()
    {
        this.blockedPanel=true;

      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_Palletstacking order by PalletStack;";
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
    getcountries()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select id, Name from Wrx_Countries order by Name;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.countriescols = response.result.cols[0];
            this.countriesrows = response.result.queryresult;
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
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_Packages order by bagname;";
    let headers = new HttpHeaders();
  
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
  
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success){
        this.pkgcols = response.result.cols[0];
        this.pkgrows = response.result.queryresult;
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
    getports()
  {
    this.blockedPanel=true;

    let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_Ports order by PortName;";
    let headers = new HttpHeaders();
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.Portscols = response.result.cols[0];
        this.Portsrows = response.result.queryresult;
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
    getTransloaders()
  {
    this.blockedPanel=true;

    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_Wrx_Transloader order by TransName;";
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
    getGw()
    {
      this.blockedPanel=true;
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
    getrailcarstype()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_RailCarsTypes order by typename;";
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
          this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
          this.blockedPanel=false;
      },
      () => {
          console.log("The Post observable is now completed.");
          this.blockedPanel=false;
      })
    }
    getprdinstruct()
    {
      this.blockedPanel=true;
      let param: any = {};
          param.op = "query";
          param.query = "select * from vw_Prdinstructscreen order by id desc;";
          let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success){
              this.cols = response.result.cols[0];
              this.PrdIns = response.result.queryresult;
              console.log(this.PrdIns)
              this.PrdIns.forEach((ins:any,index:number)=>{
                this.PrdIns[index].createdon = new Date(ins.createdon);
                this.PrdIns[index].BagsNum = Number(this.PrdIns[index].BagsNum);
                this.PrdIns[index].UnitNum = Number(this.PrdIns[index].UnitNum);
                this.PrdIns[index].TotalMT = Number(this.PrdIns[index].TotalMT)
              })
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
    
    getUnits()
    {
      let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Units order by UnitName;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {  
          this.Units = response.result.queryresult;
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel=false;
    },
    () => {
        console.log("The Post observable is now completed.");
    })
    }
    getPlants()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Plants order by Plant;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {  
          this.Plants = response.result.queryresult;
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel=false;
    },
    () => {
        console.log("The Post observable is now completed.");
        
    })
  }
  isRowSelectable(event:any) {
    return (event.data.id)? true : false;
  }
  onRowSelect(event: any) {
    
    if(!this.updateObject.find((obj: any)=>obj.id==event.data.id)){
      let Tot: number = event.data.TotalMT;
      //Tot = 0;
      this.CalcMT(event.data.pkgid);
      let unitnm: number = event.data.UnitNum;
      let bgnum: number = event.data.BagsNum;
      let bgwe: number = this.bagweight;

      Tot = unitnm * bgnum;

      Tot = Tot / bgwe;

      console.log("VVVVVVVVVVV");
      
      console.log(Tot);
      
      event.data.TotalMT = Number(Tot);
      this.updateObject.push(event.data);
    }
    console.log(this.updateObject);
    this.generalservice.selectedObject = this.updateObject;
    this.generalservice.prodDialogueDisplay = false;
    

    //this.messageService.add({key: 'toast01',severity:'info', summary:'Product Selected', detail: event.data.id});
}
  onRowUnselect(event: any) {
    //this.messageService.add({key: 'toast01',severity:'info', summary:'Product Unselected',  detail: event.data.Transloader});
}

  Updateinstruct()
  {
    if(this.updateObject && this.updateObject.length>0)
    {
      this.submitted = true;
          
        //this.commodities[this.findIndexById(this.shipinstruct.id)] = this.commodities;
        this.updateObject.forEach((element: any) => {
          element.modifiedby = this.loggedinuser.id;
          element.modifiedon = this.myDate;
          element.TotalMT = 0;
          element.TotalMT = Number((element.UnitNum * element.BagsNum)/this.bagweight);
        });
        
        console.log(this.updateObject);
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/updateMultiple";
        console.log(url);
        let param: any = {};
        param.op = "updateMultiple";
        //param.entityid={id:this.updateObject.id};
        param.entity = "Wrx_ProdInstruct";
        param.attributes = this.updateObject;
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {                  
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Production instruction Updated', life: 3000});
              this.getprdinstruct();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Production instruction Not Updated', life: 3000});
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
  }
  Calc()
  {
    this.Tot = 0;
    this.Tot +=  (this.PrdIn.UnitNum * this.PrdIn.BagsNum)/this.bagweight;
    console.log('Total MT >>' + this.Tot);
    
  }
  addinstruct()
  {
 
     this.PrdIn = {};
      this.submitted = false;
      this.addNewDialogue = true;
    

    // PrdIn.Plant =0;

    // PrdIn.UnitType = 0;

    // PrdIn.UnitNum = 0;

    // PrdIn.BagsNum = 0;

    // PrdIn.UnitMesure = 0;

    // PrdIn.TotalMT = 0;

    // PrdIn.CFIA = 0;

    // PrdIn.SGS = 0;

    // PrdIn.Tags = 0;
    // PrdIn.LoadInstructions = 0;
    // PrdIn.Crop = 0;
    // PrdIn.PlanBal=0;

    this.PrdIn.createdon = this.myDate;
    this.PrdIn.createdby = this.loggedinuser.id;
    this.PrdIn.modifiedby = this.loggedinuser.id;
    this.PrdIn.modifiedon = this.myDate;
  }
  deleteSelectedins(Delprd:any)
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
          param.entityid={id:Delprd.id};
          param.entity = "Wrx_ProdInstruct";
          param.attributes=Delprd;

          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Instruction Deleted', life: 3000});

              this.getprdinstruct();
                
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
  onRowSave()
{
  //SQL to create Record
  this.submitted = true;

  this.blockedPanel=true;
  if(this.PrdIn.id)
    {
    
      this.PrdIns[this.findIndexById(this.PrdIn.id)] = this.PrdIns;
        this.PrdIn.modifiedby = this.loggedinuser.Uid;
        this.PrdIn.modifiedon = this.myDate;
        this.PrdIn.TotalMT = Number((this.PrdIn.UnitNum * this.PrdIn.BagsNum)/this.bagweight);
        this.PrdIn.BagsNum = Number(this.PrdIn.BagsNum);
        this.PrdIn.UnitNum = Number(this.PrdIn.UnitNum);
        

        delete this.PrdIn.GWName;
        delete this.PrdIn.PlantName;
        delete this.PrdIn.Name;  
        delete this.PrdIn.variety;
        delete this.PrdIn.Grade;
        delete this.PrdIn.TransName;
        delete this.PrdIn.bagname;
        delete this.PrdIn.CFIAName;  
        delete this.PrdIn.SGSName;
        delete this.PrdIn.Tag;
        delete this.PrdIn.SuperVisionName;
        delete this.PrdIn.Pallet;
        delete this.PrdIn.PalletStack;
        
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entityid={id:this.PrdIn.id};
        param.entity = "Wrx_ProdInstruct";
        param.attributes = this.PrdIn;
        console.log(param.attributes);
        
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Production instruction Updated', life: 3000});
              this.getprdinstruct();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Production instruction Not Updated', life: 3000});
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
        
        if(this.PrdIns.find((element:any)=>element.Plant==this.PrdIn.Plant && element.Gw==this.PrdIn.Gw && element.Commodityid==this.PrdIn.Commodityid))
              {
                this.PrdIn.Plant = null;
                this.PrdIn.Gw = null;
                this.PrdIn.Commodityid = null;
                this.blockedPanel=false;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Production Instruction Exist', life: 3000});
                return;
              }
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
        console.log(url);
        let param: any = {};
        param.op = "create";
        param.entity = "Wrx_ProdInstruct";
        param.attributes = this.PrdIn;
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Production instruction Created', life: 3000});
            this.getprdinstruct();
            this.blockedPanel=false;
          }else{
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Production instruction Not Created', life: 3000});
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
                this.addNewDialogue=false;
   
//SQL finish create...........................................................................................................
}
findIndexById(id: string): number 
{
  let index = -1;
  for (let i = 0; i < this.PrdIns.length; i++) 
  {
    if (this.PrdIns[i].id === id) 
    {
      index = i;
      break;
    }
  }

  return index;
}
exportSelExcel(Ins:any)
{
    
     import('xlsx').then((xlsx) => {
    const worksheet = xlsx.utils.json_to_sheet(Ins);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'SelectedPrdInstruct');
});
}
exportExcel()
{
  this.getProdInstructionExcel();
  
  import('xlsx').then((xlsx) => {
    const worksheet = xlsx.utils.json_to_sheet(this.ProdInstructExcel);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'ProdInstruction');
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