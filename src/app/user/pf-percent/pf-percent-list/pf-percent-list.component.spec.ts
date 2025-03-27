import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfPercentListComponent } from './pf-percent-list.component';

describe('PfPercentListComponent', () => {
  let component: PfPercentListComponent;
  let fixture: ComponentFixture<PfPercentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfPercentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfPercentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
