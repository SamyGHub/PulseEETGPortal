import { Injectable } from '@angular/core';
import {Message} from 'primeng//api';
import {MessageService} from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private messageService: MessageService) { }
  addSingle(message: any) {
    //this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
    this.messageService.add(message);
  }

  addMultiple(messages: any []) {
      //this.messageService.addAll([{severity:'success', summary:'Service Message', detail:'Via MessageService'},{severity:'info', summary:'Info Message', detail:'Via MessageService'}]);
      this.messageService.addAll(messages);
  }

  clear() {
      this.messageService.clear();
  }
}
