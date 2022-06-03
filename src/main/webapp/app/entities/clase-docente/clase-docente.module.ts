import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ClaseDocenteComponent } from './list/clase-docente.component';
import { ClaseDocenteDetailComponent } from './detail/clase-docente-detail.component';
import { ClaseDocenteUpdateComponent } from './update/clase-docente-update.component';
import { ClaseDocenteDeleteDialogComponent } from './delete/clase-docente-delete-dialog.component';
import { ClaseDocenteRoutingModule } from './route/clase-docente-routing.module';

@NgModule({
  imports: [SharedModule, ClaseDocenteRoutingModule],
  declarations: [ClaseDocenteComponent, ClaseDocenteDetailComponent, ClaseDocenteUpdateComponent, ClaseDocenteDeleteDialogComponent],
  entryComponents: [ClaseDocenteDeleteDialogComponent],
})
export class ClaseDocenteModule {}
