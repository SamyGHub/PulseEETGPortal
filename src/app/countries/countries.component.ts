import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService, ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { GeneralService } from '../general.service';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
  providers: [DatePipe]
})
export class CountriesComponent {
  [x: string]: any;
  blockedPanel: boolean = false;
  loggedinuser: any;
  newformdata: any;
  addNewDialogue = false;
  selectedcountry: any=[];
  rows: any[]  = [];
  cols: any [] = [];
  tablefilter: string = "";
  countries: any = [];
  country: any;
  submitted: boolean = false;
  uploadedFiles: any[] = [];
  myDate = new Date();
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";
  fileBase64: any="";
  newimg:boolean = false;
  continent:any=[];

  constructor(private router:Router, private datePipe: DatePipe, private primengConfig: PrimeNGConfig,private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
  
  private http: HttpClient) {
    
    let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss'); //
    this.loggedinuser = generalservice.getLoggedUser();
    if(!this.loggedinuser)
  {
    this.router.navigateByUrl('/app-login');
  }
    console.log(this.generalservice.login);
    
  }
  ngOnInit(): void 
  {
    this.getcountries();
    this.getcontinent();
  }
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getcontinent()
  {
    let param: any = {};
      param.op = "query";
      param.query = "select * from Wrx_Continent;";
      let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/query";
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => 
      {
        console.log(res);
        var response: any = res;
        if(response.success){
          
          this.continent = response.result.queryresult;
         
        }
      },response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top',this.generalservice.appconfigs.Messages.NetworkError);
    },
    () => {
        console.log("The Post observable is now completed.");
        
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
    },
    () => {
        console.log("The Post observable is now completed.");
        
    })
  }
 
  addNew()
  {
      this.country = {};
      this.submitted = false;
      this.addNewDialogue = true;
  }
  deleteSelectedCountries(selectedcountries:any)
  {
      this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Countries?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
              this.blockedPanel=true;
              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/deleteMultiple";
              console.log(url);
              let param: any = {};
              param.op = "deleteMultiple";
              //param.entityid={id:grade.id};
              param.entity = "Wrx_Countries";
              param.attributes=selectedcountries;
    
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
              (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Countries Selected Deleted', life: 3000});
                    this.getcountries();
                  }
                  else
                  {
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Countries Selected Not Deleted', life: 3000});
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
  deleteSelectedCountry(Country: any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + Country.Name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.rows = this.rows.filter(val => val.id !== Country.id);
          this.country = {};
    //Delete SQL Database
        this.blockedPanel=true;
          let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
          console.log(url);
          let param: any = {};
          param.op = "delete";
          param.entityid={id:Country.id};
          param.entity = "Wrx_Commodity";
          let headers = new HttpHeaders();
          this.http.post(url, param, {headers: headers}).subscribe(
          (res) => 
            {
              console.log(res);
              var response: any = res;
              if(response.success)
              {
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Country Deleted', life: 3000});
                this.getcountries();
              }else{
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Country Not Deleted', life: 3000});
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
  hideDialog()
  {
    this.addNewDialogue = false;
  }
  editcountry(Country: any)
  {
    this.newimg= false;
    this.submitted = true;
    this.country = {...Country};
    this.country.fileBase64 = this.country.image;
    console.log(this.country)
    this.addNewDialogue = true;
  }
  saveCountry()
  {
    this.submitted = true;
      
        if (this.country.Name && this.country.Name.trim()) 
        {
            if (this.country.id) 
            {
              this.countries[this.findIndexById(this.country.id)] = this.countries;
              this.country.modifiedby = this.loggedinuser.id;
              this.country.modifiedon = this.myDate;
              
              
              if(this.newimg)
              this.country.image = this.fileBase64;

              delete this.country.fileBase64;

              let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
              console.log(url);

              this.blockedPanel=true;
              let param: any = {};
              param.op = "update";
              param.entityid={id:this.country.id};
              param.entity = "Wrx_Countries";
              param.attributes = this.country;
              let headers = new HttpHeaders();
              this.http.post(url, param, {headers: headers}).subscribe(
               (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Country Updated', life: 3000});
                    this.getcountries();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Country Not Updated', life: 3000});
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
             if(this.rows.find((element:any)=>element.Name==this.country.Name))
              {
                this.country.Name = null;
                this.messageService.add({severity:'error', summary: 'Failed', detail: 'Same Country Name Exist', life: 3000});
                return;
              }
                //this.country.id = this.createId();
                this.country.status = true;
                this.country.createdby = this.loggedinuser.id;
                this.country.createdon = this.myDate;
                this.country.modifiedby = this.loggedinuser.id;
                this.country.modifiedon = this.myDate;
                
                
                
                if(this.newimg)
                this.country.image = this.fileBase64;

                delete this.country.fileBase64;
                
                this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/create";
                console.log(url);
                let param: any = {};
                param.op = "create";
                param.entity = "Wrx_Countries";
                param.attributes = this.country;
                let headers = new HttpHeaders();
                this.http.post(url, param, {headers: headers}).subscribe(
                (res) => 
                {
                  console.log(res);
                  var response: any = res;
                  if(response.success)
                  {
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Country Created', life: 3000});
                    this.getcountries();
                  }else{
                    this.messageService.add({severity:'error', summary: 'Failed', detail: 'Country Not Created', life: 3000});
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
        this.country = {};
      }
  }
  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.countries.length; i++) 
    {
      if (this.countries[i].id === id) 
      {
        index = i;
        break;
      }
    }

    return index;
  }
  createId(): string 
  {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  generateCode(): string 
  {
    let Code = '';
    var Suffix = 'Comm_';
    for ( var i = 0; i < 5; i++ ) {
        Code += Suffix + Math.random()*100;
    }
    return Code;
  }
  handleFileInput(files: any)
  {
    // console.log(files);
    let selectedfile = files.currentFiles[0];
    // console.log(selectedfile);
    const reader = new FileReader();
    reader.readAsDataURL(selectedfile);
    reader.onload = () => {
        
        if(reader.result)
          this.fileBase64 = reader.result.toString();
          this.newimg=true;
          //this.country.image = reader.result.toString();
 
    };
   }
  myUploader(event:any)
  {
    this.country.fileBase64="";
    this.uploadedFiles= [];
    for(let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles);
      //this.country.image = this.uploadedFiles[0].name;
      console.log(this.country);
    }

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
}
