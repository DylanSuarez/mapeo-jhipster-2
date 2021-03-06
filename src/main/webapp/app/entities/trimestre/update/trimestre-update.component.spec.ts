import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TrimestreService } from '../service/trimestre.service';
import { ITrimestre, Trimestre } from '../trimestre.model';

import { TrimestreUpdateComponent } from './trimestre-update.component';

describe('Trimestre Management Update Component', () => {
  let comp: TrimestreUpdateComponent;
  let fixture: ComponentFixture<TrimestreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let trimestreService: TrimestreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TrimestreUpdateComponent],
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
      .overrideTemplate(TrimestreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TrimestreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    trimestreService = TestBed.inject(TrimestreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const trimestre: ITrimestre = { id: 456 };

      activatedRoute.data = of({ trimestre });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(trimestre));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Trimestre>>();
      const trimestre = { id: 123 };
      jest.spyOn(trimestreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trimestre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: trimestre }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(trimestreService.update).toHaveBeenCalledWith(trimestre);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Trimestre>>();
      const trimestre = new Trimestre();
      jest.spyOn(trimestreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trimestre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: trimestre }));
      saveSubject.complete();

      // THEN
      expect(trimestreService.create).toHaveBeenCalledWith(trimestre);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Trimestre>>();
      const trimestre = { id: 123 };
      jest.spyOn(trimestreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trimestre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(trimestreService.update).toHaveBeenCalledWith(trimestre);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
