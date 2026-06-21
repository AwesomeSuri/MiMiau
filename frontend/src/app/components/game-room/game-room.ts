import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CatState } from '../../services/cat-state';

@Component({
  selector: 'app-game-room',
  imports: [CommonModule],
  templateUrl: './game-room.html',
  styleUrl: './game-room.css',
})
export class GameRoom {  

  constructor(
    public catState: CatState,
  ){}

  onOpenBox() {
    this.catState.claimCat();
  }
}
