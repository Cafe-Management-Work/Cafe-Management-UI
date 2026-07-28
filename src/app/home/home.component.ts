import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dialog: MatDialog, private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  const token = localStorage.getItem('token');

  if (token) {
    console.log("Token detected locally. Testing automatic routing...");
    // Bypass checkToken API temporarily to see if your routing works:
    this.router.navigate(['/cafe/dashboard']);
  } else {
    console.log("No active token found.");
  }
}

handleSignUp() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = "550px";
  dialogConfig.disableClose = true;
  
  // CHANGE THIS TO FALSE
  dialogConfig.autoFocus = false; 

  this.dialog.open(SignupComponent, dialogConfig);
}

handleForgotPassword() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = "550px";
  dialogConfig.disableClose = true;
  
  // CHANGE THIS TO FALSE
  dialogConfig.autoFocus = false; 

  this.dialog.open(ForgotPasswordComponent, dialogConfig);
}

handleLogin(){
   const dialogConfig = new MatDialogConfig();
  dialogConfig.width = "550px";
  dialogConfig.disableClose = true;
  
  // CHANGE THIS TO FALSE
  dialogConfig.autoFocus = false; 

  this.dialog.open(LoginComponent, dialogConfig);
}

}
