import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrimestreDetailComponent } from './trimestre-detail.component';

describe('Trimestre Management Detail Component', () => {
  let comp: TrimestreDetailComponent;
  let fixture: ComponentFixture<TrimestreDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrimestreDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ trimestre: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TrimestreDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TrimestreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load trimestre on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.trimestre).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
