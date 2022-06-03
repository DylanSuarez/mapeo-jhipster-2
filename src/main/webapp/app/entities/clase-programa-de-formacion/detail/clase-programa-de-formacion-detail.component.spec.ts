import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClaseProgramaDeFormacionDetailComponent } from './clase-programa-de-formacion-detail.component';

describe('ClaseProgramaDeFormacion Management Detail Component', () => {
  let comp: ClaseProgramaDeFormacionDetailComponent;
  let fixture: ComponentFixture<ClaseProgramaDeFormacionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaseProgramaDeFormacionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ claseProgramaDeFormacion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ClaseProgramaDeFormacionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ClaseProgramaDeFormacionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load claseProgramaDeFormacion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.claseProgramaDeFormacion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
