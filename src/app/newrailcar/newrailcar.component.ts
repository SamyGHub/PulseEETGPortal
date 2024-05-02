import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, FilterService, FilterMatchMode, SelectItem } from 'primeng/api';
import { GeneralService } from '../general.service';
import FileSaver from 'file-saver';
import { Table } from 'primeng/table';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-newrailcar',
  templateUrl: './newrailcar.component.html',
  styleUrls: ['./newrailcar.component.css']
})
export class NewrailcarComponent {
  rows: any [] =[];
  myDate = new Date ();
  loggedinuser:any;
  cols:any []=[];
  addNewDialogue:boolean=false;
  railcar:any;
  submitted: boolean = false;
  blockedPanel: boolean = false;
  invalidDates: Array<Date>;
  selectedRails:any=[];
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  Plants:any=[];
  Commrows:any=[];
  pkgrows:any=[];
  Transloaders:any=[];
  Origin:any=[]
  tablefilter: string = "";
  matchModeOptions: SelectItem[]=[];
  variety: any = [];
  filteredvariety: any = [];
  graderows:any =[];
  Purchases:any=[];
  PurCols:any=[];
  selectedpu:any = [];
  updateObject: any = [];
  commodities:any=[];
  containerrelatedrail:any=[];

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
      this.getCommodities();
      this.getPlants();
      this.getOrigin();
      this.getPkgs();
      this.getTransloaders();
      this.getVariety();
      this.FGrade();
      this.getCommimgs();
      
  }
  FGrade()
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
  clear(table: Table) {
    table.clear();
  }
  filtervarietybycommodity(commodityid:number)
  {
    console.log(commodityid);
    
    this.filteredvariety=this.variety.filter((item:any) => item.commodityid == commodityid);
    console.log(this.filteredvariety);
    this.getPurchase(commodityid)
  }
  showPurchase(railcar:any)
  {
    if(!this.updateObject.find((obj: any)=>obj.id==railcar.id))
    {
      this.updateObject.push(railcar);
      console.log(this.updateObject);
    }
  
    this.generalservice.sourceObject = railcar;
    this.generalservice.purDialogueDisplay = true;
  }
  getPurchase(commodityid:number)
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from vw_PurchaseContractsRemain where Commodityid =" + commodityid + ";";
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
  clearValueOnService()
{
  this.generalservice.selectedObject = {};
}
onRowpuOVSelect(event:any, popu: OverlayPanel, railcar:any) {
    
  if(!this.updateObject.find((obj: any)=>obj.id==railcar.id))
  {
    console.log("in update");
    console.log(railcar.id);
    
    this.updateObject.push(railcar);
    console.log(this.updateObject);
    console.log(railcar);
    
  }

    this.generalservice.sourceObject = railcar;
    popu.hide();
}
  setPurchaseValueFromService()
{

  if(!this.selectedpu)
    return;
  let selectedObject = this.selectedpu;
  let sourceObject  = this.generalservice.sourceObject;
  console.log("service selected object", this.selectedpu);
  
  // this.railcar.forEach((element: any,index: number)=>{
  //   if(element.id == this.generalservice.sourceObject.id)
      this.railcar.Purchaseid = this.selectedpu.id;
      console.log("Selected id", this.railcar.Purchaseid);
      
 // });
  
  // this.generalservice.sourceObject
}
  getTransloaders()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select id, TransName from Wrx_Transloaders;";
    let headers = new HttpHeaders();
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {
        this.Transloaders = response.result.queryresult;
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
  getPkgs()
  {
    this.blockedPanel=true;
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
  findIndexById(id: string): number 
{
  let index = -1;
  for (let i = 0; i < this.rows.length; i++) 
  {
    if (this.rows[i].id === id) 
    {
      index = i;
      break;
    }
  }

  return index;
}
  onRowSave()
  {
    //SQL to create Record
    this.submitted = true;
  
    this.blockedPanel=true;
    if(this.railcar.id)
      {
      
          //this.railcar[this.findIndexById(this.railcar.id)] = this.rows;
          this.railcar.modifiedby = this.loggedinuser.Uid;
          this.railcar.modifiedon = this.myDate;
        
  
          delete this.railcar.Plant;
          delete this.railcar.Name;
          delete this.railcar.bagname;  
          delete this.railcar.TransName;
          delete this.railcar.CUNAME;
          delete this.railcar.MUNAME;
          delete this.railcar.bagname;
          delete this.railcar.Origin;
          delete this.railcar.TransID;
          delete this.railcar.variety;
          delete this.railcar.Grade;
          delete this.railcar.Contractnumber;
          delete this.railcar.UnloadWeight;
          delete this.railcar.WeightRemaining;
          
          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid={id:this.railcar.id};
          param.entity = "Wrx_RailCars";
          param.attributes = this.railcar;
          console.log(param.attributes);
          
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Rail Car Updated', life: 3000});
                this.getrails();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Rail Car Not Updated', life: 3000});
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
          
          this.railcar.modifiedby = this.loggedinuser.Uid;
          this.railcar.modifiedon = this.myDate;
          this.railcar.createdby = this.loggedinuser.Uid;
          this.railcar.createdon = this.myDate;
  
          delete this.railcar.Plant;
          delete this.railcar.Name;
          delete this.railcar.bagname;  
          delete this.railcar.TransName;
          delete this.railcar.CUNAME;
          delete this.railcar.MUNAME;
          delete this.railcar.bagname;
          delete this.railcar.Origin;
          delete this.railcar.TransID;
          delete this.railcar.variety;
          delete this.railcar.Grade;
          delete this.railcar.Contractnumber;
          delete this.railcar.UnloadWeight;
          delete this.railcar.WeightRemaining;

          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
          console.log(url);
          let param: any = {};
          param.op = "create";
          param.entity = "Wrx_RailCars";
          param.attributes = this.railcar;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Rail Car Created', life: 3000});
              this.getrails();
              this.blockedPanel=false;
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Rail Car Not Created', life: 3000});
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
  getVariety()
  {
    this.blockedPanel=true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_Variety;";
    let headers = new HttpHeaders();
  
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
  
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success){
        this.variety = response.result.queryresult;
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
  getOrigin()
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
        this.Origin = response.result.queryresult;
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
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  getCommimgs()
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
  getrails()
  {
    this.blockedPanel=true;
      let param: any = {};
          param.op = "query";
          param.query = "select * from vw_RailCarsMaster;";
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
  addRailCar()
  {
    this.railcar = {};
    this.submitted = false;
    this.addNewDialogue = true;
  
  this.railcar.createdon = this.myDate;
  this.railcar.createdby = this.loggedinuser.id;
  this.railcar.modifiedby = this.loggedinuser.id;
  this.railcar.modifiedon = this.myDate;
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
  getPlants()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Plants;";
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
  editrail(RailEdit: any)
  {
    this.submitted = true;
    this.railcar = {...RailEdit};
    console.log(this.railcar);
    //this.FVariety(this.PrdIn.Commodityid)
    this.addNewDialogue = true;
  }
  DeleteContainerrelated(Rail:any)
  {
    this.confirmationService.confirm({
    message: 'Are you sure you want to Delete Containers Related?',
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
      param.entityid={railcarid:Rail.id};
      param.entity = "Wrx_Containers";
      //param.attributes=Rail;

      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Rail Car Deleted', life: 3000});
            this.getrails();
           
            
          }else{
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Rail Car Not Deleted', life: 3000});
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
  deleteRail(Rail:any)
  {
    this.confirmationService.confirm({
    message: 'Are you sure you want to Delete RailCar?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      //this.rows = this.rows.filter(val => val.id !== grade.id);
      //this.grade = {};
      //get assigned containers
        let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_Containers where railcarid=" + Rail.id + ";";
        let headers = new HttpHeaders();
      
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {  
            this.containerrelatedrail = response.result.queryresult;

            console.log(this.containerrelatedrail);
            
            if (this.containerrelatedrail.length != 0)
            {
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.RailContainer);
              console.log("Rail Car has contanire");
                }else{
                        //Delete SQL Database
              this.blockedPanel=true;
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
              console.log(url);
              let param: any = {};
              param.op = "delete";
              param.entityid={id:Rail.id};
              param.entity = "Wrx_RailCars";
              param.attributes=Rail;

              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
              (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Rail Car Deleted', life: 3000});
                    this.getrails();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Rail Car Not Deleted', life: 3000});
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
            },response => {
              console.log("Post call in error", response);
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
              this.blockedPanel=false;
          },
          () => {
              console.log("The Post observable is now completed.");
              
          })
        }
      });
  }
    //..........................................................................
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
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

}
