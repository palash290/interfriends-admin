import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubadminAddComponent } from './subadmin-add.component';

describe('SubadminAddComponent', () => {
  let component: SubadminAddComponent;
  let fixture: ComponentFixture<SubadminAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubadminAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubadminAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
