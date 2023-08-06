import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProfileService } from './profile.service';
import { User } from './profile.model';
import { LoadingService } from '../../loading.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userEmail$!: Observable<string>;
  userProfile$!: Observable<User | null>;
  profilePictureUrl!: Observable<string | null>;

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private profileService: ProfileService,
    public loadingService: LoadingService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.userEmail$ = this.auth.user.pipe(
      switchMap((user) => {
        if (user) {
          const userDoc = this.firestore.collection('users').doc(user.uid);
          return userDoc.get().pipe(
            map((doc) => doc.get('email'))
          );
        } else {
          return of(null);
        }
      })
    );

    this.userProfile$ = this.auth.user.pipe(
      switchMap((user) => {
        if (user) {
          return this.profileService.getUserProfile(user.uid);
        } else {
          return of(null);
        }
      })
    );

    this.profilePictureUrl = this.userProfile$.pipe(
      switchMap((userProfile) => {
        if (userProfile && userProfile.profilePicture) {
          return this.profileService.getProfilePictureUrl(userProfile.profilePicture);
        } else {
          return this.profileService.getDefaultProfilePictureUrl();
        }
      })
    );
  }

  updateUserProfile(name: string, phone: string): void {
    this.loadingService.showLoading();
    this.auth.user.subscribe((user) => {
      if (user) {
        const userId = user.uid;
        const profileData = { name, phone };
        this.profileService.updateUserProfile(userId, profileData)
          .then(() => console.log('Profile updated successfully'))
          .catch((error) => console.error('Error updating profile:', error));
          this.loadingService.hideLoading();
      }
    });
  }

  onProfilePictureChange(event: any): void {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.updateProfilePicture(file);
    }
  }

  updateProfilePicture(input: any): void {
    const file = input.target.files[0];
    const filePath = `profile-pictures/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
  
    // Upload the file to Firebase Storage
    task.snapshotChanges().pipe(
      finalize(() => {
        // Get the download URL of the uploaded file
        fileRef.getDownloadURL().subscribe((url: string) => {
          // Update the user's profile picture field in Firestore
          const userId = 'your_user_id'; // Replace with the actual user ID
          const pictureUrl = url;
          
          this.profileService.updateProfilePicture(userId, pictureUrl)
            .then(() => {
              console.log('Profile picture updated successfully.');
            })
            .catch((error) => {
              console.error('Error updating profile picture:', error);
            });
        });
      })
    ).subscribe();
  }
}

