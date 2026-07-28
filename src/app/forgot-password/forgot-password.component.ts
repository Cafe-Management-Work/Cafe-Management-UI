import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { ForgotPasswordRequest } from '../models/forgot-password';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: any;

  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService

  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
    });
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data: ForgotPasswordRequest = {
      email: formData.email
    }
    this.userService.forgotPassoword(data).subscribe((response: any) => {
      this.ngxService.stop();

      this.responseMessage = (typeof response === 'string') ? response : response?.message;

      this.snackbarService.opensnackbar(this.responseMessage, "success");
      this.dialogRef.close();
    }, (error) => {
  this.ngxService.stop();
  
  // 1. Extract the message from the raw string shown in your photo
  if (error.error && typeof error.error === 'string') {
    try {
      const parsed = JSON.parse(error.error);
      this.responseMessage = parsed.error || parsed.message;
    } catch (e) {
      this.responseMessage = error.error; // Fallback to raw string
    }
  } else if (error.error?.error) {
    this.responseMessage = error.error.error;
  } else {
    this.responseMessage = GlobalConstants.genericError;
  }

  // 2. Trigger the RED snackbar
  // Make sure GlobalConstants.error is set to "error"
  this.snackbarService.opensnackbar(this.responseMessage, GlobalConstants.error);
});
  }

}
