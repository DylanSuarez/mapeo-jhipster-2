import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EstudianteHorarioDetailComponent } from './estudiante-horario-detail.component';

describe('EstudianteHorario Management Detail Component', () => {
  let comp: EstudianteHorarioDetailComponent;
  let fixture: ComponentFixture<EstudianteHorarioDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstudianteHorarioDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ estudianteHorario: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EstudianteHorarioDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EstudianteHorarioDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load estudianteHorario on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.estudianteHorario).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
