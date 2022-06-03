import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEstudianteHorario, EstudianteHorario } from '../estudiante-horario.model';
import { EstudianteHorarioService } from '../service/estudiante-horario.service';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/estudiante/service/estudiante.service';
import { IHorario } from 'app/entities/horario/horario.model';
import { HorarioService } from 'app/entities/horario/service/horario.service';

@Component({
  selector: 'fsis-estudiante-horario-update',
  templateUrl: './estudiante-horario-update.component.html',
})
export class EstudianteHorarioUpdateComponent implements OnInit {
  isSaving = false;

  estudiantesSharedCollection: IEstudiante[] = [];
  horariosSharedCollection: IHorario[] = [];

  editForm = this.fb.group({
    id: [],
    estudiante: [],
    horario: [],
  });

  constructor(
    protected estudianteHorarioService: EstudianteHorarioService,
    protected estudianteService: EstudianteService,
    protected horarioService: HorarioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estudianteHorario }) => {
      this.updateForm(estudianteHorario);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estudianteHorario = this.createFromForm();
    if (estudianteHorario.id !== undefined) {
      this.subscribeToSaveResponse(this.estudianteHorarioService.update(estudianteHorario));
    } else {
      this.subscribeToSaveResponse(this.estudianteHorarioService.create(estudianteHorario));
    }
  }

  trackEstudianteById(_index: number, item: IEstudiante): number {
    return item.id!;
  }

  trackHorarioById(_index: number, item: IHorario): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstudianteHorario>>): void {
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

  protected updateForm(estudianteHorario: IEstudianteHorario): void {
    this.editForm.patchValue({
      id: estudianteHorario.id,
      estudiante: estudianteHorario.estudiante,
      horario: estudianteHorario.horario,
    });

    this.estudiantesSharedCollection = this.estudianteService.addEstudianteToCollectionIfMissing(
      this.estudiantesSharedCollection,
      estudianteHorario.estudiante
    );
    this.horariosSharedCollection = this.horarioService.addHorarioToCollectionIfMissing(
      this.horariosSharedCollection,
      estudianteHorario.horario
    );
  }

  protected loadRelationshipsOptions(): void {
    this.estudianteService
      .query()
      .pipe(map((res: HttpResponse<IEstudiante[]>) => res.body ?? []))
      .pipe(
        map((estudiantes: IEstudiante[]) =>
          this.estudianteService.addEstudianteToCollectionIfMissing(estudiantes, this.editForm.get('estudiante')!.value)
        )
      )
      .subscribe((estudiantes: IEstudiante[]) => (this.estudiantesSharedCollection = estudiantes));

    this.horarioService
      .query()
      .pipe(map((res: HttpResponse<IHorario[]>) => res.body ?? []))
      .pipe(
        map((horarios: IHorario[]) => this.horarioService.addHorarioToCollectionIfMissing(horarios, this.editForm.get('horario')!.value))
      )
      .subscribe((horarios: IHorario[]) => (this.horariosSharedCollection = horarios));
  }

  protected createFromForm(): IEstudianteHorario {
    return {
      ...new EstudianteHorario(),
      id: this.editForm.get(['id'])!.value,
      estudiante: this.editForm.get(['estudiante'])!.value,
      horario: this.editForm.get(['horario'])!.value,
    };
  }
}
