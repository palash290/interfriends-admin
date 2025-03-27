import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCycleStatusHistoryComponent } from './group-cycle-status-history.component';

describe('GroupCycleStatusHistoryComponent', () => {
  let component: GroupCycleStatusHistoryComponent;
  let fixture: ComponentFixture<GroupCycleStatusHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupCycleStatusHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCycleStatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
