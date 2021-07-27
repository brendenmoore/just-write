import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient, HttpResponse } from '@angular/common/http';

const BACKEND_URL = environment.apiURL + 'user/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private auth: AuthService, private http: HttpClient) {}

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
    this.http.post(BACKEND_URL + 'register', null).subscribe(
      (result) => {
        console.log('User initialized');
      },
      (error) => {
        console.log('Error initializing user');
      }
    );
  }
}
