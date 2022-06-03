import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RegionalService } from '../service/regional.service';

import { RegionalComponent } from './regional.component';

describe('Regional Management Component', () => {
  let comp: RegionalComponent;
  let fixture: ComponentFixture<RegionalComponent>;
  let service: RegionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RegionalComponent],
    })
      .overrideTemplate(RegionalComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RegionalComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RegionalService);

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
    expect(comp.regionals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
