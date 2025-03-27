import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPercentAddComponent } from './loan-percent-add.component';

describe('LoanPercentAddComponent', () => {
  let component: LoanPercentAddComponent;
  let fixture: ComponentFixture<LoanPercentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanPercentAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanPercentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
