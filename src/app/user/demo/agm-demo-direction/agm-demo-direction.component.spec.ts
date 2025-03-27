import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgmDemoDirectionComponent } from './agm-demo-direction.component';

describe('AgmDemoDirectionComponent', () => {
  let component: AgmDemoDirectionComponent;
  let fixture: ComponentFixture<AgmDemoDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgmDemoDirectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgmDemoDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
