import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ClaseFichaComponent } from './list/clase-ficha.component';
import { ClaseFichaDetailComponent } from './detail/clase-ficha-detail.component';
import { ClaseFichaUpdateComponent } from './update/clase-ficha-update.component';
import { ClaseFichaDeleteDialogComponent } from './delete/clase-ficha-delete-dialog.component';
import { ClaseFichaRoutingModule } from './route/clase-ficha-routing.module';

@NgModule({
  imports: [SharedModule, ClaseFichaRoutingModule],
  declarations: [ClaseFichaComponent, ClaseFichaDetailComponent, ClaseFichaUpdateComponent, ClaseFichaDeleteDialogComponent],
  entryComponents: [ClaseFichaDeleteDialogComponent],
})
export class ClaseFichaModule {}
