import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICentroDeFormacion, CentroDeFormacion } from '../centro-de-formacion.model';
import { CentroDeFormacionService } from '../service/centro-de-formacion.service';
import { IRegional } from 'app/entities/regional/regional.model';
import { RegionalService } from 'app/entities/regional/service/regional.service';

@Component({
  selector: 'fsis-centro-de-formacion-update',
  templateUrl: './centro-de-formacion-update.component.html',
})
export class CentroDeFormacionUpdateComponent implements OnInit {
  isSaving = false;

  regionalsSharedCollection: IRegional[] = [];

  editForm = this.fb.group({
    id: [],
    nombreCentro: [null, [Validators.required, Validators.maxLength(45)]],
    regional: [],
  });

  constructor(
    protected centroDeFormacionService: CentroDeFormacionService,
    protected regionalService: RegionalService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ centroDeFormacion }) => {
      this.updateForm(centroDeFormacion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const centroDeFormacion = this.createFromForm();
    if (centroDeFormacion.id !== undefined) {
      this.subscribeToSaveResponse(this.centroDeFormacionService.update(centroDeFormacion));
    } else {
      this.subscribeToSaveResponse(this.centroDeFormacionService.create(centroDeFormacion));
    }
  }

  trackRegionalById(_index: number, item: IRegional): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICentroDeFormacion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(centroDeFormacion: ICentroDeFormacion): void {
    this.editForm.patchValue({
      id: centroDeFormacion.id,
      nombreCentro: centroDeFormacion.nombreCentro,
      regional: centroDeFormacion.regional,
    });

    this.regionalsSharedCollection = this.regionalService.addRegionalToCollectionIfMissing(
      this.regionalsSharedCollection,
      centroDeFormacion.regional
    );
  }

  protected loadRelationshipsOptions(): void {
    this.regionalService
      .query()
      .pipe(map((res: HttpResponse<IRegional[]>) => res.body ?? []))
      .pipe(
        map((regionals: IRegional[]) =>
          this.regionalService.addRegionalToCollectionIfMissing(regionals, this.editForm.get('regional')!.value)
        )
      )
      .subscribe((regionals: IRegional[]) => (this.regionalsSharedCollection = regionals));
  }

  protected createFromForm(): ICentroDeFormacion {
    return {
      ...new CentroDeFormacion(),
      id: this.editForm.get(['id'])!.value,
      nombreCentro: this.editForm.get(['nombreCentro'])!.value,
      regional: this.editForm.get(['regional'])!.value,
    };
  }
}
