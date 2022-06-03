import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DocenteService } from '../service/docente.service';
import { IDocente, Docente } from '../docente.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { ICentroDeFormacion } from 'app/entities/centro-de-formacion/centro-de-formacion.model';
import { CentroDeFormacionService } from 'app/entities/centro-de-formacion/service/centro-de-formacion.service';

import { DocenteUpdateComponent } from './docente-update.component';

describe('Docente Management Update Component', () => {
  let comp: DocenteUpdateComponent;
  let fixture: ComponentFixture<DocenteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let docenteService: DocenteService;
  let customerService: CustomerService;
  let centroDeFormacionService: CentroDeFormacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DocenteUpdateComponent],
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
      .overrideTemplate(DocenteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocenteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    docenteService = TestBed.inject(DocenteService);
    customerService = TestBed.inject(CustomerService);
    centroDeFormacionService = TestBed.inject(CentroDeFormacionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Customer query and add missing value', () => {
      const docente: IDocente = { id: 456 };
      const customer: ICustomer = { id: 64545 };
      docente.customer = customer;

      const customerCollection: ICustomer[] = [{ id: 5342 }];
      jest.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: customerCollection })));
      const additionalCustomers = [customer];
      const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
      jest.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      expect(customerService.query).toHaveBeenCalled();
      expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(customerCollection, ...additionalCustomers);
      expect(comp.customersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CentroDeFormacion query and add missing value', () => {
      const docente: IDocente = { id: 456 };
      const centroDeFormacion: ICentroDeFormacion = { id: 65475 };
      docente.centroDeFormacion = centroDeFormacion;

      const centroDeFormacionCollection: ICentroDeFormacion[] = [{ id: 57746 }];
      jest.spyOn(centroDeFormacionService, 'query').mockReturnValue(of(new HttpResponse({ body: centroDeFormacionCollection })));
      const additionalCentroDeFormacions = [centroDeFormacion];
      const expectedCollection: ICentroDeFormacion[] = [...additionalCentroDeFormacions, ...centroDeFormacionCollection];
      jest.spyOn(centroDeFormacionService, 'addCentroDeFormacionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      expect(centroDeFormacionService.query).toHaveBeenCalled();
      expect(centroDeFormacionService.addCentroDeFormacionToCollectionIfMissing).toHaveBeenCalledWith(
        centroDeFormacionCollection,
        ...additionalCentroDeFormacions
      );
      expect(comp.centroDeFormacionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const docente: IDocente = { id: 456 };
      const customer: ICustomer = { id: 15983 };
      docente.customer = customer;
      const centroDeFormacion: ICentroDeFormacion = { id: 37403 };
      docente.centroDeFormacion = centroDeFormacion;

      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(docente));
      expect(comp.customersSharedCollection).toContain(customer);
      expect(comp.centroDeFormacionsSharedCollection).toContain(centroDeFormacion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Docente>>();
      const docente = { id: 123 };
      jest.spyOn(docenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: docente }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(docenteService.update).toHaveBeenCalledWith(docente);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Docente>>();
      const docente = new Docente();
      jest.spyOn(docenteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: docente }));
      saveSubject.complete();

      // THEN
      expect(docenteService.create).toHaveBeenCalledWith(docente);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Docente>>();
      const docente = { id: 123 };
      jest.spyOn(docenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(docenteService.update).toHaveBeenCalledWith(docente);
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

    describe('trackCentroDeFormacionById', () => {
      it('Should return tracked CentroDeFormacion primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCentroDeFormacionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
