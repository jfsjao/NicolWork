import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '@core/api.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  const apiServiceMock = {
    getPacksDestaque: jasmine.createSpy('getPacksDestaque').and.returnValue(of({
      total: 0,
      packs: []
    }))
  };

  beforeEach(async () => {
    apiServiceMock.getPacksDestaque.calls.reset();

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiServiceMock }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should expose the hero slides configuration', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component.slides.length).toBe(3);
  });
});
