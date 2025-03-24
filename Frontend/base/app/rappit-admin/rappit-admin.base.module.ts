import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';

import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { RappitAdminRoutingBaseModule } from './rappit-admin-routing.base.module';
import { ClientMappingComponent } from '@app/rappit-admin/client-mapping/client-mapping.component';
import { DataTablesModule } from 'angular-datatables';
import { ClientDetailComponent } from './client-mapping/client-detail/client-detail.component';
import { WidgetsBaseModule } from '@baseapp/widgets/widgets.base.module';
import { ProviderDetailComponent } from './provider-mapping/provider-detail/provider-detail.component';
import { ProviderListBaseComponent } from './provider-mapping/provider-list/provider-list.base.component';
import { ProviderListComponent } from '@app/rappit-admin/provider-mapping/provider-list.component';
// import { WidgetsBaseModule } from '@libbase/widgets.base.module';


@NgModule({
  declarations: [
    ClientMappingComponent,
    ClientDetailComponent,
    ProviderDetailComponent,
   ProviderListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WidgetsBaseModule,
    RappitAdminRoutingBaseModule,
    DataTablesModule
  ],
  exports: [SharedModule,
    WidgetsBaseModule,
    ClientMappingComponent,
    ClientDetailComponent,
    ProviderDetailComponent,
    ProviderListComponent],
  providers: [
    CanDeactivateGuard]

})
export class RappitAdminBaseModule { }
