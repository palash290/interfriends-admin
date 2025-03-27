import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMiscellaneousPaymentComponent } from './add-miscellaneous-payment.component';

describe('AddMiscellaneousPaymentComponent', () => {
  let component: AddMiscellaneousPaymentComponent;
  let fixture: ComponentFixture<AddMiscellaneousPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMiscellaneousPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMiscellaneousPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
