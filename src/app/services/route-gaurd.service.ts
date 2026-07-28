import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { jwtDecode } from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGaurdService {

  constructor(
    public auth: AuthService, 
    public router: Router,
    private snackBar: SnackbarService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoleArray: string[] = route.data['expectedRole'] || [];

    const token: any = localStorage.getItem('token');
    let tokenPayload: any;

    try {
      if (token) {
        tokenPayload = jwtDecode(token);
        console.log("Decoded JWT contents in RouteGuard:", tokenPayload);
      } else {
        throw new Error("No token found");
      }
    } catch (error) {
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }

    // Extract the role and force it to lowercase to match your conditions safely
    const rawRole = tokenPayload.role || tokenPayload.roles || "";
    const userRole = rawRole.toLowerCase(); 

    let roleMatched = false;
    for (let i = 0; i < expectedRoleArray.length; i++) {
      // Ensure expected route configuration roles are also lowercase for accurate matching
      if (expectedRoleArray[i].toLowerCase() === userRole) {
        roleMatched = true;
        break;
      }
    }

    if (userRole === 'admin' || userRole === 'user') {
      if (this.auth.isAuthenticated() && roleMatched) {
        return true;
      } else {
        console.warn(`Access denied. Matched status: ${roleMatched}. Authenticated: ${this.auth.isAuthenticated()}`);
        this.snackBar.opensnackbar(GlobalConstants.unauthorized, GlobalConstants.error);
        this.router.navigate(['/']); 
        return false;
      }
    } else {
      console.warn("Invalid role type caught in payload: ", userRole);
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}