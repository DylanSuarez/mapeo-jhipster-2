import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FichaDetailComponent } from './ficha-detail.component';

describe('Ficha Management Detail Component', () => {
  let comp: FichaDetailComponent;
  let fixture: ComponentFixture<FichaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FichaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ficha: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FichaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FichaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ficha on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ficha).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
