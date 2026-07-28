import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { AuthenticationRequest } from '../models/authentication-dto';
import { error } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: any;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userservice: UserService,
    public dailogRef: MatDialogRef<LoginComponent>,
    private ngxservice: NgxUiLoaderService,
    private snackbarservice: SnackbarService

  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]]
    })
  }

 handleSubmit() {
    this.ngxservice.start();
    var formData = this.loginForm.value;
    var data: AuthenticationRequest = {
      email: formData.email,
      password: formData.password
    };

    this.userservice.login(data).subscribe(
      (response: any) => {
        this.ngxservice.stop();
        this.dailogRef.close();

        let extractedToken = '';

        try {
          // If response is a JSON string string like '{"token":"ey..."}'
          if (typeof response === 'string' && (response.startsWith('{') || response.trim().startsWith('{'))) {
            const parsed = JSON.parse(response);
            extractedToken = parsed.token || parsed.Token || response;
          } else if (response && response.token) {
            // If Angular automatically parsed it as a JSON object
            extractedToken = response.token;
          } else {
            // Fallback if it's just a raw text token string directly
            extractedToken = response;
          }
        } catch (e) {
          console.error("Parsing failed, using raw response:", e);
          extractedToken = response;
        }

        // Save the verified clean token string to storage
        localStorage.setItem('token', extractedToken);

        // Execute the dashboard redirect
        console.log("Token successfully stored. Redirecting to dashboard...");
        this.router.navigate(['/cafe/dashboard']);
      },
      (error) => {
        this.ngxservice.stop();
        if (error.error && typeof error.error === 'string') {
          try {
            const parsed = JSON.parse(error.error);
            this.responseMessage = parsed.error || parsed.message;
          } catch (e) {
            this.responseMessage = error.error;
          }
        } else if (error.error?.error) {
          this.responseMessage = error.error.error;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarservice.opensnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
}

