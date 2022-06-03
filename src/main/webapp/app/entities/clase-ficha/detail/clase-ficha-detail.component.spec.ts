import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClaseFichaDetailComponent } from './clase-ficha-detail.component';

describe('ClaseFicha Management Detail Component', () => {
  let comp: ClaseFichaDetailComponent;
  let fixture: ComponentFixture<ClaseFichaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaseFichaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ claseFicha: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ClaseFichaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ClaseFichaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load claseFicha on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.claseFicha).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
