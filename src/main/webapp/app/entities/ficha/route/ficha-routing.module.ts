import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FichaComponent } from '../list/ficha.component';
import { FichaDetailComponent } from '../detail/ficha-detail.component';
import { FichaUpdateComponent } from '../update/ficha-update.component';
import { FichaRoutingResolveService } from './ficha-routing-resolve.service';

const fichaRoute: Routes = [
  {
    path: '',
    component: FichaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FichaDetailComponent,
    resolve: {
      ficha: FichaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FichaUpdateComponent,
    resolve: {
      ficha: FichaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FichaUpdateComponent,
    resolve: {
      ficha: FichaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fichaRoute)],
  exports: [RouterModule],
})
export class FichaRoutingModule {}
