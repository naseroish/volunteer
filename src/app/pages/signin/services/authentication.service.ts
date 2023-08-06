import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, from, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoogleAuthProvider, AuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private auth: AngularFireAuth
  ) { }

  isLogged(): Observable<boolean> {
    return this.auth.authState.pipe(
      catchError(() => of(null)),
      map((user) => !!user)
    );
  }

  signIn(params: SignIn): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(
      params.email, params.password
    )).pipe(
      catchError((error: FirebaseError) => 
        throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
      )
    );
  }

  recoverPassword(email: string): Observable<void> {
    return from(this.auth.sendPasswordResetEmail(email)).pipe(
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

  private translateFirebaseErrorMessage({code, message}: FirebaseError) {
    if (code === "auth/user-not-found") {
      return "User not found.";
    }
    if (code === "auth/wrong-password") {
      return "User not found.";
    }
    return message;
  }

  // signInWithPhoneNumber(phoneNumber: string, appVerifier: any): Observable<any> {
  //   return from(this.auth.signInWithPhoneNumber(phoneNumber, appVerifier)).pipe(
  //     catchError((error: FirebaseError) => 
  //       throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
  //     )
  //   );
  // }

  // verifyPhoneNumber(verificationId: string, verificationCode: string): Observable<any> {
  //   return from(this.auth.signInWithPhoneNumber(verificationId, verificationCode)).pipe(
  //     catchError((error: FirebaseError) => 
  //       throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
  //     )
  //   );
  // }

}

type SignIn = {
  email: string;
  password: string;
}

type FirebaseError = {
  code: string;
  message: string
};
