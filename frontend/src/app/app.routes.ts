import { Routes } from '@angular/router';
import { Dashboard } from './components/home/dashboard/dashboard';
import { anonGuard } from './guards/anon-guard';
import { authGuard } from './guards/auth-guard';
import { ProfileOverview } from './components/profile/profile-overview/profile-overview';
import { ChangePassword } from './components/profile/change-password/change-password';
import { DeleteAccount } from './components/profile/delete-account/delete-account';
import { ForgotPassword } from './components/landing/forgot-password/forgot-password';
import { Login } from './components/landing/login/login';
import { Register } from './components/landing/register/register';
import { ResetPassword } from './components/landing/reset-password/reset-password';

export const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch: "full"},
    
    {path: "login", component: Login, canActivate: [anonGuard]},
    {path: "register", component: Register, canActivate: [anonGuard]},
    {path: "forgot-password", component: ForgotPassword, canActivate: [anonGuard]},
    {path: "reset-password", component: ResetPassword, canActivate: [anonGuard]},
    {path: "dashboard", component: Dashboard, canActivate: [authGuard]},
    {path: "profile", component: ProfileOverview, canActivate: [authGuard]},
    {path: "profile/change-password", component: ChangePassword, canActivate: [authGuard]},
    {path: "profile/delete-account", component: DeleteAccount, canActivate: [authGuard]},

    {path: "**", redirectTo: "login"}
];
