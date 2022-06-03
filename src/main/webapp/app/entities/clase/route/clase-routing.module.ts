import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClaseComponent } from '../list/clase.component';
import { ClaseDetailComponent } from '../detail/clase-detail.component';
import { ClaseUpdateComponent } from '../update/clase-update.component';
import { ClaseRoutingResolveService } from './clase-routing-resolve.service';

const claseRoute: Routes = [
  {
    path: '',
    component: ClaseComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClaseDetailComponent,
    resolve: {
      clase: ClaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClaseUpdateComponent,
    resolve: {
      clase: ClaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClaseUpdateComponent,
    resolve: {
      clase: ClaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(claseRoute)],
  exports: [RouterModule],
})
export class ClaseRoutingModule {}
