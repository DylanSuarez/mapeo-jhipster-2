import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProgramaDeFormacionComponent } from './list/programa-de-formacion.component';
import { ProgramaDeFormacionDetailComponent } from './detail/programa-de-formacion-detail.component';
import { ProgramaDeFormacionUpdateComponent } from './update/programa-de-formacion-update.component';
import { ProgramaDeFormacionDeleteDialogComponent } from './delete/programa-de-formacion-delete-dialog.component';
import { ProgramaDeFormacionRoutingModule } from './route/programa-de-formacion-routing.module';

@NgModule({
  imports: [SharedModule, ProgramaDeFormacionRoutingModule],
  declarations: [
    ProgramaDeFormacionComponent,
    ProgramaDeFormacionDetailComponent,
    ProgramaDeFormacionUpdateComponent,
    ProgramaDeFormacionDeleteDialogComponent,
  ],
  entryComponents: [ProgramaDeFormacionDeleteDialogComponent],
})
export class ProgramaDeFormacionModule {}
