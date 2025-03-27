import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleUsersComponent } from './circle-users.component';

describe('CircleUsersComponent', () => {
  let component: CircleUsersComponent;
  let fixture: ComponentFixture<CircleUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
