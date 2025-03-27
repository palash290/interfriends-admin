import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoanDefaultComponent } from './add-loan-default.component';

describe('AddLoanDefaultComponent', () => {
  let component: AddLoanDefaultComponent;
  let fixture: ComponentFixture<AddLoanDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLoanDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoanDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
