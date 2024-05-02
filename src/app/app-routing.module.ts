import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { CustomersComponent } from './customers/customers.component';
import { CommoditiesComponent } from './commodities/commodities.component';
import { RailcarsComponent } from './railcarsTypes/railcars.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { TeamsComponent } from './teams/teams.component';
import { GradesComponent } from './grades/grades.component';
import { CountriesComponent } from './countries/countries.component';
import { ShipTransloadersComponent } from './ship-transloaders/ship-transloaders.component';
import { ServcietypeComponent } from './servcietype/servcietype.component';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { OperationsComponent } from './operations/operations.component';
import { PuroperationsComponent } from './puroperations/puroperations.component';
import { BookingComponent } from './booking/booking.component';
import { ProdinstructComponent } from './prodinstruct/prodinstruct.component';
import { ShippinglinesComponent } from './shippinglines/shippinglines.component';
import { ImportpermitComponent } from './importpermit/importpermit.component';
import { ShippingInstructComponent } from './shipping-instruct/shipping-instruct.component';
import { RolesComponent } from './roles/roles.component';
import { PlandetailsComponent } from './plandetails/plandetails.component';
import { PlantsComponent } from './plants/plants.component';
import { PackagesComponent } from './packages/packages.component';
import { PkagetypesComponent } from './pkagetypes/pkagetypes.component';
import { DoXComponent } from './do-x/do-x.component';
import { RailcarsMapComponent } from './railcars-map/railcars-map.component';
import { PortsofdischargeComponent } from './portsofdischarge/portsofdischarge.component';
import { STComponent } from './SalesTransactions/st.component';
import { DoxDetailsComponent } from './dox-details/dox-details.component';
import { AccdetailsComponent } from './accdetails/accdetails.component';
import { AccountsComponent } from './accounts/accounts.component';
import { NotesComponent } from './notes/notes.component';
import { RailscardetailsComponent } from './railscardetails/railscardetails.component';
import { PurtransactionsComponent } from './purtransactions/purtransactions.component';
import { OriginsComponent } from './origins/origins.component';
import { ExtrasrvComponent } from './extrasrv/extrasrv.component';
import { ImportpermitmatrixComponent } from './importpermitmatrix/importpermitmatrix.component';
import { GroupsComponent } from './groups/groups.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ERRLogComponent } from './errlog/errlog.component';
import { DummyContractComponent } from './dummy-contract/dummy-contract.component';
import { VarietyComponent } from './variety/variety.component';
import { PaymenttermsComponent } from './paymentterms/paymentterms.component';
import { SGSComponent } from './sgs/sgs.component';
import { CFIAComponent } from './cfia/cfia.component';
import { PalletdimensionsComponent } from './palletdimensions/palletdimensions.component';
import { PalletstackingComponent } from './palletstacking/palletstacking.component';
import { ArchivedContractsComponent } from './archived-contracts/archived-contracts.component';
import { ContractstocloseComponent } from './contractstoclose/contractstoclose.component';
import { NewrailcarComponent } from './newrailcar/newrailcar.component';
import { PositionreprotComponent } from './positionreprot/positionreprot.component';
import { RailnophytorptComponent } from './railnophytorpt/railnophytorpt.component';
import { PurchasecontractsComponent } from './purchasecontracts/purchasecontracts.component';
import { RptXMLComponent } from './rpt-xml/rpt-xml.component';
import { DatadumptbComponent } from './datadumptb/datadumptb.component';
import { RptAllcontainersComponent } from './rpt-allcontainers/rpt-allcontainers.component';
import { RptDummyDumpComponent } from './rpt-dummy-dump/rpt-dummy-dump.component';
import { RptSalesDumpComponent } from './rpt-sales-dump/rpt-sales-dump.component';
import { RptPurchaseDumpComponent } from './rpt-purchase-dump/rpt-purchase-dump.component';
import { PortofloadingComponent } from './portofloading/portofloading.component';
import { TestTreeComponent } from './test-tree/test-tree.component';


