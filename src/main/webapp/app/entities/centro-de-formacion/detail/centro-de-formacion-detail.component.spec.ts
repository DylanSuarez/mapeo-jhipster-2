import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CentroDeFormacionDetailComponent } from './centro-de-formacion-detail.component';

describe('CentroDeFormacion Management Detail Component', () => {
  let comp: CentroDeFormacionDetailComponent;
  let fixture: ComponentFixture<CentroDeFormacionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CentroDeFormacionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ centroDeFormacion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CentroDeFormacionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CentroDeFormacionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load centroDeFormacion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.centroDeFormacion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
