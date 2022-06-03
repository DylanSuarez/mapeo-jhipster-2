import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FichaService } from '../service/ficha.service';
import { IFicha, Ficha } from '../ficha.model';
import { IProgramaDeFormacion } from 'app/entities/programa-de-formacion/programa-de-formacion.model';
import { ProgramaDeFormacionService } from 'app/entities/programa-de-formacion/service/programa-de-formacion.service';

import { FichaUpdateComponent } from './ficha-update.component';

describe('Ficha Management Update Component', () => {
  let comp: FichaUpdateComponent;
  let fixture: ComponentFixture<FichaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fichaService: FichaService;
  let programaDeFormacionService: ProgramaDeFormacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FichaUpdateComponent],
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
      .overrideTemplate(FichaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FichaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fichaService = TestBed.inject(FichaService);
    programaDeFormacionService = TestBed.inject(ProgramaDeFormacionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProgramaDeFormacion query and add missing value', () => {
      const ficha: IFicha = { id: 456 };
      const programadeformacion: IProgramaDeFormacion = { id: 39204 };
      ficha.programadeformacion = programadeformacion;

      const programaDeFormacionCollection: IProgramaDeFormacion[] = [{ id: 14264 }];
      jest.spyOn(programaDeFormacionService, 'query').mockReturnValue(of(new HttpResponse({ body: programaDeFormacionCollection })));
      const additionalProgramaDeFormacions = [programadeformacion];
      const expectedCollection: IProgramaDeFormacion[] = [...additionalProgramaDeFormacions, ...programaDeFormacionCollection];
      jest.spyOn(programaDeFormacionService, 'addProgramaDeFormacionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ficha });
      comp.ngOnInit();

      expect(programaDeFormacionService.query).toHaveBeenCalled();
      expect(programaDeFormacionService.addProgramaDeFormacionToCollectionIfMissing).toHaveBeenCalledWith(
        programaDeFormacionCollection,
        ...additionalProgramaDeFormacions
      );
      expect(comp.programaDeFormacionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ficha: IFicha = { id: 456 };
      const programadeformacion: IProgramaDeFormacion = { id: 36785 };
      ficha.programadeformacion = programadeformacion;

      activatedRoute.data = of({ ficha });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ficha));
      expect(comp.programaDeFormacionsSharedCollection).toContain(programadeformacion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ficha>>();
      const ficha = { id: 123 };
      jest.spyOn(fichaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ficha });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ficha }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(fichaService.update).toHaveBeenCalledWith(ficha);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ficha>>();
      const ficha = new Ficha();
      jest.spyOn(fichaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ficha });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ficha }));
      saveSubject.complete();

      // THEN
      expect(fichaService.create).toHaveBeenCalledWith(ficha);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ficha>>();
      const ficha = { id: 123 };
      jest.spyOn(fichaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ficha });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fichaService.update).toHaveBeenCalledWith(ficha);
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
