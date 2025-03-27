import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfPercentAddComponent } from './pf-percent-add.component';

describe('PfPercentAddComponent', () => {
  let component: PfPercentAddComponent;
  let fixture: ComponentFixture<PfPercentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfPercentAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfPercentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
