import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatterygameComponent } from './latterygame.component';

describe('LatterygameComponent', () => {
  let component: LatterygameComponent;
  let fixture: ComponentFixture<LatterygameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatterygameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LatterygameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
