import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofwinComponent } from './listofwin.component';

describe('ListofwinComponent', () => {
  let component: ListofwinComponent;
  let fixture: ComponentFixture<ListofwinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListofwinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListofwinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
