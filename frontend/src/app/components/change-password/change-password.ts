import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css', '../landing.css'],
})
export class ChangePassword {
  currentPassword = "";
  newPassword = "";
  confirmPassword = "";

  isLoading = false;
  message = "";
  errorMessage = "";

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ){}

  onSubmit() {
    this.isLoading = true;
    this.message = "";
    this.errorMessage = "";

    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.message = "Password has been updated."
        this.currentPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "Could not update password."
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    })
  }
}
