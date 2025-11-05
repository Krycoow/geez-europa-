// Configure database provider here.
// To enable Firestore:
// 1) Create a Firebase project → Web app
// 2) Copy the config below and set DB_PROVIDER = 'firestore'
// 3) Deploy; quotes will be stored in the 'quotes' collection

window.DB_PROVIDER = window.DB_PROVIDER || 'local'; // 'firestore' | 'local'

window.FIREBASE_CONFIG = window.FIREBASE_CONFIG || {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};


