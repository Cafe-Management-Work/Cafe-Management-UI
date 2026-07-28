import { Component, EventEmitter, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from '../shared/global-constants';
import { UserRequest } from '../models/user-request';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  password = true;
  confirmPassword = true;
  signupForm: any;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    @Optional() public dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  validateSubmit() {
    if (this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value) {
      return true;
    }
    else {
      return false;
    }

  }
  handleSubmit() {
    if (this.signupForm.invalid || this.validateSubmit()) {
      this.responseMessage = 'Please complete all required fields and ensure passwords match.';
      this.snackbarService.opensnackbar(this.responseMessage, GlobalConstants.error);
      return;
    }

    this.ngxService.start();
    var formData = this.signupForm.value;
    var data: UserRequest = {
      name: formData.username,         
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
      role: 'user'
    }
    this.userService.signup(data).subscribe((response: string) => { // response is now the string itself
      this.ngxService.stop();

      // Since response is just the string "User Saved Successfully"
      this.responseMessage = response;

      this.dialogRef.close();
      this.snackbarService.opensnackbar(this.responseMessage, "success");
      this.router.navigate(['/']);
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else if (typeof error.error === 'string') {
        // Handled plain text error response
        this.responseMessage = error.error;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.opensnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

}
