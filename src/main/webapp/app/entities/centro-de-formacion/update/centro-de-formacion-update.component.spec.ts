import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CentroDeFormacionService } from '../service/centro-de-formacion.service';
import { ICentroDeFormacion, CentroDeFormacion } from '../centro-de-formacion.model';
import { IRegional } from 'app/entities/regional/regional.model';
import { RegionalService } from 'app/entities/regional/service/regional.service';

import { CentroDeFormacionUpdateComponent } from './centro-de-formacion-update.component';

describe('CentroDeFormacion Management Update Component', () => {
  let comp: CentroDeFormacionUpdateComponent;
  let fixture: ComponentFixture<CentroDeFormacionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let centroDeFormacionService: CentroDeFormacionService;
  let regionalService: RegionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CentroDeFormacionUpdateComponent],
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
      .overrideTemplate(CentroDeFormacionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CentroDeFormacionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    centroDeFormacionService = TestBed.inject(CentroDeFormacionService);
    regionalService = TestBed.inject(RegionalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Regional query and add missing value', () => {
      const centroDeFormacion: ICentroDeFormacion = { id: 456 };
      const regional: IRegional = { id: 96606 };
      centroDeFormacion.regional = regional;

      const regionalCollection: IRegional[] = [{ id: 66432 }];
      jest.spyOn(regionalService, 'query').mockReturnValue(of(new HttpResponse({ body: regionalCollection })));
      const additionalRegionals = [regional];
      const expectedCollection: IRegional[] = [...additionalRegionals, ...regionalCollection];
      jest.spyOn(regionalService, 'addRegionalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ centroDeFormacion });
      comp.ngOnInit();

      expect(regionalService.query).toHaveBeenCalled();
      expect(regionalService.addRegionalToCollectionIfMissing).toHaveBeenCalledWith(regionalCollection, ...additionalRegionals);
      expect(comp.regionalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const centroDeFormacion: ICentroDeFormacion = { id: 456 };
      const regional: IRegional = { id: 22333 };
      centroDeFormacion.regional = regional;

      activatedRoute.data = of({ centroDeFormacion });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(centroDeFormacion));
      expect(comp.regionalsSharedCollection).toContain(regional);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CentroDeFormacion>>();
      const centroDeFormacion = { id: 123 };
      jest.spyOn(centroDeFormacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ centroDeFormacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: centroDeFormacion }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(centroDeFormacionService.update).toHaveBeenCalledWith(centroDeFormacion);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CentroDeFormacion>>();
      const centroDeFormacion = new CentroDeFormacion();
      jest.spyOn(centroDeFormacionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ centroDeFormacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: centroDeFormacion }));
      saveSubject.complete();

      // THEN
      expect(centroDeFormacionService.create).toHaveBeenCalledWith(centroDeFormacion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CentroDeFormacion>>();
      const centroDeFormacion = { id: 123 };
      jest.spyOn(centroDeFormacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ centroDeFormacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(centroDeFormacionService.update).toHaveBeenCalledWith(centroDeFormacion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRegionalById', () => {
      it('Should return tracked Regional primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRegionalById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
