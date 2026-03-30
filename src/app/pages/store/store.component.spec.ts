import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { StoreComponent } from './store.component';
import { ApiService } from '@core/api.service';

describe('StoreComponent', () => {
  let component: StoreComponent;
  let fixture: ComponentFixture<StoreComponent>;
  const apiServiceMock = {
    getPacksDestaque: jasmine.createSpy('getPacksDestaque').and.returnValue(of({
      total: 0,
      packs: []
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
