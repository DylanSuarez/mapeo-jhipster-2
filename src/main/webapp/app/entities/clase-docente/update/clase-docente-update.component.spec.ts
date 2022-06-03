import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClaseDocenteService } from '../service/clase-docente.service';
import { IClaseDocente, ClaseDocente } from '../clase-docente.model';
import { IDocente } from 'app/entities/docente/docente.model';
import { DocenteService } from 'app/entities/docente/service/docente.service';
import { IHorario } from 'app/entities/horario/horario.model';
import { HorarioService } from 'app/entities/horario/service/horario.service';
import { IClase } from 'app/entities/clase/clase.model';
import { ClaseService } from 'app/entities/clase/service/clase.service';

import { ClaseDocenteUpdateComponent } from './clase-docente-update.component';

describe('ClaseDocente Management Update Component', () => {
  let comp: ClaseDocenteUpdateComponent;
  let fixture: ComponentFixture<ClaseDocenteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let claseDocenteService: ClaseDocenteService;
  let docenteService: DocenteService;
  let horarioService: HorarioService;
  let claseService: ClaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClaseDocenteUpdateComponent],
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
      .overrideTemplate(ClaseDocenteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClaseDocenteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    claseDocenteService = TestBed.inject(ClaseDocenteService);
    docenteService = TestBed.inject(DocenteService);
    horarioService = TestBed.inject(HorarioService);
    claseService = TestBed.inject(ClaseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Docente query and add missing value', () => {
      const claseDocente: IClaseDocente = { id: 456 };
      const docente: IDocente = { id: 45607 };
      claseDocente.docente = docente;

      const docenteCollection: IDocente[] = [{ id: 44024 }];
      jest.spyOn(docenteService, 'query').mockReturnValue(of(new HttpResponse({ body: docenteCollection })));
      const additionalDocentes = [docente];
      const expectedCollection: IDocente[] = [...additionalDocentes, ...docenteCollection];
      jest.spyOn(docenteService, 'addDocenteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ claseDocente });
      comp.ngOnInit();

      expect(docenteService.query).toHaveBeenCalled();
      expect(docenteService.addDocenteToCollectionIfMissing).toHaveBeenCalledWith(docenteCollection, ...additionalDocentes);
      expect(comp.docentesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Horario query and add missing value', () => {
      const claseDocente: IClaseDocente = { id: 456 };
      const horario: IHorario = { id: 79678 };
      claseDocente.horario = horario;

      const horarioCollection: IHorario[] = [{ id: 12779 }];
      jest.spyOn(horarioService, 'query').mockReturnValue(of(new HttpResponse({ body: horarioCollection })));
      const additionalHorarios = [horario];
      const expectedCollection: IHorario[] = [...additionalHorarios, ...horarioCollection];
      jest.spyOn(horarioService, 'addHorarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ claseDocente });
      comp.ngOnInit();

      expect(horarioService.query).toHaveBeenCalled();
      expect(horarioService.addHorarioToCollectionIfMissing).toHaveBeenCalledWith(horarioCollection, ...additionalHorarios);
      expect(comp.horariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Clase query and add missing value', () => {
      const claseDocente: IClaseDocente = { id: 456 };
      const clase: IClase = { id: 75402 };
      claseDocente.clase = clase;

      const claseCollection: IClase[] = [{ id: 84713 }];
      jest.spyOn(claseService, 'query').mockReturnValue(of(new HttpResponse({ body: claseCollection })));
      const additionalClases = [clase];
      const expectedCollection: IClase[] = [...additionalClases, ...claseCollection];
      jest.spyOn(claseService, 'addClaseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ claseDocente });
      comp.ngOnInit();

      expect(claseService.query).toHaveBeenCalled();
      expect(claseService.addClaseToCollectionIfMissing).toHaveBeenCalledWith(claseCollection, ...additionalClases);
      expect(comp.clasesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const claseDocente: IClaseDocente = { id: 456 };
      const docente: IDocente = { id: 73495 };
      claseDocente.docente = docente;
      const horario: IHorario = { id: 54728 };
      claseDocente.horario = horario;
      const clase: IClase = { id: 43256 };
      claseDocente.clase = clase;

      activatedRoute.data = of({ claseDocente });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(claseDocente));
      expect(comp.docentesSharedCollection).toContain(docente);
      expect(comp.horariosSharedCollection).toContain(horario);
      expect(comp.clasesSharedCollection).toContain(clase);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClaseDocente>>();
      const claseDocente = { id: 123 };
      jest.spyOn(claseDocenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claseDocente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: claseDocente }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(claseDocenteService.update).toHaveBeenCalledWith(claseDocente);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClaseDocente>>();
      const claseDocente = new ClaseDocente();
      jest.spyOn(claseDocenteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claseDocente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: claseDocente }));
      saveSubject.complete();

      // THEN
      expect(claseDocenteService.create).toHaveBeenCalledWith(claseDocente);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClaseDocente>>();
      const claseDocente = { id: 123 };
      jest.spyOn(claseDocenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ claseDocente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(claseDocenteService.update).toHaveBeenCalledWith(claseDocente);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDocenteById', () => {
      it('Should return tracked Docente primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDocenteById(0, entity);
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

    describe('trackClaseById', () => {
      it('Should return tracked Clase primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackClaseById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
