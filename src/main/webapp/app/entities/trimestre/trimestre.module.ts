import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TrimestreComponent } from './list/trimestre.component';
import { TrimestreDetailComponent } from './detail/trimestre-detail.component';
import { TrimestreUpdateComponent } from './update/trimestre-update.component';
import { TrimestreDeleteDialogComponent } from './delete/trimestre-delete-dialog.component';
import { TrimestreRoutingModule } from './route/trimestre-routing.module';

@NgModule({
  imports: [SharedModule, TrimestreRoutingModule],
  declarations: [TrimestreComponent, TrimestreDetailComponent, TrimestreUpdateComponent, TrimestreDeleteDialogComponent],
  entryComponents: [TrimestreDeleteDialogComponent],
})
export class TrimestreModule {}
