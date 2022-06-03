import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProgramaDeFormacionService } from '../service/programa-de-formacion.service';

import { ProgramaDeFormacionComponent } from './programa-de-formacion.component';

describe('ProgramaDeFormacion Management Component', () => {
  let comp: ProgramaDeFormacionComponent;
  let fixture: ComponentFixture<ProgramaDeFormacionComponent>;
  let service: ProgramaDeFormacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProgramaDeFormacionComponent],
    })
      .overrideTemplate(ProgramaDeFormacionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProgramaDeFormacionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProgramaDeFormacionService);

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
    expect(comp.programaDeFormacions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
