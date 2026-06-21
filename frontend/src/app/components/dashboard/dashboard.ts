import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InteractiveViewport } from '../interactive-viewport/interactive-viewport';
import { GameRoom } from '../game-room/game-room';
import { CatState } from '../../services/cat-state';
import { GachaOverlay } from '../gacha-overlay/gacha-overlay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, InteractiveViewport, GameRoom, GachaOverlay],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css', '../landing.css'],
})
export class Dashboard implements OnInit {  
  private apiUrl = environment.apiUrl;

  errorMessage = "";
  isLoading = false;

  gachaCat: any | null = null;
  overflowCat = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private catState: CatState,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.catState.fetchMyCats();
  }
  
  closeOverlay() {
    this.gachaCat = null;
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
