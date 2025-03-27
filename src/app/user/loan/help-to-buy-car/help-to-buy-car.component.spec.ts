import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpToBuyCarComponent } from './help-to-buy-car.component';

describe('HelpToBuyCarComponent', () => {
  let component: HelpToBuyCarComponent;
  let fixture: ComponentFixture<HelpToBuyCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpToBuyCarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpToBuyCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
