import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CatState } from '../../services/cat-state';

@Component({
  selector: 'app-game-room',
  imports: [CommonModule],
  templateUrl: './game-room.html',
  styleUrl: './game-room.css',
})
export class GameRoom implements OnInit {  
  myCats: any[] = [];
  showBox = false;

  constructor(
    private catState: CatState,
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.myCats = this.catState.cats();
    this.showBox = this.catState.catCount() === 0;
  }

  onOpenBox() {
  }
}
