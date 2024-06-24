import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MastervalueComponent } from './mastervalue.component';

describe('MastervalueComponent', () => {
  let component: MastervalueComponent;
  let fixture: ComponentFixture<MastervalueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MastervalueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MastervalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
