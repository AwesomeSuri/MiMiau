import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./forgot-password.html",
  styleUrl: "../landing.css"
})
export class ForgotPassword {
  $apiUrl = environment.phpApiUrl;

  email = "";
  message = "";
  errorMessage = "";
  isLoading = false;

  constructor(private auth: Auth){};

  onRequest() {
    this.message = "";
    this.errorMessage = "";
    this.isLoading = true;

    this.auth.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.message = "Check your email box! If the account exists, your reset link is on its way."
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || "Failed to send a request."
      }
    }
    );
  }
}