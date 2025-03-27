import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpToPayccComponent } from './help-to-paycc.component';

describe('HelpToPayccComponent', () => {
  let component: HelpToPayccComponent;
  let fixture: ComponentFixture<HelpToPayccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpToPayccComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpToPayccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
