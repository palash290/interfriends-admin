import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserPaymentComponent } from './update-user-payment.component';

describe('UpdateUserPaymentComponent', () => {
  let component: UpdateUserPaymentComponent;
  let fixture: ComponentFixture<UpdateUserPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
