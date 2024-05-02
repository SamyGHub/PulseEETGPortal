import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from './general.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ETG Portal';
  
  constructor(
    //translate:  TranslateService, 
    public generalServices: GeneralService,
    private router: Router,
    private translate: TranslateService) {
    
    translate.setDefaultLang('en');
    translate.use('en');
    
    if(!generalServices.loggeduser)
      this.router.navigate(['/app-login'])
  }
  useLanguage(language: string): void {
    this.translate.use(language);
}
}
