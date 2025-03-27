import { Component, OnInit } from '@angular/core';
import { InfoWindow } from '@agm/core/services/google-maps-types'

@Component({
  selector: 'app-agm-demo-direction',
  templateUrl: './agm-demo-direction.component.html',
  styleUrls: ['./agm-demo-direction.component.css']
})
export class AgmDemoDirectionComponent implements OnInit {
  lat = 22.7227319;
  lng = 75.8848823;

  infoWindow: InfoWindow = undefined;
  origin = {};
  destination = {};
  waypoints : any[] = [];
  markerOptions = {};
  renderOptions = {
    suppressMarkers: true,
  }



  constructor() { }

  ngOnInit(): void {
    this.getDirection();
  }


  getDirection() {
    this.origin = { lat: 22.7227319, lng: 75.8848823 };
    this.destination = { lat: 22.7552769, lng: 75.8879944 };
    this.waypoints = [
      {
        location: { lat: 22.7336945, lng: 75.8879279 },
        stopover: false,
      },
      {
        location: { lat: 22.7441256, lng: 75.8918344 },
        stopover: false,
      }, {
        location: { lat: 22.7529441, lng: 75.8915147 },
        stopover: false,
      }
    ];


    this.markerOptions = {
      origin: {
        infoWindow: `
        <div>
          <h3>Origin</h3>
          <div>
            <p>Shekhar central, AB Road, Manorama Ganj, Indore, Madhya Pradesh</p>
          </div>
        </div>`,
        icon: 'assets/img/map/mark-blue.png',
      },
      destination: {
        infoWindow: `
        <div>
          <h3>Destination</h3>
          <div>
            <p>Shri Satyasai School Square, Scheme No 54, Indore, Madhya Pradesh</p>
          </div>
        </div>`,
        icon: 'assets/img/map/mark-green.png',
      },
      waypoints: [
        {
          infoWindow: `
          <div>
            <h3>Stop 1</h3>
            <div>
              <p>LIG Square, Rss Nagar, Indore, Madhya Pradesh</p>
            </div>
          </div>`,
          label: '1',
        }, {
          infoWindow: `
          <div>
            <h3>Stop 2</h3>
            <div>
              <p>C21 Mall, AB Road, Scheme 54 PU4, Indore, Madhya Pradesh</p>
            </div>
          </div>`,
          label: '2',
        },
        {
          infoWindow: `
          <div>
            <h3>Stop 3</h3>
            <div>
              <p>Vijay Nagar, Indore, Madhya Pradesh</p>
            </div>
          </div>`,
          label: '3',
        }
      ]
    };
  }

 obtainInfowindow(window: InfoWindow) {
    this.infoWindow = window
  }

}
