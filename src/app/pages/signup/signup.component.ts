import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form!: FormGroup;
  isSigningUp = false;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  signup() {
    this.isSigningUp = true;

    this.authenticationService.signup({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe({
      next: () => {
        this.isSigningUp = false;
        this.router.navigate(['home']);
        this.snackBar.open("تم تسجيل الدخول بنجاح", "تم", {
          duration: 5000,
          direction: 'rtl',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (error: any) => {
        this.isSigningUp = false;
        this.snackBar.open(error.message, 'تم', {
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
}
