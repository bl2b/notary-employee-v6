import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  private orderID: string;
  private userId: string;
  private languageCode: string;

  constructor(private _router: Router, private _authService: AuthenticationService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this.orderID = next.queryParams['O'];
      this.userId = next.queryParams['U'];
      this.languageCode = next.queryParams['L'];

    if (this.orderID && this.userId && this.languageCode) {
      this._authService.getApiToken(this.orderID, this.userId, this.languageCode).subscribe((token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('OrderId', this.orderID);
        localStorage.setItem('UserId', this.userId);
        localStorage.setItem('Language', this.languageCode);
        this._router.navigateByUrl('home');
        return true;
      });
    } else if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
}
