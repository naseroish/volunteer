import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  }
]

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase), // Replace `yourFirebaseConfig` with your actual Firebase configuration
    AngularFirestoreModule,
    RouterModule.forChild(routes),
    AngularFireStorageModule,
  ],
})
export class ProfileModule {}
