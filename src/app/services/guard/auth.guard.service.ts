import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from "../auth.service";

@Injectable()

export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, public router: Router) {
  }

  canActivate(): boolean {
    if(!this.authService.isLoggedIn()) {
      this.router.navigate(['sign-in']);
      return false;
    }
    return true;
  }
}
