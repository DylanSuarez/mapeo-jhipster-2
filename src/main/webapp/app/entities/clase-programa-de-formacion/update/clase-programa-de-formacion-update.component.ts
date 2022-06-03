import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IClaseProgramaDeFormacion, ClaseProgramaDeFormacion } from '../clase-programa-de-formacion.model';
import { ClaseProgramaDeFormacionService } from '../service/clase-programa-de-formacion.service';
import { IProgramaDeFormacion } from 'app/entities/programa-de-formacion/programa-de-formacion.model';
import { ProgramaDeFormacionService } from 'app/entities/programa-de-formacion/service/programa-de-formacion.service';

@Component({
  selector: 'fsis-clase-programa-de-formacion-update',
  templateUrl: './clase-programa-de-formacion-update.component.html',
})
export class ClaseProgramaDeFormacionUpdateComponent implements OnInit {
  isSaving = false;

  programaDeFormacionsSharedCollection: IProgramaDeFormacion[] = [];

  editForm = this.fb.group({
    id: [],
    programadeformacion: [],
  });

  constructor(
    protected claseProgramaDeFormacionService: ClaseProgramaDeFormacionService,
    protected programaDeFormacionService: ProgramaDeFormacionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ claseProgramaDeFormacion }) => {
      this.updateForm(claseProgramaDeFormacion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const claseProgramaDeFormacion = this.createFromForm();
    if (claseProgramaDeFormacion.id !== undefined) {
      this.subscribeToSaveResponse(this.claseProgramaDeFormacionService.update(claseProgramaDeFormacion));
    } else {
      this.subscribeToSaveResponse(this.claseProgramaDeFormacionService.create(claseProgramaDeFormacion));
    }
  }

  trackProgramaDeFormacionById(_index: number, item: IProgramaDeFormacion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClaseProgramaDeFormacion>>): void {
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

  protected updateForm(claseProgramaDeFormacion: IClaseProgramaDeFormacion): void {
    this.editForm.patchValue({
      id: claseProgramaDeFormacion.id,
      programadeformacion: claseProgramaDeFormacion.programadeformacion,
    });

    this.programaDeFormacionsSharedCollection = this.programaDeFormacionService.addProgramaDeFormacionToCollectionIfMissing(
      this.programaDeFormacionsSharedCollection,
      claseProgramaDeFormacion.programadeformacion
    );
  }

  protected loadRelationshipsOptions(): void {
    this.programaDeFormacionService
      .query()
      .pipe(map((res: HttpResponse<IProgramaDeFormacion[]>) => res.body ?? []))
      .pipe(
        map((programaDeFormacions: IProgramaDeFormacion[]) =>
          this.programaDeFormacionService.addProgramaDeFormacionToCollectionIfMissing(
            programaDeFormacions,
            this.editForm.get('programadeformacion')!.value
          )
        )
      )
      .subscribe((programaDeFormacions: IProgramaDeFormacion[]) => (this.programaDeFormacionsSharedCollection = programaDeFormacions));
  }

  protected createFromForm(): IClaseProgramaDeFormacion {
    return {
      ...new ClaseProgramaDeFormacion(),
      id: this.editForm.get(['id'])!.value,
      programadeformacion: this.editForm.get(['programadeformacion'])!.value,
    };
  }
}
