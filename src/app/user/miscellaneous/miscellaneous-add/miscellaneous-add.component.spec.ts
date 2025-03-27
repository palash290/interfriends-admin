import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousAddComponent } from './miscellaneous-add.component';

describe('MiscellaneousAddComponent', () => {
  let component: MiscellaneousAddComponent;
  let fixture: ComponentFixture<MiscellaneousAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
