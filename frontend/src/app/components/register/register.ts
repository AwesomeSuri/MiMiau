import { ChangeDetectorRef, Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: '../landing.css',
})
export class Register {
  apiUrl = environment.phpApiUrl;

  username = "";
  email = "";
  verificationCode = "";
  receivedVerificationToken = "";
  isSendingCode = false;
  password = "";
  passwordConfirm = "";

  errorMessage = "";
  isLoading = false;

  constructor(
    private auth: Auth, 
    private cdr: ChangeDetectorRef, 
    private router: Router,
    private http: HttpClient,
  ) { }

  sendCode() {
    this.isSendingCode = true;
    this.auth.sendVerificationCode(this.email).subscribe({
      next: (res) => {
        this.isSendingCode = false;
        this.receivedVerificationToken = res.verificationToken;
      },
      error: (err) => {
        this.isSendingCode = false;
        console.error("Verification code could not be sent:", err);
      }
    })
  }

  onRegister() {
    this.errorMessage = "";
    this.isLoading = true;

    this.auth.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.auth.login(this.email, this.password).subscribe({
          next: () => {
            this.router.navigate(["/dashboard"]);
          }
        });
      },
      error: (err) => {
        var code = err.error?.error?.code
        if (code) {
          switch (code) {
            case "ER_DUP_ENTRY":
              this.errorMessage = "This email address is already in use.";
              break;
            default:
              this.errorMessage = "Registration failed with unknown code.";
          }
        } else {
          this.errorMessage = "Registration failed.";
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    })
  }
}
