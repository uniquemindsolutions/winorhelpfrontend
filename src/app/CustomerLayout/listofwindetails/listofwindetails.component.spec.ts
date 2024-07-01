import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofwindetailsComponent } from './listofwindetails.component';

describe('ListofwindetailsComponent', () => {
  let component: ListofwindetailsComponent;
  let fixture: ComponentFixture<ListofwindetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListofwindetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListofwindetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
