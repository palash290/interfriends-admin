import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUserGroupListComponent } from './single-user-group-list.component';

describe('SingleUserGroupListComponent', () => {
  let component: SingleUserGroupListComponent;
  let fixture: ComponentFixture<SingleUserGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleUserGroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleUserGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
