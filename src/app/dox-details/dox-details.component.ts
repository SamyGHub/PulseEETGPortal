import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeneralService } from '../general.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuItem } from 'primeng/api';
import moment from 'moment';
import { EMPTY } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dox-details',
  templateUrl: './dox-details.component.html',
  styleUrls: ['./dox-details.component.css']
})
export class DoxDetailsComponent {
  rowData: any = {};
  Doxobj: any = {};
  Doxobjs: any[] = [];
  cols: any[] = [];
  rows: any[] = [];
  submitted: boolean = false;
  addNewDialogue = false;
  selectedDox: any;
  Insurance: any[] = [];
  blockedPanel: boolean = false;
  loggedinuser: any;
  myDate = new Date();
  position: string = "";
  displayPosition: boolean = false;
  dialougmessage: string = "";
  TBLWeightCert: any = [];
  TBLWeightCertcols: any = [];
  items: MenuItem[];
  custdtcols: any = [];
  custdt: any = [];
  crop: any = [];
  Supervision: any = [];
  doxtrm: any = [];
  ValueBinvoice: any = [];
  tablefilter: string = "";
  Phyto: any[] = [];
  phytocols: any[] = [];
  PhytoRail: any[] = [];
  pdfURL: any;
  iscreated: boolean = false;
  rowURL: any[] = [];
  invRows: any = [];
  Invoicerpt: any;
  invoiceURL: any = {};
  Appropriation: any = []
  AppropriationURL: any = {};
  railcontainer: any = [];
  israil: boolean = true;
  isPhytorail: boolean = true;
  BLInstructions: any = [];
  BLInstructionsURL: any = {};
  NonGmo: any = [];
  NonGmoURL: any = {};
  HealthCert: any = [];
  HealthCertURL: any = {};
  weightCertURL: any = {};
  PhytoDeclaredQTY: any = [];
  Customers: any = [];
  Consignee: any = [];
  packinglist: any = {};
  packinglistrows: any = [];
  WQrows: any = [];
  railcontainerTOT: any = [];
  Notifydt:any = [];
  AllDecresult:any = [];
  SheilfLiferesult:any=[];
  SheilfLifeURL:any={};
  CROPCertresult:any={};
  CROPCertURL:any={};
  consigneeopt:any=[{ name: 'To Order', code: 1 }, { name: 'Same as Notify', code: 2 }];
  consigneebox:boolean = true;

  //consigneeopt = [{ name: 'To Order', code: 1 }, { name: 'Same as Notify', code: 2 }];
  code = new FormControl(2);
  CustName = new FormControl(2)
  
