import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HorarioService } from '../service/horario.service';

import { HorarioComponent } from './horario.component';

describe('Horario Management Component', () => {
  let comp: HorarioComponent;
  let fixture: ComponentFixture<HorarioComponent>;
  let service: HorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HorarioComponent],
    })
      .overrideTemplate(HorarioComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HorarioComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HorarioService);

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
    expect(comp.horarios?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
