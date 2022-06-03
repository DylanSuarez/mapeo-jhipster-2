import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEstudiante, Estudiante } from '../estudiante.model';
import { EstudianteService } from '../service/estudiante.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IProgramaDeFormacion } from 'app/entities/programa-de-formacion/programa-de-formacion.model';
import { ProgramaDeFormacionService } from 'app/entities/programa-de-formacion/service/programa-de-formacion.service';
import { ITrimestre } from 'app/entities/trimestre/trimestre.model';
import { TrimestreService } from 'app/entities/trimestre/service/trimestre.service';
import { IFicha } from 'app/entities/ficha/ficha.model';
import { FichaService } from 'app/entities/ficha/service/ficha.service';

@Component({
  selector: 'fsis-estudiante-update',
  templateUrl: './estudiante-update.component.html',
})
export class EstudianteUpdateComponent implements OnInit {
  isSaving = false;

  customersSharedCollection: ICustomer[] = [];
  programaDeFormacionsSharedCollection: IProgramaDeFormacion[] = [];
  trimestresSharedCollection: ITrimestre[] = [];
  fichasSharedCollection: IFicha[] = [];

  editForm = this.fb.group({
    id: [],
    huella: [null, [Validators.required]],
    customer: [],
    programadeformacion: [],
    trimestre: [],
    ficha: [],
  });

  constructor(
    protected estudianteService: EstudianteService,
    protected customerService: CustomerService,
    protected programaDeFormacionService: ProgramaDeFormacionService,
    protected trimestreService: TrimestreService,
    protected fichaService: FichaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estudiante }) => {
      this.updateForm(estudiante);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estudiante = this.createFromForm();
    if (estudiante.id !== undefined) {
      this.subscribeToSaveResponse(this.estudianteService.update(estudiante));
    } else {
      this.subscribeToSaveResponse(this.estudianteService.create(estudiante));
    }
  }

  trackCustomerById(_index: number, item: ICustomer): number {
    return item.id!;
  }

  trackProgramaDeFormacionById(_index: number, item: IProgramaDeFormacion): number {
    return item.id!;
  }

  trackTrimestreById(_index: number, item: ITrimestre): number {
    return item.id!;
  }

  trackFichaById(_index: number, item: IFicha): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstudiante>>): void {
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

  protected updateForm(estudiante: IEstudiante): void {
    this.editForm.patchValue({
      id: estudiante.id,
      huella: estudiante.huella,
      customer: estudiante.customer,
      programadeformacion: estudiante.programadeformacion,
      trimestre: estudiante.trimestre,
      ficha: estudiante.ficha,
    });

    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing(
      this.customersSharedCollection,
      estudiante.customer
    );
    this.programaDeFormacionsSharedCollection = this.programaDeFormacionService.addProgramaDeFormacionToCollectionIfMissing(
      this.programaDeFormacionsSharedCollection,
      estudiante.programadeformacion
    );
    this.trimestresSharedCollection = this.trimestreService.addTrimestreToCollectionIfMissing(
      this.trimestresSharedCollection,
      estudiante.trimestre
    );
    this.fichasSharedCollection = this.fichaService.addFichaToCollectionIfMissing(this.fichasSharedCollection, estudiante.ficha);
  }

  protected loadRelationshipsOptions(): void {
    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing(customers, this.editForm.get('customer')!.value)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));

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

    this.trimestreService
      .query()
      .pipe(map((res: HttpResponse<ITrimestre[]>) => res.body ?? []))
      .pipe(
        map((trimestres: ITrimestre[]) =>
          this.trimestreService.addTrimestreToCollectionIfMissing(trimestres, this.editForm.get('trimestre')!.value)
        )
      )
      .subscribe((trimestres: ITrimestre[]) => (this.trimestresSharedCollection = trimestres));

    this.fichaService
      .query()
      .pipe(map((res: HttpResponse<IFicha[]>) => res.body ?? []))
      .pipe(map((fichas: IFicha[]) => this.fichaService.addFichaToCollectionIfMissing(fichas, this.editForm.get('ficha')!.value)))
      .subscribe((fichas: IFicha[]) => (this.fichasSharedCollection = fichas));
  }

  protected createFromForm(): IEstudiante {
    return {
      ...new Estudiante(),
      id: this.editForm.get(['id'])!.value,
      huella: this.editForm.get(['huella'])!.value,
      customer: this.editForm.get(['customer'])!.value,
      programadeformacion: this.editForm.get(['programadeformacion'])!.value,
      trimestre: this.editForm.get(['trimestre'])!.value,
      ficha: this.editForm.get(['ficha'])!.value,
    };
  }
}
