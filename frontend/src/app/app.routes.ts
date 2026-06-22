import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { anonGuard } from './guards/anon-guard';
import { authGuard } from './guards/auth-guard';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { ProfileOverview } from './components/profile-overview/profile-overview';
import { ChangePassword } from './components/change-password/change-password';
import { DeleteAccount } from './components/delete-account/delete-account';

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
