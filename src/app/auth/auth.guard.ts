import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (!isAuth) {
        this.router.navigate(['/auth/login']);
        return isAuth;
      }
    });
    return true;
    }
  }
