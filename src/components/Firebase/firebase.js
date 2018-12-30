import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyC7ETcq1FLFGKY8yhEsjanA5fg1zi8Rxy0",
    authDomain: "new-year-list.firebaseapp.com",
    databaseURL: "https://new-year-list.firebaseio.com",
    projectId: "new-year-list",
    storageBucket: "new-year-list.appspot.com",
    messagingSenderId: "810166356481"
};

firebase.initializeApp(config);

export default firebase;

export const auth = firebase.auth();
export const database = firebase.database();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
googleAuthProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

