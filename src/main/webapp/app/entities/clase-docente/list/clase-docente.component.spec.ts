import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ClaseDocenteService } from '../service/clase-docente.service';

import { ClaseDocenteComponent } from './clase-docente.component';

describe('ClaseDocente Management Component', () => {
  let comp: ClaseDocenteComponent;
  let fixture: ComponentFixture<ClaseDocenteComponent>;
  let service: ClaseDocenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ClaseDocenteComponent],
    })
      .overrideTemplate(ClaseDocenteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClaseDocenteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClaseDocenteService);

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
    expect(comp.claseDocentes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
