import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClaseFichaComponent } from '../list/clase-ficha.component';
import { ClaseFichaDetailComponent } from '../detail/clase-ficha-detail.component';
import { ClaseFichaUpdateComponent } from '../update/clase-ficha-update.component';
import { ClaseFichaRoutingResolveService } from './clase-ficha-routing-resolve.service';

const claseFichaRoute: Routes = [
  {
    path: '',
    component: ClaseFichaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClaseFichaDetailComponent,
    resolve: {
      claseFicha: ClaseFichaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClaseFichaUpdateComponent,
    resolve: {
      claseFicha: ClaseFichaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClaseFichaUpdateComponent,
    resolve: {
      claseFicha: ClaseFichaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(claseFichaRoute)],
  exports: [RouterModule],
})
export class ClaseFichaRoutingModule {}
