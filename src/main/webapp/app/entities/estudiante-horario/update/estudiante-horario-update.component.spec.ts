import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EstudianteHorarioService } from '../service/estudiante-horario.service';
import { IEstudianteHorario, EstudianteHorario } from '../estudiante-horario.model';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/estudiante/service/estudiante.service';
import { IHorario } from 'app/entities/horario/horario.model';
import { HorarioService } from 'app/entities/horario/service/horario.service';

import { EstudianteHorarioUpdateComponent } from './estudiante-horario-update.component';

describe('EstudianteHorario Management Update Component', () => {
  let comp: EstudianteHorarioUpdateComponent;
  let fixture: ComponentFixture<EstudianteHorarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estudianteHorarioService: EstudianteHorarioService;
  let estudianteService: EstudianteService;
  let horarioService: HorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EstudianteHorarioUpdateComponent],
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
      .overrideTemplate(EstudianteHorarioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstudianteHorarioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estudianteHorarioService = TestBed.inject(EstudianteHorarioService);
    estudianteService = TestBed.inject(EstudianteService);
    horarioService = TestBed.inject(HorarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Estudiante query and add missing value', () => {
      const estudianteHorario: IEstudianteHorario = { id: 456 };
      const estudiante: IEstudiante = { id: 73825 };
      estudianteHorario.estudiante = estudiante;

      const estudianteCollection: IEstudiante[] = [{ id: 27183 }];
      jest.spyOn(estudianteService, 'query').mockReturnValue(of(new HttpResponse({ body: estudianteCollection })));
      const additionalEstudiantes = [estudiante];
      const expectedCollection: IEstudiante[] = [...additionalEstudiantes, ...estudianteCollection];
      jest.spyOn(estudianteService, 'addEstudianteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estudianteHorario });
      comp.ngOnInit();

      expect(estudianteService.query).toHaveBeenCalled();
      expect(estudianteService.addEstudianteToCollectionIfMissing).toHaveBeenCalledWith(estudianteCollection, ...additionalEstudiantes);
      expect(comp.estudiantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Horario query and add missing value', () => {
      const estudianteHorario: IEstudianteHorario = { id: 456 };
      const horario: IHorario = { id: 48602 };
      estudianteHorario.horario = horario;

      const horarioCollection: IHorario[] = [{ id: 80839 }];
      jest.spyOn(horarioService, 'query').mockReturnValue(of(new HttpResponse({ body: horarioCollection })));
      const additionalHorarios = [horario];
      const expectedCollection: IHorario[] = [...additionalHorarios, ...horarioCollection];
      jest.spyOn(horarioService, 'addHorarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estudianteHorario });
      comp.ngOnInit();

      expect(horarioService.query).toHaveBeenCalled();
      expect(horarioService.addHorarioToCollectionIfMissing).toHaveBeenCalledWith(horarioCollection, ...additionalHorarios);
      expect(comp.horariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const estudianteHorario: IEstudianteHorario = { id: 456 };
      const estudiante: IEstudiante = { id: 86749 };
      estudianteHorario.estudiante = estudiante;
      const horario: IHorario = { id: 68740 };
      estudianteHorario.horario = horario;

      activatedRoute.data = of({ estudianteHorario });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(estudianteHorario));
      expect(comp.estudiantesSharedCollection).toContain(estudiante);
      expect(comp.horariosSharedCollection).toContain(horario);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EstudianteHorario>>();
      const estudianteHorario = { id: 123 };
      jest.spyOn(estudianteHorarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudianteHorario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudianteHorario }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(estudianteHorarioService.update).toHaveBeenCalledWith(estudianteHorario);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EstudianteHorario>>();
      const estudianteHorario = new EstudianteHorario();
      jest.spyOn(estudianteHorarioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudianteHorario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudianteHorario }));
      saveSubject.complete();

      // THEN
      expect(estudianteHorarioService.create).toHaveBeenCalledWith(estudianteHorario);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EstudianteHorario>>();
      const estudianteHorario = { id: 123 };
      jest.spyOn(estudianteHorarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudianteHorario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estudianteHorarioService.update).toHaveBeenCalledWith(estudianteHorario);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEstudianteById', () => {
      it('Should return tracked Estudiante primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEstudianteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackHorarioById', () => {
      it('Should return tracked Horario primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackHorarioById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
