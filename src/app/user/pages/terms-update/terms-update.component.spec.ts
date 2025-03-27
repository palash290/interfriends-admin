import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsUpdateComponent } from './terms-update.component';

describe('TermsUpdateComponent', () => {
  let component: TermsUpdateComponent;
  let fixture: ComponentFixture<TermsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
