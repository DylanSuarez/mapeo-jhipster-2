import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProgramaDeFormacionService } from '../service/programa-de-formacion.service';
import { IProgramaDeFormacion, ProgramaDeFormacion } from '../programa-de-formacion.model';
import { ICentroDeFormacion } from 'app/entities/centro-de-formacion/centro-de-formacion.model';
import { CentroDeFormacionService } from 'app/entities/centro-de-formacion/service/centro-de-formacion.service';
import { IClase } from 'app/entities/clase/clase.model';
import { ClaseService } from 'app/entities/clase/service/clase.service';

import { ProgramaDeFormacionUpdateComponent } from './programa-de-formacion-update.component';

describe('ProgramaDeFormacion Management Update Component', () => {
  let comp: ProgramaDeFormacionUpdateComponent;
  let fixture: ComponentFixture<ProgramaDeFormacionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let programaDeFormacionService: ProgramaDeFormacionService;
  let centroDeFormacionService: CentroDeFormacionService;
  let claseService: ClaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProgramaDeFormacionUpdateComponent],
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
      .overrideTemplate(ProgramaDeFormacionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProgramaDeFormacionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    programaDeFormacionService = TestBed.inject(ProgramaDeFormacionService);
    centroDeFormacionService = TestBed.inject(CentroDeFormacionService);
    claseService = TestBed.inject(ClaseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CentroDeFormacion query and add missing value', () => {
      const programaDeFormacion: IProgramaDeFormacion = { id: 456 };
      const centroDeFormacion: ICentroDeFormacion = { id: 92140 };
      programaDeFormacion.centroDeFormacion = centroDeFormacion;

      const centroDeFormacionCollection: ICentroDeFormacion[] = [{ id: 93574 }];
      jest.spyOn(centroDeFormacionService, 'query').mockReturnValue(of(new HttpResponse({ body: centroDeFormacionCollection })));
      const additionalCentroDeFormacions = [centroDeFormacion];
      const expectedCollection: ICentroDeFormacion[] = [...additionalCentroDeFormacions, ...centroDeFormacionCollection];
      jest.spyOn(centroDeFormacionService, 'addCentroDeFormacionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ programaDeFormacion });
      comp.ngOnInit();

      expect(centroDeFormacionService.query).toHaveBeenCalled();
      expect(centroDeFormacionService.addCentroDeFormacionToCollectionIfMissing).toHaveBeenCalledWith(
        centroDeFormacionCollection,
        ...additionalCentroDeFormacions
      );
      expect(comp.centroDeFormacionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Clase query and add missing value', () => {
      const programaDeFormacion: IProgramaDeFormacion = { id: 456 };
      const clase: IClase = { id: 25297 };
      programaDeFormacion.clase = clase;

      const claseCollection: IClase[] = [{ id: 57334 }];
      jest.spyOn(claseService, 'query').mockReturnValue(of(new HttpResponse({ body: claseCollection })));
      const additionalClases = [clase];
      const expectedCollection: IClase[] = [...additionalClases, ...claseCollection];
      jest.spyOn(claseService, 'addClaseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ programaDeFormacion });
      comp.ngOnInit();

      expect(claseService.query).toHaveBeenCalled();
      expect(claseService.addClaseToCollectionIfMissing).toHaveBeenCalledWith(claseCollection, ...additionalClases);
      expect(comp.clasesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const programaDeFormacion: IProgramaDeFormacion = { id: 456 };
      const centroDeFormacion: ICentroDeFormacion = { id: 72068 };
      programaDeFormacion.centroDeFormacion = centroDeFormacion;
      const clase: IClase = { id: 4541 };
      programaDeFormacion.clase = clase;

      activatedRoute.data = of({ programaDeFormacion });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(programaDeFormacion));
      expect(comp.centroDeFormacionsSharedCollection).toContain(centroDeFormacion);
      expect(comp.clasesSharedCollection).toContain(clase);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgramaDeFormacion>>();
      const programaDeFormacion = { id: 123 };
      jest.spyOn(programaDeFormacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ programaDeFormacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: programaDeFormacion }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(programaDeFormacionService.update).toHaveBeenCalledWith(programaDeFormacion);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgramaDeFormacion>>();
      const programaDeFormacion = new ProgramaDeFormacion();
      jest.spyOn(programaDeFormacionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ programaDeFormacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: programaDeFormacion }));
      saveSubject.complete();

      // THEN
      expect(programaDeFormacionService.create).toHaveBeenCalledWith(programaDeFormacion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProgramaDeFormacion>>();
      const programaDeFormacion = { id: 123 };
      jest.spyOn(programaDeFormacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ programaDeFormacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(programaDeFormacionService.update).toHaveBeenCalledWith(programaDeFormacion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCentroDeFormacionById', () => {
      it('Should return tracked CentroDeFormacion primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCentroDeFormacionById(0, entity);
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
