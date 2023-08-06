import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, from, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GoogleAuthProvider, AuthProvider } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  signup(params: SignUp): Observable<any> {
    return from(this.auth.createUserWithEmailAndPassword(
      params.email, params.password
    )).pipe(
      switchMap((userCredential) => {
        const { user } = userCredential;
        if (user) {
          // Update the user document with the email field
          return this.firestore.collection('users').doc(user.uid).set({ email: params.email }, { merge: true }).then(() => {
            // Return any data or confirmation if needed
            return // ...
          });
        } else {
          throw new Error('User not found');
        }
      }),
      catchError((error: FirebaseError) =>
        throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
      )
    );
  }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  private AuthLogin(provider: AuthProvider): Promise<void> {
    return this.auth.signInWithPopup(provider)
      .then((result) => {
        console.log('You have been successfully logged in!');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private translateFirebaseErrorMessage({ code, message }: FirebaseError): string {
    // Error translation logic
    return message;
  }
}

type SignUp = {
  email: string;
  password: string;
}

type FirebaseError = {
  code: string;
  message: string
};
