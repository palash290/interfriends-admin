import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgmSearchMapComponent } from './agm-search-map.component';

describe('AgmSearchMapComponent', () => {
  let component: AgmSearchMapComponent;
  let fixture: ComponentFixture<AgmSearchMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgmSearchMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgmSearchMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
