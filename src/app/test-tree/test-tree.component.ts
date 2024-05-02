import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { GeneralService } from '../general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-test-tree',
  templateUrl: './test-tree.component.html',
  styleUrls: ['./test-tree.component.css']
})
export class TestTreeComponent {
  tableData: TreeNode[] = []; 
  batches:any[]=[];
  batchcols:any=[];
  IDs:any=[];
  Subsplitcols:any =[];
  Subsplit:any =[];
  event:any;
  selectedbatch:any;

  constructor(   
    public generalservice: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService, private confirmationService: ConfirmationService, public datePipe: DatePipe) {
    
      this.getbatches();
    }

     getbatches()
    {
      this.batches= [];
      let param: any = {};
        param.op = "query";
        param.query = "select SplitNo, Bookingid, CalcQuantity, Contractid, Shipinstruct, id, Sourceid,Splitid from Wrx_BatchContract where Contractid =83;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
          //  this.batchcols = response.result.cols[0];
           this.batchcols = [
               { field: 'Bookingid', header: 'Booking' },
               { field: 'CalcQuantity', header: 'Quantity' },
              { field: 'Contractid', header: 'Contract' },
              { field: 'Shipinstruct', header: 'Shipment Instruction' }
           ];
            this.batches = response.result.queryresult;
           //console.log(this.newcontractbatch.Bookingid);
           
           
            if (this.batches.length>0)
            {
              let total = 0;
              let bdgin = 0;
              for(let quant of this.batches) 
              {
                if((quant.Bookingid!==0 && quant.Shipinstruct!==0 && quant.prodinstructid!==0) || (quant.Bookingid!==0 && quant.Shipinstruct!==0 && quant.Source!==2))
                 {
                   total += +quant.CalcQuantity;
                 }
                else{
                    
                }
              }
              
            }
            this.getSubSplit();
          }else{

          }
        },response => {
          console.log("Post call in error", response);
          
      },
      () => {
          console.log("The Post observable is now completed.");
      })
    }
    getSources()
    {
      this.batches.forEach((idelement:any,idindex:number)=>{
        this.IDs[idindex] = idelement.id.toString();
      });
      console.log(this.IDs.toString());
      
      let param: any = {};
        param.op = "query";
        param.query = "select SplitNo, Bookingid, CalcQuantity, Contractid, Shipinstruct, id, Sourceid,Splitid from Wrx_SubSplit where Splitid in (" + this.IDs.toString() + ");";
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
              this.batches.forEach((Belement:any)=>{
                let tableTreeObject : any= {};
                //tableTreeObject.key = Belement.id;
                //tableTreeObject.lable=Belement.SplitNo;
                tableTreeObject.data = Belement;
                tableTreeObject.children = [];
                this.Subsplit.forEach((Selement:any)=>
                {
                  if(Belement.id == Selement.Splitid)
                    {
                      let tableTreeSub: any = {};
                      //tableTreeSub.key = Belement.id+"."+Selement.id;
                      tableTreeSub.data = Selement;
                      tableTreeObject.children = [...tableTreeObject.children,tableTreeSub];
                      
                    }
                });
                
                this.tableData = [...this.tableData,tableTreeObject];
           });
           //console.log("batch cols", this.batchcols);
           
            console.log("Batches Children",this.tableData );
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
    getSubSplit()
    {
      this.batches.forEach((idelement:any,idindex:number)=>{
        this.IDs[idindex] = idelement.id.toString();
      });
      console.log(this.IDs.toString());
      
      let param: any = {};
        param.op = "query";
        param.query = "select Bookingid, CalcQuantity, Contractid, Shipinstruct, id, Sourceid,Splitid from Wrx_SubSplit where Splitid in (" + this.IDs.toString() + ");";
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
                      
                      this.batches[index].children = [...this.batches[index].children,Selement];
                      
                    }
                });
                
                
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
    addNewSplit(){}
  }
