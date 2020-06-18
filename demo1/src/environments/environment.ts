// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isMockEnabled: true, // You have to switch this, when your real back-end is done
  authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
  baseUrl:'http://localhost:5010/gerenciamento-revendas',
  firebase : {
    apiKey: "AIzaSyAg18M89vyn0ipBa3saWYKlwpvontETApQ",
    authDomain: "lia-app-e4bf0.firebaseapp.com",
    databaseURL: "https://lia-app-e4bf0.firebaseio.com",
    projectId: "lia-app-e4bf0",
    storageBucket: "lia-app-e4bf0.appspot.com",
    messagingSenderId: "490237104479",
    appId: "1:490237104479:web:086fb2ba9272db43a3a6ea",
    measurementId: "G-5EQ0CH2516"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
