import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-gacha-overlay',
  imports: [CommonModule],
  templateUrl: './gacha-overlay.html',
  styleUrl: './gacha-overlay.css',
})
export class GachaOverlay implements OnInit {
  @Input() cat: any | null = null;
  @Input() overflow = false;
  @Output() close = new EventEmitter<void>();

  maxStars = 0;

  ngOnInit(): void {
    this.maxStars = this.cat.facts.length;
  }

  getTitle(): string {
    if (this.cat.level === 1) {
      return "✨ NEW CAT ✨";
    } else if (this.cat.level > this.cat.facts.length) {
      return "🐱 ALREADY MAXED 🐱";
    } else {
      return "✨ CAT STAR UP ✨";
    }
  }

  getStars(): boolean[] {
    return Array(this.maxStars).fill(false).map((_, i) => this.cat.level > i);
  }

  getFacts(): string[] {
    return Array(this.maxStars).fill("❓").map((text, i) => this.cat.level > i ? this.cat.facts[i] : text);
  }
}
