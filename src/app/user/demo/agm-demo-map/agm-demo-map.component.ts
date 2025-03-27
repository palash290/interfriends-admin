import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agm-demo-map',
  templateUrl: './agm-demo-map.component.html',
  styleUrls: ['./agm-demo-map.component.css']
})
export class AgmDemoMapComponent implements OnInit {
  lat = 51.678418;
  lng = 7.809007;

  constructor() { }

  ngOnInit(): void { }

}
