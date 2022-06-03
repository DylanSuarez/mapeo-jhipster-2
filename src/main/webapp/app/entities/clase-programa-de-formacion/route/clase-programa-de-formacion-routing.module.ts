import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClaseProgramaDeFormacionComponent } from '../list/clase-programa-de-formacion.component';
import { ClaseProgramaDeFormacionDetailComponent } from '../detail/clase-programa-de-formacion-detail.component';
import { ClaseProgramaDeFormacionUpdateComponent } from '../update/clase-programa-de-formacion-update.component';
import { ClaseProgramaDeFormacionRoutingResolveService } from './clase-programa-de-formacion-routing-resolve.service';

const claseProgramaDeFormacionRoute: Routes = [
  {
    path: '',
    component: ClaseProgramaDeFormacionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClaseProgramaDeFormacionDetailComponent,
    resolve: {
      claseProgramaDeFormacion: ClaseProgramaDeFormacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClaseProgramaDeFormacionUpdateComponent,
    resolve: {
      claseProgramaDeFormacion: ClaseProgramaDeFormacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClaseProgramaDeFormacionUpdateComponent,
    resolve: {
      claseProgramaDeFormacion: ClaseProgramaDeFormacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(claseProgramaDeFormacionRoute)],
  exports: [RouterModule],
})
export class ClaseProgramaDeFormacionRoutingModule {}
