import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPercentListComponent } from './loan-percent-list.component';

describe('LoanPercentListComponent', () => {
  let component: LoanPercentListComponent;
  let fixture: ComponentFixture<LoanPercentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanPercentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanPercentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
