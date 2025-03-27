import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyUpdateComponent } from './privacy-policy-update.component';

describe('PrivacyPolicyUpdateComponent', () => {
  let component: PrivacyPolicyUpdateComponent;
  let fixture: ComponentFixture<PrivacyPolicyUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPolicyUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
