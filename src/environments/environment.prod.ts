import { firebaseConfig } from './firebase.local';

export const environment = {
  production: true,
  apiUrl: 'http://localhost:3333',
  frontendUrl: 'http://localhost:4200',
  firebase: firebaseConfig
};
