// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: 'http://localhost:3000/api/',
  firebase: {
    apiKey: 'AIzaSyAHFs6hKyfyv7xnSafDLvT3x4tmb5ks8rs',
    authDomain: 'justwrite-dd5cc.firebaseapp.com',
    databaseURL: 'https://justwrite-dd5cc-default-rtdb.firebaseio.com',
    projectId: 'justwrite-dd5cc',
    storageBucket: 'justwrite-dd5cc.appspot.com',
    messagingSenderId: '336083107302',
    appId: '1:336083107302:web:185f3b5f6d757246c1ea27',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
