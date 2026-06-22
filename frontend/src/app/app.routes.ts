import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { anonGuard } from './guards/anon-guard';
import { authGuard } from './guards/auth-guard';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';

export const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch: "full"},
    
    {path: "login", component: Login, canActivate: [anonGuard]},
    {path: "register", component: Register, canActivate: [anonGuard]},
    {path: "forgot-password", component: ForgotPassword, canActivate: [anonGuard]},
    {path: "reset-password", component: ResetPassword, canActivate: [anonGuard]},
    {path: "dashboard", component: Dashboard, canActivate: [authGuard]},

    {path: "**", redirectTo: "login"}
];
