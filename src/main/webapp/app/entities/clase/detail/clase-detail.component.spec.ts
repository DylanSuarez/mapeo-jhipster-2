import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClaseDetailComponent } from './clase-detail.component';

describe('Clase Management Detail Component', () => {
  let comp: ClaseDetailComponent;
  let fixture: ComponentFixture<ClaseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ clase: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ClaseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ClaseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load clase on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.clase).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
