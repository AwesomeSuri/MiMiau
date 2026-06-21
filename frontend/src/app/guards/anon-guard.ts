import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const anonGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwt = localStorage.getItem("mimiau_jwt");

  if (jwt) {
    router.navigate(["/dashboard"]);
    return false;
  } else {
    return true;
  }
};
