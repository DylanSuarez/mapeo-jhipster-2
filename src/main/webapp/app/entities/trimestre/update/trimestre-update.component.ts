import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITrimestre, Trimestre } from '../trimestre.model';
import { TrimestreService } from '../service/trimestre.service';

@Component({
  selector: 'fsis-trimestre-update',
  templateUrl: './trimestre-update.component.html',
})
export class TrimestreUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    numTrimestre: [null, [Validators.required, Validators.maxLength(45)]],
  });

  constructor(protected trimestreService: TrimestreService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trimestre }) => {
      this.updateForm(trimestre);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const trimestre = this.createFromForm();
    if (trimestre.id !== undefined) {
      this.subscribeToSaveResponse(this.trimestreService.update(trimestre));
    } else {
      this.subscribeToSaveResponse(this.trimestreService.create(trimestre));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITrimestre>>): void {
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

  protected updateForm(trimestre: ITrimestre): void {
    this.editForm.patchValue({
      id: trimestre.id,
      numTrimestre: trimestre.numTrimestre,
    });
  }

  protected createFromForm(): ITrimestre {
    return {
      ...new Trimestre(),
      id: this.editForm.get(['id'])!.value,
      numTrimestre: this.editForm.get(['numTrimestre'])!.value,
    };
  }
}
