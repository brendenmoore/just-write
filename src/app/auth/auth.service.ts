import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth-data.model';

const BACKEND_URL = environment.apiURL + "user/"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isLoggedIn: boolean = false;
  private tokenTimer: NodeJS.Timer;
  private userId: string;
  private userEmail: string;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getUserEmail() {
    (this.userEmail);
    return this.userEmail;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post(BACKEND_URL + "signup", authData).subscribe(
      result => {
        this.login(email, password);
    }, error => {
      this.authStatusListener.next(false);
    })
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string, userEmail: string}>(BACKEND_URL + "login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isLoggedIn = true;
          this.userId = response.userId;
          this.userEmail = response.userEmail;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
          this.saveAuthData(token, expirationDate, this.userId, this.userEmail);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      })
  }

  logout() {
    this.token = null;
    this.isLoggedIn = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isLoggedIn = true;
      this.userId = authInformation.userId;
      this.userEmail = authInformation.userEmail;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, userEmail: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userEmail: userEmail
    }
  }
}
