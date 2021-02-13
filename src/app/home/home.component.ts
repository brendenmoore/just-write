import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuth: boolean = false;
  authStatusSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getIsLoggedIn();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(response => {
      this.isAuth = response;
    })
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
