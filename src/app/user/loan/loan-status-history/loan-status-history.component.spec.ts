import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanStatusHistoryComponent } from './loan-status-history.component';

describe('LoanStatusHistoryComponent', () => {
  let component: LoanStatusHistoryComponent;
  let fixture: ComponentFixture<LoanStatusHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanStatusHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanStatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
