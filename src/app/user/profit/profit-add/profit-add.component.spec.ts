import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitAddComponent } from './profit-add.component';

describe('ProfitAddComponent', () => {
  let component: ProfitAddComponent;
  let fixture: ComponentFixture<ProfitAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
