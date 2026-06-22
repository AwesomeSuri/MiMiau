import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: '../landing.css',
})
export class Login {
  email = "";
  password = "";

  errorMessage = "";
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  onLogin() {
    this.errorMessage = "";
    this.isLoading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(["/dashboard"])
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "Login failed. Please check your credentials."
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    })
  }
}
