import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-overview',
  imports: [RouterModule, CommonModule],
  templateUrl: './profile-overview.html',
  styleUrl: './profile-overview.css',
})
export class ProfileOverview implements OnInit{
  username = "";

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.username = this.auth.getUsername();
  }

  onLogout() {
    this.auth.logout().subscribe({
      next: () => {
        localStorage.removeItem("mimiau_jwt");
        localStorage.removeItem("mimiau_user_id");
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        console.error("Could not logout.", err);
      }
    })
  }
}
