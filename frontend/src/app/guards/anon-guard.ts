import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const anonGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionId = localStorage.getItem("sessionId");

  if (sessionId) {
    router.navigate(["/dashboard"]);
    return false;
  } else {
    return true;
  }
};
