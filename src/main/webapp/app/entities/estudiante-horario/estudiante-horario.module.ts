import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EstudianteHorarioComponent } from './list/estudiante-horario.component';
import { EstudianteHorarioDetailComponent } from './detail/estudiante-horario-detail.component';
import { EstudianteHorarioUpdateComponent } from './update/estudiante-horario-update.component';
import { EstudianteHorarioDeleteDialogComponent } from './delete/estudiante-horario-delete-dialog.component';
import { EstudianteHorarioRoutingModule } from './route/estudiante-horario-routing.module';

@NgModule({
  imports: [SharedModule, EstudianteHorarioRoutingModule],
  declarations: [
    EstudianteHorarioComponent,
    EstudianteHorarioDetailComponent,
    EstudianteHorarioUpdateComponent,
    EstudianteHorarioDeleteDialogComponent,
  ],
  entryComponents: [EstudianteHorarioDeleteDialogComponent],
})
export class EstudianteHorarioModule {}
