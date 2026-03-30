import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PacksComponent } from './packs.component';
import { AuthService } from '@core/services/auth.service';
import { UserLibraryService } from '@core/services/user-library.service';

describe('PacksComponent', () => {
  let component: PacksComponent;
  let fixture: ComponentFixture<PacksComponent>;
  const authServiceMock = {
    waitForAuthInit: jasmine.createSpy('waitForAuthInit').and.resolveTo(),
    currentUser: jasmine.createSpy('currentUser').and.returnValue({
      backendUserId: 1
    })
  };
  const userLibraryServiceMock = {
    loadUserLibrary: jasmine.createSpy('loadUserLibrary').and.returnValue(of({
      userId: 1,
      plan: {
        slug: 'basic',
        nome: 'Basic',
        status: 'ativo'
      },
      ownedPacks: [],
      featuredPacks: [],
      noveltyPacks: [],
      allPacks: [],
      upgradePacks: [],
      popularPacks: []
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacksComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserLibraryService, useValue: userLibraryServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
