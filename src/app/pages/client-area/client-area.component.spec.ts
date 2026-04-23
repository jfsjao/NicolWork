import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ClientAreaComponent } from './client-area.component';
import { AuthService } from '@core/services/auth.service';
import { UserLibraryService } from '@core/services/user-library.service';

describe('ClientAreaComponent', () => {
  let component: ClientAreaComponent;
  let fixture: ComponentFixture<ClientAreaComponent>;
  const authServiceMock = {
    currentUser: jasmine.createSpy('currentUser').and.returnValue(null),
    waitForAuthInit: jasmine.createSpy('waitForAuthInit').and.resolveTo()
  };
  const userLibraryServiceMock = {
    loadUserLibrary: jasmine.createSpy('loadUserLibrary').and.returnValue(of({
      userId: 1,
      plan: { slug: 'gratuito', nome: 'Gratuito', status: 'ativo' },
      ownedPacks: [],
      featuredPacks: [],
      noveltyPacks: [],
      allPacks: [],
      upgradePacks: [],
      popularPacks: []
    }))
  };

  beforeEach(async () => {
    authServiceMock.currentUser.calls.reset();
    authServiceMock.currentUser.and.returnValue(null);
    authServiceMock.waitForAuthInit.calls.reset();
    userLibraryServiceMock.loadUserLibrary.calls.reset();

    await TestBed.configureTestingModule({
      imports: [ClientAreaComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserLibraryService, useValue: userLibraryServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
