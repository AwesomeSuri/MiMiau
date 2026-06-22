import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CatState } from '../../../services/cat-state';
import { CatsCatalog } from '../../../services/cats-catalog';
import { CatDetailCard } from '../../game/cat-detail-card/cat-detail-card';
import { GachaOverlay } from '../../game/gacha-overlay/gacha-overlay';
import { GameRoom } from '../../game/game-room/game-room';
import { InteractiveViewport } from '../interactive-viewport/interactive-viewport';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule, 
    RouterModule,
    InteractiveViewport, 
    GameRoom, 
    GachaOverlay, 
    CatDetailCard, 
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css', '../landing.css'],
})
export class Dashboard implements OnInit {  
  private catsCatalogService = inject(CatsCatalog);

  errorMessage = "";
  isLoading = false;

  public catsCatalog = this.catsCatalogService.catalog;

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public catState: CatState,
  ) { }


  ngOnInit(): void {
    this.catState.fetchMyCats();
    this.catsCatalogService.fetchCatalog().subscribe();
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
