import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RegionalComponent } from './list/regional.component';
import { RegionalDetailComponent } from './detail/regional-detail.component';
import { RegionalUpdateComponent } from './update/regional-update.component';
import { RegionalDeleteDialogComponent } from './delete/regional-delete-dialog.component';
import { RegionalRoutingModule } from './route/regional-routing.module';

@NgModule({
  imports: [SharedModule, RegionalRoutingModule],
  declarations: [RegionalComponent, RegionalDetailComponent, RegionalUpdateComponent, RegionalDeleteDialogComponent],
  entryComponents: [RegionalDeleteDialogComponent],
})
export class RegionalModule {}
