import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HorarioService } from '../service/horario.service';
import { IHorario, Horario } from '../horario.model';

import { HorarioUpdateComponent } from './horario-update.component';

describe('Horario Management Update Component', () => {
  let comp: HorarioUpdateComponent;
  let fixture: ComponentFixture<HorarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let horarioService: HorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HorarioUpdateComponent],
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
      .overrideTemplate(HorarioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HorarioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    horarioService = TestBed.inject(HorarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const horario: IHorario = { id: 456 };

      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(horario));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Horario>>();
      const horario = { id: 123 };
      jest.spyOn(horarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: horario }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(horarioService.update).toHaveBeenCalledWith(horario);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Horario>>();
      const horario = new Horario();
      jest.spyOn(horarioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: horario }));
      saveSubject.complete();

      // THEN
      expect(horarioService.create).toHaveBeenCalledWith(horario);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Horario>>();
      const horario = { id: 123 };
      jest.spyOn(horarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(horarioService.update).toHaveBeenCalledWith(horario);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
