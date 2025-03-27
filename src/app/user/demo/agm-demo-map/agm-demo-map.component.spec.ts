import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgmDemoMapComponent } from './agm-demo-map.component';

describe('AgmDemoMapComponent', () => {
  let component: AgmDemoMapComponent;
  let fixture: ComponentFixture<AgmDemoMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgmDemoMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgmDemoMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
