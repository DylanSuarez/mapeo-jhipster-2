import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FichaComponent } from './list/ficha.component';
import { FichaDetailComponent } from './detail/ficha-detail.component';
import { FichaUpdateComponent } from './update/ficha-update.component';
import { FichaDeleteDialogComponent } from './delete/ficha-delete-dialog.component';
import { FichaRoutingModule } from './route/ficha-routing.module';

@NgModule({
  imports: [SharedModule, FichaRoutingModule],
  declarations: [FichaComponent, FichaDetailComponent, FichaUpdateComponent, FichaDeleteDialogComponent],
  entryComponents: [FichaDeleteDialogComponent],
})
export class FichaModule {}
