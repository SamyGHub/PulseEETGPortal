import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import { DialogService } from 'primeng/dynamicdialog';
import FileSaver from 'file-saver';
import { FilterMatchMode, FilterService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-railscardetails',
  templateUrl: './railscardetails.component.html',
  styleUrls: ['./railscardetails.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DialogService, MessageService, DatePipe,FilterService]
})
export class RailscardetailsComponent {

  blockedPanel: boolean = false;
  Railobjs:any [] = [];
  Railobj:any = {};
  loggedinuser: any;
  cols:any = [];
  selectedrailcar:any = {};
  product:any = [];
  selectedcontainer:any={};
  containers:any []= [];
  container:any = {};
  Containercols:any []= [];
  myDate: Date = new Date ();
  updateObject:any=[];
  submitted:boolean=false;
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  SS:boolean=false;
  oneBatch: any = {};
  SPcols:any=[];
  SPobjs:any = [];
  commodities:any=[];
  Railbysplit:any=[];
  Railbysplitcols:any=[];
  selectedRailsbysplit:any;
  matchModeOptions: SelectItem[]=[];
  ispassed:boolean = false;
  contractsrails:any=[];
  fileReaded: any;
  conMatch:any=[];
  uploadedFiles: any[] = [];
  TData:any=[];

  constructor(private generalservice: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService, private confirmationService: ConfirmationService, private datePipe: DatePipe, public dialogService: DialogService,private filterService: FilterService)
    {
      this.loggedinuser = generalservice.getLoggedUser();
        if(!this.loggedinuser)
      {
        
        this.router.navigateByUrl('/app-login');
      }
      this.isRowContainerSelectable = this.isRowContainerSelectable.bind(this);
      this.isRowSelectable = this.isRowSelectable.bind(this);

      if(this.route.snapshot.queryParamMap.get("source"))
      {
        let productstring = this.product = this.route.snapshot.queryParamMap.get("source");
        
         console.log("Product String aho", productstring);
        
        if(productstring)
          this.product = JSON.parse(atob(productstring));
          console.log("Product -->")
          console.log(this.product);
         
          
      }
        
        this.getSplitData();
        this.getCommodities();
        this.getRailCarsbysplit();
        this.getrailcarsbyid();

        //this.getRailCars();
      }
      clear(table: Table) 
    {
      table.clear();
    }
      getRailCarsbysplit()
      
