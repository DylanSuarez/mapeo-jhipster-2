import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegional } from '../regional.model';
import { RegionalService } from '../service/regional.service';
import { RegionalDeleteDialogComponent } from '../delete/regional-delete-dialog.component';

@Component({
  selector: 'fsis-regional',
  templateUrl: './regional.component.html',
})
export class RegionalComponent implements OnInit {
  regionals?: IRegional[];
  isLoading = false;

  constructor(protected regionalService: RegionalService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.regionalService.query().subscribe({
      next: (res: HttpResponse<IRegional[]>) => {
        this.isLoading = false;
        this.regionals = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IRegional): number {
    return item.id!;
  }

  delete(regional: IRegional): void {
    const modalRef = this.modalService.open(RegionalDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.regional = regional;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
