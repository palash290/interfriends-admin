import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeKeepingWithdralRequestComponent } from './safe-keeping-withdral-request.component';

describe('SafeKeepingWithdralRequestComponent', () => {
  let component: SafeKeepingWithdralRequestComponent;
  let fixture: ComponentFixture<SafeKeepingWithdralRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeKeepingWithdralRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeKeepingWithdralRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
