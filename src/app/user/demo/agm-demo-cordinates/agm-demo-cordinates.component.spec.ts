import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgmDemoCordinatesComponent } from './agm-demo-cordinates.component';

describe('AgmDemoCordinatesComponent', () => {
  let component: AgmDemoCordinatesComponent;
  let fixture: ComponentFixture<AgmDemoCordinatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgmDemoCordinatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgmDemoCordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
