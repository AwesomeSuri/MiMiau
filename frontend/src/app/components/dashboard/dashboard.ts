import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InteractiveViewport } from '../interactive-viewport/interactive-viewport';
import { GameRoom } from '../game-room/game-room';
import { environment } from '../../../environments/environment.development';
import { CatState } from '../../services/cat-state';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, InteractiveViewport, GameRoom],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css', '../landing.css'],
})
export class Dashboard implements OnInit {  
  errorMessage = "";
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private catState: CatState
  ) { }

  ngOnInit(): void {
    this.catState.fetchMyCats();
  }

  onLogout() {
    this.isLoading = true;
    this.errorMessage = "";

    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || "Logout failed.";
        this.cdr.detectChanges();
      }
    });
  }
}
