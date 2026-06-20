import { ChangeDetectorRef, Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css', '../landing.css'],
})
export class Dashboard {
  errorMessage = "";
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  onLogout() {
    this.isLoading = true;
    this.errorMessage = "";

    this.auth.logout().subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || "Logout failed.";
        this.cdr.detectChanges();
      }
    });
  }
}
