import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupUserInfoComponent } from './edit-group-user-info.component';

describe('EditGroupUserInfoComponent', () => {
  let component: EditGroupUserInfoComponent;
  let fixture: ComponentFixture<EditGroupUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGroupUserInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
