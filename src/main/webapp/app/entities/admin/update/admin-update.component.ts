import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAdmin, Admin } from '../admin.model';
import { AdminService } from '../service/admin.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { ICentroDeFormacion } from 'app/entities/centro-de-formacion/centro-de-formacion.model';
import { CentroDeFormacionService } from 'app/entities/centro-de-formacion/service/centro-de-formacion.service';

@Component({
  selector: 'fsis-admin-update',
  templateUrl: './admin-update.component.html',
})
export class AdminUpdateComponent implements OnInit {
  isSaving = false;

  customersSharedCollection: ICustomer[] = [];
  centroDeFormacionsSharedCollection: ICentroDeFormacion[] = [];

  editForm = this.fb.group({
    id: [],
    cargo: [null, [Validators.required, Validators.maxLength(45)]],
    customer: [],
    centroDeFormacion: [],
  });

  constructor(
    protected adminService: AdminService,
    protected customerService: CustomerService,
    protected centroDeFormacionService: CentroDeFormacionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ admin }) => {
      this.updateForm(admin);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const admin = this.createFromForm();
    if (admin.id !== undefined) {
      this.subscribeToSaveResponse(this.adminService.update(admin));
    } else {
      this.subscribeToSaveResponse(this.adminService.create(admin));
    }
  }

  trackCustomerById(_index: number, item: ICustomer): number {
    return item.id!;
  }

  trackCentroDeFormacionById(_index: number, item: ICentroDeFormacion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdmin>>): void {
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

  protected updateForm(admin: IAdmin): void {
    this.editForm.patchValue({
      id: admin.id,
      cargo: admin.cargo,
      customer: admin.customer,
      centroDeFormacion: admin.centroDeFormacion,
    });

    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing(this.customersSharedCollection, admin.customer);
    this.centroDeFormacionsSharedCollection = this.centroDeFormacionService.addCentroDeFormacionToCollectionIfMissing(
      this.centroDeFormacionsSharedCollection,
      admin.centroDeFormacion
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

  protected createFromForm(): IAdmin {
    return {
      ...new Admin(),
      id: this.editForm.get(['id'])!.value,
      cargo: this.editForm.get(['cargo'])!.value,
      customer: this.editForm.get(['customer'])!.value,
      centroDeFormacion: this.editForm.get(['centroDeFormacion'])!.value,
    };
  }
}
