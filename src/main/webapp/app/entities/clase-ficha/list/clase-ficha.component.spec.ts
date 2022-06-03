import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ClaseFichaService } from '../service/clase-ficha.service';

import { ClaseFichaComponent } from './clase-ficha.component';

describe('ClaseFicha Management Component', () => {
  let comp: ClaseFichaComponent;
  let fixture: ComponentFixture<ClaseFichaComponent>;
  let service: ClaseFichaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ClaseFichaComponent],
    })
      .overrideTemplate(ClaseFichaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClaseFichaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClaseFichaService);

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
    expect(comp.claseFichas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
