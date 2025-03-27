import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpToPayCarInsuraneComponent } from './help-to-pay-car-insurane.component';

describe('HelpToPayCarInsuraneComponent', () => {
  let component: HelpToPayCarInsuraneComponent;
  let fixture: ComponentFixture<HelpToPayCarInsuraneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpToPayCarInsuraneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpToPayCarInsuraneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
