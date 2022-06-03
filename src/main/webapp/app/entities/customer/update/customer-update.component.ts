import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICustomer, Customer } from '../customer.model';
import { CustomerService } from '../service/customer.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ITipoDocumento } from 'app/entities/tipo-documento/tipo-documento.model';
import { TipoDocumentoService } from 'app/entities/tipo-documento/service/tipo-documento.service';

@Component({
  selector: 'fsis-customer-update',
  templateUrl: './customer-update.component.html',
})
export class CustomerUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  tipoDocumentosSharedCollection: ITipoDocumento[] = [];

  editForm = this.fb.group({
    id: [],
    numDocumento: [null, [Validators.required, Validators.maxLength(50)]],
    primerNombre: [null, [Validators.required, Validators.maxLength(50)]],
    segundoNombre: [null, [Validators.maxLength(50)]],
    primerApellido: [null, [Validators.required, Validators.maxLength(50)]],
    segundoApellido: [null, [Validators.maxLength(50)]],
    user: [null, Validators.required],
    tipoDocumento: [],
  });

  constructor(
    protected customerService: CustomerService,
    protected userService: UserService,
    protected tipoDocumentoService: TipoDocumentoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customer }) => {
      this.updateForm(customer);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customer = this.createFromForm();
    if (customer.id !== undefined) {
      this.subscribeToSaveResponse(this.customerService.update(customer));
    } else {
      this.subscribeToSaveResponse(this.customerService.create(customer));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  trackTipoDocumentoById(_index: number, item: ITipoDocumento): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomer>>): void {
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

  protected updateForm(customer: ICustomer): void {
    this.editForm.patchValue({
      id: customer.id,
      numDocumento: customer.numDocumento,
      primerNombre: customer.primerNombre,
      segundoNombre: customer.segundoNombre,
      primerApellido: customer.primerApellido,
      segundoApellido: customer.segundoApellido,
      user: customer.user,
      tipoDocumento: customer.tipoDocumento,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, customer.user);
    this.tipoDocumentosSharedCollection = this.tipoDocumentoService.addTipoDocumentoToCollectionIfMissing(
      this.tipoDocumentosSharedCollection,
      customer.tipoDocumento
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.tipoDocumentoService
      .query()
      .pipe(map((res: HttpResponse<ITipoDocumento[]>) => res.body ?? []))
      .pipe(
        map((tipoDocumentos: ITipoDocumento[]) =>
          this.tipoDocumentoService.addTipoDocumentoToCollectionIfMissing(tipoDocumentos, this.editForm.get('tipoDocumento')!.value)
        )
      )
      .subscribe((tipoDocumentos: ITipoDocumento[]) => (this.tipoDocumentosSharedCollection = tipoDocumentos));
  }

  protected createFromForm(): ICustomer {
    return {
      ...new Customer(),
      id: this.editForm.get(['id'])!.value,
      numDocumento: this.editForm.get(['numDocumento'])!.value,
      primerNombre: this.editForm.get(['primerNombre'])!.value,
      segundoNombre: this.editForm.get(['segundoNombre'])!.value,
      primerApellido: this.editForm.get(['primerApellido'])!.value,
      segundoApellido: this.editForm.get(['segundoApellido'])!.value,
      user: this.editForm.get(['user'])!.value,
      tipoDocumento: this.editForm.get(['tipoDocumento'])!.value,
    };
  }
}
