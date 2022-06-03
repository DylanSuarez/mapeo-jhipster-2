import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IClase, Clase } from '../clase.model';
import { ClaseService } from '../service/clase.service';
import { ITrimestre } from 'app/entities/trimestre/trimestre.model';
import { TrimestreService } from 'app/entities/trimestre/service/trimestre.service';

@Component({
  selector: 'fsis-clase-update',
  templateUrl: './clase-update.component.html',
})
export class ClaseUpdateComponent implements OnInit {
  isSaving = false;

  trimestresSharedCollection: ITrimestre[] = [];

  editForm = this.fb.group({
    id: [],
    nombreClase: [null, [Validators.required, Validators.maxLength(45)]],
    trimestre: [],
  });

  constructor(
    protected claseService: ClaseService,
    protected trimestreService: TrimestreService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clase }) => {
      this.updateForm(clase);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const clase = this.createFromForm();
    if (clase.id !== undefined) {
      this.subscribeToSaveResponse(this.claseService.update(clase));
    } else {
      this.subscribeToSaveResponse(this.claseService.create(clase));
    }
  }

  trackTrimestreById(_index: number, item: ITrimestre): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClase>>): void {
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

  protected updateForm(clase: IClase): void {
    this.editForm.patchValue({
      id: clase.id,
      nombreClase: clase.nombreClase,
      trimestre: clase.trimestre,
    });

    this.trimestresSharedCollection = this.trimestreService.addTrimestreToCollectionIfMissing(
      this.trimestresSharedCollection,
      clase.trimestre
    );
  }

  protected loadRelationshipsOptions(): void {
    this.trimestreService
      .query()
      .pipe(map((res: HttpResponse<ITrimestre[]>) => res.body ?? []))
      .pipe(
        map((trimestres: ITrimestre[]) =>
          this.trimestreService.addTrimestreToCollectionIfMissing(trimestres, this.editForm.get('trimestre')!.value)
        )
      )
      .subscribe((trimestres: ITrimestre[]) => (this.trimestresSharedCollection = trimestres));
  }

  protected createFromForm(): IClase {
    return {
      ...new Clase(),
      id: this.editForm.get(['id'])!.value,
      nombreClase: this.editForm.get(['nombreClase'])!.value,
      trimestre: this.editForm.get(['trimestre'])!.value,
    };
  }
}
