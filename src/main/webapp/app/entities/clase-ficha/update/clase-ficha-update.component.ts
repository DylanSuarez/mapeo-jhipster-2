import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IClaseFicha, ClaseFicha } from '../clase-ficha.model';
import { ClaseFichaService } from '../service/clase-ficha.service';
import { IFicha } from 'app/entities/ficha/ficha.model';
import { FichaService } from 'app/entities/ficha/service/ficha.service';
import { IClase } from 'app/entities/clase/clase.model';
import { ClaseService } from 'app/entities/clase/service/clase.service';

@Component({
  selector: 'fsis-clase-ficha-update',
  templateUrl: './clase-ficha-update.component.html',
})
export class ClaseFichaUpdateComponent implements OnInit {
  isSaving = false;

  fichasSharedCollection: IFicha[] = [];
  clasesSharedCollection: IClase[] = [];

  editForm = this.fb.group({
    id: [],
    ficha: [],
    clase: [],
  });

  constructor(
    protected claseFichaService: ClaseFichaService,
    protected fichaService: FichaService,
    protected claseService: ClaseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ claseFicha }) => {
      this.updateForm(claseFicha);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const claseFicha = this.createFromForm();
    if (claseFicha.id !== undefined) {
      this.subscribeToSaveResponse(this.claseFichaService.update(claseFicha));
    } else {
      this.subscribeToSaveResponse(this.claseFichaService.create(claseFicha));
    }
  }

  trackFichaById(_index: number, item: IFicha): number {
    return item.id!;
  }

  trackClaseById(_index: number, item: IClase): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClaseFicha>>): void {
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

  protected updateForm(claseFicha: IClaseFicha): void {
    this.editForm.patchValue({
      id: claseFicha.id,
      ficha: claseFicha.ficha,
      clase: claseFicha.clase,
    });

    this.fichasSharedCollection = this.fichaService.addFichaToCollectionIfMissing(this.fichasSharedCollection, claseFicha.ficha);
    this.clasesSharedCollection = this.claseService.addClaseToCollectionIfMissing(this.clasesSharedCollection, claseFicha.clase);
  }

  protected loadRelationshipsOptions(): void {
    this.fichaService
      .query()
      .pipe(map((res: HttpResponse<IFicha[]>) => res.body ?? []))
      .pipe(map((fichas: IFicha[]) => this.fichaService.addFichaToCollectionIfMissing(fichas, this.editForm.get('ficha')!.value)))
      .subscribe((fichas: IFicha[]) => (this.fichasSharedCollection = fichas));

    this.claseService
      .query()
      .pipe(map((res: HttpResponse<IClase[]>) => res.body ?? []))
      .pipe(map((clases: IClase[]) => this.claseService.addClaseToCollectionIfMissing(clases, this.editForm.get('clase')!.value)))
      .subscribe((clases: IClase[]) => (this.clasesSharedCollection = clases));
  }

  protected createFromForm(): IClaseFicha {
    return {
      ...new ClaseFicha(),
      id: this.editForm.get(['id'])!.value,
      ficha: this.editForm.get(['ficha'])!.value,
      clase: this.editForm.get(['clase'])!.value,
    };
  }
}
