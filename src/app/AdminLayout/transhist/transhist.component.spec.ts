import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranshistComponent } from './transhist.component';

describe('TranshistComponent', () => {
  let component: TranshistComponent;
  let fixture: ComponentFixture<TranshistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranshistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TranshistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
