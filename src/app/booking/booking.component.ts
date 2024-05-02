import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import {TooltipModule} from 'primeng/tooltip';
import FileSaver from 'file-saver';
import { Table } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class BookingComponent {
  rows: any [] =[];
  myDate: any = new Date ();
  loggedinuser:any;
  prod:any=0;
  book:any=0;
  books:any[]=[];
  items: MenuItem[] = [];
  activeIndex: number = 0;
  submitted: boolean = false;
  invalidDates: Array<Date>
  addNewDialogue = false;
  updateObject:any=[];
  selectedBooking:any;
  blockedPanel: boolean = false;
  cols: any [] = [];
  users:any[]=[];
  teams: any;
  sourceUsers: any = [];
  targetUsers: any=[];
  usersbooks: any = [];
  bookingDialogue = false;
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  addNewDialogueATT:boolean=false;
  EntityId: string = "";
  OwnerName: string = "";
  OwnerId: string = "";
  EntityType: String = "Booking";
  DTH:any=[];
  Lines:any=[];
  ShipLinecols:any=[];
  Dischargeportsrows:any=[];
  ShipBookingExcel:any=[];
  booksplits:any=[];
  countriesrows:any=[];
  bookstatus:any=[];
  BookingRefEnable:boolean = false;
  ATTCount:any ={};

  //clonedProducts: { [s: string]: Product; } = {};

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService, public generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe, private router: Router) 
    {
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = this.generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      
      this.router.navigateByUrl('/app-login');
    }
      this.rows = generalservice.SalesContract;
      console.log(this.rows)
      let today = new Date();
      let invalidDate = new Date();
      invalidDate.setDate(today.getDate() - 1);
      this.invalidDates = [today,invalidDate];
      this.isRowSelectable = this.isRowSelectable.bind(this);
      this.getusers();
      this.getLines();
      this.getDischargeport();
      this.getShipBookingExcel();
      this.getcountries();
      this.getbookings();
      this.getbookStatus();

      //this.getbookingsplit();

     // this.getSplitsassignedtobooks();

      this.EntityId = "WT8cv";
      this.OwnerId = this.loggedinuser.Uid;
      this.OwnerName = this.loggedinuser.Name;
      this.DTH = [{name:'Collect' , code:1},{name:'Prepaid' ,code:2}];
    }
    clear(table: Table) 
    {
      table.clear();
    }
    getbookStatus()
    {
        let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_ShipbookStatus;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.bookstatus = response.result.queryresult;
           
          }
        },response => {
          console.log("Post call in error", response);
      },
      () => {
          console.log("The Post observable is now completed.");
      })
    }
    getbookingsplit(id:any)
    {
      this.booksplits=[];
        let param: any = {};
        param.op = "query";
        param.query = "select * from vw_BookingSplits where id =" + id + ";";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.booksplits = response.result.queryresult;
            this.books.forEach((book: any, index: number)=>{
              if(this.book.id==book.id){
                this.books[index].bookssplits = this.booksplits.map((x: any)=>x.SplitNo).join(",");
              }
            })
          }
        },response => {
          console.log("Post call in error", response);
      },
      () => {
          console.log("The Post observable is now completed.");
      })
    }
    getShipBookingExcel()
    {
        let param: any = {};
        param.op = "query";
        param.query = "select * from vw_ShipBookingExcel;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.ShipBookingExcel = response.result.queryresult;
            this.ShipBookingExcel.forEach((SBE:any, index:number)=>{
              this.ShipBookingExcel[index].FCLNum = Number(SBE.FCLNum);
              this.ShipBookingExcel[index].FreightValue = Number(SBE.FreightValue);
              this.ShipBookingExcel[index].NoFreedays = Number(SBE.NoFreedays);
               
            })
          }
        },response => {
          console.log("Post call in error", response);
      },
      () => {
          console.log("The Post observable is now completed.");
      })
    }
    
    hideDialog()
    {
      this.addNewDialogueATT = false;
     
    }
    showPositionDialog(position: string, message: string) 
    {
      this.dialougmessage = message;
      this.position = position;
      this.displayPosition = true;
    }
    savebookstoUser()
    {
      this.usersbooks = [];
    //start delete statment.
      this.blockedPanel=true;

      let urlDel = this.generalservice.appconfigs.URLs.apiUrl+"/api/DeleteTow";
      console.log(urlDel);
      let paramDel: any = {};
      paramDel.op = "DeleteTow";
      paramDel.entityid={FromID:this.selectedBooking[0].id, FromType:'Booking'};
      paramDel.entity = "Wrx_ManyMany";
      let Delheaders = new HttpHeaders();
      this.http.post(urlDel, paramDel, {headers: Delheaders}).subscribe(
      (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Books Removed', life: 3000});
                      
          }
          else
          {
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Failed to delete', life: 3000});
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
    //End the delete statment 
        console.log(this.targetUsers);
        this.selectedBooking.forEach((booked: any) => {
        this.targetUsers.forEach((user: any) => {
        this.usersbooks.push({"FromID": booked.id, "ToID": user.id });
      })
    });   
      //this.targetTeams.forEach((element: any) => {
      //if(element.ID == this.selectedUsers[0].ID)
      //{
       // element.teams = this.targetTeams;

        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createRelations";
        console.log(url);
        let param: any = {};
        param.op = "createRelations";
        param.FromType = "Booking";
        param.ToType = "User";
        param.attributes = this.usersbooks;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'User added to Booking', life: 3000});
              }
              else
              {
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'User Not Added', life: 3000});
              }
            },response => 
            {
              console.log("Post call in error", response);
              this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
            },
            () => {
            console.log("The Post observable is now completed.");
                  })
        this.bookingDialogue = false;
        //this.ngOnInit();
    }
    clearValueOnService()
    {
      this.generalservice.selectedObject = {};
    }
    
    HideDi()
    {
      
      this.getbookings();
      this.bookingDialogue=false;
      //this.book.ownerid.push(this.targetUsers[0].id)
      //console.log(this.targetUsers[0].id);
    }
    opendialog()
    {
      this.EntityId = this.selectedBooking.id;
      
      this.addNewDialogueATT = true;
    }
    getDischargeport()
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
          this.Dischargeportsrows = response.result.queryresult;
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
    getLines()
    {
        let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_ShippingLines;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
            this.ShipLinecols = response.result.cols[0];
            this.Lines = response.result.queryresult;
          }
        },response => {
          console.log("Post call in error", response);
      },
      () => {
          console.log("The Post observable is now completed.");
      })
    }
    getusers()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select distinct * from vw_UserTeams where (id=4 or id= 7) and ToType='Team';";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success)
          {
            this.users = response.result.queryresult;
           //let zero:any = {"id":"UnAssigned"}
            console.log(this.users)
          }
          else
          {
            this.messageService.add({severity:'error', summary: 'Failed', detail: 'Users Not Available', life: 3000});
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
    onusersRowSelect(event:any) {
      this.messageService.add({severity: 'info', summary: 'Product Selected', detail: event.data.id});
  }
    onRowSelect(event: any) {
      
      if(!this.updateObject.find((obj: any)=>obj.id==event.data.id))
        this.updateObject.push(event.data);
        this.selectedBooking.BookingRef = event.data.BookingRef;
        console.log(this.updateObject);

               
        this.getbookingsplit(this.selectedBooking.id);

        this.getattachementcount(this.selectedBooking.id)
      }
    getattachementcount(recid:any)
      {
        let param: any = {};
        param.op = "query";
        param.query = "select Count(*) as ATT from NotesAndAttachements where entityid ='" + recid + "';";
        let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success){
             
              this.ATTCount = response.result.queryresult;
              console.log("Counter",this.ATTCount[0].ATT);
              
              
            }
          },response => {
            console.log("Post call in error", response);
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        },
        () => {
            console.log("The Post observable is now completed.");
        })
      }
  showusers(book:any)
  {
    if(!this.updateObject.find((obj: any)=>obj.id==book.id))
      {
        this.updateObject.push(book);
        console.log(this.updateObject);
      }
      this.generalservice.sourceObject = book;
      this.generalservice.usersDialougeDisplay = true;
  }
  deleteSelectedbook(book:any)
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
        param.entityid={id:book.id};
        param.entity = "Wrx_ShipBooking";
        param.attributes=book;

        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Booking Deleted', life: 3000});

            this.getbookings();
              
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Booking Not Deleted', life: 3000});
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
  onRowUnselect(event: any) {
      this.messageService.add({key: 'toast01',severity:'info', summary:'Product Unselected',  detail: event.data.Transloader});
  }
    isRowSelectable(event:any) 
    {
      return (event.data.id)? true : false;
    }
  ngOnInit() 
  { 
        this.books = this.generalservice.initialinfo;       
        console.log(this.generalservice.initialinfo);
        
    }

    getSplitsassignedtobooks()
    {
      if(this.loggedinuser.id ==1)
      {
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
              this.cols = response.result.cols[0];
              //this.rows = response.result.queryresult;
              this.books = response.result.queryresult;
              this.books.forEach((b:any,index:number)=>{
               
                //this.getbookingsplit(b.id);
              });
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
      }else{
        let param: any = {};
        param.op = "query";
        param.query = "select * from Wrx_ShipBooking;" //where ownerid =" + this.loggedinuser.Uid + ";";
        let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success){
              this.cols = response.result.cols[0];
              //this.rows = response.result.queryresult;
              this.books = response.result.queryresult;
              this.books.forEach((b:any,index:number)=>{
              //  this.getbookingsplit(b.id);
              });
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
    }
    getbookings()
    {
      if(this.loggedinuser.id ==1)
      {
        let param: any = {};
        param.op = "query";
        param.query = "select * from vw_bookingsplits order by ID Desc;";
        let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success){
              this.cols = response.result.cols[0];
              //this.rows = response.result.queryresult;
              this.books = response.result.queryresult;
              this.books.forEach((b:any,index:number)=>{
              
                  this.books[index].DoxCutoff = this.datePipe.transform(b.DoxCutoff, 'yyyy-MM-dd');

          
              });
              console.log("Print",this.books)
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
      }else{
        let param: any = {};
        param.op = "query";
        param.query = "select * from vw_bookingsplits order by ID Desc;" //where ownerid =" + this.loggedinuser.Uid + ";";
        let headers = new HttpHeaders();
        
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
        
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success){
              this.cols = response.result.cols[0];
              this.books = response.result.queryresult;
              this.books.forEach((b:any,index:number)=>{
              this.books[index].DoxCutoff = new Date(b.DoxCutoff);
            

             });
           
            
            }
          },response => {
            console.log("Post call in error", response);
            this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
        },
        () => {
            console.log("The Post observable is now completed.");
        })
      }
     
    }
    getcountries()
    {
      this.blockedPanel=true;
      let param: any = {};
        param.op = "query";
        param.query = "select id,PortName from Wrx_Ports;";
        let headers = new HttpHeaders();
      
      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
      this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
        {
          console.log(res);
          var response: any = res;
          if(response.success){
           
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
    addBookpopup()
    {
      this.BookingRefEnable=false;
      this.book = {};
      this.submitted = false;
      this.bookingDialogue=true;
    }
  addBook()
  {
    let book:any = {};

    book.BookingRef ="";
    
    //book.ShippingLine = '';

    book.FCLNum = "";

    book.DoxCutoff = "";

    book.VGMCutoff = "";
    book.ERD = "";

    book.LRD = "";

    book.ETS = "";

    book.ETA = "";

    book.VesselName = "";

    book.VoyageNum = "";
    book.SplitNum = "";
   
    this.books = [...this.books,book];
  }
  createId(): string 
  {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    id = '';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  
  onRowEditInit(book:any) 
  {
    this.BookingRefEnable=true;
    this.submitted = true;
    //this.books[this.book.id] = {...book};
    this.book = {...book};
    this.bookingDialogue = true;
  }
  onRowcloneInit(book:any) 
  {
    this.BookingRefEnable=true;
    this.submitted = true;
    //this.books[this.book.id] = {...book};
    book.id="";
    book.BookingRef="";

    this.book = {...book};
    console.log(this.book);
    
    this.bookingDialogue = true;
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
  onRowEditSave(book:any) {
      
    if (this.book.id) 
      {
        this.books[this.findIndexById(this.book.id)] = this.books;
        this.book.modifiedby = this.loggedinuser.Uid;
        this.book.modifiedon = this.myDate;
        this.blockedPanel=true;

        delete this.book.SplitNo;
       
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entityid={id:this.book.id};
        param.entity = "Wrx_ShipBooking";
        param.attributes = this.book;
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Booking Updated', life: 3000});
              this.getbookings();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Booking Not Updated', life: 3000});
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
              this.blockedPanel=true;
            })
      }
      else
      {
        if(this.books.find((element:any)=>element.BookingRef==book.BookingRef))
        {
          book.BookingRef = null;
          book.DischargePort=null;
          book.countryid=null;
          this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Booking Exist', life: 3000});
          return;
        }
          
          book.modifiedby = this.loggedinuser.Uid;
          book.modifiedon = this.myDate;
          book.createdby = this.loggedinuser.Uid;
          book.createdon = this.myDate;

          book.DoxCutoff = this.datePipe.transform(book.DoxCutoff,'yyyy-MM-dd');
          book.VGMCutoff = this.datePipe.transform(book.VGMCutoff,'yyyy-MM-dd');
          book.ERD = this.datePipe.transform(book.ERD,'yyyy-MM-dd');
          book.LRD = this.datePipe.transform(book.LRD,'yyyy-MM-dd');
          book.ETS = this.datePipe.transform(book.ETS,'yyyy-MM-dd');
          book.ETA = this.datePipe.transform(book.ETA,'yyyy-MM-dd');

          delete this.book.SplitNo;
        //SQL to create Commodity
          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
          console.log(url);
          let param: any = {};
          param.op = "create";
          param.entity = "Wrx_ShipBooking";
          param.attributes = book;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Book Created', life: 3000});
              this.getbookings();
            }else{
              this.messageService.add({severity:'error', summary: 'Failed', detail: 'Book Not Created', life: 3000});
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
      //SQL finish create...........................................................................................................
  }
}
onRowSave(book:any)
{
  this.submitted = true;
      console.log("Edited book", book);
      
        if (book.id && book.id.trim()) 
        {
          //this.books[this.findIndexById(book.id)] = this.books;
          book.modifiedby = this.loggedinuser.id;
          book.modifiedon = this.myDate;
          delete book.SplitNo;
          
          //this.books.forEach((e:any)=>{
                          
            if(this.books.find((element:any)=>element.BookingRef==book.BookingRef && book.id != element.id))
              {
                
                book.BookingRef = null;
                //book.countryid = null;
                //book.DischargePort=null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Booking Reference Exist', life: 3000});
                return;
              }
              else
              {
        //});
          

          this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
          console.log(url);
          let param: any = {};
          param.op = "update";
          param.entityid={id:book.id};
          param.entity = "Wrx_ShipBooking";
          param.attributes = book;
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
            (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Booking Updated', life: 3000});
                this.bookingDialogue = false;
                this.getbookings();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Booking Not Updated', life: 3000});
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
          }
            else
            {
              if(this.books.find((element:any)=>element.BookingRef==book.BookingRef))
              {
                book.BookingRef = null;
                book.countryid = null;
                book.DischargePort=null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Booking Exist', life: 3000});
                return;
              }

              book.DoxCutoff = this.datePipe.transform(book.DoxCutoff,'yyyy-MM-dd');
              book.VGMCutoff = this.datePipe.transform(book.VGMCutoff,'yyyy-MM-dd');
              book.ERD = this.datePipe.transform(book.ERD,'yyyy-MM-dd');
              book.LRD = this.datePipe.transform(book.LRD,'yyyy-MM-dd');
              book.ETS = this.datePipe.transform(book.ETS,'yyyy-MM-dd');
              book.ETA = this.datePipe.transform(book.ETA,'yyyy-MM-dd');
              
              book.modifiedby = this.loggedinuser.Uid;
              book.modifiedon = this.myDate;
              book.createdby = this.loggedinuser.Uid;
              book.createdon = this.myDate;
              //book.ownerid = this.loggedinuser.Uid;
              
              delete this.book.SplitNo;

              //SQL to create Commodity
              console.log(book);
              this.blockedPanel=true;
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
              console.log(url);
              let param: any = {};
              param.op = "create";
              param.entity = "Wrx_ShipBooking";
              param.attributes = book;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
              (res) => 
              {
                console.log(res);
                var response: any = res;
                if(response.success)
                {
                  this.messageService.add({severity:'success', summary: 'Successful', detail: 'Book Created', life: 3000});
                  this.bookingDialogue = false;
                  this.getbookings();
                }else{
                  this.messageService.add({severity:'error', summary: 'Failed', detail: 'Book Not Created', life: 3000});
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
//SQL finish create...........................................................................................................
            
}
  onRowEditCancel(book:any, index:number) 
  {
      this.rows[index] = this.books[this.book.id];
      delete this.books[this.book.id];
      this.BookingRefEnable = false;
  }
  Updateinstruct()
  {
    if(this.updateObject && this.updateObject.length>0)
    {
      this.submitted = true;
          
        //this.commodities[this.findIndexById(this.shipinstruct.id)] = this.commodities;
        this.updateObject.forEach((element: any) => {
          element.modifiedby = this.loggedinuser.Uid;
          element.modifiedon = this.myDate;
          delete element.SplitNo;
          
          element.DoxCutoff = this.datePipe.transform(element.DoxCutoff,'yyyy-MM-dd');
          element.VGMCutoff = this.datePipe.transform(element.VGMCutoff,'yyyy-MM-dd');
          element.ERD = this.datePipe.transform(element.ERD,'yyyy-MM-dd');
          element.LRD = this.datePipe.transform(element.LRD,'yyyy-MM-dd');
          element.ETS = this.datePipe.transform(element.ETS,'yyyy-MM-dd');
          element.ETA = this.datePipe.transform(element.ETA,'yyyy-MM-dd');
                          
            //this.books.forEach((e:any)=>
            //{
          
                if(this.books.find((ele:any)=>ele.BookingRef==element.BookingRef  && ele.id != element.id))
                {
                 
                  this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Booking Exist ' + element.BookingRef, life: 3000});
                  this.getbookings();
                  return;
                  
                }
                else
                {
                  delete this.book.SplitNo;
                  this.blockedPanel=true;
                  let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/updateMultiple";
                  console.log(url);
                  let param: any = {};
                  param.op = "updateMultiple";
                  //param.entityid={id:this.updateObject.id};
                  param.entity = "Wrx_ShipBooking";
                  param.attributes = this.updateObject;
                  let headers = new HttpHeaders();
                  this.http.post(url, param, {headers: headers}).subscribe(
                    (res) => 
                    {
                      console.log(res);
                      var response: any = res;
                      if(response.success)
                      {
                        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Booking Updated', life: 3000});
                        this.getbookings();
                      }
                      else
                      {
                        this.messageService.add({severity:'error', summary: 'Failed', detail: 'Booking Not Updated', life: 3000});
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
     
        //});
        this.updateObject=[];
      }
  }
  exportExcel()
  {
    this.getShipBookingExcel();
    
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.ShipBookingExcel);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'bookingInstruction');
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