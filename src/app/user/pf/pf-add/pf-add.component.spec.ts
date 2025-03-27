import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfAddComponent } from './pf-add.component';

describe('PfAddComponent', () => {
  let component: PfAddComponent;
  let fixture: ComponentFixture<PfAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
