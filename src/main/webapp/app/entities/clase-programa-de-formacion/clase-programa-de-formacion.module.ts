import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ClaseProgramaDeFormacionComponent } from './list/clase-programa-de-formacion.component';
import { ClaseProgramaDeFormacionDetailComponent } from './detail/clase-programa-de-formacion-detail.component';
import { ClaseProgramaDeFormacionUpdateComponent } from './update/clase-programa-de-formacion-update.component';
import { ClaseProgramaDeFormacionDeleteDialogComponent } from './delete/clase-programa-de-formacion-delete-dialog.component';
import { ClaseProgramaDeFormacionRoutingModule } from './route/clase-programa-de-formacion-routing.module';

@NgModule({
  imports: [SharedModule, ClaseProgramaDeFormacionRoutingModule],
  declarations: [
    ClaseProgramaDeFormacionComponent,
    ClaseProgramaDeFormacionDetailComponent,
    ClaseProgramaDeFormacionUpdateComponent,
    ClaseProgramaDeFormacionDeleteDialogComponent,
  ],
  entryComponents: [ClaseProgramaDeFormacionDeleteDialogComponent],
})
export class ClaseProgramaDeFormacionModule {}
