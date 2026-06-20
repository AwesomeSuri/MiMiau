import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { anonGuard } from './guards/anon-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch: "full"},
    
    {path: "login", component: Login, canActivate: [anonGuard]},
    {path: "register", component: Register, canActivate: [anonGuard]},
    {path: "dashboard", component: Dashboard, canActivate: [authGuard]},

    {path: "**", redirectTo: "login"}
];
