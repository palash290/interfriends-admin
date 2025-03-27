import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedUserDetailComponent } from './grouped-user-detail.component';

describe('GroupedUserDetailComponent', () => {
  let component: GroupedUserDetailComponent;
  let fixture: ComponentFixture<GroupedUserDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupedUserDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
