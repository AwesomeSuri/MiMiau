import { ChangeDetectorRef, Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: '../landing.css',
})
export class Register {
  user = {
    email: "",
    password: "",
    username: ""
  };

  errorMessage = "";
  isLoading = false;

  constructor(private auth: Auth, private cdr: ChangeDetectorRef) { }

  onRegister() {
    this.errorMessage = "";
    this.isLoading = true;

    this.auth.register(this.user).subscribe({
      next: () => {
        this.auth.login(this.user);
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
