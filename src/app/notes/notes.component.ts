//import { string } from '@amcharts/amcharts4/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Directive, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralService } from '../general.service';
import { ConfirmationService } from 'primeng/api';
//import { FileUploader } from 'ng2-file-upload';
//import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';


//import { ConfigService } from '../config.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})

//@Directive({ selector: '[ng2FileSelect]' })

export class NotesComponent implements OnInit {

  @Input() EntityId: any;
  @Input() OwnerId: any;
  @Input() OwnerName: any;
  @Input() EntityType: any;

  addNote: boolean=false;
  notesSegmentDimmed: boolean = false;
  notesLoading: boolean = false;
  notesLoadingText: string='';
  notes: any;
  formdata: any;

  //file uploader
  fileName: string='';
  fileType: string='';
  fileBase64: string='';
  globalfile: string='';
  loggedinuser: any;
  messageService: any;
  blockedPanel: boolean = false;
  displayPosition:boolean=false;
  position: string = "";
  dialougmessage: string ="";

  constructor(
    private generalservice: GeneralService, 
    private http: HttpClient, 
    private router: Router,
    private confirmationService: ConfirmationService) 
  {
    this.loggedinuser = generalservice.getLoggedUser();
      if(!this.loggedinuser)
    {
      this.router.navigateByUrl('/app-login');
    }
  }

ngOnInit() {
    if(this.EntityId){
      console.log("This is the parent data", this.OwnerName);
      this.getNotes();
    }
    else{
      console.log("undefied");
      this.notesSegmentDimmed = true;
    }
    this.formdata = new FormGroup({
      subject: new FormControl("", Validators.compose([
         Validators.required
      ]))
      ,
      notes: new FormControl("", Validators.compose([
       // Validators.required
     ])),
      });
  }
  focusFunction(){
    this.addNote = true;
  }
  focusOutFunction(){
    this.addNote = false;
  }
  getNotes(){
    this.blockedPanel = true;
    let param: any = {};
    param.EntityID = this.EntityId;
    
    
    this.setLoading(true, "Loading...");
    let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/getNotesByEntityID";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if(response.success){
          console.log(response);
          this.notes = response.result.NotesList;
        }
        // else{
        //   this.messageService.add({severity:'error', summary: 'Failed', detail: 'Connection error: '+response.message, life: 6000});
        // }
      },
      response => {
          console.log("POST call in error", response);
          this.blockedPanel=false;         
      },
      () => {
          console.log("The POST observable is now completed.");
          this.blockedPanel=false;
      }
    );
   }
   onClickSubmit(formdata: { subject: any; notes: any; })
   {
    this.blockedPanel=true;
    console.log(formdata);
    let param: any = {
      Subject: formdata.subject,
      EntityID: this.EntityId,
      OwnerId: this.OwnerId,
      OwnerName: this.OwnerName,
      EntityType: this.EntityType,
      Notes: formdata.notes
  
  };
  if(this.fileName != "" && this.fileType !="" && this.fileBase64 != ""){
    param.FileName = this.fileName;
    param.MimeType = this.fileType;
    param.Base64File = this.fileBase64;
  }
    this.setLoading(true, "Pocessing...");
    let headers = new HttpHeaders();
    
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/createNote";
    
    this.http.post(url, param, {headers: headers}).subscribe(
      (res) => {
        console.log(res);
        var response: any = res;
        if(response.success){
          console.log(response);
          this.notes = response.result.NotesList;
          this.formdata.reset();
          this.focusOutFunction();
        }
        
      },
      response => {
          console.log("POST call in error", response);
          this.blockedPanel=false;      
      },
      () => {
          console.log("The POST observable is now completed.");
          this.blockedPanel=false;
      }
    );
   }
   handleFileInput(files: any){
    // console.log(files);
    let selectedfile = files.currentFiles[0];
    // console.log(selectedfile);
    const reader = new FileReader();
    reader.readAsDataURL(selectedfile);
    reader.onload = () => {
        //console.log(reader.result);
        this.fileName = selectedfile.name;
        this.fileType = selectedfile.type;
        if(reader.result)
          this.fileBase64 = reader.result.toString();
        this.globalfile = this.fileBase64;
        // console.log(this.fileBase64);
        
    };
   }
   deleteAttachement(noteId: Number)
   {
    //call delete API after confirmation from the customer
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + noteId + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
        //Delete SQL Database
        this.blockedPanel=true;
        let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/delete";
        console.log(url);
        let param: any = {};
        param.op = "delete";
        param.entityid={NotesID:noteId};
        param.entity = "NotesAndAttachements";
        let headers = new HttpHeaders();
        this.http.post(url, param, {headers: headers}).subscribe(
        (res) => 
          {
            console.log(res);
            var response: any = res;
            if(response.success)
            {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Attachement Deleted', life: 3000});
              this.getNotes();
              
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
    //refresh notes after delete
    
   }
   showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
 getFile(noteid: number): Observable<Blob> {  
  let param: any = {
    NoteId: noteid
  }; 
  //const options = { responseType: 'blob' }; there is no use of this
    let url = this.generalservice.appconfigs.URLs.apiUrl+"/api/getAttachementByNoteID";
      // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
      return this.http.post(url, param, { responseType: 'blob' });
  }

  public downloadFile(fileName: string, fileType: string, noteid: number): void {
    this.getFile(noteid)
        .subscribe(x => {
            // It is necessary to create a new blob object with mime-type explicitly set
            // otherwise only Chrome works like it should
            var newBlob = new Blob([x], { type: fileType });
            
            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            //     window.navigator.msSaveOrOpenBlob(newBlob, fileName);
            //     return;
            // }
            
            // For other browsers: 
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);
            
            var link = document.createElement('a');
            link.href = data;
            link.download = fileName;
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            
            setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
        });
  }
setLoading(state: boolean, loadingtext: string){
  this.notesSegmentDimmed = state;
    this.notesLoading = state;
    this.notesLoadingText = loadingtext;
  }
}
