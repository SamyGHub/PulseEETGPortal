import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ConfirmationService, MegaMenuItem, MenuItem, MessageService} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {MenubarModule} from 'primeng/menubar';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [DialogService, MessageService]  
})
export class NavComponent implements OnInit {
  //items: MenuItem[] = [];
  items: MegaMenuItem[] = []; 
  loggedinuser: any;
  cols:any =[];
  rows:any =[];
  blockedPanel: boolean = false;
  position: string = "";
  displayPosition: boolean=false;
  dialougmessage: string ="";

  constructor(
    private generalservices: GeneralService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService, private datePipe: DatePipe, public dialogService: DialogService,private messageService: MessageService
  ) { 
    this.loggedinuser = generalservices.getLoggedUser();
      if(!this.loggedinuser)
    {
      this.router.navigateByUrl('/app-login');
    }
  }
  getUsrTeam()
  {
    let param: any = {};
    param.op = "query";
    param.query = "select * from vw_UserTeams where Uid=" + this.loggedinuser.Uid + " and ToType='Team';";
    console.log(param.query);
    
    let headers = new HttpHeaders();
    let url = this.generalservices.appconfigs.URLs.apiUrl+"/api/query";
    
    this.http.post(url, param, {headers: headers}).subscribe(
    (res) => 
    {
      console.log(res);
      var response: any = res;
      if(response.success)
      {        
        this.cols = response.result.cols[0];
        this.rows = response.result.queryresult;
        if(!this.rows.length)
        this.showPositionDialog('Top',this.generalservices.appconfigs.Messages.NetworkError);
      }
      else{
        this.messageService.add({severity:'error', summary: 'Failed', detail: 'Network DB Connection Error', life: 3000});
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
  showPositionDialog(position: string, message: string) 
  {
    this.dialougmessage = message;
    this.position = position;
    this.displayPosition = true;
  }
  ngOnInit() 
  {
      switch (this.loggedinuser.id)
    {
      case "7":  //DoxLogistics
      this.items = [
      {
        label: 'Dashboard', 
        icon:  'pi pi-fw pi-chart-pie', command: () => {this.router.navigateByUrl('/app-home');}
      },
      {
        label: 'Data Imports', 
        icon: 'pi pi-book',
        items: [
          [
            {
              label:'ERP-Prosoft Import',
              items:[{
                label: 'ERP Data Import',
                icon: 'pi pi-file-import', command: () => {this.router.navigateByUrl('/app-groups');},}]
            }
        ]]
      },
      {
        label: 'Operations', 
        icon: 'pi pi-fw pi-folder-open',
        items:[ 
          [ 
            {
                label:'Contracts',
                items:[{
                        label: 'Plan Sales Contract',
                        icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-operations');},
                      },
                      {
                        label: 'Purchase Contract',
                        icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-purchasecontracts');},
                      },
                      {
                        label: 'Dummy Contracts', 
                        icon: 'pi pi-shield',command: () => {this.router.navigateByUrl('/app-dummy-contract');}
                      }]
              }
            ],
            [{
                label: 'Instructions', 
                icon: 'pi pi-box',
                items: [
                        {
                          label: 'Production Instr.',
                          icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-prodinstruct');},
                        },
                        {
                          label: 'Shipping Instr.',
                          icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-shipping-instruct');},
                        },
                        {
                          label: 'RailCars Entry',
                          icon: 'pi pi-truck', command: () => {this.router.navigateByUrl('/app-newrailcar');},
                        },
                        {
                          label: 'Booking',
                          icon: 'pi pi-cog', command: () => {this.router.navigateByUrl('/app-booking');},
                        }]}
                ]
              ]
          
      },
      {
        label: 'Documentation', 
        icon: 'pi pi-fw pi-folder-open',
        items:[ 
            [
              {
                label:'Dox Generation',
                items:[{label: 'DoX Register',
                icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-do-x');},}]
              },
            
            ]]   
      },
      {
        label: 'Reports', 
        icon: 'pi pi-fw pi-folder-open',
        items:
        [[
          {
            label:'XML',
            items:[{label: 'Report Generation',
            icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-rpt-xml');},}]
            
          }]
          ,[
              {
                label:'Contract Reports',
                items:[{label: 'Dump File Export',
                icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-datadumptb')}
                        },
                        {
                          label:'Sales Dump Report',
                          icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-sales-dump');}
                         }, 
                        {
                          label:'Purchase Dump Report',
                          icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-purchase-dump');}
                        },
                        {
                          label:'Dummy Dump Report',
                          icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-dummy-dump');}
                        },
                        {
                          label:'Contracts To Close/Cancel',
                          icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-contractstoclose');}
                        },
                        {
                          label: 'Excluded/Closed from upload.',
                          icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-archived-contracts');},
                        },]}]
                        
          ,[
            {
              label:'RailCars Reports',
              items:[{label: 'Mapping Report',
              icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-rpt-allcontainers');}}
              ,{
                label:'RailCars Missing Phyto Application',
                icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-railnophytorpt');}
              }]}]
              ,[
              {
                label:'ETG Position',
                items:[{label:'Position',
                icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-positionreprot');}}]
              },
          ]] 
        }
    ];
    break;
    case "6":  //procurement
    this.items = [
    {
      label: 'Dashboard', 
      icon:  'pi pi-fw pi-chart-pie', command: () => {this.router.navigateByUrl('/app-home');}
    },
    {
      label: 'Reports', 
      icon: 'pi pi-fw pi-folder-open',
      items:
      [[
        {
          label:'XML',
          items:[{label: 'Report Generation',
          icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-rpt-xml');},}]
          
        }]
        ,[
            {
              label:'Contract Reports',
              items:[{label: 'Dump File Export',
              icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-datadumptb')}
                      },
                      {
                        label:'Sales Dump Report',
                        icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-sales-dump');}
                       }, 
                      {
                        label:'Purchase Dump Report',
                        icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-purchase-dump');}
                      },
                      {
                        label:'Dummy Dump Report',
                        icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-dummy-dump');}
                      },
                      {
                        label:'Contracts To Close/Cancel',
                        icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-contractstoclose');}
                      },
                      {
                        label: 'Excluded/Closed from upload.',
                        icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-archived-contracts');},
                      },]}]
                      
        ,[
          {
            label:'RailCars Reports',
            items:[{label: 'Mapping Report',
            icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-rpt-allcontainers');}}
            ,{
              label:'RailCars Missing Phyto Application',
              icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-railnophytorpt');}
            }]}]
            ,[
            {
              label:'ETG Position',
              items:[{label:'Position',
              icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-positionreprot');}}]
            },
        ]] 
      }    
     
  ];
  break;
      case "4":  //Documentation Team
      this.items = [
        {
          label: 'Dashboard', 
          icon:  'pi pi-fw pi-chart-pie', command: () => {this.router.navigateByUrl('/app-home');}
        },
        {
          label: 'Data Imports', 
          icon: 'pi pi-book',
          items: [
            [
              {
                label:'ERP-Prosoft Import',
                items:[{
                  label: 'ERP Data Import',
                  icon: 'pi pi-file-import', command: () => {this.router.navigateByUrl('/app-groups');},}]
              }
          ]]
        },
        {
          label: 'Operations', 
          icon: 'pi pi-fw pi-folder-open',
          items:[ 
            [ 
              {
                  label:'Contracts',
                  items:[{
                          label: 'Plan Sales Contract',
                          icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-operations');},
                        },
                        {
                          label: 'Purchase Contract',
                          icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-purchasecontracts');},
                        },
                        {
                          label: 'Dummy Contracts', 
                          icon: 'pi pi-shield',command: () => {this.router.navigateByUrl('/app-dummy-contract');}
                        }]
                }
              ],
              [{
                  label: 'Instructions', 
                  icon: 'pi pi-box',
                  items: [
                          {
                            label: 'Booking',
                            icon: 'pi pi-cog', command: () => {this.router.navigateByUrl('/app-booking');},
                          }]}
                  ]
                ]
            
        },
        {
          label: 'Documentation', 
          icon: 'pi pi-fw pi-folder-open',
          items:[ 
              [
                {
                  label:'Dox Generation',
                  items:[{label: 'DoX Register',
                  icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-do-x');},}]
                },
              
              ]]   
        },
      {
          label: 'Reports', 
          icon: 'pi pi-fw pi-folder-open',
          items:
          [[
            {
              label:'XML',
              items:[{label: 'Report Generation',
              icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-rpt-xml');},}]
              
            }]
            ,[
                {
                  label:'Contract Reports',
                  items:[{label: 'Dump File Export',
                  icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-datadumptb')}
                          },
                          {
                            label:'Sales Dump Report',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-sales-dump');}
                           }, 
                          {
                            label:'Purchase Dump Report',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-purchase-dump');}
                          },
                          {
                            label:'Dummy Dump Report',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-dummy-dump');}
                          },
                          {
                            label:'Contracts To Close/Cancel',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-contractstoclose');}
                          },
                          {
                            label: 'Excluded/Closed from upload.',
                            icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-archived-contracts');},
                          },]}]
                          
            ,[
              {
                label:'RailCars Reports',
                items:[{label: 'Mapping Report',
                icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-rpt-allcontainers');}}
                ,{
                  label:'RailCars Missing Phyto Application',
                  icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-railnophytorpt');}
                }]}]
                ,[
                {
                  label:'ETG Position',
                  items:[{label:'Position',
                  icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-positionreprot');}}]
                },
            ]] 
          }
    ];
    break;
    case "1": //Administrator Team
      this.items = [
        {
          label: 'Dashboard', 
          icon:  'pi pi-fw pi-chart-pie', command: () => {this.router.navigateByUrl('/app-home');}
        },
        {
          label: 'Test Tree',
          icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-test-tree');}
        },
        {
          label: 'Data Imports', 
          icon: 'pi pi-book',
          items: [
            [
              {
                label:'ERP-Prosoft Import',
                items:[{
                  label: 'ERP Data Import',
                  icon: 'pi pi-file-import', command: () => {this.router.navigateByUrl('/app-groups');},}]
              }
          ]]
        },
        {
          label: 'Operations', 
          icon: 'pi pi-fw pi-folder-open',
          items:[ 
            [ 
              {
                  label:'Contracts',
                  items:[{
                          label: 'Plan Sales Contract',
                          icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-operations');},
                        },
                        {
                          label: 'Purchase Contract',
                          icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-purchasecontracts');},
                        },
                        {
                          label: 'Dummy Contracts', 
                          icon: 'pi pi-shield',command: () => {this.router.navigateByUrl('/app-dummy-contract');}
                        }]
                }
              ],
              [{
                  label: 'Instructions', 
                  icon: 'pi pi-box',
                  items: [
                          {
                            label: 'Production Instr.',
                            icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-prodinstruct');},
                          },
                          {
                            label: 'Shipping Instr.',
                            icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-shipping-instruct');},
                          },
                          {
                            label: 'RailCars Entry',
                            icon: 'pi pi-truck', command: () => {this.router.navigateByUrl('/app-newrailcar');},
                          },
                          {
                            label: 'Booking',
                            icon: 'pi pi-cog', command: () => {this.router.navigateByUrl('/app-booking');},
                          }]}
                  ]
                ]
            
        },
        {
          label: 'Documentation', 
          icon: 'pi pi-fw pi-folder-open',
          items:[ 
              [
                {
                  label:'Dox Generation',
                  items:[{label: 'DoX Register',
                  icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-do-x');},}]
                },
              
              ]]   
        },
        {
          label: 'Accounting', 
          icon: 'pi pi-fw pi-folder-open',
          items:[ 
              [
                {
                  label:'Accounts Operation',
                  items:[{label: 'Accounting',
                  icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-accounts');},}]
                  
                },
              ]]   
        },
        {
          label: 'Reports', 
          icon: 'pi pi-fw pi-folder-open',
          items:
          [[
            {
              label:'XML',
              items:[{label: 'Report Generation',
              icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-rpt-xml');},}]
              
            }]
            ,[
                {
                  label:'Contract Reports',
                  items:[{label: 'Dump File Export',
                  icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-datadumptb')}
                          },
                          {
                            label:'Sales Dump Report',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-sales-dump');}
                           }, 
                          {
                            label:'Purchase Dump Report',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-purchase-dump');}
                          },
                          {
                            label:'Dummy Dump Report',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-dummy-dump');}
                          },
                          {
                            label:'Contracts To Close/Cancel',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-contractstoclose');}
                          },
                          {
                            label: 'Excluded/Closed from upload.',
                            icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-archived-contracts');},
                          },]}]
                          
            ,[
              {
                label:'RailCars Reports',
                items:[{label: 'Mapping Report',
                icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-rpt-allcontainers');}}
                ,{
                  label:'RailCars Missing Phyto Application',
                  icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-railnophytorpt');}
                }]}]
                ,[
                {
                  label:'ETG Position',
                  items:[{label:'Position',
                  icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-positionreprot');}}]
                },
            ]] 
          },
          {
          label: 'Administration', 
          icon: 'pi pi-shield',
          items: [
            [{
              label:'Notifications',
              items:[{label: 'Upload Error', 
              icon: 'pi pi-shield',command: () => {this.router.navigateByUrl('/app-errlog');}}]
            }],
            [
              {
              label:'Settings',
              items:[
                {
                label: 'Users',
                icon: 'pi pi-user', command: () => {this.router.navigateByUrl('/app-users');}},
                {
                  label: 'Roles',
                  icon: 'pi pi-lock-open', command: () => {this.router.navigateByUrl('/app-roles');},
                },
                {
                  label: 'Teams',
                  icon: 'pi pi-users', command: () => {this.router.navigateByUrl('/app-teams');},
                },],
              }],
              [  
                {
                  label: 'Types', 
                  icon: 'pi pi-box',
                  items: [
                    {
                      label: 'RailCars Types',
                      icon: 'pi pi-truck', command: () => {this.router.navigateByUrl('/app-railcars');},
                    },
                    {
                      label: 'Service Types',
                      icon: 'pi pi-cog', command: () => {this.router.navigateByUrl('/app-servcietype');},
                    },
                    // {
                    //   label: 'Package Types',
                    //   icon: 'pi pi-users', command: () => {this.router.navigateByUrl('/app-pkagetypes');},
                    // },
                    {
                      label: 'Package Configuration',
                      icon: 'pi pi-users', command: () => {this.router.navigateByUrl('/app-packages');},
                    }
                  ]
                },
              ],[
            {
              label: 'Master Data', 
              icon: 'pi pi-box',
              items: [
                {
                  label: 'Customers',
                  icon: 'pi pi-users', command: () => {this.router.navigateByUrl('/app-customers');},
                },             
                {
                  label: 'Commodity',
                  icon: 'pi pi-slack', command: () => {this.router.navigateByUrl('/app-commodities');},
                },
                {
                  label: 'Countries',
                  icon: 'pi pi-flag', command: () => {this.router.navigateByUrl('/app-countries');},
                },
                {
                  label: 'Grades',
                  icon: 'pi pi-chart-line', command: () => {this.router.navigateByUrl('/app-grade');},
                },
                {
                  label: 'Plants',
                  icon: 'pi pi-tablet', command: () => {this.router.navigateByUrl('/app-plants');},
                },
                {
                  label: 'Transloaders',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-ship-transloaders');},
                },
                {
                  label: 'Port of Discharge',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-portsofdischarge');},
                },
                {
                  label: 'Port of Loading',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-portofloading');},
                },
                {
                  label: 'Origins',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-origins');},
                },
                {
                  label: 'Shipping Line',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-shippinglines');},
                },
                {
                  label: 'Extra Services',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-extrasrv');},
                },
                {
                  label: 'Import Permit Matrix',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-importpermitmatrix');},
                },
                {
                  label: 'Vareity',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-variety');},
                },
                {
                  label: 'CFIA',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-cfia');},
                },
                {
                  label: 'Quality Inspection',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-sgs');},
                },
                {
                  label: 'Pallet Dimensions',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-palletdimensions');},
                },
                {
                  label: 'Pallet Stacking',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-palletstacking');},
                },
                {
                  label: 'Payment Terms',
                  icon: 'pi pi-wrench', command: () => {this.router.navigateByUrl('/app-paymentterms');},
                }
              ]
            }
          ]
      ]}
      ];
      break;
      case "5": //Accounting Team
        this.items = [
          {label: 'Dashboard', icon: 'pi pi-fw pi-chart-pie',command: () => {this.router.navigateByUrl('/app-home');}},
          {
            label: 'Accounting', 
            icon: 'pi pi-fw pi-folder-open',
            items:[ 
                [
                  {
                    label:'Accounts Operation',
                    items:[{label: 'Accounting',
                    icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-accounts');},}]
                    
                  },
                ]]   
          },
          {
            label: 'Reports', 
            icon: 'pi pi-fw pi-folder-open',
            items:
            [[
              {
                label:'XML',
                items:[{label: 'Report Generation',
                icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-rpt-xml');},}]
                
              }]
              ,[
                  {
                    label:'Contract Reports',
                    items:[{label: 'Dump File Export',
                    icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-datadumptb')}
                            },
                            {
                              label:'Sales Dump Report',
                              icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-sales-dump');}
                             }, 
                            {
                              label:'Purchase Dump Report',
                              icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-purchase-dump');}
                            },
                            {
                              label:'Dummy Dump Report',
                              icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-dummy-dump');}
                            },
                            {
                              label:'Contracts To Close/Cancel',
                              icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-contractstoclose');}
                            },
                            {
                              label: 'Excluded/Closed from upload.',
                              icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-archived-contracts');},
                            },]}]
                            
              ,[
                {
                  label:'RailCars Reports',
                  items:[{label: 'Mapping Report',
                  icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-rpt-allcontainers');}}
                  ,{
                    label:'RailCars Missing Phyto Application',
                    icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-railnophytorpt');}
                  }]}]
                  ,[
                  {
                    label:'ETG Position',
                    items:[{label:'Position',
                    icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-positionreprot');}}]
                  },
              ]] 
            }      
            ]
        break;
      case "3": //logistics Team
        this.items = [
        {
          label: 'Dashboard', 
          icon:  'pi pi-fw pi-chart-pie', command: () => {this.router.navigateByUrl('/app-home');}
        },
        {
          label: 'Data Imports', 
          icon: 'pi pi-book',
          items: [
            [
              {
                label:'ERP-Prosoft Import',
                items:[{
                  label: 'ERP Data Import',
                  icon: 'pi pi-file-import', command: () => {this.router.navigateByUrl('/app-groups');},}]
              }
          ]]
        },
        {
          label: 'Operations', 
          icon: 'pi pi-fw pi-folder-open',
          items:[ 
            [ 
              {
                  label:'Contracts',
                  items:[{
                          label: 'Plan Sales Contract',
                          icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-operations');},
                        },
                        {
                          label: 'Purchase Contract',
                          icon: 'pi pi-book', command: () => {this.router.navigateByUrl('/app-purchasecontracts');},
                        },
                        {
                          label: 'Dummy Contracts', 
                          icon: 'pi pi-shield',command: () => {this.router.navigateByUrl('/app-dummy-contract');}
                        }]
                }
              ],
              [{
                  label: 'Instructions', 
                  icon: 'pi pi-box',
                  items: [
                          {
                            label: 'Production Instr.',
                            icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-prodinstruct');},
                          },
                          {
                            label: 'Shipping Instr.',
                            icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-shipping-instruct');},
                          },
                          {
                            label: 'RailCars Entry',
                            icon: 'pi pi-truck', command: () => {this.router.navigateByUrl('/app-newrailcar');},
                          },
                          {
                            label: 'Booking',
                            icon: 'pi pi-cog', command: () => {this.router.navigateByUrl('/app-booking');},
                          }]}
                  ]
                ]
            
        },        
        {
          label: 'Reports', 
          icon: 'pi pi-fw pi-folder-open',
          items:
          [[
            {
              label:'XML',
              items:[{label: 'Report Generation',
              icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-rpt-xml');},}]
              
            }]
            ,[
                {
                  label:'Contract Reports',
                  items:[{label: 'Dump File Export',
                  icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-datadumptb')}
                          },
                          {
                            label:'Sales Dump Report',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-sales-dump');}
                           }, 
                          {
                            label:'Purchase Dump Report',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-purchase-dump');}
                          },
                          {
                            label:'Dummy Dump Report',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-rpt-dummy-dump');}
                          },
                          {
                            label:'Contracts To Close/Cancel',
                            icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-contractstoclose');}
                          },
                          {
                            label: 'Excluded/Closed from upload.',
                            icon: 'pi pi-file-edit', command: () => {this.router.navigateByUrl('/app-archived-contracts');},
                          },]}]
                          
            ,[
              {
                label:'RailCars Reports',
                items:[{label: 'Mapping Report',
                icon:'pi pi-file-edit',command: () => {this.router.navigateByUrl('/app-rpt-allcontainers');}}
                ,{
                  label:'RailCars Missing Phyto Application',
                  icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-railnophytorpt');}
                }]}]
                ,[
                {
                  label:'ETG Position',
                  items:[{label:'Position',
                  icon:'pi pi-file-edit',command: ()=>{this.router.navigateByUrl('/app-positionreprot');}}]
                },
            ]] 
          },
        ];
        break;
    }
  }
}