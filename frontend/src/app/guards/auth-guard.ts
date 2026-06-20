import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionId = localStorage.getItem("sessionId");

  if (sessionId) {
    return true;
  } else {
    router.navigate(["/login"]);
    return false;
  }
};
