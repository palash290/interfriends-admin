import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendUserListComponent } from './recommend-user-list.component';

describe('RecommendUserListComponent', () => {
  let component: RecommendUserListComponent;
  let fixture: ComponentFixture<RecommendUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
