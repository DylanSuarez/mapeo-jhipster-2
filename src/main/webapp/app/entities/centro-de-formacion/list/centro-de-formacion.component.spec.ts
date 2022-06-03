import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CentroDeFormacionService } from '../service/centro-de-formacion.service';

import { CentroDeFormacionComponent } from './centro-de-formacion.component';

describe('CentroDeFormacion Management Component', () => {
  let comp: CentroDeFormacionComponent;
  let fixture: ComponentFixture<CentroDeFormacionComponent>;
  let service: CentroDeFormacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CentroDeFormacionComponent],
    })
      .overrideTemplate(CentroDeFormacionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CentroDeFormacionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CentroDeFormacionService);

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
    expect(comp.centroDeFormacions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
