import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdmin } from '../admin.model';
import { AdminService } from '../service/admin.service';
import { AdminDeleteDialogComponent } from '../delete/admin-delete-dialog.component';

@Component({
  selector: 'fsis-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  admins?: IAdmin[];
  isLoading = false;

  constructor(protected adminService: AdminService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.adminService.query().subscribe({
      next: (res: HttpResponse<IAdmin[]>) => {
        this.isLoading = false;
        this.admins = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAdmin): number {
    return item.id!;
  }

  delete(admin: IAdmin): void {
    const modalRef = this.modalService.open(AdminDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.admin = admin;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
