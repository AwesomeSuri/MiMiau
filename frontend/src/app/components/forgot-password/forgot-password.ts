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
  isLoading = "";

  constructor(private auth: Auth){};

  onRequest() {
    this.auth.requestPasswordReset(this.email).subscribe(
       () => this.message = "Check your email box! If the account exists, your reset link is on its way."
    );
  }
}