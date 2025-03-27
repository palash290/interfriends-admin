import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitDetailComponent } from './profit-detail.component';

describe('ProfitDetailComponent', () => {
  let component: ProfitDetailComponent;
  let fixture: ComponentFixture<ProfitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
