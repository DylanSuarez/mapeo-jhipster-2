import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClaseProgramaDeFormacionService } from '../service/clase-programa-de-formacion.service';
import { IClaseProgramaDeFormacion, ClaseProgramaDeFormacion } from '../clase-programa-de-formacion.model';
import { IProgramaDeFormacion } from 'app/entities/programa-de-formacion/programa-de-formacion.model';
import { ProgramaDeFormacionService } from 'app/entities/programa-de-formacion/service/programa-de-formacion.service';

import { ClaseProgramaDeFormacionUpdateComponent } from './clase-programa-de-formacion-update.component';

describe('ClaseProgramaDeFormacion Management Update Component', () => {
  let comp: ClaseProgramaDeFormacionUpdateComponent;
  let fixture: ComponentFixture<ClaseProgramaDeFormacionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let claseProgramaDeFormacionService: ClaseProgramaDeFormacionService;
  let programaDeFormacionService: ProgramaDeFormacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClaseProgramaDeFormacionUpdateComponent],
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
      .overrideTemplate(ClaseProgramaDeFormacionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClaseProgramaDeFormacionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    claseProgramaDeFormacionService = TestBed.inject(ClaseProgramaDeFormacionService);
    programaDeFormacionService = TestBed.inject(ProgramaDeFormacionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProgramaDeFormacion query and add missing value', () => {
      const claseProgramaDeFormacion: IClaseProgramaDeFormacion = { id: 456 };
      const programadeformacion: IProgramaDeFormacion = { id: 60443 };
      claseProgramaDeFormacion.programadeformacion = programadeformacion;

      const programaDeFormacionCollection: IProgramaDeFormacion[] = [{ id: 29080 }];
      jest.spyOn(programaDeFormacionService, 'query').mockReturnValue(of(new HttpResponse({ body: programaDeFormacionCollection })));
      const additionalProgramaDeFormacions = [programadeformacion];
      const expectedCollection: IProgramaDeFormacion[] = [...additionalProgramaDeFormacions, ...programaDeFormacionCollection];
      jest.spyOn(programaDeFormacionService, 'addProgramaDeFormacionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ claseProgramaDeFormacion });
      comp.ngOnInit();

      expect(programaDeFormacionService.query).toHaveBeenCalled();
      expect(programaDeFormacionService.addProgramaDeFormacionToCollectionIfMissing).toHaveBeenCalledWith(
        programaDeFormacionCollection,
        ...additionalProgramaDeFormacions
      );
      expect(comp.programaDeFormacionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const claseProgramaDeFormacion: IClaseProgramaDeFormacion = { id: 456 };
      const programadeformacion: IProgramaDeFormacion = { id: 1977 };
      claseProgramaDeFormacion.programadeformacion = programadeformacion;

      activatedRoute.data = of({ claseProgramaDeFormacion });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(claseProgramaDeFormacion));
      expect(comp.programaDeFormacionsSharedCollection).toContain(programadeformacion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClaseProgramaDeFormacion>>();
      const claseProgramaDeFormacion = { id: 123 };
      jest.spyOn(claseProgramaDeFormacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claseProgramaDeFormacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: claseProgramaDeFormacion }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(claseProgramaDeFormacionService.update).toHaveBeenCalledWith(claseProgramaDeFormacion);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClaseProgramaDeFormacion>>();
      const claseProgramaDeFormacion = new ClaseProgramaDeFormacion();
      jest.spyOn(claseProgramaDeFormacionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claseProgramaDeFormacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: claseProgramaDeFormacion }));
      saveSubject.complete();

      // THEN
      expect(claseProgramaDeFormacionService.create).toHaveBeenCalledWith(claseProgramaDeFormacion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClaseProgramaDeFormacion>>();
      const claseProgramaDeFormacion = { id: 123 };
      jest.spyOn(claseProgramaDeFormacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claseProgramaDeFormacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(claseProgramaDeFormacionService.update).toHaveBeenCalledWith(claseProgramaDeFormacion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProgramaDeFormacionById', () => {
      it('Should return tracked ProgramaDeFormacion primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProgramaDeFormacionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
