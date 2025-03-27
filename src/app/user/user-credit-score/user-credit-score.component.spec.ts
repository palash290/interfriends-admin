import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreditScoreComponent } from './user-credit-score.component';

describe('UserCreditScoreComponent', () => {
  let component: UserCreditScoreComponent;
  let fixture: ComponentFixture<UserCreditScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCreditScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreditScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
