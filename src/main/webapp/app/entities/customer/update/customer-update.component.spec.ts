import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CustomerService } from '../service/customer.service';
import { ICustomer, Customer } from '../customer.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ITipoDocumento } from 'app/entities/tipo-documento/tipo-documento.model';
import { TipoDocumentoService } from 'app/entities/tipo-documento/service/tipo-documento.service';

import { CustomerUpdateComponent } from './customer-update.component';

describe('Customer Management Update Component', () => {
  let comp: CustomerUpdateComponent;
  let fixture: ComponentFixture<CustomerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let customerService: CustomerService;
  let userService: UserService;
  let tipoDocumentoService: TipoDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CustomerUpdateComponent],
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
      .overrideTemplate(CustomerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    customerService = TestBed.inject(CustomerService);
    userService = TestBed.inject(UserService);
    tipoDocumentoService = TestBed.inject(TipoDocumentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const customer: ICustomer = { id: 456 };
      const user: IUser = { id: 67969 };
      customer.user = user;

      const userCollection: IUser[] = [{ id: 33034 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TipoDocumento query and add missing value', () => {
      const customer: ICustomer = { id: 456 };
      const tipoDocumento: ITipoDocumento = { id: 16053 };
      customer.tipoDocumento = tipoDocumento;

      const tipoDocumentoCollection: ITipoDocumento[] = [{ id: 62725 }];
      jest.spyOn(tipoDocumentoService, 'query').mockReturnValue(of(new HttpResponse({ body: tipoDocumentoCollection })));
      const additionalTipoDocumentos = [tipoDocumento];
      const expectedCollection: ITipoDocumento[] = [...additionalTipoDocumentos, ...tipoDocumentoCollection];
      jest.spyOn(tipoDocumentoService, 'addTipoDocumentoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      expect(tipoDocumentoService.query).toHaveBeenCalled();
      expect(tipoDocumentoService.addTipoDocumentoToCollectionIfMissing).toHaveBeenCalledWith(
        tipoDocumentoCollection,
        ...additionalTipoDocumentos
      );
      expect(comp.tipoDocumentosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const customer: ICustomer = { id: 456 };
      const user: IUser = { id: 90005 };
      customer.user = user;
      const tipoDocumento: ITipoDocumento = { id: 20903 };
      customer.tipoDocumento = tipoDocumento;

      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(customer));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.tipoDocumentosSharedCollection).toContain(tipoDocumento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Customer>>();
      const customer = { id: 123 };
      jest.spyOn(customerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customer }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(customerService.update).toHaveBeenCalledWith(customer);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Customer>>();
      const customer = new Customer();
      jest.spyOn(customerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customer }));
      saveSubject.complete();

      // THEN
      expect(customerService.create).toHaveBeenCalledWith(customer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Customer>>();
      const customer = { id: 123 };
      jest.spyOn(customerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(customerService.update).toHaveBeenCalledWith(customer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTipoDocumentoById', () => {
      it('Should return tracked TipoDocumento primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTipoDocumentoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
