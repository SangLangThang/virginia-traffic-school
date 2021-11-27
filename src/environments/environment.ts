// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  BASE_URL_SIGNUP:
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=",
  BASE_URL_LOGIN:
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=",
  BASE_URL_USER:
    "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=",
  API_KEY: "AIzaSyBK9Q-HdSH40UWWaKEib8gMN80_FozBvFE",

  BASE_URL_DATABASE:
    "https://virginia-traffic-school-default-rtdb.asia-southeast1.firebasedatabase.app",
  BASE_URL_USERS:
    "https://virginia-traffic-school-default-rtdb.asia-southeast1.firebasedatabase.app/users",
  firebase: {
    apiKey: "AIzaSyBK9Q-HdSH40UWWaKEib8gMN80_FozBvFE",
    authDomain: "virginia-traffic-school.firebaseapp.com",
    databaseURL:
      "https://virginia-traffic-school-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "virginia-traffic-school",
    storageBucket: "virginia-traffic-school.appspot.com",
    messagingSenderId: "28202837301",
    appId: "1:28202837301:web:36f5ac5e442a09f67fd87c",
  },
};
