import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFicha, Ficha } from '../ficha.model';
import { FichaService } from '../service/ficha.service';
import { IProgramaDeFormacion } from 'app/entities/programa-de-formacion/programa-de-formacion.model';
import { ProgramaDeFormacionService } from 'app/entities/programa-de-formacion/service/programa-de-formacion.service';
import { State } from 'app/entities/enumerations/state.model';

@Component({
  selector: 'fsis-ficha-update',
  templateUrl: './ficha-update.component.html',
})
export class FichaUpdateComponent implements OnInit {
  isSaving = false;
  stateValues = Object.keys(State);

  programaDeFormacionsSharedCollection: IProgramaDeFormacion[] = [];

  editForm = this.fb.group({
    id: [],
    nombreFicha: [null, [Validators.required, Validators.maxLength(45)]],
    estadoFicha: [null, [Validators.required]],
    programadeformacion: [],
  });

  constructor(
    protected fichaService: FichaService,
    protected programaDeFormacionService: ProgramaDeFormacionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ficha }) => {
      this.updateForm(ficha);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ficha = this.createFromForm();
    if (ficha.id !== undefined) {
      this.subscribeToSaveResponse(this.fichaService.update(ficha));
    } else {
      this.subscribeToSaveResponse(this.fichaService.create(ficha));
    }
  }

  trackProgramaDeFormacionById(_index: number, item: IProgramaDeFormacion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFicha>>): void {
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

  protected updateForm(ficha: IFicha): void {
    this.editForm.patchValue({
      id: ficha.id,
      nombreFicha: ficha.nombreFicha,
      estadoFicha: ficha.estadoFicha,
      programadeformacion: ficha.programadeformacion,
    });

    this.programaDeFormacionsSharedCollection = this.programaDeFormacionService.addProgramaDeFormacionToCollectionIfMissing(
      this.programaDeFormacionsSharedCollection,
      ficha.programadeformacion
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

  protected createFromForm(): IFicha {
    return {
      ...new Ficha(),
      id: this.editForm.get(['id'])!.value,
      nombreFicha: this.editForm.get(['nombreFicha'])!.value,
      estadoFicha: this.editForm.get(['estadoFicha'])!.value,
      programadeformacion: this.editForm.get(['programadeformacion'])!.value,
    };
  }
}
