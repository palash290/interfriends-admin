import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUserDetailComponent } from './single-user-detail.component';

describe('SingleUserDetailComponent', () => {
  let component: SingleUserDetailComponent;
  let fixture: ComponentFixture<SingleUserDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleUserDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
