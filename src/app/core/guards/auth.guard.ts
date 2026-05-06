import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  await authService.waitForAuthInit();

  if (authService.isAuthenticated()) {
    return true;
  }

  toastr.warning('Você precisa fazer login', 'Acesso Negado');
  return router.createUrlTree(['/auth'], {
    queryParams: {
      mode: 'register',
      plan: route.queryParamMap?.get('plan') ?? undefined,
      redirect: state.url ?? undefined
    }
  });
};
