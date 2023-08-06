import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  form!: FormGroup;
  isLoggingIn = false;
  isRecoveringPassword = false;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    this.isLoggingIn = true;

    this.authenticationService.signIn({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe({
      next: () => this.router.navigate(['home']),
      error: (error: any) => { // Explicitly specify the type of 'error'
        this.isLoggingIn = false;
        this.snackBar.open(error.message, "تم", {
          duration: 5000,
          direction: 'rtl',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  recoverPassword() {
    this.isRecoveringPassword = true;

    this.authenticationService.recoverPassword(
      this.form.value.email
    ).subscribe({
      next: () => {
        this.isRecoveringPassword = false;
        this.snackBar.open("تم ارسال رابط اعادة تعيين كلمة السر على الايميل .", "تم", {
          duration: 5000,
          direction: 'rtl',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (error: any) => { // Explicitly specify the type of 'error'
        this.isRecoveringPassword = false;
        this.snackBar.open(error.message, "تم", {
          duration: 5000,
          direction: 'rtl',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  loginWithGoogle() {
    this.authenticationService.GoogleAuth().then(() => {
      // Google sign-in successful
      this.router.navigate(['home']);
      this.snackBar.open("تم تسجيل الدخول بنجاح", "تم", {
        duration: 5000,
        direction: 'rtl',
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }).catch((error: any) => {
      // Handle error
      this.snackBar.open(error.message, "تم", {
        duration: 5000,
        direction: 'rtl',
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
    );
  }

  loginUsingPhone() {
    this.router.navigate(['phone-signin']);
  }

}
