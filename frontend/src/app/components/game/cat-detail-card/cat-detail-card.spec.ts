import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatDetailCard } from './cat-detail-card';

describe('CatDetailCard', () => {
  let component: CatDetailCard;
  let fixture: ComponentFixture<CatDetailCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatDetailCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CatDetailCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
