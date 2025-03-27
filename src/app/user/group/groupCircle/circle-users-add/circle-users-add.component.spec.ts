import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleUsersAddComponent } from './circle-users-add.component';

describe('CircleUsersAddComponent', () => {
  let component: CircleUsersAddComponent;
  let fixture: ComponentFixture<CircleUsersAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleUsersAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleUsersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
