import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: '../landing.css',
})
export class Login {
  credentials = {
    email: "",
    password: ""
  }

  message = "";
  errorMessage = "";
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin(){
    this.message = "";
    this.errorMessage = "";
    this.isLoading = true;

    this.auth.login(this.credentials).subscribe({
      next: (res) => {
        this.message = "Login successful! Welcome back 🐾";
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "Login failed. Please check your credentials."
        this.isLoading = false;
        this.cdr. detectChanges();
      }
    })
  }
}
