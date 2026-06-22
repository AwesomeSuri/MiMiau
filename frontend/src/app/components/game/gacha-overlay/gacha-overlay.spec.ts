import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GachaOverlay } from './gacha-overlay';

describe('GachaOverlay', () => {
  let component: GachaOverlay;
  let fixture: ComponentFixture<GachaOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GachaOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(GachaOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
