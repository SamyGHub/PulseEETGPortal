import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PickListFilterOptions } from 'primeng/picklist';
import { Utils } from '../utils';
import { GeneralService } from '../general.service';
import { Router } from '@angular/router';
 

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit 
{
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedCustomers: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  customer: any;
  customers: any [] = [];
  teamsDialogue = false;
  submitted: boolean = false;
  tablefilter: string = "";
  CustSett:any[]=[];
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  myDate = new Date();
  adddtDialogue:boolean=false;
  custdtcols:any=[];
  custdt:any=[];
  updateObject:any=[];
  countryrows:any=[];
 
  constructor(
    private messageService: MessageService, private router: Router,
    private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient) {
      this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
    this.getcustomers();
    this.getSettings();
    this.getCountries();
    //this.getcustdt(); 
    }
  ngOnInit(): void {
    
  }
    getCountries()
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
          if(response.success){
            this.countryrows = response.result.queryresult;
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
onRowSavedtd(custdt:any)
{
  console.log(custdt);
  this.blockedPanel=true;
  let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
  console.log(url);
  let param: any = {};
  param.op = "create";
  param.entity = "Wrx_CustomerDetails";
  param.attributes = custdt;
  let headers = new HttpHeaders();
  this.http.post(url, param, {headers: headers}).subscribe(
  (res) => 
  {
    console.log(res);
    var response: any = res;
    if(response.success)
    {
      this.messageService.add({severity:'success', summary: 'Successful', detail: 'Customer Details Created', life: 3000});
      this.getcustdt(custdt.customerid);
    }else{
      this.messageService.add({severity:'error', summary: 'Failed', detail: 'Customer Details Not Created', life: 3000});
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
addDetails()
{
  this.getcustdt(this.selectedCustomers[0].id);
  this.adddtDialogue=true;
}
isRowSelectable(event:any) {
  return (event.data.id)? true : false;
}
onRowSelect(event: any) {
  
  if(!this.updateObject.find((obj: any)=>obj.id==event.data.id)){
    this.updateObject.push(event.data);
  }
  console.log(this.updateObject);
  this.generalservice.selectedObject = this.updateObject;
  this.generalservice.prodDialogueDisplay = false;
}
onRowUnselect(event: any) {
  //this.messageService.add({key: 'toast01',severity:'info', summary:'Product Unselected',  detail: event.data.Transloader});
}

getcustdt(custid:any)
  {
    this.blockedPanel=true;
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_CustomerDetails where customerid= " + custid + ";";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.custdtcols = response.result.cols[0];
          this.custdt = response.result.queryresult;
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
getSettings()
{
  let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Setting;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          this.CustSett = response.result.queryresult;
          console.log(this.CustSett);
        }
      },response => {
        console.log("Post call in error", response); 
    },
    () => {
        console.log("The Post observable is now completed.");
        
    })
}
deleteSelectedCustomer(cust:any)
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
        param.entityid={id:cust.id};
        param.entity = "Wrx_CustomerDetails";
        param.attributes=cust;

        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Details Deleted', life: 3000});

            this.getcustdt(cust.customerid);
              
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Details Not Deleted', life: 3000});
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
getcustomers()
{
  //let users = sessionStorage.getItem("Users");
  this.blockedPanel=true;
  let param: any = {};
      param.op = "query";
      param.query = "select * from vw_CustomerCreation;";
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
addNew()
{ 
  this.customer = {};
  this.submitted = false;
  this.addNewDialogue = true;
}

addCustdt()
{
  let Customerdt:any = {};
      console.log(this.selectedCustomers[0].id);
           
      Customerdt.customerid = this.selectedCustomers[0].id;
      Customerdt.Address = "";
      Customerdt.Notify = "";
      this.custdt = [...this.custdt,Customerdt];
}

showPositionDialog(position: string, message: string) 
{
  this.dialougmessage = message;
  this.position = position;
  this.displayPosition = true;
}
findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.customers.length; i++) 
    {
      if (this.customers[i].id === id) 
      {
        index = i;
        break;
      }
    }

    return index;
  }
saveCustomer()
  {
    this.submitted = true;
    if (this.customer.CustName && this.customer.CustName.trim()) 
    {
      if (this.customer.id) 
      {
        this.customers[this.findIndexById(this.customer.id)] = this.customer;
        
        this.customer.modifiedby = this.loggedinuser.id;
        this.customer.modifiedon = this.myDate;

        delete this.customer.CUName;
        delete this.customer.MUName;

        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        this.blockedPanel=true;
        let param: any = {};
        param.op = "update";
        param.entityid={id:this.customer.id};
        param.entity = "Wrx_Customers";
        param.attributes = this.customer;
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Customer Updated', life: 3000});
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Customer Not Updated', life: 3000});
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
              this.getcustomers();
              //this.blockedPanel=false;
            })
          }
           else 
          {
          if(this.customers.find((element:any)=>element.CustNum==this.customer.CustNum))
          {
            this.customer.CustName = null;
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Customer Name Exist', life: 3000});
            return;
          }
            //this.customer.id = this.createId();
            
            // this.country.status = true;
            this.customer.createdby = this.loggedinuser.id;
            this.customer.createdon = this.myDate;
            this.customer.modifiedby = this.loggedinuser.id;
            this.customer.modifiedon = this.myDate;
           
            delete this.customer.CUName;
            delete this.customer.MUName;
           
            this.blockedPanel=true;
            let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
            console.log(url);
            let param: any = {};
            param.op = "create";
            param.entity = "Wrx_Customers";
            param.attributes = this.customer;
            let headers = new HttpHeaders();
            this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Customer Created', life: 3000});
                this.getcustomers();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Customer Not Created', life: 3000});
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
              this.addNewDialogue = false;
              this.customer = {};
        }
      }
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  createId(): string 
{
  let id = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 5; i++ ) 
  {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
editCustomer(customer: any)
  {
    this.submitted = true;
    this.customer = {...customer};
    console.log(this.customer)
        this.addNewDialogue = true;
  }
  deleteSelectedCustomers(selectedcoustomers:any)
  {
      this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Customers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/deleteMultiple";
        console.log(url);
        let param: any = {};
        param.op = "deleteMultiple";
        //param.entityid={id:grade.id};
        param.entity = "Wrx_Customers";
        param.attributes=selectedcoustomers;

        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Customers Selected Deleted', life: 3000});
              this.getcustomers();
            }
            else
            {
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Customers Selected Not Deleted', life: 3000});
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
  deleteSelectedcustomer(customer: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + customer.Name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.id !== customer.id);
          this.customer = {};
    //Delete SQL Database
        this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:customer.id};
          param.entity = "Wrx_Customers";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Customer Deleted', life: 3000});
                this.getcustomers();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Customer Not Deleted', life: 3000});
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
}