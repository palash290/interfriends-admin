import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCycleListComponent } from './group-cycle-list.component';

describe('GroupCycleListComponent', () => {
  let component: GroupCycleListComponent;
  let fixture: ComponentFixture<GroupCycleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupCycleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCycleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
