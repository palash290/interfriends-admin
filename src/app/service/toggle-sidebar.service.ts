import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleSidebarService {

  toggleChange: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  setToggle( toggle : boolean)
  {
    this.toggleChange.emit(toggle);
  }
}
