import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IClaseDocente, ClaseDocente } from '../clase-docente.model';
import { ClaseDocenteService } from '../service/clase-docente.service';
import { IDocente } from 'app/entities/docente/docente.model';
import { DocenteService } from 'app/entities/docente/service/docente.service';
import { IHorario } from 'app/entities/horario/horario.model';
import { HorarioService } from 'app/entities/horario/service/horario.service';
import { IClase } from 'app/entities/clase/clase.model';
import { ClaseService } from 'app/entities/clase/service/clase.service';

@Component({
  selector: 'fsis-clase-docente-update',
  templateUrl: './clase-docente-update.component.html',
})
export class ClaseDocenteUpdateComponent implements OnInit {
  isSaving = false;

  docentesSharedCollection: IDocente[] = [];
  horariosSharedCollection: IHorario[] = [];
  clasesSharedCollection: IClase[] = [];

  editForm = this.fb.group({
    id: [],
    docente: [],
    horario: [],
    clase: [],
  });

  constructor(
    protected claseDocenteService: ClaseDocenteService,
    protected docenteService: DocenteService,
    protected horarioService: HorarioService,
    protected claseService: ClaseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ claseDocente }) => {
      this.updateForm(claseDocente);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const claseDocente = this.createFromForm();
    if (claseDocente.id !== undefined) {
      this.subscribeToSaveResponse(this.claseDocenteService.update(claseDocente));
    } else {
      this.subscribeToSaveResponse(this.claseDocenteService.create(claseDocente));
    }
  }

  trackDocenteById(_index: number, item: IDocente): number {
    return item.id!;
  }

  trackHorarioById(_index: number, item: IHorario): number {
    return item.id!;
  }

  trackClaseById(_index: number, item: IClase): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClaseDocente>>): void {
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

  protected updateForm(claseDocente: IClaseDocente): void {
    this.editForm.patchValue({
      id: claseDocente.id,
      docente: claseDocente.docente,
      horario: claseDocente.horario,
      clase: claseDocente.clase,
    });

    this.docentesSharedCollection = this.docenteService.addDocenteToCollectionIfMissing(
      this.docentesSharedCollection,
      claseDocente.docente
    );
    this.horariosSharedCollection = this.horarioService.addHorarioToCollectionIfMissing(
      this.horariosSharedCollection,
      claseDocente.horario
    );
    this.clasesSharedCollection = this.claseService.addClaseToCollectionIfMissing(this.clasesSharedCollection, claseDocente.clase);
  }

  protected loadRelationshipsOptions(): void {
    this.docenteService
      .query()
      .pipe(map((res: HttpResponse<IDocente[]>) => res.body ?? []))
      .pipe(
        map((docentes: IDocente[]) => this.docenteService.addDocenteToCollectionIfMissing(docentes, this.editForm.get('docente')!.value))
      )
      .subscribe((docentes: IDocente[]) => (this.docentesSharedCollection = docentes));

    this.horarioService
      .query()
      .pipe(map((res: HttpResponse<IHorario[]>) => res.body ?? []))
      .pipe(
        map((horarios: IHorario[]) => this.horarioService.addHorarioToCollectionIfMissing(horarios, this.editForm.get('horario')!.value))
      )
      .subscribe((horarios: IHorario[]) => (this.horariosSharedCollection = horarios));

    this.claseService
      .query()
      .pipe(map((res: HttpResponse<IClase[]>) => res.body ?? []))
      .pipe(map((clases: IClase[]) => this.claseService.addClaseToCollectionIfMissing(clases, this.editForm.get('clase')!.value)))
      .subscribe((clases: IClase[]) => (this.clasesSharedCollection = clases));
  }

  protected createFromForm(): IClaseDocente {
    return {
      ...new ClaseDocente(),
      id: this.editForm.get(['id'])!.value,
      docente: this.editForm.get(['docente'])!.value,
      horario: this.editForm.get(['horario'])!.value,
      clase: this.editForm.get(['clase'])!.value,
    };
  }
}
