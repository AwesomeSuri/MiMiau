import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatState } from '@services/cat-state';

@Component({
  selector: 'app-cat-detail-card',
  imports: [CommonModule],
  templateUrl: './cat-detail-card.html',
  styleUrls: ['./cat-detail-card.css', "../gacha-overlay/gacha-overlay.css"],
})
export class CatDetailCard {
  @Input() cat: any | null = null; maxStars = 0;

  constructor(public catState: CatState) { }

  ngOnInit(): void {
    this.maxStars = this.cat.facts.length;
  }

  getStars(): boolean[] {
    return Array(this.maxStars).fill(false).map((_, i) => this.cat.level > i);
  }

  getFacts(): string[] {
    return Array(this.maxStars).fill("❓").map((text, i) => this.cat.level > i ? this.cat.facts[i] : text);
  }
}
