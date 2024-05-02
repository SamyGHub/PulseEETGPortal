import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService,ConfirmationService } from 'primeng/api';
import { GeneralService } from '../general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent {
  uploadedFiles: any[] = [];
  filePath: any;

  constructor(
    private generalservcies:GeneralService,
    private HttpClient :HttpClient, private messageService: MessageService
  ) {
    
    let csvData = '"Hello","World!"';
        let options = {
            complete: (results: any, file: any) => {
                console.log('Parsed: ', results, file);
            }
          };
  }
  ngOnInit(): void 
  {
    
  }
  onSelectEvent(event:any) {
    console.log("Selected files", event);
  }
  onUpload(event:any) 
  {
    //console.log(event.target.files);
    for(let file of event.files) 
    {
      this.uploadedFiles.push(file);
    }
    console.log(this.uploadedFiles);
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
  
  
}

