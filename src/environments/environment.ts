// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://interfriends.uk/interfriendsApp/Api/Admin',
  // apiUrl: 'https://www.creativethoughtsinfo.com/CT01/interfriends_admin/Api/Admin',

  // apiUrl :'http://stlsmap.com/CT01/interfriends/Api/Admin',

  // apiUrl: 'http://192.168.1.138/interfriendsApp/Api/Admin',
  firebase: {
    apiKey: "AIzaSyAMUPRiRPReoYc17c8V9Tz2OigkMA-Q7gk",
    authDomain: "irate-web.firebaseapp.com",
    projectId: "irate-web",
    storageBucket: "irate-web.appspot.com",
    messagingSenderId: "903775577594",
    appId: "1:903775577594:web:3a8e0d922d09389481b043",
    measurementId: "G-YENMEJM9WE"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
