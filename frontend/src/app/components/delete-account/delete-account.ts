import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './delete-account.html',
  styleUrls: [
    './delete-account.css',
    '../landing.css',
    '../change-password/change-password.css'
  ],
})
export class DeleteAccount {
  password = "";
  isLoading = false;
  errorMessage = "";

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ){}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = "";

    this.auth.deleteAccount(this.password).subscribe({
      next: () => {
        localStorage.removeItem("mimiau_jwt");
        localStorage.removeItem("mimiau_user_id");
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || "Could not delete Account.";
        this.cdr.detectChanges();
      }
    })
  }
}
