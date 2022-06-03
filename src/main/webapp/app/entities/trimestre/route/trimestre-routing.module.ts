import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TrimestreComponent } from '../list/trimestre.component';
import { TrimestreDetailComponent } from '../detail/trimestre-detail.component';
import { TrimestreUpdateComponent } from '../update/trimestre-update.component';
import { TrimestreRoutingResolveService } from './trimestre-routing-resolve.service';

const trimestreRoute: Routes = [
  {
    path: '',
    component: TrimestreComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TrimestreDetailComponent,
    resolve: {
      trimestre: TrimestreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TrimestreUpdateComponent,
    resolve: {
      trimestre: TrimestreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TrimestreUpdateComponent,
    resolve: {
      trimestre: TrimestreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(trimestreRoute)],
  exports: [RouterModule],
})
export class TrimestreRoutingModule {}
