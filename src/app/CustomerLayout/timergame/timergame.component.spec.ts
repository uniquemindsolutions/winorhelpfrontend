import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimergameComponent } from './timergame.component';

describe('TimergameComponent', () => {
  let component: TimergameComponent;
  let fixture: ComponentFixture<TimergameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimergameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimergameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
