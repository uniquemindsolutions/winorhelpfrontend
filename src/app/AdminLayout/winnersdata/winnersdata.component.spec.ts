import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnersdataComponent } from './winnersdata.component';

describe('WinnersdataComponent', () => {
  let component: WinnersdataComponent;
  let fixture: ComponentFixture<WinnersdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinnersdataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WinnersdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
