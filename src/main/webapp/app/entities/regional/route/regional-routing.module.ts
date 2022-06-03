import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RegionalComponent } from '../list/regional.component';
import { RegionalDetailComponent } from '../detail/regional-detail.component';
import { RegionalUpdateComponent } from '../update/regional-update.component';
import { RegionalRoutingResolveService } from './regional-routing-resolve.service';

const regionalRoute: Routes = [
  {
    path: '',
    component: RegionalComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RegionalDetailComponent,
    resolve: {
      regional: RegionalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RegionalUpdateComponent,
    resolve: {
      regional: RegionalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RegionalUpdateComponent,
    resolve: {
      regional: RegionalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(regionalRoute)],
  exports: [RouterModule],
})
export class RegionalRoutingModule {}
