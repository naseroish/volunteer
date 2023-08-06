import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getUserProfile(userId: string): Observable<User | null> {
    return this.firestore.collection('users').doc(userId).get()
      .pipe(
        map((doc) => {
          const data = doc.data();
          if (doc.exists && data) {
            return data as User;
          } else {
            return null;
          }
        })
      );
  }

  updateUserProfile(userId: string, profileData: Partial<User>): Promise<void> {
    return this.firestore
      .collection('users')
      .doc(userId)
      .update(profileData);
  }

  getProfilePictureUrl(profilePicture: string): Observable<string | null> {
    if (!profilePicture) {
      return of(null);
    }

    const ref = this.storage.ref(profilePicture);
    return ref.getDownloadURL();
  }

  getDefaultProfilePictureUrl(): Observable<string> {
    return this.getProfilePictureUrl('default-profiles/deafult-profile.png').pipe(
      map(url => url || '')
    );
  }

  updateProfilePicture(userId: string, pictureUrl: string): Promise<void> {
    return this.firestore
      .collection('users')
      .doc(userId)
      .update({ profilePicture: pictureUrl });
  }

  
  
}
