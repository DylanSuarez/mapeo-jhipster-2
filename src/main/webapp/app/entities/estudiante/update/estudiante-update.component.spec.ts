import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EstudianteService } from '../service/estudiante.service';
import { IEstudiante, Estudiante } from '../estudiante.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IProgramaDeFormacion } from 'app/entities/programa-de-formacion/programa-de-formacion.model';
import { ProgramaDeFormacionService } from 'app/entities/programa-de-formacion/service/programa-de-formacion.service';
import { ITrimestre } from 'app/entities/trimestre/trimestre.model';
import { TrimestreService } from 'app/entities/trimestre/service/trimestre.service';
import { IFicha } from 'app/entities/ficha/ficha.model';
import { FichaService } from 'app/entities/ficha/service/ficha.service';

import { EstudianteUpdateComponent } from './estudiante-update.component';

describe('Estudiante Management Update Component', () => {
  let comp: EstudianteUpdateComponent;
  let fixture: ComponentFixture<EstudianteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estudianteService: EstudianteService;
  let customerService: CustomerService;
  let programaDeFormacionService: ProgramaDeFormacionService;
  let trimestreService: TrimestreService;
  let fichaService: FichaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EstudianteUpdateComponent],
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
      .overrideTemplate(EstudianteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstudianteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estudianteService = TestBed.inject(EstudianteService);
    customerService = TestBed.inject(CustomerService);
    programaDeFormacionService = TestBed.inject(ProgramaDeFormacionService);
    trimestreService = TestBed.inject(TrimestreService);
    fichaService = TestBed.inject(FichaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Customer query and add missing value', () => {
      const estudiante: IEstudiante = { id: 456 };
      const customer: ICustomer = { id: 50560 };
      estudiante.customer = customer;

      const customerCollection: ICustomer[] = [{ id: 71547 }];
      jest.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: customerCollection })));
      const additionalCustomers = [customer];
      const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
      jest.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      expect(customerService.query).toHaveBeenCalled();
      expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(customerCollection, ...additionalCustomers);
      expect(comp.customersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ProgramaDeFormacion query and add missing value', () => {
      const estudiante: IEstudiante = { id: 456 };
      const programadeformacion: IProgramaDeFormacion = { id: 85997 };
      estudiante.programadeformacion = programadeformacion;

      const programaDeFormacionCollection: IProgramaDeFormacion[] = [{ id: 55129 }];
      jest.spyOn(programaDeFormacionService, 'query').mockReturnValue(of(new HttpResponse({ body: programaDeFormacionCollection })));
      const additionalProgramaDeFormacions = [programadeformacion];
      const expectedCollection: IProgramaDeFormacion[] = [...additionalProgramaDeFormacions, ...programaDeFormacionCollection];
      jest.spyOn(programaDeFormacionService, 'addProgramaDeFormacionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      expect(programaDeFormacionService.query).toHaveBeenCalled();
      expect(programaDeFormacionService.addProgramaDeFormacionToCollectionIfMissing).toHaveBeenCalledWith(
        programaDeFormacionCollection,
        ...additionalProgramaDeFormacions
      );
      expect(comp.programaDeFormacionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Trimestre query and add missing value', () => {
      const estudiante: IEstudiante = { id: 456 };
      const trimestre: ITrimestre = { id: 40404 };
      estudiante.trimestre = trimestre;

      const trimestreCollection: ITrimestre[] = [{ id: 68694 }];
      jest.spyOn(trimestreService, 'query').mockReturnValue(of(new HttpResponse({ body: trimestreCollection })));
      const additionalTrimestres = [trimestre];
      const expectedCollection: ITrimestre[] = [...additionalTrimestres, ...trimestreCollection];
      jest.spyOn(trimestreService, 'addTrimestreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      expect(trimestreService.query).toHaveBeenCalled();
      expect(trimestreService.addTrimestreToCollectionIfMissing).toHaveBeenCalledWith(trimestreCollection, ...additionalTrimestres);
      expect(comp.trimestresSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Ficha query and add missing value', () => {
      const estudiante: IEstudiante = { id: 456 };
      const ficha: IFicha = { id: 90407 };
      estudiante.ficha = ficha;

      const fichaCollection: IFicha[] = [{ id: 44991 }];
      jest.spyOn(fichaService, 'query').mockReturnValue(of(new HttpResponse({ body: fichaCollection })));
      const additionalFichas = [ficha];
      const expectedCollection: IFicha[] = [...additionalFichas, ...fichaCollection];
      jest.spyOn(fichaService, 'addFichaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      expect(fichaService.query).toHaveBeenCalled();
      expect(fichaService.addFichaToCollectionIfMissing).toHaveBeenCalledWith(fichaCollection, ...additionalFichas);
      expect(comp.fichasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const estudiante: IEstudiante = { id: 456 };
      const customer: ICustomer = { id: 56570 };
      estudiante.customer = customer;
      const programadeformacion: IProgramaDeFormacion = { id: 74430 };
      estudiante.programadeformacion = programadeformacion;
      const trimestre: ITrimestre = { id: 28825 };
      estudiante.trimestre = trimestre;
      const ficha: IFicha = { id: 56016 };
      estudiante.ficha = ficha;

      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(estudiante));
      expect(comp.customersSharedCollection).toContain(customer);
      expect(comp.programaDeFormacionsSharedCollection).toContain(programadeformacion);
      expect(comp.trimestresSharedCollection).toContain(trimestre);
      expect(comp.fichasSharedCollection).toContain(ficha);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Estudiante>>();
      const estudiante = { id: 123 };
      jest.spyOn(estudianteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudiante }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(estudianteService.update).toHaveBeenCalledWith(estudiante);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Estudiante>>();
      const estudiante = new Estudiante();
      jest.spyOn(estudianteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudiante }));
      saveSubject.complete();

      // THEN
      expect(estudianteService.create).toHaveBeenCalledWith(estudiante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Estudiante>>();
      const estudiante = { id: 123 };
      jest.spyOn(estudianteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estudianteService.update).toHaveBeenCalledWith(estudiante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCustomerById', () => {
      it('Should return tracked Customer primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCustomerById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackProgramaDeFormacionById', () => {
      it('Should return tracked ProgramaDeFormacion primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProgramaDeFormacionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTrimestreById', () => {
      it('Should return tracked Trimestre primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTrimestreById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackFichaById', () => {
      it('Should return tracked Ficha primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFichaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
