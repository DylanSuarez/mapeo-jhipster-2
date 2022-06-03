import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IHorario, Horario } from '../horario.model';
import { HorarioService } from '../service/horario.service';

@Component({
  selector: 'fsis-horario-update',
  templateUrl: './horario-update.component.html',
})
export class HorarioUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    horaInicio: [null, [Validators.required]],
    horaFinal: [null, [Validators.required]],
    fecha: [null, [Validators.required]],
    jornada: [null, [Validators.required, Validators.maxLength(45)]],
  });

  constructor(protected horarioService: HorarioService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ horario }) => {
      if (horario.id === undefined) {
        const today = dayjs().startOf('day');
        horario.horaInicio = today;
        horario.horaFinal = today;
      }

      this.updateForm(horario);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const horario = this.createFromForm();
    if (horario.id !== undefined) {
      this.subscribeToSaveResponse(this.horarioService.update(horario));
    } else {
      this.subscribeToSaveResponse(this.horarioService.create(horario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHorario>>): void {
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

  protected updateForm(horario: IHorario): void {
    this.editForm.patchValue({
      id: horario.id,
      horaInicio: horario.horaInicio ? horario.horaInicio.format(DATE_TIME_FORMAT) : null,
      horaFinal: horario.horaFinal ? horario.horaFinal.format(DATE_TIME_FORMAT) : null,
      fecha: horario.fecha,
      jornada: horario.jornada,
    });
  }

  protected createFromForm(): IHorario {
    return {
      ...new Horario(),
      id: this.editForm.get(['id'])!.value,
      horaInicio: this.editForm.get(['horaInicio'])!.value ? dayjs(this.editForm.get(['horaInicio'])!.value, DATE_TIME_FORMAT) : undefined,
      horaFinal: this.editForm.get(['horaFinal'])!.value ? dayjs(this.editForm.get(['horaFinal'])!.value, DATE_TIME_FORMAT) : undefined,
      fecha: this.editForm.get(['fecha'])!.value,
      jornada: this.editForm.get(['jornada'])!.value,
    };
  }
}
