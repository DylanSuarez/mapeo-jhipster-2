import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ClaseComponent } from './list/clase.component';
import { ClaseDetailComponent } from './detail/clase-detail.component';
import { ClaseUpdateComponent } from './update/clase-update.component';
import { ClaseDeleteDialogComponent } from './delete/clase-delete-dialog.component';
import { ClaseRoutingModule } from './route/clase-routing.module';

@NgModule({
  imports: [SharedModule, ClaseRoutingModule],
  declarations: [ClaseComponent, ClaseDetailComponent, ClaseUpdateComponent, ClaseDeleteDialogComponent],
  entryComponents: [ClaseDeleteDialogComponent],
})
export class ClaseModule {}
