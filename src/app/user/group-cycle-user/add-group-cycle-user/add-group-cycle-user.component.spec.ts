import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupCycleUserComponent } from './add-group-cycle-user.component';

describe('AddGroupCycleUserComponent', () => {
  let component: AddGroupCycleUserComponent;
  let fixture: ComponentFixture<AddGroupCycleUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGroupCycleUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupCycleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
