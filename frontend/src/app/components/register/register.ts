import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  user = {
    email: "",
    password: "",
    username: ""
  };

  message = "";
  errorMessage = "";

  constructor(private auth: Auth) {  }

  onRegister() {
    this.message = "";
    this.errorMessage = "";

    this.auth.register(this.user).subscribe({
      next: (res) => {
        this.message = res.message;
      },
      error: (err) => {
        this.errorMessage = err.errror?.error || "Registration failed.";
      }
    })
  }
}
