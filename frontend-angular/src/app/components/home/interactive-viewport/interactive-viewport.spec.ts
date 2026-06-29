import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveViewport } from './interactive-viewport';

describe('InteractiveViewport', () => {
  let component: InteractiveViewport;
  let fixture: ComponentFixture<InteractiveViewport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveViewport],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveViewport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
