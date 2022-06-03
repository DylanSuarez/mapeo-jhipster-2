import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClaseDocenteComponent } from '../list/clase-docente.component';
import { ClaseDocenteDetailComponent } from '../detail/clase-docente-detail.component';
import { ClaseDocenteUpdateComponent } from '../update/clase-docente-update.component';
import { ClaseDocenteRoutingResolveService } from './clase-docente-routing-resolve.service';

const claseDocenteRoute: Routes = [
  {
    path: '',
    component: ClaseDocenteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClaseDocenteDetailComponent,
    resolve: {
      claseDocente: ClaseDocenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClaseDocenteUpdateComponent,
    resolve: {
      claseDocente: ClaseDocenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClaseDocenteUpdateComponent,
    resolve: {
      claseDocente: ClaseDocenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(claseDocenteRoute)],
  exports: [RouterModule],
})
export class ClaseDocenteRoutingModule {}
