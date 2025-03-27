import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyLoanAddComponent } from './emergency-loan-add.component';

describe('EmergencyLoanAddComponent', () => {
  let component: EmergencyLoanAddComponent;
  let fixture: ComponentFixture<EmergencyLoanAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmergencyLoanAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyLoanAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