  constructor(
    private generalservice: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService, private confirmationService: ConfirmationService, private datePipe: DatePipe) {
    this.loggedinuser = generalservice.getLoggedUser();
    if (!this.loggedinuser) 
    {
      this.router.navigateByUrl('/app-login');
    }
    if (this.route.snapshot.queryParamMap.get("rowData")) {
      let productstring =
       this.rowData = this.route.snapshot.queryParamMap.get("rowData");

      if (productstring)
        this.rowData = JSON.parse(atob(productstring));
      console.log(this.rowData);
      this.rowData.Amount = this.rowData.Price * this.PhytoDeclaredQTY.ShippedQTY
    }
    this.Insurance = [{ name: 'Yes', code: 0 }, { name: 'No', code: 1 }];
    this.consigneeopt = [{name:'To Order',code:0},{name:'Same as Notify Party',code:1},{name:'Other',code:2}]
    let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
    this.loggedinuser = generalservice.getLoggedUser();
    this.items = [
      {
        label: 'Weight Certificate',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.GetWeightCer();
        }
      },
      {
        label: 'Health Certificate',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.GetHealthCert();
        }
      },
      {
        label: 'Packing List',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.getpackinglist();
        }
      },

      {
        label: 'W&Q Application',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.getWQ();
        }
      },
      {
        label: 'Origin Application',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.GMA();
        }
      },
      {
        label: 'Crop Year',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.CROPCert();
        }
      },
      {
        label: 'NON GMO',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.GetNonGmo();
        }
      },
      {
        label: 'Shelf Life',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.SheilfLife();
        }
      },
      {
        label: 'Allergen Declaragtion',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.AllDec();
        }
      },

      { separator: true },
      {
        label: 'Close',
        icon: 'pi pi-times',
        command: () => {
          this.GMA();
        }
      },
    ];
    this.getRailcontainer();
    this.getRailContaniersToT();
    this.getCustDetails();
    this.getdocumentterm();
    this.getURL();
    this.getcustomersList();
    this.getcropyear();
    this.getNotifyDetails(this.rowData.Custid);
    //this.GetDescription();
    //this.getPhytoDeclaredQTY();

    //this.crop=[{name:'2019',code:2019},{name:'2020',code:2020},{name:'2021',code:2021},{name:'2022',code:2022},{name:'2023',code:2023},{name:'2024',code:2024}];
    this.Supervision = [{ name: 'SGS', code: 0 }, { name: 'INTERTEK', code: 1 }, { name: 'COTECNA', code: 2 }, { name: 'CONTROL UNION', code: 3 }, { name: 'BALTIC CONTROL', code: 4 }, { name: 'AMSPEC', code: 5 }];
    this.ValueBinvoice = [{ name: 'Yes', code: 1 }, { name: 'No', code: 0 }];
    this.Insurance = [{ name: 'Yes', code: 1 }, { name: 'No', code: 0 }];
   
  }
  
  ConsigneeChg()
  {
    switch(this.code.value)
    {
      case 0:
        this.Doxobj.Consignee="";
        this.Doxobj.Consignee = "To Order";
        break;
      case 1:
        this.Customers.forEach((e:any)=>{
          if(e.id==this.CustName.value)
            this.Doxobj.Consignee = e.CustName;
        })
        
       // this.Doxobj.Consignee = this.CustName.value;
        break;
      case 2:
        this.Doxobj.Consignee = "";
        this.consigneebox = false;
        break;
    }
    
  }

  getcropyear() {
    let param: any = {};
    param.op = "query";
    param.query = "select id, cropyear, code from Wrx_CropYear;" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.crop = response.result.queryresult;

        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  getURL() 
  {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select id, phytoURL, InvoiceURL, BLInstructionsURL, HealthCertURL, weightCertURL, NonGmoURL, AppropriationURL,PackingListURL, WQURL, AllDecURL, SheilfLifeURL,CROPCertURL from Wrx_BatchContract where id=" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.rowURL = response.result.queryresult;
          console.log("URLS -->")
          console.log(this.rowURL);

        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  getRailCars() 
  {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_PhytoRailCars where id=" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.PhytoRail = response.result.queryresult;
          if (!this.PhytoRail.length) {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingRailCar);
            this.isPhytorail = true;
          }
          else {
            this.isPhytorail = false;
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  hideDialog() 
  {
    this.addNewDialogue = false;
  }
  getpackinglist() 
  {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.packinglistrows = response.result.queryresult;
          if (this.packinglistrows.length) {
            this.packinglistrows.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = (this.loggedinuser.Email != "") ? this.loggedinuser.Email : "";
              element.Phone = (this.loggedinuser.Phone != "") ? this.loggedinuser.Phone : "";
            })
            this.PackingLST();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  PackingLST() {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/packinglist";

    console.log(url);
    let param: any = {};
    param.op = "packinglist";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.packinglistrows;
    param.attributesrail = this.railcontainerTOT;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.packinglist = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.PackingListURL + this.rowData.id + ".pdf";
          this.rowURL[0].PackingListURL = this.packinglist;
          this.updateURL();
          window.open(this.rowURL[0].PackingListURL);
          console.log(this.packinglist);

        }
        else if (response.message.includes("System.IO.IOException")) {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Unable to produce document, it is being used by another process or already opened.', life: 6000 });
          //window.location.reload()
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  GetInvoice() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_getinvoices where id=" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.invRows = response.result.queryresult;
          this.invRows.forEach((element: any) => {
            element.Username = this.loggedinuser.UName;
            element.signature = this.loggedinuser.UName;
            element.Email = this.loggedinuser.Email;
            element.Phone = this.loggedinuser.Phone;
            element.BLDate = (element.BLDate != "") ? element.BLDate : this.myDate;
          })
          this.rptInvoice();
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  rptInvoice() {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/Invoice";

    console.log(url);
    let param: any = {};
    param.op = "Invoice";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.invRows;
    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          if(this.invRows[0].CurrencyName=="CAD")
            {
              this.Invoicerpt = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.InvoicerptCAD + this.rowData.id + ".pdf";
            }
          else
            {
            this.Invoicerpt = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.Invoicerpt + this.rowData.id + ".pdf";
            }

          this.rowURL[0].InvoiceURL = this.Invoicerpt;
          this.updateURL();
          window.open(this.rowURL[0].InvoiceURL);

          console.log(this.Invoicerpt);

        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
          //window.location.reload()
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  AllDec()
  {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) 
        {
          this.AllDecresult = response.result.queryresult;
          if (this.AllDecresult.length) {
            this.AllDecresult.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = (this.loggedinuser.Email != "") ? this.loggedinuser.Email : "";
              element.Phone = (this.loggedinuser.Phone != "") ? this.loggedinuser.Phone : "";
            })
            this.rptAllDec();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  rptAllDec() 
  {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/AllDec";

    console.log(url);
    let param: any = {};
    param.op = "AllDec";
    
    param.attributes = this.AllDecresult;
    param.attributesrail = this.railcontainerTOT;
    //param.attributescontainer = this.railcontainer;
    
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    console.log("declare", param.op);

    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) 
        {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.pdfURL = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.AllDec + this.rowData.id + ".pdf";

          this.rowURL[0].AllDecURL = this.pdfURL;
          this.updateURL();
          window.open(this.rowURL[0].AllDecURL);
          console.log(this.pdfURL);

        } 
        else 
        {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
     
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  SheilfLife()
  {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) 
        {
          this.SheilfLiferesult = response.result.queryresult;
          if (this.SheilfLiferesult.length) {
            this.SheilfLiferesult.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = (this.loggedinuser.Email != "") ? this.loggedinuser.Email : "";
              element.Phone = (this.loggedinuser.Phone != "") ? this.loggedinuser.Phone : "";
            })
            this.rptShelfLife();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  rptShelfLife() 
  {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/SheilfLife";

    console.log(url);
    let param: any = {};
    param.op = "SheilfLife";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.SheilfLiferesult;
    param.attributesrail = this.railcontainer;
    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.SheilfLifeURL = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.SheilfLiferesult + this.rowData.id + ".pdf";
          this.rowURL[0].SheilfLifeURL = this.SheilfLifeURL;
          this.updateURL();
          window.open(this.rowURL[0].SheilfLifeURL)

        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
          //window.location.reload()
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  CROPCert()
  {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) 
        {
          this.CROPCertresult = response.result.queryresult;
          if (this.CROPCertresult.length) {
            this.CROPCertresult.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = (this.loggedinuser.Email != "") ? this.loggedinuser.Email : "";
              element.Phone = (this.loggedinuser.Phone != "") ? this.loggedinuser.Phone : "";
            })
            this.rptCROPCert();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  rptCROPCert() 
  {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/CROPCert";

    console.log(url);
    let param: any = {};
    param.op = "CROPCert";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.CROPCertresult;
    param.attributesrail = this.railcontainer;
    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.CROPCertURL = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.CROPCertresult + this.rowData.id + ".pdf";
          this.rowURL[0].CROPCertURL = this.CROPCertURL;
          this.updateURL();
          window.open(this.rowURL[0].CROPCertURL)

        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
          //window.location.reload()
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  ngOnInit() 
  {
    this.getDox();
  }
  getcustomersList() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_CustomerCreation;";
    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {

          this.Customers = response.result.queryresult;

        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  editDox(Doxobj: any) 
  {
    
    this.submitted = true;
    this.Doxobj = { ...Doxobj };
    this.addNewDialogue = true;
    console.log("inEdit",this.Doxobj);
  }
  deleteSelectedDox(Doxobj: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + Doxobj.Name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rows = this.rows.filter(val => val.id !== Doxobj.id);
        this.Doxobj = {};
        //Delete SQL Database
        this.blockedPanel = true;
        let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/delete";
        console.log(url);
        let param: any = {};
        param.op = "delete";
        param.entityid = { id: Doxobj.id };
        param.entity = "Wrx_Dox";
        let headers = new HttpHeaders();
        this.http.post(url, param, { headers: headers }).subscribe(
          (res) => {
            console.log(res);
            var response: any = res;
            if (response.success) {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
              this.getDox();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Record Not Deleted', life: 3000 });
            }
          }, response => {
          console.log("Post call in error", response);
          this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
          this.blockedPanel = false;
        },
          () => {
            console.log("The Post observable is now completed.");
            this.blockedPanel = false;
          })
        //End of Delete Database
      }
    });
  }
  showPositionDialog(position: string, message: string) {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  getdocumentterm() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_DocumentTerms;";
    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.doxtrm = response.result.queryresult;
        }
      }, response => {
        console.log("Post call in error", response);
        this.blockedPanel = false;
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  getDox() 
  {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_Dox where SplitNo=" + this.rowData.id + ";";
    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) 
        {
          this.cols = response.result.cols[0];
          this.Doxobjs = response.result.queryresult;
          //this.GetDescription();
          //this.getPhytoDeclaredQTY();
          this.Doxobjs.forEach((item:any)=>
          {
            if (item.Description ==="")
            {
              item.Description = this.rowData.QTYPlanned + " METRIC TONS OF " + this.rowData.Name + " | " + this.rowData.variety + " | " + this.rowData.Grade + ", ORIGIN CANADA, CROP YEAR " + 
              this.rowData.CropYear + " PACKED IN " + this.rowData.bagname + " bag X " + this.rowData.Packgnum + " loaded in " + this.rowData.FCLNum + " FCLs. HS CODE " 
              + this.rowData.HSCODE
              +" TOTAL NET WEIGHT: " + this.rowData.QTYPlanned
              +" MT., "
              +" TOTAL GROSS WEIGHT: " + this.rowData.TotalGrossWeight + " MT.";
            }
          })
          
          console.log(this.Doxobjs);
        }
      }, response => {
        console.log("Post call in error", response);
        this.blockedPanel = false;
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  getNotifyDetails(Custid:any) {
    let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_CustomerDetails where customerid=" + Custid + ";";
    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          
          this.Notifydt = response.result.queryresult;

          console.log("This Customer List Adddress", this.custdt);

        }
      }, response => {
        console.log("Post call in error", response);

        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
      },
      () => {
        console.log("The Post observable is now completed.");
      })
  }
  getCustDetails() {
    let param: any = {};
    param.op = "query";
    param.query = "select * from Wrx_CustomerDetails where customerid=" + this.rowData.Custid + ";";
    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.custdtcols = response.result.cols[0];
          this.custdt = response.result.queryresult;
          
          console.log("This Customer List Adddress", this.custdt);

        }
      }, response => {
        console.log("Post call in error", response);

        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
      },
      () => {
        console.log("The Post observable is now completed.");
      })
  }
  addNew() {
    this.Doxobj = {};
    this.Doxobj.SplitNo = this.rowData.id;
    this.submitted = false;
    this.addNewDialogue = true;
    console.log(this.Doxobj);

  }
  saveDoxobj() {
    this.submitted = true;
    this.Doxobj.SplitNo = this.rowData.id;

    if (this.Doxobj.SplitNo && this.Doxobj.SplitNo.trim()) {
      if (this.Doxobj.id) {
        console.log(this.Doxobj);
        //this.Doxobj.id = this.createId();
        this.Doxobj.modifiedby = this.loggedinuser.Uid;
       // this.Doxobj.modifiedon = this.myDate;
        //this.Doxobj.Appropriation = this.datePipe.transform(this.Doxobj.Appropriation,'yyyy-MM-dd');
        if(this.Doxobj.Appropriation != "")
        {this.Doxobj.Appropriation=this.datePipe.transform(this.Doxobj.Appropriation,'yyyy-MM-dd')}else{delete this.Doxobj.Appropriation};

        if(this.Doxobj.B13Date !="")
        {this.Doxobj.B13Date= this.datePipe.transform(this.Doxobj.B13Date,'yyyy-MM-dd')}else{delete this.Doxobj.B13Date};

        if(this.Doxobj.BLApproval !="")
        {this.Doxobj.BLApproval=this.datePipe.transform(this.Doxobj.BLApproval,'yyyy-MM-dd')}else{delete this.Doxobj.BLApproval};

        if(this.Doxobj.BLDate !="")
        {this.Doxobj.BLDate=this.datePipe.transform(this.Doxobj.BLDate,'yyyy-MM-dd')}else{delete this.Doxobj.BLDate};
       
        if(this.Doxobj.BLDraftReceived !="")
        {this.Doxobj.BLDraftReceived=this.datePipe.transform(this.Doxobj.BLDraftReceived,'yyyy-MM-dd')}else{delete this.Doxobj.BLDraftReceived};

        if(this.Doxobj.BLISent !="")
        {this.Doxobj.BLISent=this.datePipe.transform(this.Doxobj.BLISent,'yyyy-MM-dd')}else{delete this.Doxobj.BLISent};

        if(this.Doxobj.COODraftReceived !="")
        {this.Doxobj.COODraftReceived=this.datePipe.transform(this.Doxobj.COODraftReceived,'yyyy-MM-dd')}else{delete this.Doxobj.COODraftReceived};

        if(this.Doxobj.COOPhytoReceived !="")
        {this.Doxobj.COOPhytoReceived=this.datePipe.transform(this.Doxobj.COOPhytoReceived,'yyyy-MM-dd')}else{delete this.Doxobj.COOPhytoReceived};

        if(this.Doxobj.DraftSentApproval !="")
        {this.Doxobj.DraftSentApproval=this.datePipe.transform(this.Doxobj.DraftSentApproval,'yyyy-MM-dd')}else{delete this.Doxobj.DraftSentApproval};

        if(this.Doxobj.ExpiryDate !="")
        {this.Doxobj.ExpiryDate=this.datePipe.transform(this.Doxobj.ExpiryDate,'yyyy-MM-dd')}else{delete this.Doxobj.ExpiryDate};
        
        if(this.Doxobj.InsuranceDate !="")
        {this.Doxobj.InsuranceDate=this.datePipe.transform(this.Doxobj.InsuranceDate,'yyyy-MM-dd')}else{delete this.Doxobj.InsuranceDate};
        
        if(this.Doxobj.Invoicedate !="")
        {this.Doxobj.Invoicedate=this.datePipe.transform(this.Doxobj.Invoicedate,'yyyy-MM-dd')}else{delete this.Doxobj.Invoicedate};
        
        if(this.Doxobj.Draftsapproved !="")
        {this.Doxobj.Draftsapproved=this.datePipe.transform(this.Doxobj.Draftsapproved,'yyyy-MM-dd')}else{delete this.Doxobj.Draftsapproved};

        if(this.Doxobj.LCExpiryDate !="")
        {this.Doxobj.LCExpiryDate=this.datePipe.transform(this.Doxobj.LCExpiryDate,'yyyy-MM-dd')}else{delete this.Doxobj.LCExpiryDate};
        
        if(this.Doxobj.LCIssuanceDate !="")
        {this.Doxobj.LCIssuanceDate=this.datePipe.transform(this.Doxobj.LCIssuanceDate,'yyyy-MM-dd')}else{delete this.Doxobj.LCIssuanceDate};
        
        if(this.Doxobj.LCLatestdate !="")
        {this.Doxobj.LCLatestdate=this.datePipe.transform(this.Doxobj.LCLatestdate,'yyyy-MM-dd')}else{delete this.Doxobj.LCLatestdate};
        
        if(this.Doxobj.OBLReceived !="")
        {this.Doxobj.OBLReceived=this.datePipe.transform(this.Doxobj.OBLReceived,'yyyy-MM-dd')}else{delete this.Doxobj.OBLReceived};
        
        if(this.Doxobj.OriginalWQReceived !="")
        {this.Doxobj.OriginalWQReceived=this.datePipe.transform(this.Doxobj.OriginalWQReceived,'yyyy-MM-dd')}else{delete this.Doxobj.OriginalWQReceived};

        if(this.Doxobj.OriginalPhytoReceived !="")
        {this.Doxobj.OriginalPhytoReceived=this.datePipe.transform(this.Doxobj.OriginalPhytoReceived,'yyyy-MM-dd')}else{delete this.Doxobj.OriginalPhytoReceived};


        if(this.Doxobj.OriginalsCouriered !="")
        {this.Doxobj.OriginalsCouriered=this.datePipe.transform(this.Doxobj.OriginalsCouriered,'yyyy-MM-dd')}else{delete this.Doxobj.OriginalsCouriered};

        if(this.Doxobj.PhytoDraftReceived !="")
        {this.Doxobj.PhytoDraftReceived=this.datePipe.transform(this.Doxobj.PhytoDraftReceived,'yyyy-MM-dd')}else{delete this.Doxobj.PhytoDraftReceived};

        if(this.Doxobj.Phytorequest !="")
        {this.Doxobj.Phytorequest=this.datePipe.transform(this.Doxobj.Phytorequest,'yyyy-MM-dd')}else{delete this.Doxobj.Phytorequest};

        if(this.Doxobj.WQDraftReceived !="")
        {this.Doxobj.WQDraftReceived=this.datePipe.transform(this.Doxobj.WQDraftReceived,'yyyy-MM-dd')}else{delete this.Doxobj.WQDraftReceived};

        if(this.Doxobj.WQrequest !="")
        {this.Doxobj.WQrequest=this.datePipe.transform(this.Doxobj.WQrequest,'yyyy-MM-dd')}else{delete this.Doxobj.WQrequest};

        if(this.Doxobj.productiondate !="")
        {this.Doxobj.productiondate=this.datePipe.transform(this.Doxobj.productiondate,'yyyy-MM-dd')}else{delete this.Doxobj.productiondate};

       
        //SQL to create Doxobj
        this.blockedPanel = true;
        let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/update";
        console.log(url);
        let param: any = {};
        param.op = "update";
        param.entity = "Wrx_Dox";
        param.entityid = { id: this.Doxobj.id };
        param.attributes = this.Doxobj;
        console.log("In Update", this.Doxobj);

        let headers = new HttpHeaders();
        this.http.post(url, param, { headers: headers }).subscribe(
          (res) => {
            console.log(res);
            var response: any = res;
            if (response.success) {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Doxobj Updated', life: 3000 });
              //................................Get Status for Contratc if railcarmapped is assigned to split
            if(this.Doxobj.AWBNo != "" || this.Doxobj.AWBNo != "NA" || this.Doxobj.AWBNo != "0") {
              let updatestatus:any ={};
              updatestatus.SplitStatus = 6;
              this.blockedPanel=true;
                let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
                console.log(url);
                let param: any = {};
                param.op = "update";
                param.entityid={id:this.rowData.id};
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
                      this.messageService.add({severity:'success', summary: 'Successful', detail: 'Status Updated As Closed', life: 3000});
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
                  }
         //..................................................
              this.getDox();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Doxobj Not Updated', life: 3000 });
            }
          }, response => {
          console.log("Post call in error", response);
          this.blockedPanel = false;
          this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        },
          () => {
            console.log("The Post observable is now completed.");
            this.blockedPanel = false;
          })
        // SQL finish create...........................................................................................................
        // this.commodities = [...this.commodities];
        //      this.addNewDialogue = false;
        //    this.Doxobj = {};
      }
      else {
        console.log(this.Doxobj);

        //this.Doxobj.id = this.createId();
        this.Doxobj.modifiedby = this.loggedinuser.Uid;
        //this.Doxobj.modifiedon = this.myDate;
      
        console.log("object  is", this.Doxobj);
        
        //SQL to create Doxobj
        this.blockedPanel = true;
        let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/create";
        console.log(url);
        let param: any = {};
        param.op = "create";
        param.entity = "Wrx_Dox";
        param.attributes = this.Doxobj;
        let headers = new HttpHeaders();
        this.http.post(url, param, { headers: headers }).subscribe(
          (res) => {
            console.log(res);
            var response: any = res;
            if (response.success) {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Doxobj Created', life: 3000 });
               //................................Get Status for Contratc if railcarmapped is assigned to split
                  if(this.Doxobj.AWBNo != "" || this.Doxobj.AWBNo != "NA" || this.Doxobj.AWBNo != "0") {
                    let updatestatus:any ={};
                    updatestatus.SplitStatus = 6; //Close the Split.
                    this.blockedPanel=true;
                      let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/update";
                      console.log(url);
                      let param: any = {};
                      param.op = "update";
                      param.entityid={id:this.rowData.id};
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
                            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Status Updated As Closed', life: 3000});
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
                        }
         //..................................................
              this.getDox();
              //this.rptAppropriation();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Doxobj Not Created', life: 3000 });

            }
          }, response => {
          console.log("Post call in error", response);
          this.blockedPanel = false;
          this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        },
          () => {
            console.log("The Post observable is now completed.");
            this.blockedPanel = false;
          })
      }
      // SQL finish create...........................................................................................................
      //          this.commodities = [...this.commodities];
      this.addNewDialogue = false;
      this.Doxobj = {};
    }
  }

  WeightCer() {
    this.blockedPanel = true;
    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/openAccountAmmendment";
    console.log(url);
    let param: any = {};
    param.op = "openAccountAmmendment";
    param.entity = "rptWeightCert.pdf";
    param.railcarid = '3';
    param.attributes = this.rowData;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.pdfURL = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.weightCert + "_" + this.rowData.id + ".pdf";
          this.rowURL[0].weightCertURL = this.pdfURL;
          this.updateURL();

        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  CommInv() {

  }
  GMA() {

  }
  getPhytoDeclaredQTY() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_PhytoDeclaredQTY where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.PhytoDeclaredQTY = response.result.queryresult;
          if (this.PhytoDeclaredQTY.length) {
            //this.PHYTO();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
            this.isPhytorail = true;
            this.israil = true;
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  GetPhyto() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_PhytoApplication where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.Phyto = response.result.queryresult;

          console.log("PhytoRecords", this.Phyto);

          if (this.Phyto.length) {
            this.PHYTO();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  getWQ() {

    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.WQrows = response.result.queryresult;
          if (this.WQrows.length) {
            this.WQrows.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = (this.loggedinuser.Email != "") ? this.loggedinuser.Email : "";
              element.Phone = (this.loggedinuser.Phone != "") ? this.loggedinuser.Phone : "";
            })
            this.WQ();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  WQ() {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/WQ";

    console.log(url);
    let param: any = {};
    param.op = "WQ";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.WQrows;
    param.attributesrail = this.PhytoRail;
    param.attributescontainer = this.railcontainer;
    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    console.log("declare", this.PhytoDeclaredQTY);

    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.pdfURL = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.WQURL + this.rowData.id + ".pdf";

          this.rowURL[0].WQURL = this.pdfURL;
          this.updateURL();
          window.open(this.rowURL[0].WQURL);
          console.log(this.pdfURL);

        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
          //window.location.reload()
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  PHYTO() {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/PhytoApplicationForm";

    console.log(url);
    let param: any = {};
    param.op = "PhytoApplicationForm";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.Phyto;
    param.attributesrail = this.PhytoRail;
    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    console.log("declare", this.PhytoDeclaredQTY);

    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.pdfURL = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.phytoTemplateFileName + "_" + this.rowData.id + ".pdf";

          this.rowURL[0].phytoURL = this.pdfURL;
          this.updateURL();
          window.open(this.rowURL[0].phytoURL);
          console.log(this.pdfURL);

        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
          //window.location.reload()
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  updateURL() {
    this.blockedPanel = true;
    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/update";
    console.log(url);
    let param: any = {};
    param.op = "update";
    param.entityid = { id: this.rowData.id };
    param.entity = "Wrx_BatchContract";
    param.attributes = this.rowURL[0];
    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'URL Updated', life: 3000 });

          this.rowData.phytoURL = this.rowURL[0].phytoURL;
          this.rowData.InvoiceURL = this.rowURL[0].InvoiceURL;
          this.rowData.weightCertURL = this.rowURL[0].weightCertURL;
          this.rowData.HealthCertURL = this.rowURL[0].HealthCertURL;
          this.rowData.BLInstructionsURL = this.rowURL[0].BLInstructionsURL;
          this.rowData.NonGmoURL = this.rowURL[0].NonGmoURL;
          this.rowData.AppropriationURL = this.rowURL[0].AppropriationURL;
          this.rowData.PackingListURL = this.rowURL[0].PackingListURL;
          this.rowData.WQURL = this.rowURL[0].WQURL;
          this.rowData.AllDecURL = this.rowURL[0].AllDecURL;
          this.rowData.SheilfLifeURL = this.rowURL[0].SheilfLifeURL;
          this.rowData.CROPCertURL = this.rowURL[0].CROPCertURL;

          console.log(this.rowData);

          //window.location.reload();
          //this.getCommodities();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'URL Not Updated', life: 3000 });
        }
      }, response => {
      console.log("Post call in error", response);
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
      this.blockedPanel = false;
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      });
  }
  GetDescription()
  {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.Appropriation = response.result.queryresult;
          if (this.Appropriation.length) {

            this.Appropriation.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = (this.loggedinuser.Email != "") ? this.loggedinuser.Email : "";
              element.Phone = (this.loggedinuser.Phone != "") ? this.loggedinuser.Phone : "";
            });
            console.log("App", this.Appropriation);
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  GetAppropriation() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.Appropriation = response.result.queryresult;
          if (this.Appropriation.length) {

            this.Appropriation.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = (this.loggedinuser.Email != "") ? this.loggedinuser.Email : "";
              element.Phone = (this.loggedinuser.Phone != "") ? this.loggedinuser.Phone : "";
            });
            console.log("App", this.Appropriation);


            this.rptAppropriation();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  getRailContaniersToT() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_RailContaniersToT where id=" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.railcontainerTOT = response.result.queryresult;
          if (!this.railcontainerTOT.length) {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingRailCar);
            this.israil = true;
            this.isPhytorail = true;
          }
          else {
            this.israil = false;
            this.isPhytorail = false;

            this.getRailCars();
            this.getPhytoDeclaredQTY();

          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }

  getRailcontainer() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_RailContaniers where id=" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.railcontainer = response.result.queryresult;
          if (!this.railcontainer.length) {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingRailCar);
            this.israil = true;
            this.isPhytorail = true;
          }
          else {
            this.israil = false;
            this.isPhytorail = false;

            this.getRailCars();
            this.getPhytoDeclaredQTY();

          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  rptAppropriation() {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/Appropriation";

    console.log(url);
    let param: any = {};
    param.op = "Appropriation";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.Appropriation;
    param.attributesrail = this.railcontainerTOT;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.AppropriationURL = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.AppropriationURL + this.rowData.id + ".pdf";
          this.rowURL[0].AppropriationURL = this.AppropriationURL;
          this.updateURL();
          window.open(this.rowURL[0].AppropriationURL);
          //window.location.href= this.rowURL.AppropriationURL;

          console.log(this.AppropriationURL);

        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
          //window.location.reload()
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  GetInstruct()
  {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.BLInstructions = response.result.queryresult;
          if (this.BLInstructions.length) {
            this.BLInstructions.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = this.loggedinuser.Email;
              element.Phone = this.loggedinuser.Phone;
            })
            //this.rptBLInstructions();
            this.rptBLInstruct();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  GetBLInstructions() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.BLInstructions = response.result.queryresult;
          if (this.BLInstructions.length) {
            this.BLInstructions.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = this.loggedinuser.Email;
              element.Phone = this.loggedinuser.Phone;
            })
            //this.rptBLInstructions();
            this.rptBLInstructions();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  rptBLInstruct()
  {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/BLInstruct";

    console.log(url);
    let param: any = {};
    param.op = "BLInstruct";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.BLInstructions;
    param.attributesrail = this.railcontainerTOT;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          //this.BLInstructionsURL = this.generalservice.appconfigs.URLs.fileURL + response.message + this.rowData.id + ".pdf";
          //this.rowURL[0].BLInstructionsURL = this.BLInstructionsURL;
          //this.updateURL();
          //window.open(this.rowURL[0].BLInstructionsURL);
          console.log(this.BLInstructionsURL);
          console.log("Print outline", response.message);
          

        }
        else if (response.message.includes("System.IO.IOException")) {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Unable to produce document, it is being used by another process or already opened.', life: 6000 });
          //window.location.reload()
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  rptBLInstructions() {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/BLInstructions";

    console.log(url);
    let param: any = {};
    param.op = "BLInstructions";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.BLInstructions;
    param.attributesrail = this.railcontainerTOT;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.BLInstructionsURL = this.generalservice.appconfigs.URLs.fileURL + response.message + this.rowData.id + ".pdf";
          this.rowURL[0].BLInstructionsURL = this.BLInstructionsURL;
          this.updateURL();
          window.open(this.rowURL[0].BLInstructionsURL);
          console.log(this.BLInstructionsURL);
          console.log("Print outline", response.message);
          

        }
        else if (response.message.includes("System.IO.IOException")) {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Unable to produce document, it is being used by another process or already opened.', life: 6000 });
          //window.location.reload()
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  GetNonGmo() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.NonGmo = response.result.queryresult;
          if (this.NonGmo.length) {
            this.NonGmo.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = this.loggedinuser.Email;
              element.Phone = this.loggedinuser.Phone;
            })
            this.rptNonGmo();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  rptNonGmo() {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/NonGmo";

    console.log(url);
    let param: any = {};
    param.op = "NonGmo";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.NonGmo;
    param.attributesrail = this.railcontainer;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.NonGmoURL = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.NonGmo + this.rowData.id + ".pdf";
          this.rowURL[0].NonGmoURL = this.NonGmoURL;
          this.updateURL();
          window.open(this.rowURL[0].NonGmoURL)

        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
          //window.location.reload()
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  GetHealthCert() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.HealthCert = response.result.queryresult;
          if (this.HealthCert.length) {
            this.HealthCert.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = this.loggedinuser.Email;
              element.Phone = this.loggedinuser.Phone;
            })
            this.rptHealthCert();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  rptHealthCert() {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/HealthCert";

    console.log(url);
    let param: any = {};
    param.op = "HealthCert";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.HealthCert;
    param.attributesrail = this.railcontainer;
    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.HealthCertURL = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.HealthCert + this.rowData.id + ".pdf";
          this.rowURL[0].HealthCertURL = this.HealthCertURL;
          this.updateURL();
          window.open(this.rowURL[0].HealthCertURL)

        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
          //window.location.reload()
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  GetWeightCer() {
    this.blockedPanel = true;
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_rptAppropriation where id =" + this.rowData.id + ";" //+ this.rowData.Contractnumber + "'";
    console.log(param.query);

    let headers = new HttpHeaders();

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/query";

    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.TBLWeightCert = response.result.queryresult;
          if (this.TBLWeightCert.length) {
            this.TBLWeightCert.forEach((element: any) => {
              element.Username = this.loggedinuser.UName;
              element.signature = this.loggedinuser.UName;
              element.Email = this.loggedinuser.Email;
              element.Phone = this.loggedinuser.Phone;
            })
            this.rptweightCert();
          }
          else {
            this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.MissingData);
          }
        }
      }, response => {
        console.log("Post call in error", response);
        this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
        this.blockedPanel = false;
      },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }
  rptweightCert() {
    this.blockedPanel = true;

    let url = this.generalservice.appconfigs.URLs.apiUrl + "/api/WeightCert";

    console.log(url);
    let param: any = {};
    param.op = "WeightCert";
    //param.entity = "rptWeightCert.pdf";
    //param.railcarid= '3';
    param.attributes = this.TBLWeightCert;
    param.attributesrail = this.railcontainerTOT;
    // param.TBLattributes = this.TBLWeightCert;
    param.userid = this.loggedinuser.Uid;
    param.ownerid = this.loggedinuser.Uid;
    param.PhytoDeclaredQTY = this.PhytoDeclaredQTY;

    let headers = new HttpHeaders();
    this.http.post(url, param, { headers: headers }).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if (response.success) {
          this.iscreated = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000 });

          this.weightCertURL = this.generalservice.appconfigs.URLs.fileURL + this.generalservice.appconfigs.URLs.weightCert + this.rowData.id + ".pdf";
          this.rowURL[0].weightCertURL = this.weightCertURL;
          this.updateURL();
          window.open(this.rowURL[0].weightCertURL);
        }
        else if (response.message.includes("System.IO.IOException")) {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Unable to produce document, it is being used by another process or already opened.', life: 6000 });
          //window.location.reload()
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Document Not Created', life: 3000 });
        }
      }, response => {
      console.log("Post call in error", response);
      this.blockedPanel = false;
      this.showPositionDialog('Top', this.generalservice.appconfigs.Messages.NetworkError);
    },
      () => {
        console.log("The Post observable is now completed.");
        this.blockedPanel = false;
      })
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.Doxobjs.length; i++) {
      if (this.Doxobjs[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

}
