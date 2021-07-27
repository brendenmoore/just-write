import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

const BACKEND_URL = "api/user";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private auth: AuthService, private http: HttpClient, private router: Router) {}

  getGoal() {
    return this.http.get<{ goal: number }>(BACKEND_URL + 'goal');
  }

  setGoal(newGoal: number) {
    return this.http.post<{ goal: number }>(
      BACKEND_URL + 'goal/' + newGoal,
      null
    );
  }

  init() {
    console.log("checking auth")
    this.auth.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        console.log("Auth success. Attempting registration")
        this.http.post(BACKEND_URL + 'register', null).subscribe(result => {
          "Successful init, rerouting..."
          this.router.navigate(['/']);
        });
      }
    })
  }
}
