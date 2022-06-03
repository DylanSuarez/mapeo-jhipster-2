import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDocente, Docente } from '../docente.model';
import { DocenteService } from '../service/docente.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { ICentroDeFormacion } from 'app/entities/centro-de-formacion/centro-de-formacion.model';
import { CentroDeFormacionService } from 'app/entities/centro-de-formacion/service/centro-de-formacion.service';

@Component({
  selector: 'fsis-docente-update',
  templateUrl: './docente-update.component.html',
})
export class DocenteUpdateComponent implements OnInit {
  isSaving = false;

  customersSharedCollection: ICustomer[] = [];
  centroDeFormacionsSharedCollection: ICentroDeFormacion[] = [];

  editForm = this.fb.group({
    id: [],
    customer: [],
    centroDeFormacion: [],
  });

  constructor(
    protected docenteService: DocenteService,
    protected customerService: CustomerService,
    protected centroDeFormacionService: CentroDeFormacionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ docente }) => {
      this.updateForm(docente);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const docente = this.createFromForm();
    if (docente.id !== undefined) {
      this.subscribeToSaveResponse(this.docenteService.update(docente));
    } else {
      this.subscribeToSaveResponse(this.docenteService.create(docente));
    }
  }

  trackCustomerById(_index: number, item: ICustomer): number {
    return item.id!;
  }

  trackCentroDeFormacionById(_index: number, item: ICentroDeFormacion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocente>>): void {
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

  protected updateForm(docente: IDocente): void {
    this.editForm.patchValue({
      id: docente.id,
      customer: docente.customer,
      centroDeFormacion: docente.centroDeFormacion,
    });

    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing(
      this.customersSharedCollection,
      docente.customer
    );
    this.centroDeFormacionsSharedCollection = this.centroDeFormacionService.addCentroDeFormacionToCollectionIfMissing(
      this.centroDeFormacionsSharedCollection,
      docente.centroDeFormacion
    );
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
  }

  protected createFromForm(): IDocente {
    return {
      ...new Docente(),
      id: this.editForm.get(['id'])!.value,
      customer: this.editForm.get(['customer'])!.value,
      centroDeFormacion: this.editForm.get(['centroDeFormacion'])!.value,
    };
  }
}
