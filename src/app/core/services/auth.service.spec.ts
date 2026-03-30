import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as firebaseAuth from 'firebase/auth';
import { auth } from '../../../../firebase-config';
import { ApiService } from '../api.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['syncAuth', 'registerEmail', 'loginEmail', 'requestPasswordReset']);

    spyOn(auth, 'onAuthStateChanged').and.callFake((callback: (user: firebaseAuth.User | null) => void) => {
      callback(null);
      return () => undefined;
    });

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('logs in with Google using Firebase popup', async () => {
    const popupSpy = spyOn<any>(service, 'signInWithGooglePopup').and.resolveTo('popup');

    const result = await service.loginWithGoogle();

    expect(result).toBeTrue();
    expect(popupSpy).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(toastrSpy.success).toHaveBeenCalled();
  });

  it('surfaces Firebase popup errors', async () => {
    spyOn<any>(service, 'signInWithGooglePopup').and.rejectWith({ code: 'auth/popup-closed-by-user' });

    const result = await service.loginWithGoogle();

    expect(result).toBeFalse();
    expect(toastrSpy.error).toHaveBeenCalled();
  });
});