const routes: Routes = [
  { path: '', redirectTo: '/app-home', pathMatch: 'full' },
  { path: 'app-home', component: HomeComponent },
  { path: 'app-login', component: LoginComponent },
  { path: 'app-users', component: UsersComponent },
  { path: 'app-customers', component: CustomersComponent },
  { path: 'app-commodities', component: CommoditiesComponent},
  { path: 'app-railcars', component: RailcarsComponent},
  { path: 'app-fileupload', component: FileuploadComponent},
  { path: 'app-teams', component: TeamsComponent},
  { path: 'app-grade', component: GradesComponent},
  { path: 'app-countries', component: CountriesComponent},
  { path: 'app-ship-transloaders', component: ShipTransloadersComponent},
  { path: 'app-servcietype' , component: ServcietypeComponent},
  { path: 'app-upload-files', component: UploadFilesComponent },
  { path: 'app-operations',component: OperationsComponent},
  { path: 'app-puroperations', component: PuroperationsComponent},
  { path: 'app-booking',component: BookingComponent},
  { path: 'app-prodinstruct',component: ProdinstructComponent},
  { path: 'app-shippinglines',component: ShippinglinesComponent},
  { path: 'app-importpermit', component:ImportpermitComponent},
  { path: 'app-shipping-instruct', component:ShippingInstructComponent},
  { path: 'app-roles', component: RolesComponent},
  { path: 'app-plandetails', component: PlandetailsComponent},
  { path: 'app-plants', component:PlantsComponent},
  { path: 'app-pkagetypes', component: PkagetypesComponent},
  { path: 'app-packages', component: PackagesComponent},
  { path: 'app-do-x',component:DoXComponent},
  { path: 'app-railcars-map', component: RailcarsMapComponent},
  { path: 'app-portsofdischarge', component:PortsofdischargeComponent},
  { path: 'app-st', component:STComponent},
  { path: 'app-dox-details', component:DoxDetailsComponent},
  { path: 'app-notes', component:NotesComponent},
  { path: 'app-accdetails', component:AccdetailsComponent},
  { path: 'app-accounts',component:AccountsComponent},
  { path: 'app-railscardetails', component: RailscardetailsComponent},
  { path: 'app-purtransactions',component:PurtransactionsComponent},
  { path: 'app-origins', component:OriginsComponent},
  { path: 'app-extrasrv',component:ExtrasrvComponent},
  { path: 'app-importpermitmatrix', component:ImportpermitmatrixComponent},
  { path: 'app-groups',component:GroupsComponent},
  { path: 'app-resetpassword', component:ResetpasswordComponent},
  { path: 'app-errlog', component:ERRLogComponent},
  { path: 'app-dummy-contract', component:DummyContractComponent},
  { path: 'app-variety', component: VarietyComponent},
  { path: 'app-paymentterms', component:PaymenttermsComponent},
  { path: 'app-sgs', component:SGSComponent},
  { path: 'app-cfia', component:CFIAComponent},
  { path: 'app-palletdimensions', component:PalletdimensionsComponent},
  { path: 'app-palletstacking', component:PalletstackingComponent},
  { path: 'app-archived-contracts', component:ArchivedContractsComponent},
  { path: 'app-contractstoclose', component:ContractstocloseComponent},
  { path: 'app-newrailcar', component:NewrailcarComponent},
  { path: 'app-positionreprot', component:PositionreprotComponent},
  { path: 'app-railnophytorpt', component:RailnophytorptComponent},
  { path: 'app-purchasecontracts', component:PurchasecontractsComponent},
  { path: 'app-rpt-xml',component:RptXMLComponent},
  { path: 'app-datadumptb', component: DatadumptbComponent},
  { path: 'app-rpt-allcontainers', component:RptAllcontainersComponent},
  { path: 'app-rpt-dummy-dump', component:RptDummyDumpComponent},
  { path: 'app-rpt-sales-dump', component:RptSalesDumpComponent},
  { path:'app-rpt-purchase-dump', component:RptPurchaseDumpComponent},
  { path: 'app-portofloading',component:PortofloadingComponent},
  { path: 'app-test-tree', component:TestTreeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
