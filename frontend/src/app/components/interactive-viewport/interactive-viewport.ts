import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-interactive-viewport',
  imports: [CommonModule],
  templateUrl: './interactive-viewport.html',
  styleUrl: './interactive-viewport.css',
})
export class InteractiveViewport implements OnInit {
  scale = 1;
  translateX = 0;
  translateY = 0;
  isDragging = false;
  startX = 0;
  startY = 0;

  ngOnInit(): void {
    this.centerView();
  }

  isCentered(): boolean {
    return this.scale === 1
      && this.translateX === 0
      && this.translateY === 0
  }

  centerView() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

  onWheel(event: WheelEvent){
    event.preventDefault();
    const zoomFactor = 0.1;
    if(event.deltaY < 0) {
      this.scale = Math.min(this.scale + zoomFactor, 3);
    } else {
      this.scale = Math.max(this.scale - zoomFactor, 0.4);
    }
  }

  onMouseDown(event: MouseEvent) {
    if(event.button !== 0) return;
    this.isDragging = true;
    this.startX = event.clientX - this.translateX;
    this.startY = event.clientY - this.translateY;
  }

  @HostListener("window:mousemove", ["$event"])
  onMouseMove(event: MouseEvent){
    if(!this.isDragging) return;
    this.translateX = event.clientX - this.startX;
    this.translateY = event.clientY - this.startY;
  }

  @HostListener("window:mouseup")
  onMouseUp() {
    this.isDragging = false;
  }

  private lastTouchDist = 0;
  private getTouchDistance(event: TouchEvent): number {
    return Math.hypot(
      event.touches[0].clientX - event.touches[1].clientX,
      event.touches[0].clientY - event.touches[1].clientY,
    )
  }

  onTouchStart(event: TouchEvent){
    if(event.touches.length === 1){
      this.isDragging = true;
      this.startX = event.touches[0].clientX - this.translateX;
      this.startY = event.touches[0].clientY - this.translateY;
    } else if(event.touches.length === 2){
      this.isDragging = false;
      this.lastTouchDist = this.getTouchDistance(event);
    }
  }

  onTouchMove(event: TouchEvent){
    if(this.isDragging && event.touches.length === 1){
      this.translateX = event.touches[0].clientX - this.startX;
      this.translateY = event.touches[0].clientY - this.startY;
    } else if ( event.touches.length === 2){
      const dist = this.getTouchDistance(event);
      const factor = dist / this.lastTouchDist;
      this.scale = Math.max(0.4, Math.min(this.scale * factor, 3));
      this.lastTouchDist = dist;
    }
  }

  onTouchEnd() {
    this.isDragging = false;
  }
}
