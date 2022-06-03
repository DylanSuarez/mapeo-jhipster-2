import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CentroDeFormacionComponent } from '../list/centro-de-formacion.component';
import { CentroDeFormacionDetailComponent } from '../detail/centro-de-formacion-detail.component';
import { CentroDeFormacionUpdateComponent } from '../update/centro-de-formacion-update.component';
import { CentroDeFormacionRoutingResolveService } from './centro-de-formacion-routing-resolve.service';

const centroDeFormacionRoute: Routes = [
  {
    path: '',
    component: CentroDeFormacionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CentroDeFormacionDetailComponent,
    resolve: {
      centroDeFormacion: CentroDeFormacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CentroDeFormacionUpdateComponent,
    resolve: {
      centroDeFormacion: CentroDeFormacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CentroDeFormacionUpdateComponent,
    resolve: {
      centroDeFormacion: CentroDeFormacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(centroDeFormacionRoute)],
  exports: [RouterModule],
})
export class CentroDeFormacionRoutingModule {}
