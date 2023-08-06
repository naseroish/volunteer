import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    profilePicture: string;
    createdAt: firebase.firestore.Timestamp;
  }
