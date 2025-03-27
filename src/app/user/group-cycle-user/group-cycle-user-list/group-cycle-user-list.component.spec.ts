import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCycleUserListComponent } from './group-cycle-user-list.component';

describe('GroupCycleUserListComponent', () => {
  let component: GroupCycleUserListComponent;
  let fixture: ComponentFixture<GroupCycleUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupCycleUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCycleUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
