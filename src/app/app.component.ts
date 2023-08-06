import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { LoadingService } from './loading.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated: Observable<boolean> = of(false);
  @ViewChild('sidenav') sidenav!: MatSidenav;
  opened = false;

  constructor(
    private afAuth: AngularFireAuth,
    public loadingService: LoadingService,
    ) {}

  ngOnInit(): void {
    this.loadingService.showLoading();
    this.isAuthenticated = this.afAuth.authState.pipe(map(user => !!user));
    this.loadingService.hideLoading();
  }

  toggleSidenav(): void {
    this.opened = !this.opened;
    this.sidenav.toggle();
  }

  logout(): void {
    this.loadingService.showLoading();
    this.afAuth.signOut()
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log('Logout error:', error);
      });
    this.loadingService.hideLoading();
  }

  
}
