import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupAddListComponent } from './user-group-add-list.component';

describe('UserGroupAddListComponent', () => {
  let component: UserGroupAddListComponent;
  let fixture: ComponentFixture<UserGroupAddListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGroupAddListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupAddListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
