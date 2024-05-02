import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PickListFilterOptions } from 'primeng/picklist';
import { Utils } from '../utils';
import { GeneralService } from '../general.service';
import {FieldsetModule} from 'primeng/fieldset';
import { SelectItem, PrimeNGConfig} from 'primeng/api';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-importpermit',
  templateUrl: './importpermit.component.html',
  styleUrls: ['./importpermit.component.css'],
  providers: [DatePipe]
})

export class ImportpermitComponent {
  uploadedFiles: any[] = [];
  myDate = new Date();
  blockedPanel: boolean = false;
  loggedinuser:any;

  constructor(private router: Router, private primengConfig: PrimeNGConfig,private messageService: MessageService, private confirmationService: ConfirmationService, private generalservice: GeneralService,
    private http: HttpClient, private datePipe: DatePipe) {
      let myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy HH:mm:ss');
      this.loggedinuser = generalservice.getLoggedUser();
      let impvalue:Date = this.myDate;
      let Expvalue:Date = this.myDate ;
      if(!this.loggedinuser)
      {
        
        this.router.navigateByUrl('/app-login');
      }
    }
  myUploader(event:any)
  {
    this.uploadedFiles= [];
    for(let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles);
      //this.commodity.image = this.uploadedFiles[0].name;
      //console.log(this.commodity);
    }

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
}
