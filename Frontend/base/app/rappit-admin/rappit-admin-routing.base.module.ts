import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientMappingComponent } from '@app/rappit-admin/client-mapping/client-mapping.component';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { ProviderListComponent } from '@app/rappit-admin/provider-mapping/provider-list.component';

export const routes: Routes = [

     {
          path: 'client',
          component: ClientMappingComponent,
          canDeactivate: [CanDeactivateGuard],
          data: {
               label: "CLIENT_MAPPING",
               breadcrumb: "CLIENT_MAPPING",
               roles: [
                    "Development Administrator"
               ]
          }
     },
     {
          path: 'provider',
          component: ProviderListComponent,
          canDeactivate: [CanDeactivateGuard],
          data: {
               label: "PROVIDER_MAPPING",
               breadcrumb: "PROVIDER_MAPPING",
               roles: [
                    "Development Administrator"
               ]
          }
     },

];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class RappitAdminRoutingBaseModule { }
