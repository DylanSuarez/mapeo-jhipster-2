import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClaseDocenteDetailComponent } from './clase-docente-detail.component';

describe('ClaseDocente Management Detail Component', () => {
  let comp: ClaseDocenteDetailComponent;
  let fixture: ComponentFixture<ClaseDocenteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaseDocenteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ claseDocente: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ClaseDocenteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ClaseDocenteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load claseDocente on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.claseDocente).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
