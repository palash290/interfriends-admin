import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousStatusHistoryComponent } from './miscellaneous-status-history.component';

describe('MiscellaneousStatusHistoryComponent', () => {
  let component: MiscellaneousStatusHistoryComponent;
  let fixture: ComponentFixture<MiscellaneousStatusHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousStatusHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousStatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
