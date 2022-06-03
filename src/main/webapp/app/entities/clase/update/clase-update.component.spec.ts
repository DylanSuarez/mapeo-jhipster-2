import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClaseService } from '../service/clase.service';
import { IClase, Clase } from '../clase.model';
import { ITrimestre } from 'app/entities/trimestre/trimestre.model';
import { TrimestreService } from 'app/entities/trimestre/service/trimestre.service';

import { ClaseUpdateComponent } from './clase-update.component';

describe('Clase Management Update Component', () => {
  let comp: ClaseUpdateComponent;
  let fixture: ComponentFixture<ClaseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let claseService: ClaseService;
  let trimestreService: TrimestreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClaseUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ClaseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClaseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    claseService = TestBed.inject(ClaseService);
    trimestreService = TestBed.inject(TrimestreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Trimestre query and add missing value', () => {
      const clase: IClase = { id: 456 };
      const trimestre: ITrimestre = { id: 33561 };
      clase.trimestre = trimestre;

      const trimestreCollection: ITrimestre[] = [{ id: 44491 }];
      jest.spyOn(trimestreService, 'query').mockReturnValue(of(new HttpResponse({ body: trimestreCollection })));
      const additionalTrimestres = [trimestre];
      const expectedCollection: ITrimestre[] = [...additionalTrimestres, ...trimestreCollection];
      jest.spyOn(trimestreService, 'addTrimestreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ clase });
      comp.ngOnInit();

      expect(trimestreService.query).toHaveBeenCalled();
      expect(trimestreService.addTrimestreToCollectionIfMissing).toHaveBeenCalledWith(trimestreCollection, ...additionalTrimestres);
      expect(comp.trimestresSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const clase: IClase = { id: 456 };
      const trimestre: ITrimestre = { id: 93254 };
      clase.trimestre = trimestre;

      activatedRoute.data = of({ clase });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(clase));
      expect(comp.trimestresSharedCollection).toContain(trimestre);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Clase>>();
      const clase = { id: 123 };
      jest.spyOn(claseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clase }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(claseService.update).toHaveBeenCalledWith(clase);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Clase>>();
      const clase = new Clase();
      jest.spyOn(claseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clase }));
      saveSubject.complete();

      // THEN
      expect(claseService.create).toHaveBeenCalledWith(clase);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Clase>>();
      const clase = { id: 123 };
      jest.spyOn(claseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(claseService.update).toHaveBeenCalledWith(clase);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTrimestreById', () => {
      it('Should return tracked Trimestre primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTrimestreById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
