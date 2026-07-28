import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserRequest } from '../models/user-request';
import { ForgotPasswordRequest } from '../models/forgot-password';
import { AuthenticationRequest } from '../models/authentication-dto';
import { PasswordUpdateRequest } from '../models/passwordUpdate-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

 // user.service.ts
signup(user: UserRequest) {
  return this.http.post(`${this.url}/user/signup`, user, { responseType: 'text' });
}

forgotPassoword(forgotPassword: ForgotPasswordRequest){
  return this.http.post(`${this.url}/user/forgotPassword`,forgotPassword, { responseType: 'text' });
}

login(authRequest: AuthenticationRequest) {
  return this.http.post(`${this.url}/user/login`, authRequest, { responseType: 'text' });   
}

checkToken(){
  return this.http.get(`${this.url}/user/checkToken`, { responseType: 'text' });
}

changePassword(passwordUpdateRequest: PasswordUpdateRequest) {
  return this.http.post(`${this.url}/user/changePassword`, passwordUpdateRequest, { responseType: 'text' });
}
}