        {
          let param: any = {};
          param.op = "query";
          param.query = "select distinct * from vw_RailContainersbySplit where Splitid like '" + this.product.Splitid + "';";
          console.log("This Splits -->" , param.query);
          let headers = new HttpHeaders();
          
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
          
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.Railbysplitcols = response.result.cols[0];
                this.Railbysplit = response.result.queryresult; 
           
                if(!this.Railbysplit.length)
                this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.MissingRailCars + "  " + this.product.SplitNo);
    
              }
              else
              {
                this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
              }
            },response => {
              console.log("Post call in error", response);
              this.blockedPanel=false;
          },
          () => {
              console.log("The Post observable is now completed.");
              this.blockedPanel=false;
          })    
      }
    getSplitData()
    {
      
      let param: any = {};
      param.op = "query";
      param.query = "select distinct * from vw_SplitContracts where id like '" + this.product.Splitid + "';";
      console.log("This Splits -->", param.query);
      let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.SPcols = response.result.cols[0];
            this.SPobjs = response.result.queryresult; 
           console.log("This Splits -->");
           console.log(this.SPobjs);
           
           this.getRailCars();
           
            if(!this.SPobjs.length)
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data + "  For This SPlit:  " + this.product.SplitNo);

          }
          else
          {
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
          }
        },response => {
          console.log("Post call in error", response);
          this.blockedPanel=false;
      },
      () => {
          console.log("The Post observable is now completed.");
          this.blockedPanel=false;
      })
    }
    getCommodities()
    {
      //this.blockedPanel = true;
      let param: any = {};
        param.op = "query";
        param.query = "select id,Name, Commodityimg from Wrx_Commodity;";
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
    getRailsContractRelated(id:any)
    {
      this.contractsrails=[];
      let param: any = {};
      param.op = "query";
      param.query = "select * from vw_RailsContractRelated where id = " + id + ";";
      
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
            this.contractsrails = response.result.queryresult;
            console.log(this.contractsrails);
            
           
            if(!this.Railobjs.length)
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data + "  For This Product:  " + this.SPobjs[0].Name);

            this.Railobjs.forEach((r:any,index:number)=>{
             
              if(id==r.id){
                
                this.Railobjs[index].Contractnumber = this.contractsrails.map((x: any)=>x.Contractnumber).join(",");
              }
            });
            console.log(this.Railobjs);
          }
          else
          {
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
          }
        },response => {
          console.log("Post call in error", response);
          this.blockedPanel=false;
      },
      () => {
          console.log("The Post observable is now completed.");
          this.blockedPanel=false;
      })
    } 
    getRailCars()
    {
      this.blockedPanel=true;
      let param: any = {};
      param.op = "query";
      param.query = "select distinct * from vw_RailCarsRelated where productno = '" + this.SPobjs[0].Commodityid + "';";
      
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
            this.cols[12] = "Actual Contract Number";
            this.Railobjs = response.result.queryresult;
            this.Railobjs[12].Contractnumber = "";
            console.log(this.Railobjs);
            
            if(this.Railobjs.length)
            {
              this.Railobjs.forEach((r:any,index:number)=>{
                this.Railobjs[index].shipdate = new Date(r.shipdate);
                this.Railobjs[index].Newshipdate = new Date(r.Newshipdate);
                
                if (this.Railobjs[index].Newshipdate.getTime() > this.myDate.getTime())
                    this.ispassed= true;   
              });
              console.log("RailObject",this.Railobjs);
            }else{
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.Data + "  For This Product:  " + this.SPobjs[0].Name);

            }           
          }
          else
          {
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
          }
        },response => {
          console.log("Post call in error", response);
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
    onRowSave(E: any)
    {
      
      E.LoadingDate = this.datePipe.transform(E.LoadingDate,'yyyy-MM-dd');

      this.blockedPanel=true;
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
      console.log(url);
      let param: any = {};
      param.op = "create";
      param.entity = "Wrx_Containers";
      param.attributes = E;
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'New Container Created', life: 3000});
          this.getContainers(E.id);
          this.getRailCars();
          this.getRailCarsbysplit();
          //................................Get Status for Contratc if railcarmapped is assigned to split
            
            let updatestatus:any ={};
              updatestatus.SplitStatus = 3;
              this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
                console.log(url);
                let param: any = {};
                param.op = "update";
                param.entityid={id:this.product.id};
                param.entity = "Wrx_BatchContract";
                param.attributes = updatestatus;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                  (res) => 
                  {
                    console.log(res);
                    var response: any = res;
                    if(response.success)
                    {
                      this.messageService.add({severity:'success', summary: 'Successful', detail: 'Status Updated As Planned', life: 3000});
                      //this.getCommodities();
                    }else{
                      this.messageService.add({severity:'error', summary: 'Failed', detail: 'Status Not Updated', life: 3000});
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
          
           //..................................................
        }else{
          this.messageService.add({severity:'error', summary: 'Failed', detail: 'Container Not Created', life: 3000});
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
    onRowUnselect(event: any) 
    {
      this.messageService.add({key: 'toast01',severity:'info', summary:'RailCar Unselected',  detail: event.data.id});
    }
    onRowcontainerUnselect(event: any) 
    {
      this.messageService.add({key: 'toast01',severity:'info', summary:'RailCar Unselected',  detail: event.data.id});
    }

    isRowContainerSelectable(event:any) 
    {
      return (event.data.id)? true : false;
    }

    isRowSelectable(event:any) 
    {
      return (event.data.id)? true : false;
    }

    getContainers(id:any)
    {
      console.log(this.selectedrailcar.id);
      
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_Containers where railcarid =" + this.selectedrailcar.id + ";";
         
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.Containercols = response.result.cols[0];
            this.containers = response.result.queryresult;
            console.log(this.containers)
          }
          else
          {
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Network Connection Error' + response.message, life: 3000});
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
    onRowSelect(event: any) {
      console.log(event.data.carnumber);
      this.selectedrailcar = event.data;
      
      if(event.data.RemainingCarQty>0 || event.data.RemainingCarQty=='')
      {
        console.log(event.data);
        this.SS = false;
      }else{
        console.log(event.data.RemainingCarQty);
        
          this.SS = true;
        }
      this.getContainers(event.data.id);
      
      console.log("Event RailID",event.data.id);
      
      this.getRailsContractRelated(event.data.id)
      //this.container.push(event.data.carnumer)
         
      // if(!this.updateObject.find((obj: any)=>obj.id==event.data.id))
      //   this.updateObject.push(event.data);
      // console.log(this.updateObject);
      // this.generalservice.selectedObject = this.updateObject;
      // this.generalservice.shipDialogueDisplay = false;
      // this.messageService.add({key: 'toast01',severity:'info', summary:'Product Selected', detail: event.data.id});
     }
     onRowcontainerSelect(event: any)
     {
      console.log("Container Select");
      
        console.log(event.data);
        event.data.BookingNum = this.SPobjs[0].BookingRef;
        
        if(!this.updateObject.find((obj: any)=>obj.id==event.data.id)){
         
          this.updateObject.push(event.data);
          console.log("Update");

        }
        
        //this.selectedBooking.BookingRef = event.data.BookingRef;
        console.log(this.updateObject);
     }

    addContainer()
    {
          
      let container: any = {};
  
      container.LoadingDate = "";

      container.SplitNoid = this.SPobjs[0].id
  
      container.RailCar = this.selectedrailcar.carnumber
  
      container.BookingNum = this.SPobjs[0].BookingRef;
  
      container.LoadOrderNumber = "";
  
      container.ContainerNum = "";
  
      container.NumOfPackages = "";
  
      container.SealNumber = "";
  
      container.UnloadWeight = "";
      container.BagWeight = this.selectedrailcar.bagweight;
      container.TransferOrderNum = "";
      container.ContractBarNumber = "";
      container.VGM = "";
      container.createdon = this.myDate;
      container.createdby = this.loggedinuser.id;
      container.modifiedby = this.loggedinuser.id;
      container.modifiedon = this.myDate;
      container.railcarid = this.selectedrailcar.id;
  
      this.containers = [...this.containers,container];
      console.log(this.containers);
      
    }
    getrailcarsbyid()
    {
      let param: any = {};
        param.op = "query";
        param.query = "select distinct ContainerNum from Wrx_Containers where SplitNoid = " + this.product.Splitid + ";";
        let Xheaders = new HttpHeaders();
      
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: Xheaders}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.conMatch = response.result.queryresult;
            console.log("Match",this.conMatch);
        
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
              this.blockedPanel=false;
                });
      }
    
   csv2Array(fileInput: any)
    {
      this.blockedPanel = true;
      //read file from input
      this.fileReaded = fileInput.files[0];
      let finalrecords: any = [];

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
            let salescontract: any = {};
            let data = allTextLines[i].split(';');
            console.log(data);
              
            for (let j = 0; j < headers.length; j++) 
            {
              headers[j] = headers[j].trim();
             
              if(headers[j]=="UnloadWeight" || headers[j]=="BagWeight" || headers[j]=="NumOfPackages" ){
                salescontract[headers[j]] = (data[j].trim());
              }else if (headers[j] == "SplitNo"){
                // salescontract[headers[j]] = moment(data[j].trim()).format("MM/dd/yyyy");
                // console.log(salescontract[headers[j]]);
              continue;
              }
              else if(data[j] && (headers[j]=="RailCar" || headers[j]=="BookingNum" || headers[j]=="LoadOrderNumber" || headers[j]=="ContainerNum" || headers[j]=="SealNumber" || headers[j]=="TransferOrderNum"))
              {
                data[j] = data[j].replace(/[^\w\s]/gi, "")
                salescontract[headers[j]] = data[j].trim();
              }
              else{
                salescontract[headers[j]] = (data[j])? data[j].trim():"";
              // console.log("sales contract", salescontract);
              }
            }
          
              console.log("line", salescontract);
              if (!salescontract.UnloadWeight || salescontract.UnloadWeight==0 || salescontract.BagWeight ==0) 
              {
                continue;
              }          
              lines.push(salescontract);
          }
        }
          if(lines.length>0)
            {
            this.TData = lines;
            //this.uploadImportedRecords();
            
            let containerNames = this.TData.map((item: any)=>{
              return item.ContainerNum;
            })
            let hasDuplicate=containerNames.some((item:any, id:any)=>{ 
              return containerNames.indexOf(item)!=id
            });
            //console.log("hasduplicates", hasDuplicate);
            if(hasDuplicate==true)
              {
                this.showPositionDialog('Top','Excel has Repeated RailCars please fix and upload again');
                lines=[];
                this.TData=[];
              }
              else
              {
                let found = false;
                this.TData.forEach((exrail:any)=>{
                 
                  if(this.Railobjs.find((rail:any)=>rail.carnumber==exrail.RailCar)==null){
                    this.showPositionDialog('Top','Excel has RailCars Not Related to the commodity please fix and upload again');
                    lines=[];
                    this.TData=[];
                    found = true;
                    return;
                  }
                });
                //this.deleterailscontainers(this.product.Splitid);
                if(!found)
                  this.showPositionDialog('Top','Excel Upload');

              }
            }
            console.log(this.TData);       
          }
        } 
        this.blockedPanel = false;
      }
  
  deleterailscontainers(splitid:any)
  {
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
    console.log(url);
    let param: any = {};
    param.op = "delete";
    param.entityid={id:splitid};
    param.entity = "Wrx_Containers";
    //param.attributes=Con;

    let headers = new HttpHeaders();
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success)
        {
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Containers Deleted', life: 3000});
          this.uploadImportedRecords();
          
          
        }else{
          this.messageService.add({severity:'error', summary: 'Failed', detail: 'Container Not Deleted', life: 3000});
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
  uploadImportedRecords()
  {
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createMultiple";
      console.log(url);
      let param: any = {};
      param.op = "createMultiple";
      param.entity = "Wrx_Containers";
      param.attributes = this.containers;
      let headers = new HttpHeaders();
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
          console.log(res);
          var response: any = res;
          if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'containers Data Imported.', life: 3000});
              this.getRailCarsbysplit();
              this.blockedPanel=false;
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'containers Data Failed to Upload', life: 3000});
              this.blockedPanel=false;
            }
          },response => 
            {
              console.log("Post call in error", response);  
              this.blockedPanel=false;    
            },
            () => {
                   console.log("The Post observable is now completed.");
                   
                  })
       }
    deleteSelectedcontainer(Con:any)
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
          param.entityid={id:Con.id};
          param.entity = "Wrx_Containers";
          param.attributes=Con;
  
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Container Deleted', life: 3000});
  
                this.getContainers(this.selectedrailcar.id);
                this.getRailCars();
                this.getRailCarsbysplit();
                
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Container Not Deleted', life: 3000});
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
    UpdateContainer()
    {
      if(this.updateObject && this.updateObject.length>0)
    this.blockedPanel=true;
    {
      this.submitted = true;
          
      //this.commodities[this.findIndexById(this.shipinstruct.id)] = this.commodities;
      this.updateObject.forEach((element: any) => {
        element.modifiedby = this.loggedinuser.Uid;
        element.modifiedon = this.myDate;
      });
      
      console.log(this.updateObject);
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/updateMultiple";
      console.log(url);
      let param: any = {};
      param.op = "updateMultiple";
      //param.entityid={id:this.updateObject.id};
      param.entity = "Wrx_Containers";
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
            this.getRailCars();
            this.getContainers(this.updateObject.id)
            this.getRailCarsbysplit();
          }else{
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Shipping instruction Not Updated', life: 3000});
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
        this.updateObject =[];
    }
    exportExcelcontainers()
    {
      import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.containers);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'containers');
    });
    }
    exportExcelRail()
    {
      import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.Railobjs);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'RailCarsbysplit');
    });
    }
    exportExcel()
    {
      import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.Railbysplit);
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
