import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyLoanListComponent } from './emergency-loan-list.component';

describe('EmergencyLoanListComponent', () => {
  let component: EmergencyLoanListComponent;
  let fixture: ComponentFixture<EmergencyLoanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmergencyLoanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyLoanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
