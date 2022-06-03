import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EstudianteHorarioComponent } from '../list/estudiante-horario.component';
import { EstudianteHorarioDetailComponent } from '../detail/estudiante-horario-detail.component';
import { EstudianteHorarioUpdateComponent } from '../update/estudiante-horario-update.component';
import { EstudianteHorarioRoutingResolveService } from './estudiante-horario-routing-resolve.service';

const estudianteHorarioRoute: Routes = [
  {
    path: '',
    component: EstudianteHorarioComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EstudianteHorarioDetailComponent,
    resolve: {
      estudianteHorario: EstudianteHorarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EstudianteHorarioUpdateComponent,
    resolve: {
      estudianteHorario: EstudianteHorarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EstudianteHorarioUpdateComponent,
    resolve: {
      estudianteHorario: EstudianteHorarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(estudianteHorarioRoute)],
  exports: [RouterModule],
})
export class EstudianteHorarioRoutingModule {}
