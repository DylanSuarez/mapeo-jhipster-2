import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProgramaDeFormacionComponent } from '../list/programa-de-formacion.component';
import { ProgramaDeFormacionDetailComponent } from '../detail/programa-de-formacion-detail.component';
import { ProgramaDeFormacionUpdateComponent } from '../update/programa-de-formacion-update.component';
import { ProgramaDeFormacionRoutingResolveService } from './programa-de-formacion-routing-resolve.service';

const programaDeFormacionRoute: Routes = [
  {
    path: '',
    component: ProgramaDeFormacionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProgramaDeFormacionDetailComponent,
    resolve: {
      programaDeFormacion: ProgramaDeFormacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProgramaDeFormacionUpdateComponent,
    resolve: {
      programaDeFormacion: ProgramaDeFormacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProgramaDeFormacionUpdateComponent,
    resolve: {
      programaDeFormacion: ProgramaDeFormacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(programaDeFormacionRoute)],
  exports: [RouterModule],
})
export class ProgramaDeFormacionRoutingModule {}
