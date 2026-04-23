import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '@core/services/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  const authServiceMock = {
    currentUser: jasmine.createSpy('currentUser').and.returnValue(null),
    isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(false),
    logout: jasmine.createSpy('logout').and.resolveTo()
  };

  beforeEach(async () => {
    authServiceMock.currentUser.calls.reset();
    authServiceMock.currentUser.and.returnValue(null);
    authServiceMock.isAuthenticated.calls.reset();
    authServiceMock.isAuthenticated.and.returnValue(false);
    authServiceMock.logout.calls.reset();

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the All In brand logo', () => {
    const brand = fixture.nativeElement.querySelector('.navbar-brand .brand-text');
    expect(brand?.getAttribute('aria-label')).toBe('ALL IN');
  });

  it('should have auth button "Acessar"', () => {
    const btn = fixture.nativeElement.querySelector('.auth-btn');
    expect(btn?.textContent).toContain('Acessar');
  });

  it('shows account links directly in the mobile menu for authenticated users', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);
    authServiceMock.currentUser.and.returnValue({
      displayName: 'Joao',
      email: 'joao@example.com'
    });

    component.isMobileView = true;
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.mobile-user-panel')).toBeTruthy();
    expect(element.textContent).toContain('Meus Downloads');
    expect(element.textContent).toContain('Minha Conta');
    expect(element.querySelector('.user-menu-trigger')).toBeFalsy();
  });
});
