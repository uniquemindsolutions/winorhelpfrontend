import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrareqComponent } from './withdrareq.component';

describe('WithdrareqComponent', () => {
  let component: WithdrareqComponent;
  let fixture: ComponentFixture<WithdrareqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrareqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WithdrareqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
