import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAddComponent } from './investment-add.component';

describe('InvestmentAddComponent', () => {
  let component: InvestmentAddComponent;
  let fixture: ComponentFixture<InvestmentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
