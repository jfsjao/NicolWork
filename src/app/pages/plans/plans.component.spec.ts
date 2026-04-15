import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PlansComponent } from './plans.component';
import { ApiService } from '@core/api.service';

describe('PlansComponent', () => {
  let component: PlansComponent;
  let fixture: ComponentFixture<PlansComponent>;
  const apiServiceMock = {
    getPacksDestaque: jasmine.createSpy('getPacksDestaque').and.returnValue(of({
      total: 0,
      packs: []
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlansComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
