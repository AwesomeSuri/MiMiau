import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { Auth } from '@services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css', '../landing.css'],
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
  sendCodeErrorMessage = "";
  isLoading = false;

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  sendCode() {
    this.isSendingCode = true;
    this.sendCodeErrorMessage = "";

    this.auth.sendVerificationCode(this.email).subscribe({
      next: (res) => {
        this.isSendingCode = false;
        this.receivedVerificationToken = res.verificationToken;
        this.sendCodeErrorMessage = "";
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSendingCode = false;
        this.cdr.detectChanges();
        this.sendCodeErrorMessage = err.error?.error || "Code could not be sent.";
      }
    })
  }

  onRegister() {
    this.errorMessage = "";
    this.isLoading = true;

    this.auth.register(this.username, this.email, this.password, this.verificationCode, this.receivedVerificationToken).subscribe({
      next: () => {
        this.auth.login(this.email, this.password).subscribe({
          next: () => {
            this.router.navigate(["/dashboard"]);
          }
        });
      },
      error: (err) => {
        if(typeof err.error?.error === "string"){
          this.errorMessage = err.error.error;
        } else if(err.error?.error?.code) {
          const code = err.error?.error?.code;
          if (code) {
            switch (code) {
              case "ER_DUP_ENTRY":
                this.errorMessage = "This email address is already in use.";
                break;
              default:
                this.errorMessage = "Registration failed with unknown code.";
            }
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
