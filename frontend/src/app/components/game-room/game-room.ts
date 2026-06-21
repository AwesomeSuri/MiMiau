import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  ){}

  ngOnInit(): void {
    this.myCats = this.catState.cats();
    this.showBox = this.catState.catCount() === 0;
  }

  onOpenBox() {
    this.catState.claimCat();
  }
}
