import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {CalendarModule} from 'primeng/calendar';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ChipsModule} from 'primeng/chips';
import {InputMaskModule} from 'primeng/inputmask';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {PasswordModule} from 'primeng/password';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {BlockUIModule} from 'primeng/blockui';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import {MessagesModule} from 'primeng/messages';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MessageModule} from 'primeng/message';
import {AvatarModule} from 'primeng/avatar';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TabMenuModule} from 'primeng/tabmenu';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import {ToastModule} from 'primeng/toast';
import {ImageModule} from 'primeng/image';
import {SpeedDialModule} from 'primeng/speeddial';
import {CheckboxModule} from 'primeng/checkbox';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';
import {TableModule} from 'primeng/table';
import {PickListModule} from 'primeng/picklist';
import { UsersComponent } from './users/users.component';
import { FormsModule } from '@angular/forms';
import { CustomersComponent } from './customers/customers.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { CommoditiesComponent } from './commodities/commodities.component';
import { RailcarsComponent } from './railcarsTypes/railcars.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { GradesComponent } from './grades/grades.component';
import { TeamsComponent } from './teams/teams.component';
import {DividerModule} from 'primeng/divider';
import { CountriesComponent } from './countries/countries.component';
import { ShipTransloadersComponent } from './ship-transloaders/ship-transloaders.component';
import { CountainerstypeComponent } from './countainerstype/countainerstype.component';
import { ShippinglinesComponent } from './shippinglines/shippinglines.component';
import { ServcietypeComponent } from './servcietype/servcietype.component';
import { PortofloadingComponent } from './portofloading/portofloading.component';
import {AccordionModule} from 'primeng/accordion';
import { GroupsComponent } from './groups/groups.component';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { BookingComponent } from './booking/booking.component';
import { OperationsComponent } from './operations/operations.component';
import { PuroperationsComponent } from './puroperations/puroperations.component';
import {FieldsetModule} from 'primeng/fieldset';
import { StepsModule } from 'primeng/steps';
import { ProdinstructComponent } from './prodinstruct/prodinstruct.component';
import { ProcessStepsComponent } from './process-steps/process-steps.component';
import { ImportpermitComponent } from './importpermit/importpermit.component';
import { ShippingInstructComponent } from './shipping-instruct/shipping-instruct.component';
import { PlandetailsComponent } from './plandetails/plandetails.component';
import { RolesComponent } from './roles/roles.component';
import { PortsofdischargeComponent } from './portsofdischarge/portsofdischarge.component';
import { UsersListComponent } from './users-list/users-list.component';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { GreenweeksComponent } from './greenweeks/greenweeks.component';
import { PlantsComponent } from './plants/plants.component';
import { OverlayPanelModule} from 'primeng/overlaypanel';
import { TabViewModule} from 'primeng/tabview';
import { PkagetypesComponent } from './pkagetypes/pkagetypes.component';
import { PackagesComponent } from './packages/packages.component';
import { AccountsComponent } from './accounts/accounts.component';
import { DoXComponent } from './do-x/do-x.component';
import { NotesComponent } from './notes/notes.component';
import { RailcarsMapComponent } from './railcars-map/railcars-map.component';
import { ChartModule} from 'primeng/chart';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { STComponent } from './SalesTransactions/st.component';
import { DoxDetailsComponent } from './dox-details/dox-details.component';
import { AccdetailsComponent } from './accdetails/accdetails.component';
import { PurtransactionsComponent } from './purtransactions/purtransactions.component';
import { RailscardetailsComponent } from './railscardetails/railscardetails.component';
import { BadgeModule} from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { PurchasecontractsComponent } from './purchasecontracts/purchasecontracts.component';
import { OriginsComponent } from './origins/origins.component';
import { FilterService } from 'primeng/api';
import { ExtrasrvComponent } from './extrasrv/extrasrv.component';
import { InplaceModule } from 'primeng/inplace';
import { ImportpermitmatrixComponent } from './importpermitmatrix/importpermitmatrix.component';
import { DummyContractComponent } from './dummy-contract/dummy-contract.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ERRLogComponent } from './errlog/errlog.component';
import { VarietyComponent } from './variety/variety.component';
import { CFIAComponent } from './cfia/cfia.component';
import { SGSComponent } from './sgs/sgs.component';
import { PalletdimensionsComponent } from './palletdimensions/palletdimensions.component';
import { PalletstackingComponent } from './palletstacking/palletstacking.component';
import { PaymenttermsComponent } from './paymentterms/paymentterms.component';
import { TagsComponent } from './tags/tags.component';
import { ArchivedContractsComponent } from './archived-contracts/archived-contracts.component';
import { ContractstocloseComponent } from './contractstoclose/contractstoclose.component';
import { NewrailcarComponent } from './newrailcar/newrailcar.component';
import { PositionreprotComponent } from './positionreprot/positionreprot.component';
import { RailnophytorptComponent } from './railnophytorpt/railnophytorpt.component';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';
import { RptXMLComponent } from './rpt-xml/rpt-xml.component';
import { DatadumptbComponent } from './datadumptb/datadumptb.component';
import { RptAllcontainersComponent } from './rpt-allcontainers/rpt-allcontainers.component';
import { RptDummyDumpComponent } from './rpt-dummy-dump/rpt-dummy-dump.component';
import { RptSalesDumpComponent } from './rpt-sales-dump/rpt-sales-dump.component';
import { RptPurchaseDumpComponent } from './rpt-purchase-dump/rpt-purchase-dump.component';
import { MegaMenuModule } from 'primeng/megamenu';
import { TreeTableModule } from 'primeng/treetable';
import { TestTreeComponent } from './test-tree/test-tree.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    LoginComponent,
    HomeComponent,
    UsersComponent,
    CustomersComponent,
    CommoditiesComponent,
    RailcarsComponent,
    FileuploadComponent,
    GradesComponent,
    TeamsComponent,
    CountriesComponent,
    ShipTransloadersComponent,
    CountainerstypeComponent,
    ShippinglinesComponent,
    ServcietypeComponent,
    PortofloadingComponent,
    GroupsComponent,
    UploadFilesComponent,
    BookingComponent,
    OperationsComponent,
    PuroperationsComponent,
    ProdinstructComponent,
    ProcessStepsComponent,
    ImportpermitComponent,
    ShippingInstructComponent,
    PlandetailsComponent,
    RolesComponent,
    PortsofdischargeComponent,
    UsersListComponent,
    GreenweeksComponent,
    PlantsComponent,
    PkagetypesComponent,
    PackagesComponent,
    AccountsComponent,
    DoXComponent,
    NotesComponent,
    RailcarsMapComponent,
    STComponent,
    DoxDetailsComponent,
    AccdetailsComponent,
    PurtransactionsComponent,
    RailscardetailsComponent,
    PurchasecontractsComponent,
    OriginsComponent,
    ExtrasrvComponent,
    ImportpermitmatrixComponent,
    DummyContractComponent,
    ResetpasswordComponent,
    ERRLogComponent,
    VarietyComponent,
    CFIAComponent,
    SGSComponent,
    PalletdimensionsComponent,
    PalletstackingComponent,
    PaymenttermsComponent,
    TagsComponent,
    ArchivedContractsComponent,
    ContractstocloseComponent,
    NewrailcarComponent,
    PositionreprotComponent,
    RailnophytorptComponent,
    RptXMLComponent,
    DatadumptbComponent,
    RptAllcontainersComponent,
    RptDummyDumpComponent,
    RptSalesDumpComponent,
    RptPurchaseDumpComponent,
    TestTreeComponent      
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CascadeSelectModule,
    CalendarModule,
    AutoCompleteModule,
    ChipsModule,
    InputMaskModule,
    DropdownModule,
    MultiSelectModule,
    PasswordModule,
    AccordionModule,
    BrowserAnimationsModule,
    BlockUIModule,
    MessagesModule,
    MessageModule,
    AvatarModule,
    MenuModule,
    ToolbarModule,
    SplitButtonModule,
    TabMenuModule,
    PanelModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    CardModule,
    PickListModule,
    ToastModule,
    ImageModule,
    SpeedDialModule,
    CheckboxModule,
    FileUploadModule,
    MenubarModule,
    FormsModule,
    InputTextareaModule,
    FieldsetModule,
    StepsModule,
    OverlayPanelModule,
    TabViewModule,
    ChartModule,
    BadgeModule,
    TagModule,
    DividerModule,
    InplaceModule,
    RadioButtonModule,
    BadgeModule,
    MegaMenuModule,
    TreeTableModule,
    // ngx-translate and the loader module
           TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
  ],
  providers: [MessageService, ConfirmationService, DatePipe, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {

}
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
