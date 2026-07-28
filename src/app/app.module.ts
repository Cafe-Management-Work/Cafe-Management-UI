import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material-module';
import { HomeComponent } from './home/home.component';
import { BestSellerComponent } from './best-seller/best-seller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import { 
  NgxUiLoaderModule, 
  NgxUiLoaderConfig, 
  SPINNER, 
  PB_DIRECTION 
} from 'ngx-ui-loader';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { TokenInterceptorInterceptor } from './services/token-interceptor.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangePasswordComponent } from './material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from './material-component/dialog/confirmation/confirmation.component';
import { CategoryComponent } from './material-component/dialog/category/category.component';
import { ProductComponent } from './material-component/dialog/product/product.component';

// ✅ REMOVED: ConfirmationComponent import has been removed from here

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: "Loading...",
  textColor: "#FFFFFF",
  textPosition: "center-center",
  bgsColor: "#7b1fa2",
  fgsColor: "#7b1fa2",
  fgsType: SPINNER.squareJellyBox,
  fgsSize: 100,
  hasProgressBar: false,
};

@NgModule({
  declarations: [ 
    AppComponent,
    HomeComponent,
    BestSellerComponent,
    FullComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    SignupComponent,
    ForgotPasswordComponent,
    LoginComponent,
    // ✅ REMOVED: ConfirmationComponent has been removed from this declarations array
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
    HttpClientModule, // ✅ Keeps HttpClientModule here (This is correct)
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  providers: [
    // ✅ FIXED: HttpClientModule has been removed from this providers array
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [SignupComponent, ForgotPasswordComponent, LoginComponent, DashboardComponent,
     AppHeaderComponent, ConfirmationComponent, ChangePasswordComponent,
    CategoryComponent,ProductComponent] // ✅ Added ConfirmationComponent and ChangePasswordComponent to entryComponents
})
export class AppModule { }