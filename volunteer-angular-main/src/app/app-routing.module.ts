import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);
const redirectUnauthorizedToSignin = () => redirectUnauthorizedTo(['signin']);

const routes: Routes = [
  { 
    path: '', // Root URL
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  { 
    path: 'signin', 
    loadChildren: () => import('./pages/signin/signin.module')
      .then(m => m.SigninModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome }
  },
  { 
    path: 'signup', 
    loadChildren: () => import('./pages/signup/signup.module')
      .then(m => m.SignupModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome }
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module')
      .then(m => m.HomeModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToSignin }
  },
  // Add more routes here as needed
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module')
      .then(m => m.ProfileModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToSignin }
  },
  {
    path: 'teams',
    loadChildren: () => import('./pages/teams/teams.module')
      .then(m => m.TeamsModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToSignin }
  },
  {
    path: 'members',
    loadChildren: () => import('./pages/members/members.module')
      .then(m => m.MembersModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToSignin }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
