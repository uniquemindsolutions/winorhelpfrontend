import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnerpercentageComponent } from './winnerpercentage.component';

describe('WinnerpercentageComponent', () => {
  let component: WinnerpercentageComponent;
  let fixture: ComponentFixture<WinnerpercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinnerpercentageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WinnerpercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
