import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpToBuyPropertyComponent } from './help-to-buy-property.component';

describe('HelpToBuyPropertyComponent', () => {
  let component: HelpToBuyPropertyComponent;
  let fixture: ComponentFixture<HelpToBuyPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpToBuyPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpToBuyPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
