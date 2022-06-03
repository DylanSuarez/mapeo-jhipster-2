import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RegionalDetailComponent } from './regional-detail.component';

describe('Regional Management Detail Component', () => {
  let comp: RegionalDetailComponent;
  let fixture: ComponentFixture<RegionalDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionalDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ regional: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RegionalDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RegionalDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load regional on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.regional).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
