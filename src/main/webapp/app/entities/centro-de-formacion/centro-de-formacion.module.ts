import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CentroDeFormacionComponent } from './list/centro-de-formacion.component';
import { CentroDeFormacionDetailComponent } from './detail/centro-de-formacion-detail.component';
import { CentroDeFormacionUpdateComponent } from './update/centro-de-formacion-update.component';
import { CentroDeFormacionDeleteDialogComponent } from './delete/centro-de-formacion-delete-dialog.component';
import { CentroDeFormacionRoutingModule } from './route/centro-de-formacion-routing.module';

@NgModule({
  imports: [SharedModule, CentroDeFormacionRoutingModule],
  declarations: [
    CentroDeFormacionComponent,
    CentroDeFormacionDetailComponent,
    CentroDeFormacionUpdateComponent,
    CentroDeFormacionDeleteDialogComponent,
  ],
  entryComponents: [CentroDeFormacionDeleteDialogComponent],
})
export class CentroDeFormacionModule {}
