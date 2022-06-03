import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ClaseProgramaDeFormacionService } from '../service/clase-programa-de-formacion.service';

import { ClaseProgramaDeFormacionComponent } from './clase-programa-de-formacion.component';

describe('ClaseProgramaDeFormacion Management Component', () => {
  let comp: ClaseProgramaDeFormacionComponent;
  let fixture: ComponentFixture<ClaseProgramaDeFormacionComponent>;
  let service: ClaseProgramaDeFormacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ClaseProgramaDeFormacionComponent],
    })
      .overrideTemplate(ClaseProgramaDeFormacionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClaseProgramaDeFormacionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClaseProgramaDeFormacionService);

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
    expect(comp.claseProgramaDeFormacions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
