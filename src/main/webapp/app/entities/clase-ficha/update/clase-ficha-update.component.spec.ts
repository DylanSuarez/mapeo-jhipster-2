import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClaseFichaService } from '../service/clase-ficha.service';
import { IClaseFicha, ClaseFicha } from '../clase-ficha.model';
import { IFicha } from 'app/entities/ficha/ficha.model';
import { FichaService } from 'app/entities/ficha/service/ficha.service';
import { IClase } from 'app/entities/clase/clase.model';
import { ClaseService } from 'app/entities/clase/service/clase.service';

import { ClaseFichaUpdateComponent } from './clase-ficha-update.component';

describe('ClaseFicha Management Update Component', () => {
  let comp: ClaseFichaUpdateComponent;
  let fixture: ComponentFixture<ClaseFichaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let claseFichaService: ClaseFichaService;
  let fichaService: FichaService;
  let claseService: ClaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClaseFichaUpdateComponent],
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
      .overrideTemplate(ClaseFichaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClaseFichaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    claseFichaService = TestBed.inject(ClaseFichaService);
    fichaService = TestBed.inject(FichaService);
    claseService = TestBed.inject(ClaseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ficha query and add missing value', () => {
      const claseFicha: IClaseFicha = { id: 456 };
      const ficha: IFicha = { id: 62682 };
      claseFicha.ficha = ficha;

      const fichaCollection: IFicha[] = [{ id: 5597 }];
      jest.spyOn(fichaService, 'query').mockReturnValue(of(new HttpResponse({ body: fichaCollection })));
      const additionalFichas = [ficha];
      const expectedCollection: IFicha[] = [...additionalFichas, ...fichaCollection];
      jest.spyOn(fichaService, 'addFichaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ claseFicha });
      comp.ngOnInit();

      expect(fichaService.query).toHaveBeenCalled();
      expect(fichaService.addFichaToCollectionIfMissing).toHaveBeenCalledWith(fichaCollection, ...additionalFichas);
      expect(comp.fichasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Clase query and add missing value', () => {
      const claseFicha: IClaseFicha = { id: 456 };
      const clase: IClase = { id: 5612 };
      claseFicha.clase = clase;

      const claseCollection: IClase[] = [{ id: 319 }];
      jest.spyOn(claseService, 'query').mockReturnValue(of(new HttpResponse({ body: claseCollection })));
      const additionalClases = [clase];
      const expectedCollection: IClase[] = [...additionalClases, ...claseCollection];
      jest.spyOn(claseService, 'addClaseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ claseFicha });
      comp.ngOnInit();

      expect(claseService.query).toHaveBeenCalled();
      expect(claseService.addClaseToCollectionIfMissing).toHaveBeenCalledWith(claseCollection, ...additionalClases);
      expect(comp.clasesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const claseFicha: IClaseFicha = { id: 456 };
      const ficha: IFicha = { id: 19962 };
      claseFicha.ficha = ficha;
      const clase: IClase = { id: 42830 };
      claseFicha.clase = clase;

      activatedRoute.data = of({ claseFicha });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(claseFicha));
      expect(comp.fichasSharedCollection).toContain(ficha);
      expect(comp.clasesSharedCollection).toContain(clase);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClaseFicha>>();
      const claseFicha = { id: 123 };
      jest.spyOn(claseFichaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claseFicha });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: claseFicha }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(claseFichaService.update).toHaveBeenCalledWith(claseFicha);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClaseFicha>>();
      const claseFicha = new ClaseFicha();
      jest.spyOn(claseFichaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claseFicha });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: claseFicha }));
      saveSubject.complete();

      // THEN
      expect(claseFichaService.create).toHaveBeenCalledWith(claseFicha);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClaseFicha>>();
      const claseFicha = { id: 123 };
      jest.spyOn(claseFichaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claseFicha });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(claseFichaService.update).toHaveBeenCalledWith(claseFicha);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFichaById', () => {
      it('Should return tracked Ficha primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFichaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackClaseById', () => {
      it('Should return tracked Clase primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackClaseById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
