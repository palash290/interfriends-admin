import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousDefaultComponent } from './miscellaneous-default.component';

describe('MiscellaneousDefaultComponent', () => {
  let component: MiscellaneousDefaultComponent;
  let fixture: ComponentFixture<MiscellaneousDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
