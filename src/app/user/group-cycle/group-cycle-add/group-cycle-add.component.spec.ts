import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCycleAddComponent } from './group-cycle-add.component';

describe('GroupCycleAddComponent', () => {
  let component: GroupCycleAddComponent;
  let fixture: ComponentFixture<GroupCycleAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupCycleAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCycleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
