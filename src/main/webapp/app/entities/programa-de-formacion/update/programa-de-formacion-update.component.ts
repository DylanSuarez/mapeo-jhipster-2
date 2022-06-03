import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProgramaDeFormacion, ProgramaDeFormacion } from '../programa-de-formacion.model';
import { ProgramaDeFormacionService } from '../service/programa-de-formacion.service';
import { ICentroDeFormacion } from 'app/entities/centro-de-formacion/centro-de-formacion.model';
import { CentroDeFormacionService } from 'app/entities/centro-de-formacion/service/centro-de-formacion.service';
import { IClase } from 'app/entities/clase/clase.model';
import { ClaseService } from 'app/entities/clase/service/clase.service';
import { State } from 'app/entities/enumerations/state.model';

@Component({
  selector: 'fsis-programa-de-formacion-update',
  templateUrl: './programa-de-formacion-update.component.html',
})
export class ProgramaDeFormacionUpdateComponent implements OnInit {
  isSaving = false;
  stateValues = Object.keys(State);

  centroDeFormacionsSharedCollection: ICentroDeFormacion[] = [];
  clasesSharedCollection: IClase[] = [];

  editForm = this.fb.group({
    id: [],
    nombrePrograma: [null, [Validators.required, Validators.maxLength(45)]],
    estadoPrograma: [null, [Validators.required]],
    centroDeFormacion: [],
    clase: [],
  });

  constructor(
    protected programaDeFormacionService: ProgramaDeFormacionService,
    protected centroDeFormacionService: CentroDeFormacionService,
    protected claseService: ClaseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ programaDeFormacion }) => {
      this.updateForm(programaDeFormacion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const programaDeFormacion = this.createFromForm();
    if (programaDeFormacion.id !== undefined) {
      this.subscribeToSaveResponse(this.programaDeFormacionService.update(programaDeFormacion));
    } else {
      this.subscribeToSaveResponse(this.programaDeFormacionService.create(programaDeFormacion));
    }
  }

  trackCentroDeFormacionById(_index: number, item: ICentroDeFormacion): number {
    return item.id!;
  }

  trackClaseById(_index: number, item: IClase): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProgramaDeFormacion>>): void {
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

  protected updateForm(programaDeFormacion: IProgramaDeFormacion): void {
    this.editForm.patchValue({
      id: programaDeFormacion.id,
      nombrePrograma: programaDeFormacion.nombrePrograma,
      estadoPrograma: programaDeFormacion.estadoPrograma,
      centroDeFormacion: programaDeFormacion.centroDeFormacion,
      clase: programaDeFormacion.clase,
    });

    this.centroDeFormacionsSharedCollection = this.centroDeFormacionService.addCentroDeFormacionToCollectionIfMissing(
      this.centroDeFormacionsSharedCollection,
      programaDeFormacion.centroDeFormacion
    );
    this.clasesSharedCollection = this.claseService.addClaseToCollectionIfMissing(this.clasesSharedCollection, programaDeFormacion.clase);
  }

  protected loadRelationshipsOptions(): void {
    this.centroDeFormacionService
      .query()
      .pipe(map((res: HttpResponse<ICentroDeFormacion[]>) => res.body ?? []))
      .pipe(
        map((centroDeFormacions: ICentroDeFormacion[]) =>
          this.centroDeFormacionService.addCentroDeFormacionToCollectionIfMissing(
            centroDeFormacions,
            this.editForm.get('centroDeFormacion')!.value
          )
        )
      )
      .subscribe((centroDeFormacions: ICentroDeFormacion[]) => (this.centroDeFormacionsSharedCollection = centroDeFormacions));

    this.claseService
      .query()
      .pipe(map((res: HttpResponse<IClase[]>) => res.body ?? []))
      .pipe(map((clases: IClase[]) => this.claseService.addClaseToCollectionIfMissing(clases, this.editForm.get('clase')!.value)))
      .subscribe((clases: IClase[]) => (this.clasesSharedCollection = clases));
  }

  protected createFromForm(): IProgramaDeFormacion {
    return {
      ...new ProgramaDeFormacion(),
      id: this.editForm.get(['id'])!.value,
      nombrePrograma: this.editForm.get(['nombrePrograma'])!.value,
      estadoPrograma: this.editForm.get(['estadoPrograma'])!.value,
      centroDeFormacion: this.editForm.get(['centroDeFormacion'])!.value,
      clase: this.editForm.get(['clase'])!.value,
    };
  }
}
