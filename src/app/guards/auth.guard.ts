/* eslint-disable curly */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      this.authService.getCurrentUser().pipe(
        take(1)
      ).subscribe(user => {
        if (!user) this.router.navigate(['login']);
        resolve(user ? true : false);
      });
    });
  }
}
