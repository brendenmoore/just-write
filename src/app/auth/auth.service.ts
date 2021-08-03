import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth-data.model';

const BACKEND_URL = environment.apiURL + 'user/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isLoggedIn: boolean = false;
  private tokenTimer: NodeJS.Timer;
  private userId: string;
  private userEmail: string;
  private goal: number = 750;

  constructor(private http: HttpClient, private router: Router, private auth: AngularFireAuth, private store: AngularFirestore) {}

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getUserEmail() {
    this.userEmail;
    return this.userEmail;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  getGoal() {
    //TODO
    // return this.http.get<{ goal: number }>(BACKEND_URL + 'goal');
    
  }

  setGoal(newGoal: number) {
    //TODO
    // return this.http.post<{ goal: number }>(
    //   BACKEND_URL + 'goal/' + newGoal,
    //   null
    // );
  }

  createUser(email: string, password: string) {
    // const authData: AuthData = { email: email, password: password };
    // this.http.post(BACKEND_URL + 'signup', authData).subscribe(
    //   (result) => {
    //     this.login(email, password);
    //   },
    //   (error) => {
    //     this.authStatusListener.next(false);
    //   }
    // );
    this.auth.createUserWithEmailAndPassword(email, password).then(result => {
      this.login(email, password);
    }, error => {
      this.authStatusListener.next(false);
    })
  }

  login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password).then(
      result => {
      if (result.user) {
        this.isLoggedIn = true;
        this.userId = result.user.uid;
        this.userEmail = result.user.email;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    })
    // const authData: AuthData = { email: email, password: password };
    // this.http
    //   .post<{
    //     token: string;
    //     expiresIn: number;
    //     userId: string;
    //     userEmail: string;
    //   }>(BACKEND_URL + 'login', authData)
    //   .subscribe(
    //     (response) => {
    //       const token = response.token;
    //       this.token = token;
    //       if (token) {
    //         const expiresInYears = response.expiresIn;
    //         this.setAuthTimer(expiresInYears);
    //         this.isLoggedIn = true;
    //         this.userId = response.userId;
    //         this.userEmail = response.userEmail;
    //         this.authStatusListener.next(true);
    //         const now = new Date();
    //         let year = now.getFullYear();
    //         let month = now.getMonth();
    //         let day = now.getDate();
    //         const expirationDate = new Date(
    //           year + expiresInYears, month, day
    //         );
    //         this.saveAuthData(
    //           token,
    //           expirationDate,
    //           this.userId,
    //           this.userEmail
    //         );
    //         this.router.navigate(['/']);
    //       }
    //     },
    //     (error) => {
    //       this.authStatusListener.next(false);
    //     }
    //   );
  }

  logout() {
    // this.token = null;
    this.auth.signOut().then(()=> {
      this.isLoggedIn = false;
      this.userId = null;
      this.authStatusListener.next(false);
      // clearTimeout(this.tokenTimer);
      // this.clearAuthData();
      this.router.navigate(['/']);
    })
  }

  autoAuthUser() {
    this.auth.user.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.userId = user.uid;
        this.userEmail = user.email;
        this.authStatusListener.next(true);
      }
    })
    // const authInformation = this.getAuthData();
    // if (!authInformation) {
    //   return;
    // }
    // const now = new Date();
    // // const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    // const expiresIn = 1;
    // if (expiresIn > 0) {
    //   this.token = authInformation.token;
    //   this.isLoggedIn = true;
    //   this.userId = authInformation.userId;
    //   this.userEmail = authInformation.userEmail;
    //   this.authStatusListener.next(true);
    //   // this.setAuthTimer(expiresIn / 1000);
    // }
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    userEmail: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
  }

  private setAuthTimer(years: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, years * 365 * 24 * 60 * 1000);
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
      userEmail: userEmail,
    };
  }
}
