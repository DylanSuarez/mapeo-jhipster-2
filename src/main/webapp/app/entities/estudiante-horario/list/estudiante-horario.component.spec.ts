import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EstudianteHorarioService } from '../service/estudiante-horario.service';

import { EstudianteHorarioComponent } from './estudiante-horario.component';

describe('EstudianteHorario Management Component', () => {
  let comp: EstudianteHorarioComponent;
  let fixture: ComponentFixture<EstudianteHorarioComponent>;
  let service: EstudianteHorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EstudianteHorarioComponent],
    })
      .overrideTemplate(EstudianteHorarioComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstudianteHorarioComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EstudianteHorarioService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.estudianteHorarios?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
