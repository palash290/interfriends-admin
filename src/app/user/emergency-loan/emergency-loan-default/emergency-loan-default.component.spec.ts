import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyLoanDefaultComponent } from './emergency-loan-default.component';

describe('EmergencyLoanDefaultComponent', () => {
  let component: EmergencyLoanDefaultComponent;
  let fixture: ComponentFixture<EmergencyLoanDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmergencyLoanDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyLoanDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
