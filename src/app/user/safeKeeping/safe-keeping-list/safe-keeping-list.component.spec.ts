import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeKeepingListComponent } from './safe-keeping-list.component';

describe('SafeKeepingListComponent', () => {
  let component: SafeKeepingListComponent;
  let fixture: ComponentFixture<SafeKeepingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeKeepingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeKeepingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
