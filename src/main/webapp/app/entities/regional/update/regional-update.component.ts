import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRegional, Regional } from '../regional.model';
import { RegionalService } from '../service/regional.service';

@Component({
  selector: 'fsis-regional-update',
  templateUrl: './regional-update.component.html',
})
export class RegionalUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nombreRegional: [null, [Validators.required, Validators.maxLength(45)]],
  });

  constructor(protected regionalService: RegionalService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ regional }) => {
      this.updateForm(regional);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const regional = this.createFromForm();
    if (regional.id !== undefined) {
      this.subscribeToSaveResponse(this.regionalService.update(regional));
    } else {
      this.subscribeToSaveResponse(this.regionalService.create(regional));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegional>>): void {
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

  protected updateForm(regional: IRegional): void {
    this.editForm.patchValue({
      id: regional.id,
      nombreRegional: regional.nombreRegional,
    });
  }

  protected createFromForm(): IRegional {
    return {
      ...new Regional(),
      id: this.editForm.get(['id'])!.value,
      nombreRegional: this.editForm.get(['nombreRegional'])!.value,
    };
  }
}
