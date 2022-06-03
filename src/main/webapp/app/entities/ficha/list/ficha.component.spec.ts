import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FichaService } from '../service/ficha.service';

import { FichaComponent } from './ficha.component';

describe('Ficha Management Component', () => {
  let comp: FichaComponent;
  let fixture: ComponentFixture<FichaComponent>;
  let service: FichaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FichaComponent],
    })
      .overrideTemplate(FichaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FichaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FichaService);

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
    expect(comp.fichas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
