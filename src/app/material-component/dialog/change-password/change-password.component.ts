import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PasswordUpdateRequest } from 'src/app/models/passwordUpdate-dto';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  oldPassword = true;
  newPassword = true;
  confirmPassword = true;

  changePasswordForm: any = FormGroup;

  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

  validateSubmit() {
    if (this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value) {
      return true;
    } else {
      return false;
    }
  }

  handleChangePasswordSubmit() {
    this.ngxService.start();
    var formData = this.changePasswordForm.value;
    var data: PasswordUpdateRequest = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword
    }

    this.userService.changePassword(data).subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.responseMessage = response;
        this.dialogRef.close();
        this.snackbarService.opensnackbar(this.responseMessage, "success");
      },
      error: (error) => {
        this.ngxService.stop();

        let errorMessage = GlobalConstants.genericError;

        if (error.error) {
          // Case 1: If error.error is already a parsed JSON object (e.g., { error: "Password mismatch" })
          if (typeof error.error === 'object') {
            errorMessage = error.error.error || error.error.message || GlobalConstants.genericError;
          }
          // Case 2: If error.error is a JSON string (happens when responseType: 'text' is used)
          else if (typeof error.error === 'string') {
            try {
              const parsedError = JSON.parse(error.error);
              errorMessage = parsedError.error || parsedError.message || error.error;
            } catch (e) {
              // It's a plain string, not JSON
              errorMessage = error.error;
            }
          }
        }

        this.responseMessage = errorMessage;

        // Show the actual extracted "Password mismatch" message in the snackbar!
        this.snackbarService.opensnackbar(this.responseMessage, GlobalConstants.error);
      }
    });
  }


}
