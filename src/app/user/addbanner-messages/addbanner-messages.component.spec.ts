import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbannerMessagesComponent } from './addbanner-messages.component';

describe('AddbannerMessagesComponent', () => {
  let component: AddbannerMessagesComponent;
  let fixture: ComponentFixture<AddbannerMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddbannerMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbannerMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
