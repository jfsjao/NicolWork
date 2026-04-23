import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { ClipboardService } from './core/services/clipboard/clipboard.service';
import { AuthService } from './core/services/auth.service';

describe('AppComponent', () => {
  const authServiceMock = {
    currentUser: jasmine.createSpy('currentUser').and.returnValue(null),
    isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(false),
    logout: jasmine.createSpy('logout').and.resolveTo(),
    waitForAuthInit: jasmine.createSpy('waitForAuthInit').and.resolveTo()
  };
  const clipboardSpy = jasmine.createSpyObj<ClipboardService>('ClipboardService', ['copyToClipboard']);
  const toastrSpy = jasmine.createSpyObj<ToastrService>('ToastrService', ['error']);

  beforeEach(async () => {
    authServiceMock.currentUser.calls.reset();
    authServiceMock.currentUser.and.returnValue(null);
    authServiceMock.isAuthenticated.calls.reset();
    authServiceMock.isAuthenticated.and.returnValue(false);
    authServiceMock.logout.calls.reset();
    authServiceMock.waitForAuthInit.calls.reset();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ClipboardService, useValue: clipboardSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'All In - Creator' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('All In - Creator');
  });

  it('should render navbar and footer components', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
