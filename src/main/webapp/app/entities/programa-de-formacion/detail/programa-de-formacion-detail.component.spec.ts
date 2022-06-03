import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProgramaDeFormacionDetailComponent } from './programa-de-formacion-detail.component';

describe('ProgramaDeFormacion Management Detail Component', () => {
  let comp: ProgramaDeFormacionDetailComponent;
  let fixture: ComponentFixture<ProgramaDeFormacionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramaDeFormacionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ programaDeFormacion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProgramaDeFormacionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProgramaDeFormacionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load programaDeFormacion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.programaDeFormacion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
