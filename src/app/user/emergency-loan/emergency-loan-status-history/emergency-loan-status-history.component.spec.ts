import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyLoanStatusHistoryComponent } from './emergency-loan-status-history.component';

describe('EmergencyLoanStatusHistoryComponent', () => {
  let component: EmergencyLoanStatusHistoryComponent;
  let fixture: ComponentFixture<EmergencyLoanStatusHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmergencyLoanStatusHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyLoanStatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
