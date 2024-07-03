import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnersdataDetailComponent } from './winnersdata-detail.component';

describe('WinnersdataDetailComponent', () => {
  let component: WinnersdataDetailComponent;
  let fixture: ComponentFixture<WinnersdataDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinnersdataDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WinnersdataDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
