import { Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-agm-search-map',
  templateUrl: './agm-search-map.component.html',
  styleUrls: ['./agm-search-map.component.css']
})
export class AgmSearchMapComponent implements OnInit {
  @ViewChild('search', {static: true}) private searchElementRef: ElementRef;
  form: FormGroup;


  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  geoCoder: any;
  locationChosen = false;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      address: new FormControl('', { validators: [Validators.required] })
    });


    // load Places Autocomplete start

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new window['google'].maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          console.log(this.latitude);
          console.log(this.longitude);
          this.zoom = 16;
        });
      });
    });

    // load Places Autocomplete end
  }


  // Get Current Location Coordinates start

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  // Get Current Location Coordinates end

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }


  getAddress(latitude: number, longitude: number) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: string) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }



  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid ) {
      return;
    }

    console.log(this.latitude.toString(), 'latitude');
    console.log(this.longitude.toString(), 'longitude');
    console.log(this.address, 'address');
  }


}
