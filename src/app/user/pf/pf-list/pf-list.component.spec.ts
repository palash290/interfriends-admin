import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfListComponent } from './pf-list.component';

describe('PfListComponent', () => {
  let component: PfListComponent;
  let fixture: ComponentFixture<PfListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
