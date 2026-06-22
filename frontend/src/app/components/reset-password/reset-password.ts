import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: '../landing.css',
})
export class ResetPassword implements OnInit {
  token: string | null = null;
  password = "";
  passwordConfirm = "";
  isLoading = false;
  message = "";
  errorMessage = "";

  constructor(
    private auth: Auth, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get("token");
    if(!this.token){
      this.errorMessage = "Reset Parameters are missing. Make sure you use the Reset Password Link to get here.";
    }
  }

  onResetPassword() {
    this.message = "";
    this.errorMessage = "";
    this.isLoading = true;

    if (this.token) {
      this.auth.resetPassword(this.token, this.password).subscribe({
        next: () => {
          this.isLoading = false;
          this.message = "You're password has been updated.";
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.error || "Your password could not be updated.";
          this.cdr.detectChanges();
        }
      })
    } else {
      this.errorMessage = "Reset Parameters are missing. Make sure you use the Reset Password Link to get here.";
    }
  }
}
