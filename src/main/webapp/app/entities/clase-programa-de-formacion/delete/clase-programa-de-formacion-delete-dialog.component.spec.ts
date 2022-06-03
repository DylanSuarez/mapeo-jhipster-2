jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ClaseProgramaDeFormacionService } from '../service/clase-programa-de-formacion.service';

import { ClaseProgramaDeFormacionDeleteDialogComponent } from './clase-programa-de-formacion-delete-dialog.component';

describe('ClaseProgramaDeFormacion Management Delete Component', () => {
  let comp: ClaseProgramaDeFormacionDeleteDialogComponent;
  let fixture: ComponentFixture<ClaseProgramaDeFormacionDeleteDialogComponent>;
  let service: ClaseProgramaDeFormacionService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ClaseProgramaDeFormacionDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(ClaseProgramaDeFormacionDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ClaseProgramaDeFormacionDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClaseProgramaDeFormacionService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
