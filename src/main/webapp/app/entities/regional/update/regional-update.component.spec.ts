import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RegionalService } from '../service/regional.service';
import { IRegional, Regional } from '../regional.model';

import { RegionalUpdateComponent } from './regional-update.component';

describe('Regional Management Update Component', () => {
  let comp: RegionalUpdateComponent;
  let fixture: ComponentFixture<RegionalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let regionalService: RegionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RegionalUpdateComponent],
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
      .overrideTemplate(RegionalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RegionalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    regionalService = TestBed.inject(RegionalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const regional: IRegional = { id: 456 };

      activatedRoute.data = of({ regional });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(regional));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Regional>>();
      const regional = { id: 123 };
      jest.spyOn(regionalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ regional });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: regional }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(regionalService.update).toHaveBeenCalledWith(regional);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Regional>>();
      const regional = new Regional();
      jest.spyOn(regionalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ regional });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: regional }));
      saveSubject.complete();

      // THEN
      expect(regionalService.create).toHaveBeenCalledWith(regional);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Regional>>();
      const regional = { id: 123 };
      jest.spyOn(regionalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ regional });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(regionalService.update).toHaveBeenCalledWith(regional);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
