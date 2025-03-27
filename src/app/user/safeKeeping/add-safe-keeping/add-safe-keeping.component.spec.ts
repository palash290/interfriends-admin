import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSafeKeepingComponent } from './add-safe-keeping.component';

describe('AddSafeKeepingComponent', () => {
  let component: AddSafeKeepingComponent;
  let fixture: ComponentFixture<AddSafeKeepingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSafeKeepingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSafeKeepingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
