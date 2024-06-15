import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditdbitComponent } from './creditdbit.component';

describe('CreditdbitComponent', () => {
  let component: CreditdbitComponent;
  let fixture: ComponentFixture<CreditdbitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditdbitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditdbitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
