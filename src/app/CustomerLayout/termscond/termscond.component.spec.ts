import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermscondComponent } from './termscond.component';

describe('TermscondComponent', () => {
  let component: TermscondComponent;
  let fixture: ComponentFixture<TermscondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermscondComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TermscondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
