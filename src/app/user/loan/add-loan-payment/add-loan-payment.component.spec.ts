import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoanPaymentComponent } from './add-loan-payment.component';

describe('AddLoanPaymentComponent', () => {
  let component: AddLoanPaymentComponent;
  let fixture: ComponentFixture<AddLoanPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLoanPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoanPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
